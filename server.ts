/// <reference path="./deploy.d.ts" />
import { handleURL } from "./utils.ts";

const isDev = !Deno.env.get("DENO_DEPLOYMENT_ID");
const listener = Deno.listen({ port: 8080 });

if (isDev) {
  const { hostname, port } = listener.addr;
  console.log(`HTTP server listening on http://${hostname}:${port}`);
}

async function handleConn(conn: Deno.Conn) {
  for await (const e of Deno.serveHttp(conn)) {
    console.log("Accessed:", e.request.url);

    const [body, init] = handleURL(e.request.url);

    if (isDev) {
      const { pathname } = new URL(e.request.url);
      if (pathname !== "/") {
        // debug output
        e.respondWith(new Response(JSON.stringify(init)));
        continue;
      }
    }
    e.respondWith(new Response(body, init));
  }
}

for await (const conn of listener) {
  handleConn(conn);
}
