# Deno Updater Proxy

[![Deploy](https://deno.com/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://raw.githubusercontent.com/lemarier/updater-deno/main/main.ts&env=GITHUB_ACCOUNT,GITHUB_REPO,GITHUB_TOKEN)

Sample PoC for Tauri updater using deno deploy or cloudflare workers.

For `update server` to work there are a few enviornment variables that need to be
set either in the local development enviornment or in the deploy settings. These
enviornment variables are:

| name           | description     | required |
| -------------- | --------------- | -------- |
| GITHUB_ACCOUNT | Github account  | YES      |
| GITHUB_REPO    | Repository name | YES      |
| GITHUB_TOKEN   | Personal token  | NO       |

Once the enviornment variables are set you can start it locally using:

```bash
> GITHUB_ACCOUNT=lemarier GITHUB_REPO=tauri-test deployctl run --watch ./main.ts
```

## Endpoints

This is the exposed endpoints and are fully compatible with tauri update server.

Once you deployed your server, you could use the main endpoint as update server in `tauri.conf.json`

Sample deno deploy URL: `https://cool-goose-79.deno.dev/`

| endpoint            |
| ------------------- |
| /darwin/`<version>` |
| /linux/`<version>`  |
| /win32/`<version>`  |
| /win64/`<version>`  |

## Known issue

- [ ] Need to implement cache (not available for deno deploy yet)
