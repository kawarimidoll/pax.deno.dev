/// <reference path="./deploy.d.ts" />
import { handleURL } from "./utils.ts";
import { log } from "./deps.ts";

const isProd = Deno.env.get("DENO_DEPLOYMENT_ID");
const listener = Deno.listen({ port: 8080 });
if (!isProd) {
  const { hostname, port } = listener.addr;
  log.info(`HTTP server listening on http://${hostname}:${port}`);
}

function genResponse(status: number, attrs?: ResponseInit): Response {
  const statusText = {
    400: "Invalid URL",
    301: "Moved Permanently",
  }[status];

  const init = { status, statusText, ...attrs };
  return isProd
    ? new Response(`${status}: ${statusText}`, init)
    : new Response(JSON.stringify(init));
}

async function handleConn(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const e of httpConn) {
    const location = handleURL(e.request.url);
    const response = location
      ? genResponse(301, { headers: { location } })
      : genResponse(400);

    e.respondWith(response);
  }
}

for await (const conn of listener) {
  handleConn(conn);
}
