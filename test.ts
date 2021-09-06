import { assertEquals } from "./deps.ts";

import { extract, parse } from "./utils.ts";

console.log("test extract");
Deno.test("invalid", () => {
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
Deno.test("/owner/repo", () => {
  assertEquals(
    extract("/owner/repo"),
    ["owner", "repo", "master", "mod.ts"],
  );
  assertEquals(
    extract("/owner/repo/"),
    ["owner", "repo", "master", "mod.ts"],
  );
});
Deno.test("/owner/repo/file", () => {
  assertEquals(
    extract("/owner/repo/file"),
    ["owner", "repo", "master", "file"],
  );
  assertEquals(
    extract("/owner/repo/file/"),
    ["owner", "repo", "master", "file"],
  );
});
Deno.test("/owner/repo@tag", () => {
  assertEquals(
    extract("/owner/repo@tag"),
    ["owner", "repo", "tag", "mod.ts"],
  );
  assertEquals(
    extract("/owner/repo@tag/"),
    ["owner", "repo", "tag", "mod.ts"],
  );
});
Deno.test("/owner/repo@tag/file", () => {
  assertEquals(
    extract("/owner/repo@tag/file"),
    ["owner", "repo", "tag", "file"],
  );
  assertEquals(
    extract("/owner/repo@tag/file/"),
    ["owner", "repo", "tag", "file"],
  );
});
Deno.test("/owner/repo@tag/nested/file", () => {
  assertEquals(
    extract("/owner/repo@tag/nested/file"),
    ["owner", "repo", "tag", "nested/file"],
  );
  assertEquals(
    extract("/owner/repo@tag/nested/file/"),
    ["owner", "repo", "tag", "nested/file"],
  );
});

console.log("test parse");
Deno.test("https://github.com/owner/repo", () => {
  assertEquals(
    parse("https://github.com/owner/repo"),
    "https://pax.deno.dev/owner/repo",
  );
});
Deno.test("https://github.com/owner/repo/tree/tag", () => {
  assertEquals(
    parse("https://github.com/owner/repo/tree/tag"),
    "https://pax.deno.dev/owner/repo@tag",
  );
});
Deno.test("https://github.com/owner/repo/blob/main/path/to/file", () => {
  assertEquals(
    parse("https://github.com/owner/repo/blob/main/path/to/file"),
    "https://pax.deno.dev/owner/repo@main/path/to/file",
  );
});
Deno.test("https://github.com/owner/repo/blob/tag/path/to/file", () => {
  assertEquals(
    parse("https://github.com/owner/repo/blob/tag/path/to/file"),
    "https://pax.deno.dev/owner/repo@tag/path/to/file",
  );
});
