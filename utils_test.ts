import { assertEquals } from "./deps.ts";
import { extract, genResponseArgs, handleURL, isProd, parse } from "./utils.ts";

Deno.test("[isProd] check environment variables", () => {
  // development
  Deno.env.delete("DENO_DEPLOYMENT_ID");
  assertEquals(isProd(), false);

  // production
  Deno.env.set("DENO_DEPLOYMENT_ID", "test-production");
  assertEquals(isProd(), true);
});

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

Deno.test("[handleURL] invalid", () => {
  assertEquals(
    handleURL("https://pax.deno.dev/owner"),
    "",
  );
  assertEquals(
    handleURL("https://pax.deno.dev/owner/"),
    "",
  );
  assertEquals(
    handleURL("https://pax.deno.dev/owner@tag"),
    "",
  );
  assertEquals(
    handleURL("https://pax.deno.dev/owner@tag?d"),
    "",
  );
});
Deno.test("[handleURL] root", () => {
  assertEquals(
    handleURL("https://pax.deno.dev"),
    "https://github.com/kawarimidoll/pax.deno.dev",
  );
  assertEquals(
    handleURL("https://pax.deno.dev/"),
    "https://github.com/kawarimidoll/pax.deno.dev",
  );
  assertEquals(
    handleURL("https://pax.deno.dev?d"),
    "https://github.com/kawarimidoll/pax.deno.dev",
  );
  assertEquals(
    handleURL("https://pax.deno.dev#d"),
    "https://github.com/kawarimidoll/pax.deno.dev",
  );
});
Deno.test("[handleURL] /owner/repo", () => {
  assertEquals(
    handleURL("https://pax.deno.dev/owner/repo"),
    "https://raw.githubusercontent.com/owner/repo/master/mod.ts",
  );
  assertEquals(
    handleURL("https://pax.deno.dev/owner/repo/"),
    "https://raw.githubusercontent.com/owner/repo/master/mod.ts",
  );
  assertEquals(
    handleURL("https://pax.deno.dev/owner/repo?d"),
    "https://doc.deno.land/https/raw.githubusercontent.com/owner/repo/master/mod.ts",
  );
});
Deno.test("[handleURL] /owner/repo/path/to/file", () => {
  assertEquals(
    handleURL("https://pax.deno.dev/owner/repo/path/to/file"),
    "https://raw.githubusercontent.com/owner/repo/master/path/to/file",
  );
  assertEquals(
    handleURL("https://pax.deno.dev/owner/repo/path/to/file/"),
    "https://raw.githubusercontent.com/owner/repo/master/path/to/file",
  );
  assertEquals(
    handleURL("https://pax.deno.dev/owner/repo/path/to/file?d"),
    "https://doc.deno.land/https/raw.githubusercontent.com/owner/repo/master/path/to/file",
  );
});
Deno.test("[handleURL] /owner/repo@tag", () => {
  assertEquals(
    handleURL("https://pax.deno.dev/owner/repo@tag"),
    "https://raw.githubusercontent.com/owner/repo/tag/mod.ts",
  );
  assertEquals(
    handleURL("https://pax.deno.dev/owner/repo@tag/"),
    "https://raw.githubusercontent.com/owner/repo/tag/mod.ts",
  );
  assertEquals(
    handleURL("https://pax.deno.dev/owner/repo@tag?d"),
    "https://doc.deno.land/https/raw.githubusercontent.com/owner/repo/tag/mod.ts",
  );
});
Deno.test("[handleURL] /owner/repo@tag/path/to/file", () => {
  assertEquals(
    handleURL("https://pax.deno.dev/owner/repo@tag/path/to/file"),
    "https://raw.githubusercontent.com/owner/repo/tag/path/to/file",
  );
  assertEquals(
    handleURL("https://pax.deno.dev/owner/repo@tag/path/to/file/"),
    "https://raw.githubusercontent.com/owner/repo/tag/path/to/file",
  );
  assertEquals(
    handleURL("https://pax.deno.dev/owner/repo@tag/path/to/file?d"),
    "https://doc.deno.land/https/raw.githubusercontent.com/owner/repo/tag/path/to/file",
  );
});

Deno.test("[genResponseArgs] invalid", () => {
  // development
  Deno.env.delete("DENO_DEPLOYMENT_ID");
  assertEquals(
    genResponseArgs(""),
    [
      JSON.stringify(
        {
          status: 400,
          statusText: "Invalid URL",
          headers: { location: "" },
        },
      ),
    ],
  );

  // production
  Deno.env.set("DENO_DEPLOYMENT_ID", "test-production");
  assertEquals(
    genResponseArgs(""),
    [
      "400: Invalid URL",
      {
        status: 400,
        statusText: "Invalid URL",
        headers: { location: "" },
      },
    ],
  );
});
Deno.test("[genResponseArgs] redirect", () => {
  // development
  Deno.env.delete("DENO_DEPLOYMENT_ID");
  assertEquals(
    genResponseArgs(
      "https://raw.githubusercontent.com/owner/repo/tag/path/to/file",
    ),
    [
      JSON.stringify(
        {
          status: 301,
          statusText: "Moved Permanently",
          headers: {
            location:
              "https://raw.githubusercontent.com/owner/repo/tag/path/to/file",
          },
        },
      ),
    ],
  );

  // production
  Deno.env.set("DENO_DEPLOYMENT_ID", "test-production");
  assertEquals(
    genResponseArgs(
      "https://raw.githubusercontent.com/owner/repo/tag/path/to/file",
    ),
    [
      "301: Moved Permanently",
      {
        status: 301,
        statusText: "Moved Permanently",
        headers: {
          location:
            "https://raw.githubusercontent.com/owner/repo/tag/path/to/file",
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
