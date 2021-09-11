import { Marked, tag as h } from "./deps.ts";

const readme = await Deno.readTextFile("./README.md");
const corner = await Deno.readTextFile("./corner.html");
const description = "Access the modules on GitHub via Deno Deploy🦕";
const icon = "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f4e6.png";
const css = "https://cdn.jsdelivr.net/npm/water.css@2/out/water.min.css";
const viewport = "width=device-width,initial-scale=1.0,minimum-scale=1.0";
const index = "<!DOCTYPE html>" +
  h(
    "html",
    h(
      "head",
      h("meta", { charset: "UTF-8" }),
      h("title", "pax.deno.dev"),
      h("meta", { name: "viewport", content: viewport }),
      h("link", { rel: "icon", type: "image/png", href: icon }),
      h("link", { rel: "stylesheet", href: css }),
      h("meta", { name: "description", content: description }),
      h("meta", { property: "og:url", content: "https://pax.deno.dev/" }),
      h("meta", { property: "og:type", content: "website" }),
      h("meta", { property: "og:title", content: "pax.deno.dev" }),
      h("meta", { property: "og:description", content: description }),
      h("meta", { property: "og:site_name", content: "pax.deno.dev" }),
      h("meta", { property: "og:image", content: icon }),
      h("meta", { name: "twitter:card", content: "summary" }),
      h("meta", { name: "twitter:site", content: "@kawarimidoll" }),
    ),
    h("body", Marked.parse(readme).content, corner),
  );

export function extract(path: string) {
  const match = path.match(/^\/([^\/]+)\/([^\/@]+)(@[^\/]+)?(\/.*)?/);
  if (!match) return [];

  const [, owner, repo, atTag, file] = match;
  return [
    owner,
    repo,
    atTag ? atTag.slice(1) : "master",
    file?.replace(/^\/|\/$/g, "") || "mod.ts",
  ];
}

export function handleURL(url: string): [string, ResponseInit] {
  const { pathname, search } = new URL(url);
  if (pathname === "/") {
    return [index, { headers: { "content-type": "text/html" } }];
  }

  const [owner, repo, tag, file] = extract(pathname);

  if (!owner || !repo) {
    const [status, statusText] = [400, "Invalid URL"];
    const init = { status, statusText };
    return [`${status}: ${statusText}`, init];
  }

  const flag = search.replace(/^\?/, "").split("=")[0];

  let host = "https://raw.githubusercontent.com";
  if (flag.includes("d")) {
    host = "https://doc.deno.land/" + host.replace(":/", "");
  }
  const location = [host, owner, repo, tag, file].join("/");
  const [status, statusText] = [301, "Moved Permanently"];
  const init = { status, statusText, headers: { location } };
  return [`${status}: ${statusText}`, init];
}

export function parse(path: string) {
  // match example: [
  //   "https://github.com/owner/repo/blob/tag/path/to/file",
  //   "owner/repo",
  //   "/blob/tag",
  //   "blob",
  //   "tag",
  //   "/path/to/file"
  // ]
  const [, ownerRepo = "", , , tag, file = ""] = path.match(
    /^https:\/\/github\.com\/([^\/]+\/[^\/]+)(\/(tree|blob)\/([^\/]+))?(\/.*)?/,
  ) || [];
  return `https://pax.deno.dev/${ownerRepo}${tag ? "@" + tag : ""}${file}`;
}
