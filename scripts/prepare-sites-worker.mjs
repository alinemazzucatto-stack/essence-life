import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const dist = resolve(process.cwd(), "dist");
const server = resolve(dist, "server");
await mkdir(server, { recursive: true });
await writeFile(
  resolve(server, "index.js"),
  `export default { fetch(request, env) { return env.ASSETS.fetch(request); } };\n`,
  "utf8",
);