import { defineConfig, loadEnv } from "vite";
import { readFile } from "node:fs/promises";
import tailwindcss from "@tailwindcss/vite";
import { handleContactRequest } from "./server/contactHandler.js";
import { servicesData } from "./src/data/services.js";
import { createServiceCard } from "./src/components/renderServices.js";

// Send the page's HTML with the first response instead of rebuilding it in JS.
function pageHtmlPlugin() {
	const sections = [
		"section1-banner", "section2-service", "section3-about",
		"section4-doctors", "section5-contacts", "section6-cta",
		"section7-reviews", "section8-requisite", "section9-licenses",
	];
	return {
		name: "page-html",
		transformIndexHtml: {
			order: "pre",
			async handler(html) {
				const names = ["header", ...sections, "footer", "contact-modal"];
				const fragments = await Promise.all(names.map((name) =>
					readFile(new URL(`./partials/${name}.html`, import.meta.url), "utf8"),
				));
				const [header, ...rest] = fragments;
				const body = rest.slice(0, sections.length).join("\n");
				const end = rest.slice(sections.length).join("\n");
				return html
					.replace("<!-- app-html -->", `${header}<main class="px-[18px] lg:px-0">${body}</main>${end}`)
					.replace("<!-- services-html -->", servicesData.map(createServiceCard).join("\n"));
			},
		},
		handleHotUpdate({ file, server }) {
			if (/[\\/]partials[\\/].+\.html$/.test(file)) {
				server.ws.send({ type: "full-reload" });
				return [];
			}
		},
	};
}

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
		plugins: [pageHtmlPlugin(), tailwindcss(), telegramContactApiPlugin()],
	};
});
