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
  const match = path.match(
    /github\.com\/([^\/]+)\/([^\/]+)(\/(tree|blob)\/([^\/]+))?(\/.*)?/,
  );
  if (!match) return "Invalid URL";
  // match example: [
  //   "github.com/owner/repo/blob/tag/path/to/file",
  //   "owner",
  //   "repo",
  //   "/blob/tag",
  //   "blob",
  //   "tag",
  //   "/path/to/file"
  // ]
  const [, owner, repo, , , branch, file] = match;
  return `https://pax.deno.dev/${owner}/${repo}${
    branch ? ("@" + branch) : ""
  }${file || ""}`;
}
