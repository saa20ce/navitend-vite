import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { handleContactRequest } from "./server/contactHandler.js";

function telegramContactApiPlugin() {
	return {
		name: "telegram-contact-api",
		configureServer(server) {
			server.middlewares.use("/api/contact", (req, res, next) => {
				handleContactRequest(req, res).catch((error) => {
					console.error(error);
					res.statusCode = 500;
					res.setHeader("Content-Type", "application/json; charset=utf-8");
					res.end(JSON.stringify({ error: "Внутренняя ошибка сервера." }));
				});
			});
		},
	};
}

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	Object.assign(process.env, env);

	return {
		plugins: [tailwindcss(), telegramContactApiPlugin()],
	};
});
