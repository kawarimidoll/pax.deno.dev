# pax.deno.dev

[![ci](https://github.com/kawarimidoll/pax.deno.dev/workflows/ci/badge.svg)](.github/workflows/ci.yml)
[![deno.land](https://img.shields.io/badge/deno-%5E1.3.0-green?logo=deno)](https://deno.land)
[![vr scripts](https://badges.velociraptor.run/flat.svg)](https://velociraptor.run)
[![LICENSE](https://img.shields.io/badge/license-MIT-brightgreen)](LICENSE)

Access the modules on GitHub via Deno Deploy
<img src="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f995.png" alt="sauropods" style="height:1rem">

"pax" represents "packs"
<img src="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f4e6.png" alt="packs" style="height:1rem">

## Usage <img src="https://twemoji.maxcdn.com/v/13.1.0/72x72/2699.png" alt="gear" style="height:1rem">

`https://pax.deno.dev/<owner>/<repo>[@branch_or_tag]/[path/to/file]` redirects
to
`https://raw.githubusercontent.com/<owner>/<repo>/[branch_or_tag]/[path/to/file]`.

- `owner` and `repo` are required.
- `@branch_or_tag` and `path/to/file` are optional.
  - If `@branch_or_tag` is skipped, use `master` implicitly. This works well
    even if your default branch is `main`.
  - If `path/to/file` is skipped, use `mod.ts` implicitly.

### Bookmarklet

Use this bookmarklet in the GitHub repository page to copy URL to
`pax.deno.dev`.

```
javascript:((d)=>((c,b,l)=>{c.textContent=(([,r="",,,t,f=""])=>`https://pax.deno.dev/${r}${t?"@"+t:""}${f}`)((l.origin+l.pathname).match(/^https:\/\/github\.com\/([^\/]+\/[^\/]+)(\/(tree|blob)\/([^\/]+))?(\/.*)?/)||[]);b.appendChild(c);c.select();d.execCommand("copy");b.removeChild(c);})(d.createElement("textArea"),d.body,location))(document)
```

## Example <img src="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f680.png" alt="rocket" style="height:1rem">

### `mod.ts` on the latest default branch

```ts
import { func } from "https://pax.deno.dev/owner/repo";

# same as:
# import { func } from "https://raw.githubusercontent.com/owner/repo/master/mod.ts";
```

### The specific file on the latest default branch

```ts
import { func } from "https://pax.deno.dev/owner/repo/path/to/file.ts";

# same as:
# import { func } from "https://raw.githubusercontent.com/owner/repo/master/path/to/file.ts";
```

### `mod.ts` on the specific branch or tag

```ts
import { func } from "https://pax.deno.dev/owner/repo@tag";

# same as:
# import { func } from "https://raw.githubusercontent.com/owner/repo/tag/mod.ts";
```

### The specific file on the specific branch or tag

```ts
import { func } from "https://pax.deno.dev/owner/repo@tag/path/to/file.ts";

# same as:
# import { func } from "https://raw.githubusercontent.com/owner/repo/tag/path/to/file.ts";
```

### Link to doc.deno.land

With the parameter `d`, the link to [doc.deno.land](https://doc.deno.land) is
generated. The main part of URL should follow the syntax above.

```
https://pax.deno.dev/owner/repo?d

# same as:
# https://doc.deno.land/https/raw.githubusercontent.com/owner/repo/master/mod.ts
```

## Prior arts <img src="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f3a8.png" alt="art" style="height:1rem">

- This project is heavily inspired by [Deno PKG](https://denopkg.com/).
