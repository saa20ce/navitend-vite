import axios from 'axios';
import nodemailer from 'nodemailer';
import { SocksProxyAgent } from 'socks-proxy-agent';

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

function getContactMessage(payload) {
  const lines = [
    "Новая заявка с сайта Navident",
    "",
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
  ];

  if (payload.doctor) {
    lines.push(`Врач: ${payload.doctor}`);
  }

  lines.push(`Дата: ${new Date().toLocaleString("ru-RU", { timeZone: "Asia/Novosibirsk" })}`);

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

function getTelegramRequestOptions() {
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const proxyUrl = process.env.TELEGRAM_PROXY_URL || process.env.SOCKS_PROXY_URL;

  if (proxyUrl) {
    options.httpsAgent = new SocksProxyAgent(proxyUrl);
  }

  return options;
}

function getEmailConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.EMAIL_TO;
  const from = process.env.EMAIL_FROM;
  const secureValue = process.env.SMTP_SECURE;

  return {
    host,
    port,
    secure: secureValue ? secureValue === "true" : port === 465,
    auth: user && pass ? { user, pass } : undefined,
    from,
    to,
  };
}

function hasEmailConfig(config) {
  return Boolean(config.host && config.port && config.from && config.to);
}

function hasAnyEmailConfig(config) {
  return Boolean(config.host || config.from || config.to || config.auth);
}

async function sendEmailNotification(message) {
  const emailConfig = getEmailConfig();

  if (!hasEmailConfig(emailConfig)) {
    if (hasAnyEmailConfig(emailConfig)) {
      throw new Error("Email variables are partially configured.");
    }

    return { skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    auth: emailConfig.auth,
  });

  await transporter.sendMail({
    from: emailConfig.from,
    to: emailConfig.to,
    subject: "Новая заявка с сайта Navident",
    text: message,
  });

  return { skipped: false };
}

function getRequestErrorDetails(error) {
  return {
    message: error.message,
    code: error.code,
    status: error.response?.status,
    response: error.response?.data,
    cause: error.cause?.message,
  };
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

    const contactMessage = getContactMessage(payload);

    const telegramResponse = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: contactMessage,
    }, getTelegramRequestOptions());

    const telegramResult = telegramResponse.data;

    if (telegramResponse.status !== 200 || !telegramResult.ok) {
      console.error("Telegram API error:", telegramResult);
      sendJson(res, 502, { error: "Не удалось отправить заявку в Telegram." });
      return;
    }

    try {
      await sendEmailNotification(contactMessage);
    } catch (error) {
      console.error("Email notification error:", getRequestErrorDetails(error));
      sendJson(res, 502, { error: "Не удалось отправить заявку на email." });
      return;
    }

    sendJson(res, 200, { ok: true });
  } catch (error) {
    console.error("Contact API error:", getRequestErrorDetails(error));
    sendJson(res, 500, { error: "Внутренняя ошибка сервера." });
  }
}
