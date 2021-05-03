# Deno Updater Proxy

[![Deploy](https://deno.com/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://raw.githubusercontent.com/lemarier/updater-deno/main/main.ts&env=GITHUB_ACCOUNT,GITHUB_REPO)

Sample PoC for Tauri updater using deno deploy or cloudflare workers.

For `update server` to work there are a few enviornment variables that need to be
set either in the local development enviornment or in the deploy settings. These
enviornment variables are:

| name           |
| -------------- |
| GITHUB_ACCOUNT |
| GITHUB_REPO    |

Once the enviornment variables are set you can start it locally using:

```bash
> GITHUB_ACCOUNT=lemarier GITHUB_REPO=tauri-test deployctl run --watch ./main.ts
```

## Known issue

- [ ] Need to implement cache (not available for deno deploy yet)
