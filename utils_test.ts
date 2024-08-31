import { assertEquals } from "./deps.ts";
import { extract, handleURL, parse } from "./utils.ts";

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

Deno.test("[handleURL] invalid", async () => {
  const expected: Awaited<ReturnType<typeof handleURL>> = [
    "400: Invalid URL",
    { status: 400, statusText: "Invalid URL" },
  ];
  assertEquals(
    await handleURL("https://pax.deno.dev/owner"),
    expected,
  );
  assertEquals(
    await handleURL("https://pax.deno.dev/owner/"),
    expected,
  );
  assertEquals(
    await handleURL("https://pax.deno.dev/owner@tag"),
    expected,
  );
  assertEquals(
    await handleURL("https://pax.deno.dev/owner@tag?d"),
    expected,
  );
});
Deno.test("[handleURL] root", async () => {
  // don't test page contents
  assertEquals(
    (await handleURL("https://pax.deno.dev"))[1],
    { headers: { "content-type": "text/html" } },
  );
  assertEquals(
    (await handleURL("https://pax.deno.dev/"))[1],
    { headers: { "content-type": "text/html" } },
  );
  assertEquals(
    (await handleURL("https://pax.deno.dev?d"))[1],
    { headers: { "content-type": "text/html" } },
  );
  assertEquals(
    (await handleURL("https://pax.deno.dev#d"))[1],
    { headers: { "content-type": "text/html" } },
  );
});
Deno.test("[handleURL] /owner/repo", async () => {
  const location = "https://raw.githubusercontent.com/owner/repo/master/mod.ts";
  const expected: Awaited<ReturnType<typeof handleURL>> = [
    "301: Moved Permanently",
    {
      status: 301,
      statusText: "Moved Permanently",
      headers: { location },
    },
  ];
  assertEquals(
    await handleURL("https://pax.deno.dev/owner/repo"),
    expected,
  );
  assertEquals(
    await handleURL("https://pax.deno.dev/owner/repo/"),
    expected,
  );
  assertEquals(
    await handleURL("https://pax.deno.dev/owner/repo?d"),
    [
      "301: Moved Permanently",
      {
        status: 301,
        statusText: "Moved Permanently",
        headers: {
          location: "https://doc.deno.land/" + location.replace(":/", ""),
        },
      },
    ],
  );
});
Deno.test("[handleURL] /owner/repo/path/to/file", async () => {
  const location =
    "https://raw.githubusercontent.com/owner/repo/master/path/to/file";
  const expected: Awaited<ReturnType<typeof handleURL>> = [
    "301: Moved Permanently",
    {
      status: 301,
      statusText: "Moved Permanently",
      headers: { location },
    },
  ];
  assertEquals(
    await handleURL("https://pax.deno.dev/owner/repo/path/to/file"),
    expected,
  );
  assertEquals(
    await handleURL("https://pax.deno.dev/owner/repo/path/to/file/"),
    expected,
  );
  assertEquals(
    await handleURL("https://pax.deno.dev/owner/repo/path/to/file?d"),
    [
      "301: Moved Permanently",
      {
        status: 301,
        statusText: "Moved Permanently",
        headers: {
          location: "https://doc.deno.land/" + location.replace(":/", ""),
        },
      },
    ],
  );
});
Deno.test("[handleURL] /owner/repo@tag", async () => {
  const location = "https://raw.githubusercontent.com/owner/repo/tag/mod.ts";
  const expected: Awaited<ReturnType<typeof handleURL>> = [
    "301: Moved Permanently",
    {
      status: 301,
      statusText: "Moved Permanently",
      headers: { location },
    },
  ];
  assertEquals(
    await handleURL("https://pax.deno.dev/owner/repo@tag"),
    expected,
  );
  assertEquals(
    await handleURL("https://pax.deno.dev/owner/repo@tag/"),
    expected,
  );
  assertEquals(
    await handleURL("https://pax.deno.dev/owner/repo@tag?d"),
    [
      "301: Moved Permanently",
      {
        status: 301,
        statusText: "Moved Permanently",
        headers: {
          location: "https://doc.deno.land/" + location.replace(":/", ""),
        },
      },
    ],
  );
});
Deno.test("[handleURL] /owner/repo@tag/path/to/file", async () => {
  const location =
    "https://raw.githubusercontent.com/owner/repo/tag/path/to/file";
  const expected: Awaited<ReturnType<typeof handleURL>> = [
    "301: Moved Permanently",
    {
      status: 301,
      statusText: "Moved Permanently",
      headers: { location },
    },
  ];
  assertEquals(
    await handleURL("https://pax.deno.dev/owner/repo@tag/path/to/file"),
    expected,
  );
  assertEquals(
    await handleURL("https://pax.deno.dev/owner/repo@tag/path/to/file/"),
    expected,
  );
  assertEquals(
    await handleURL("https://pax.deno.dev/owner/repo@tag/path/to/file?d"),
    [
      "301: Moved Permanently",
      {
        status: 301,
        statusText: "Moved Permanently",
        headers: {
          location: "https://doc.deno.land/" + location.replace(":/", ""),
        },
      },
    ],
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
