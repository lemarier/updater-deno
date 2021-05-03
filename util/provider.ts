import { PROVIDER } from "./constants.ts";
import { MatchHandler } from "../deps.ts";
// load providers as deno deploy do not support
// dynamic import
import GithubProvider from "../providers/github.ts";

export enum AVAILABLE_PROVIDERS {
  Github = "github",
}

function loadProvider(): MatchHandler {
  switch (PROVIDER) {
    case AVAILABLE_PROVIDERS.Github:
      return GithubProvider;

    // return github as default provider
    default:
      return GithubProvider;
  }
}

export { loadProvider };
