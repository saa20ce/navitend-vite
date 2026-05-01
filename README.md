# Navident Vite App

Это веб-приложение на базе Vite с Node.js API для обработки контактных форм.

## Описание проекта

Приложение включает:
- Фронтенд на Vite с Tailwind CSS
- API для отправки контактных данных в Telegram и на email
- Docker-контейнеризация для развертывания

## Docker настройка

### Предварительные требования
- Docker
- Docker Compose

### Переменные окружения
Скопируйте `.env.example` в `.env` и заполните учетные данные Telegram бота и vmess-прокси:

```bash
cp .env.example .env
```

Отредактируйте `.env` с реальными значениями:
- `TELEGRAM_BOT_TOKEN`: Токен вашего Telegram бота
- `TELEGRAM_CHAT_ID`: ID чата Telegram
- `VMESS_URL`: прямая ссылка `vmess://...` для Xray
- `SUBSCRIPTION_URL`: URL подписки Vmess прокси, если Telegram API должен идти через Xray
- `TELEGRAM_PROXY_URL`: SOCKS-прокси для Telegram, если нужно обойти встроенный Xray
- `SMTP_HOST`: SMTP-сервер для отправки email, например `smtp.office365.com`
- `SMTP_PORT`: SMTP-порт, обычно `587`
- `SMTP_SECURE`: `true` для порта `465`, для `587` обычно `false`
- `SMTP_USER`: логин SMTP-ящика
- `SMTP_PASS`: пароль или пароль приложения SMTP-ящика
- `EMAIL_FROM`: адрес отправителя, если отличается от `SMTP_USER`
- `EMAIL_TO`: адрес получателя заявок

### Сборка и запуск

1. Соберите и запустите контейнеры:
```bash
docker-compose up --build
```

2. Приложение будет доступно по адресам:
- Фронтенд: http://localhost:8080
- API: http://localhost:3001

### Разработка

Для разработки без Docker:
```bash
npm install
npm run dev
```

### Продакшн

Docker-конфигурация настроена для продакшена:
- Фронтенд обслуживается Nginx
- API обслуживается Node.js/Express
- API-запросы проксируются через Nginx

## Структура проекта

```
├── api/                 # API эндпоинты
├── server/              # Серверная логика
├── src/                 # Исходный код фронтенда
├── public/              # Статические файлы
├── partials/            # HTML части
├── Dockerfile           # Docker для фронтенда
├── Dockerfile.api       # Docker для API
├── docker-compose.yml   # Оркестрация сервисов
├── nginx.conf           # Конфигурация Nginx
└── package.json         # Зависимости
```

## Прокси для Telegram API

Приложение использует Xray Vmess прокси для соединения с Telegram API серверами. Самый простой вариант - указать прямую vmess-ссылку:

```bash
VMESS_URL=vmess://...
```

### Как это работает:
1. При запуске API-контейнер берет `VMESS_URL`; если он пустой, пробует получить первую vmess-ссылку из `SUBSCRIPTION_URL`
2. Автоматически декодируется vmess-конфиг и создается `/app/xray-config.json`
3. Запросы к Telegram API идут через локальный Socks5 прокси `socks5://127.0.0.1:1080`
4. Xray туннелирует трафик через Vmess сервер

Если у вас уже запущен SOCKS-прокси на хост-машине, можно не задавать `VMESS_URL` и `SUBSCRIPTION_URL`, а указать:

```bash
TELEGRAM_PROXY_URL=socks5://host.docker.internal:1080
```

### Изменение прокси:
Измените `VMESS_URL` в `.env` файле на вашу vmess-ссылку или `SUBSCRIPTION_URL` на subscription link.

## Скрипты

- `npm run dev` - Запуск dev-сервера Vite
- `npm run build` - Сборка для продакшена
- `npm run preview` - Предпросмотр собранного приложения
- `npm start` - Запуск API-сервера
