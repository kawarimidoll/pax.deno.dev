import { handleURL } from "./utils.ts";

const isDev = !Deno.env.get("DENO_DEPLOYMENT_ID");

async function handleConn(req: Request) {
  console.log("Accessed:", req.url);

  const [body, init] = await handleURL(req.url);

  if (isDev) {
    const { pathname } = new URL(req.url);
    if (pathname !== "/") {
      // debug output
      return new Response(JSON.stringify(init));
    }
  }
  return new Response(body, init);
}

Deno.serve(handleConn);
