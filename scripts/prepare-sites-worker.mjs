import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const dist = resolve(process.cwd(), "dist");
const server = resolve(dist, "server");

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      if (fullPath !== server && entry.name !== ".openai") files.push(...await filesIn(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

const files = await filesIn(dist);
const assets = {};
for (const file of files) {
  const pathname = `/${relative(dist, file).replaceAll("\\", "/")}`;
  const body = await readFile(file);
  assets[pathname] = [body.toString("base64"), mimeTypes[extname(file)] ?? "application/octet-stream"];
}

const api = await readFile(resolve(process.cwd(), "worker/api.js"), "utf8");

await mkdir(server, { recursive: true });
await mkdir(resolve(dist, ".openai"), { recursive: true });
await writeFile(resolve(dist, ".openai/hosting.json"), await readFile(resolve(process.cwd(), ".openai/hosting.json")));
const workerFile = resolve(server, "index.js");
const worker = `${api}\nconst assets = ${JSON.stringify(assets)};
function body(encoded) { const binary = atob(encoded); const bytes = new Uint8Array(binary.length); for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i); return bytes; }
export default { async fetch(request, env) { const apiResponse = await handleApi(request, env); if (apiResponse) return apiResponse; const url = new URL(request.url); const pathname = url.pathname === "/" ? "/index.html" : url.pathname; const asset = assets[pathname] ?? assets["/index.html"]; if (!asset) return new Response("Not found", { status: 404 }); return new Response(body(asset[0]), { headers: { "content-type": asset[1], "cache-control": pathname === "/index.html" ? "no-cache" : "public, max-age=31536000, immutable" } }); } };
`;
await writeFile(workerFile, worker, "utf8");
await import(`${pathToFileURL(workerFile).href}?build=${Date.now()}`);