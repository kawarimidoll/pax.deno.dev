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
