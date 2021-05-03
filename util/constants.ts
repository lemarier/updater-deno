// define provider
export const PROVIDER = Deno.env.get("PROVIDER")!;

// github provider
export const GITHUB_ACCOUNT = Deno.env.get("GITHUB_ACCOUNT")!;
export const GITHUB_REPO = Deno.env.get("GITHUB_REPO")!;
// optional; required if your repo is private
export const GITHUB_TOKEN = Deno.env.get("GITHUB_TOKEN")!;
