function setJsonHeaders(res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  setJsonHeaders(res);
  res.end(JSON.stringify(payload));
}

function getDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    return JSON.parse(req.body);
  }

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  return rawBody ? JSON.parse(rawBody) : {};
}

function getTelegramMessage(payload) {
  const lines = [
    "Новая заявка с сайта Navident",
    "",
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    `Источник: ${payload.source || "site-form"}`,
  ];

  if (payload.doctor) {
    lines.push(`Врач: ${payload.doctor}`);
  }

  if (payload.pageUrl) {
    lines.push(`Страница: ${payload.pageUrl}`);
  }

  lines.push(`Время: ${new Date().toLocaleString("ru-RU", { timeZone: "Asia/Novosibirsk" })}`);

  return lines.join("\n");
}

function validatePayload(payload) {
  const name = String(payload.name || "").trim();
  const phone = String(payload.phone || "").trim();
  const phoneDigits = getDigits(phone);

  if (name.length < 2) {
    return "Укажите имя.";
  }

  if (phoneDigits.length !== 11) {
    return "Укажите корректный номер телефона.";
  }

  return null;
}

export async function handleContactRequest(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Метод не поддерживается." });
    return;
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || process.env.CHAT_ID;

  if (!botToken || !chatId) {
    sendJson(res, 500, { error: "Не настроены переменные окружения Telegram." });
    return;
  }

  try {
    const payload = await readJsonBody(req);
    const validationError = validatePayload(payload);

    if (validationError) {
      sendJson(res, 400, { error: validationError });
      return;
    }

    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: getTelegramMessage(payload),
      }),
    });

    const telegramResult = await telegramResponse.json().catch(() => ({}));

    if (!telegramResponse.ok || !telegramResult.ok) {
      console.error("Telegram API error:", telegramResult);
      sendJson(res, 502, { error: "Не удалось отправить заявку в Telegram." });
      return;
    }

    sendJson(res, 200, { ok: true });
  } catch (error) {
    console.error("Contact API error:", error);
    sendJson(res, 500, { error: "Внутренняя ошибка сервера." });
  }
}
