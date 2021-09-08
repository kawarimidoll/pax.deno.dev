/// <reference path="./deploy.d.ts" />
import { genResponseArgs, handleURL, isProd } from "./utils.ts";
import { log } from "./deps.ts";

const listener = Deno.listen({ port: 8080 });

if (!isProd()) {
  const { hostname, port } = listener.addr;
  log.info(`HTTP server listening on http://${hostname}:${port}`);
}

async function handleConn(conn: Deno.Conn) {
  for await (const e of Deno.serveHttp(conn)) {
    const location = handleURL(e.request.url);
    const args = genResponseArgs(location);

    e.respondWith(new Response(...args));
  }
}

for await (const conn of listener) {
  handleConn(conn);
}
