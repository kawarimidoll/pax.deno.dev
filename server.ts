/// <reference path="./deploy.d.ts" />
import { extract } from "./mod.ts";

const listener = Deno.listen({ port: 8080 });
console.log(`HTTP server listening on http://localhost:${listener.addr.port}`);

function genResponse(status: number, attrs?: ResponseInit): Response {
  const statusText = {
    400: "Invalid URL",
    301: "Moved Permanently",
  }[status];

  const init = { status, statusText, ...attrs };
  return new Response(`${status}: ${statusText}`, init);
}

async function handleConn(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const e of httpConn) {
    e.respondWith(handler(e.request, conn));
  }
}

function handler(request: Request, _conn: Deno.Conn) {
  console.log({ access: request.url });
  if (request.url.includes("favicon")) {
    return new Response("ok");
  }

  const { pathname } = new URL(request.url);

  const [owner, repo, tag, file] = extract(pathname);

  if (!owner || !repo) {
    return genResponse(400);
  }

  const host = "https://raw.githubusercontent.com";
  const location = [host, owner, repo, tag, file].join("/");
  console.log({ location });

  return genResponse(301, { headers: { location } });
}

for await (const conn of listener) {
  handleConn(conn);
}
