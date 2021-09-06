# pax.deno.dev

[![ci](https://github.com/kawarimidoll/deno-dev-template/workflows/ci/badge.svg)](.github/workflows/ci.yml)
[![deno.land](https://img.shields.io/badge/deno-%5E1.0.0-green?logo=deno)](https://deno.land)
[![vr scripts](https://badges.velociraptor.run/flat.svg)](https://velociraptor.run)
[![LICENSE](https://img.shields.io/badge/license-MIT-brightgreen)](LICENSE)

Access the modules on GitHub via Deno Deploy
<img src="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f995.png" alt="sauropods" width="20">

"pax" represents "packs"
<img src="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f4e6.png" alt="packs" width="20">

## Usage <img src="https://twemoji.maxcdn.com/v/13.1.0/72x72/2699.png" alt="gear" width="24">

`https://pax.deno.dev/<owner>/<repo>[@branch_or_tag]/[path/to/file]` redirects
to
`https://raw.githubusercontent.com/<owner>/<repo>/[branch_or_tag]/[path/to/file]`.

- `owner` and `repo` are required.
- `@branch_or_tag` and `path/to/file` are optional.
- If `@branch_or_tag` is skipped, use `master` implicitly. This works well even
  if your default branch is `main`.
  - If `path/to/file` is skipped, use `mod.ts` implicitly.

### Bookmarklet

Use this bookmarklet in the GitHub repository page to copy URL to
`pax.deno.dev`.

```
javascript:((d)=>((c,b,l)=>{c.textContent=(([,r="",,,t,f=""])=>`https://pax.deno.dev/${r}${t?"@"+t:""}${f}`)((l.origin+l.pathname).match(/^https:\/\/github\.com\/([^\/]+\/[^\/]+)(\/(tree|blob)\/([^\/]+))?(\/.*)?/)||[]);b.appendChild(c);c.select();d.execCommand("copy");b.removeChild(c);})(d.createElement("textArea"),d.body,location))(document)
```

## Example <img src="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f680.png" alt="rocket" width="24">

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

## Prior arts

- This project is heavily inspired by [Deno PKG](https://denopkg.com/).
