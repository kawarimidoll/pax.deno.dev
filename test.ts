import { assertEquals } from "@std/assert";
// deno-lint-ignore no-import-prefix
import { tag } from "https://pax.deno.dev/kawarimidoll/deno-markup-tag";

Deno.test("[health-check] import module", () => {
  assertEquals(tag("div", "ok"), "<div>ok</div>");
});
