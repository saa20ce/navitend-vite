#!/bin/sh

set -e

start_node() {
    echo "Starting Node.js server"
    exec npm start
}

decode_base64() {
    VALUE=$(printf '%s' "$1" | sed 's|^vmess://||')
    PADDING=$(( (4 - ${#VALUE} % 4) % 4 ))

    if [ "$PADDING" -eq 1 ]; then
        VALUE="${VALUE}="
    elif [ "$PADDING" -eq 2 ]; then
        VALUE="${VALUE}=="
    elif [ "$PADDING" -eq 3 ]; then
        VALUE="${VALUE}==="
    fi

    printf '%s' "$VALUE" | base64 -d 2>/dev/null
}

get_vmess_link() {
    if [ -n "$VMESS_URL" ]; then
        printf '%s' "$VMESS_URL"
        return
    fi

    if [ -z "$SUBSCRIPTION_URL" ]; then
        return
    fi

    echo "[1/5] Downloading subscription..." >&2
    SUB_DATA=$(curl -s -m 10 "$SUBSCRIPTION_URL") || return
    VMESS_LINKS=$(decode_base64 "$SUB_DATA" || printf '%s' "$SUB_DATA")
    printf '%s' "$VMESS_LINKS" | grep -o 'vmess://[^[:space:]]*' | head -1
}

echo "===== Starting Xray Proxy Setup ====="
VMESS_LINK=$(get_vmess_link || true)

if [ -z "$VMESS_LINK" ]; then
    echo "VMESS_URL and SUBSCRIPTION_URL are not set or do not contain a vmess link."
    echo "Starting without Telegram proxy."
    start_node
fi

echo "[2/5] Decoding vmess config..."
VMESS_CONFIG=$(decode_base64 "$VMESS_LINK" || true)

if [ -z "$VMESS_CONFIG" ] || ! printf '%s' "$VMESS_CONFIG" | jq -e . >/dev/null 2>&1; then
    echo "ERROR: Failed to decode vmess config. Starting without Telegram proxy."
    start_node
fi

echo "[3/5] Parsing vmess config..."
SERVER=$(printf '%s' "$VMESS_CONFIG" | jq -r '.add // empty')
PORT=$(printf '%s' "$VMESS_CONFIG" | jq -r '.port // empty')
ID=$(printf '%s' "$VMESS_CONFIG" | jq -r '.id // empty')

if [ -z "$SERVER" ] || [ -z "$PORT" ] || [ -z "$ID" ]; then
    echo "ERROR: Invalid vmess config: missing server, port or id. Starting without Telegram proxy."
    start_node
fi

echo "[4/5] Creating Xray config..."
printf '%s' "$VMESS_CONFIG" | jq '{
  log: {
    loglevel: "warning"
  },
  inbounds: [
    {
      listen: "127.0.0.1",
      port: 1080,
      protocol: "socks",
      settings: {
        auth: "noauth",
        udp: true
      },
      sniffing: {
        enabled: true,
        destOverride: ["http", "tls"]
      }
    }
  ],
  outbounds: [
    {
      protocol: "vmess",
      settings: {
        vnext: [
          {
            address: .add,
            port: (.port | tonumber),
            users: [
              {
                id: .id,
                alterId: ((.aid // "0") | tonumber),
                security: (.scy // "auto")
              }
            ]
          }
        ]
      },
      streamSettings: (
        {
          network: (.net // "tcp"),
          security: (.tls // "none")
        }
        + if (.tls // "") == "tls" then {
          tlsSettings: {
            serverName: (.sni // .host // .add),
            fingerprint: (.fp // "chrome"),
            alpn: (((.alpn // "") | split(",") | map(select(length > 0))) // [])
          }
        } else {} end
        + if (.net // "tcp") == "ws" then {
          wsSettings: {
            path: (.path // "/"),
            headers: (
              if (.host // "") != "" then { Host: .host } else {} end
            )
          }
        } else {} end
        + if (.net // "tcp") == "tcp" and (.type // "") != "" then {
          tcpSettings: {
            header: {
              type: (.type // "none")
            }
          }
        } else {} end
      )
    }
  ]
}' > /app/xray-config.json

echo "[5/5] Starting Xray"
/usr/local/bin/xray -config /app/xray-config.json &
XRAY_PID=$!

export TELEGRAM_PROXY_URL="socks5://127.0.0.1:1080"
sleep 3

echo "Starting Node.js server"
npm start &
NODE_PID=$!

trap 'kill "$NODE_PID" "$XRAY_PID" 2>/dev/null || true' INT TERM
wait "$NODE_PID"
