import { assertEquals } from "./deps.ts";
import { extract, generate, parse } from "./utils.ts";

Deno.test("[extract] invalid", () => {
  assertEquals(
    extract("/owner"),
    [],
  );
  assertEquals(
    extract("/owner/"),
    [],
  );
  assertEquals(
    extract("/owner@tag"),
    [],
  );
});
Deno.test("[extract] /owner/repo", () => {
  assertEquals(
    extract("/owner/repo"),
    ["owner", "repo", "master", "mod.ts"],
  );
  assertEquals(
    extract("/owner/repo/"),
    ["owner", "repo", "master", "mod.ts"],
  );
});
Deno.test("[extract] /owner/repo/file", () => {
  assertEquals(
    extract("/owner/repo/file"),
    ["owner", "repo", "master", "file"],
  );
  assertEquals(
    extract("/owner/repo/file/"),
    ["owner", "repo", "master", "file"],
  );
});
Deno.test("[extract] /owner/repo@tag", () => {
  assertEquals(
    extract("/owner/repo@tag"),
    ["owner", "repo", "tag", "mod.ts"],
  );
  assertEquals(
    extract("/owner/repo@tag/"),
    ["owner", "repo", "tag", "mod.ts"],
  );
});
Deno.test("[extract] /owner/repo@tag/file", () => {
  assertEquals(
    extract("/owner/repo@tag/file"),
    ["owner", "repo", "tag", "file"],
  );
  assertEquals(
    extract("/owner/repo@tag/file/"),
    ["owner", "repo", "tag", "file"],
  );
});
Deno.test("[extract] /owner/repo@tag/nested/file", () => {
  assertEquals(
    extract("/owner/repo@tag/nested/file"),
    ["owner", "repo", "tag", "nested/file"],
  );
  assertEquals(
    extract("/owner/repo@tag/nested/file/"),
    ["owner", "repo", "tag", "nested/file"],
  );
});

const generateArgs = {
  owner: "owner",
  repo: "repo",
  tag: "master",
  file: "mod.ts",
};
Deno.test("[generate] to raw.githubusercontent.com", () => {
  assertEquals(
    generate({ ...generateArgs, flag: "" }),
    "https://raw.githubusercontent.com/owner/repo/master/mod.ts",
  );
});
Deno.test("[generate] to doc.deno.land", () => {
  assertEquals(
    generate({ ...generateArgs, flag: "d" }),
    "https://doc.deno.land/https/raw.githubusercontent.com/owner/repo/master/mod.ts",
  );
});

Deno.test("[parse] invalid", () => {
  assertEquals(
    parse("https://github.com/owner"),
    "https://pax.deno.dev/",
  );
  assertEquals(
    parse("https://deno.land/x/module"),
    "https://pax.deno.dev/",
  );
});
Deno.test("[parse] https://github.com/owner/repo", () => {
  assertEquals(
    parse("https://github.com/owner/repo"),
    "https://pax.deno.dev/owner/repo",
  );
});
Deno.test("[parse] https://github.com/owner/repo/tree/tag", () => {
  assertEquals(
    parse("https://github.com/owner/repo/tree/tag"),
    "https://pax.deno.dev/owner/repo@tag",
  );
});
Deno.test("[parse] https://github.com/owner/repo/blob/main/path/to/file", () => {
  assertEquals(
    parse("https://github.com/owner/repo/blob/main/path/to/file"),
    "https://pax.deno.dev/owner/repo@main/path/to/file",
  );
});
Deno.test("[parse] https://github.com/owner/repo/blob/tag/path/to/file", () => {
  assertEquals(
    parse("https://github.com/owner/repo/blob/tag/path/to/file"),
    "https://pax.deno.dev/owner/repo@tag/path/to/file",
  );
});
