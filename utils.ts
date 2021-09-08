export function isProd() {
  // declare as a function to change environment when testing
  return !!Deno.env.get("DENO_DEPLOYMENT_ID");
}

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

export function handleURL(url: string) {
  const { pathname, search } = new URL(url);

  if (pathname === "/") {
    return "https://github.com/kawarimidoll/pax.deno.dev";
  }

  const [owner, repo, tag, file] = extract(pathname);

  if (!owner || !repo) {
    return "";
  }

  const flag = search.replace(/^\?/, "").split("=")[0];

  let host = "https://raw.githubusercontent.com";
  if (flag.includes("d")) {
    host = "https://doc.deno.land/" + host.replace(/:\//, "");
  }
  return [host, owner, repo, tag, file].join("/");
}

export function genResponseArgs(location: string): [string, ResponseInit?] {
  let [status, statusText] = [301, "Moved Permanently"];
  if (location === "https://github.com/kawarimidoll/pax.deno.dev") {
    // Not use 301, because top page may be useful something...
    [status, statusText] = [302, "Found"];
  } else if (location === "") {
    [status, statusText] = [400, "Invalid URL"];
  }

  const init = { status, statusText, headers: { location } };
  return isProd() ? [`${status}: ${statusText}`, init] : [JSON.stringify(init)];
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
