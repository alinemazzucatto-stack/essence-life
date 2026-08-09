import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const dist = resolve(process.cwd(), "dist");
const server = resolve(dist, "server");
await mkdir(server, { recursive: true });
await writeFile(
  resolve(server, "index.js"),
  `export default { async fetch(request, env) { const asset = await env.ASSETS.fetch(request); return asset.status === 404 ? env.ASSETS.fetch(new Request(new URL("/index.html", request.url), request)) : asset; } };\n`,
  "utf8",
);