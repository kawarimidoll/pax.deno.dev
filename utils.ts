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
