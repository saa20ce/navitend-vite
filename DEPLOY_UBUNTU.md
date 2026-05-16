# Деплой Navident Vite на Ubuntu 26.04

Инструкция рассчитана на новый сервер Ubuntu 26.04, домен и запуск через Docker Compose. Контейнер фронтенда слушает только `127.0.0.1:8080`, а внешний HTTPS делает Nginx на хосте.

## 1. Подготовить DNS

В панели домена создайте записи:

```text
A     navident.example.com      SERVER_IP
A     www.navident.example.com  SERVER_IP
```

Замените `navident.example.com` на реальный домен.

## 2. Установить пакеты на сервере

```bash
sudo apt update
sudo apt install -y ca-certificates curl git nginx ufw

for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do
  sudo apt remove -y "$pkg" 2>/dev/null || true
done

sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

sudo tee /etc/apt/sources.list.d/docker.sources > /dev/null <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker "$USER"
```

После `usermod` выйдите из SSH и зайдите снова, чтобы группа `docker` применилась.

## 3. Открыть firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow "Nginx Full"
sudo ufw --force enable
sudo ufw status
```

## 4. Скопировать проект

Вариант через Git:

```bash
sudo mkdir -p /opt/navident-vite
sudo chown "$USER:$USER" /opt/navident-vite
git clone <REPO_URL> /opt/navident-vite
cd /opt/navident-vite
```

Если репозитория нет, скопируйте папку проекта на сервер в `/opt/navident-vite` через `scp` или SFTP.

## 5. Настроить переменные окружения

```bash
cd /opt/navident-vite
cp .env.example .env
nano .env
```

Минимально нужны:

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

Для email-заявок заполните также `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `EMAIL_TO`.

Если Telegram недоступен напрямую с сервера, используйте один из вариантов прокси:

```env
VMESS_URL=vmess://...
```

или:

```env
SUBSCRIPTION_URL=https://...
```

## 6. Запустить контейнеры

```bash
cd /opt/navident-vite
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs --tail=80
```

Локальная проверка на сервере:

```bash
curl -I http://127.0.0.1:8080
curl http://127.0.0.1:8080/healthz
```

## 7. Настроить Nginx на хосте

```bash
sudo cp deploy/nginx-navident.conf /etc/nginx/sites-available/navident
sudo nano /etc/nginx/sites-available/navident
```

Замените `navident.example.com` и `www.navident.example.com` на реальные домены.

```bash
sudo ln -s /etc/nginx/sites-available/navident /etc/nginx/sites-enabled/navident
sudo nginx -t
sudo systemctl reload nginx
```

Теперь сайт должен открываться по HTTP.

## 8. Включить HTTPS

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d navident.example.com -d www.navident.example.com
sudo certbot renew --dry-run
```

## Обновление проекта

```bash
cd /opt/navident-vite
git pull
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml logs --tail=80
```

## Полезные команды

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml restart
docker compose -f docker-compose.prod.yml down
```
