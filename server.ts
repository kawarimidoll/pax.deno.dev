/// <reference path="./deploy.d.ts" />
import { extract, generate } from "./utils.ts";
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
    e.respondWith(handler(e.request, conn));
  }
}

function handler(request: Request, _conn: Deno.Conn) {
  const { pathname, search } = new URL(request.url);

  if (pathname === "/") {
    const location = "https://github.com/kawarimidoll/pax.deno.dev";
    return genResponse(301, { headers: { location } });
  }

  const [owner, repo, tag, file] = extract(pathname);

  if (!owner || !repo) {
    return genResponse(400);
  }

  const flag = search.replace(/^\?/, "").split("=")[0];

  const args = { owner, repo, tag, file, flag };
  const location = generate(args);
  log.info({ access: request.url, ...args, location });

  return genResponse(301, { headers: { location } });
}

for await (const conn of listener) {
  handleConn(conn);
}
