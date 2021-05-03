import { Match, SemverValid, SemverGT } from "../deps.ts";
import { json, notFound, noUpdateAvailable } from "../util/response.ts";
import { validatePlatform, AVAILABLE_PLATFORMS } from "../util/platform.ts";
import {
  GITHUB_TOKEN,
  GITHUB_ACCOUNT,
  GITHUB_REPO,
} from "../util/constants.ts";

export default async function (req: Request, match: Match): Promise<Response> {
  const { platform, version } = match.params;

  // Make sure the platform is valid
  if (!platform || !validatePlatform(platform)) {
    return notFound();
  }

  // Make sure our version is semver valid
  if (!version || !SemverValid(version)) {
    return notFound();
  }

  // Github api URL for latest version
  const reqUrl = new URL(
    `https://api.github.com/repos/${GITHUB_ACCOUNT}/${GITHUB_REPO}/releases/latest`
  );

  // Headers
  const headers: HeadersInit = { Accept: "application/vnd.github.preview" };
  // Add github token if provided
  if (GITHUB_TOKEN && GITHUB_TOKEN.length > 0) {
    headers.Authorization = `token ${GITHUB_TOKEN}`;
  }

  // Get JSON from github
  const release = await (
    await fetch(reqUrl.toString(), {
      method: "GET",
      headers,
    })
  ).json();

  console.log({ release });

  // Sanitize our version
  const remoteVersion = sanitizeVersion(release.tag_name.toLowerCase());

  // Make sure we found a valid version
  if (!remoteVersion || !SemverValid(remoteVersion)) {
    return notFound();
  }

  // Check if the user is running older version or not
  const shouldUpdate = SemverGT(remoteVersion, version);
  if (!shouldUpdate) {
    return noUpdateAvailable();
  }

  for (const asset of release.assets) {
    const { name, browser_download_url } = asset;
    const findPlatform = checkPlatform(platform, name);
    if (!findPlatform) {
      continue;
    }

    // try to find signature for this asset
    const signature = await findAssetSignature(name, release.assets);

    return json({
      name: release.tag_name,
      notes: release.body,
      pub_date: release.published_at,
      signature,
      url: browser_download_url,
    });
  }

  return notFound();
}

function sanitizeVersion(version: string): string {
  // if it start with v1.0.0 remove the `v`
  if (version.charAt(0) === "v") {
    return version.substring(1);
  }

  return version;
}

function checkPlatform(platform: string, fileName: string) {
  const extension = extname(fileName);

  // OSX we should have our .app tar.gz
  if (
    (fileName.includes(".app") ||
      fileName.includes("darwin") ||
      fileName.includes("osx")) &&
    extension === "gz" &&
    platform === AVAILABLE_PLATFORMS.MacOS
  ) {
    return "darwin";
  }

  // Windows 64 bits
  if (
    (fileName.includes("x64") || fileName.includes("win64")) &&
    extension === "zip" &&
    platform === AVAILABLE_PLATFORMS.Win64
  ) {
    return "win64";
  }

  // Windows 32 bits
  if (
    (fileName.includes("x32") || fileName.includes("win32")) &&
    extension === "zip" &&
    platform === AVAILABLE_PLATFORMS.Win32
  ) {
    return "win32";
  }

  // Linux app image
  if (
    fileName.includes("AppImage") &&
    extension === "gz" &&
    platform === AVAILABLE_PLATFORMS.Linux
  ) {
    return "linux";
  }
}

function extname(filename: string) {
  return filename.split(".").pop() || "";
}

async function findAssetSignature(fileName: string, assets: any[]) {
  // check in our assets if we have a file: `fileName.sig`
  // by example fileName can be: App-1.0.0.zip
  const foundSignature = assets.find(
    (asset) => asset.name.toLowerCase() === `${fileName.toLowerCase()}.sig`
  );

  if (!foundSignature) {
    return null;
  }

  const response = await fetch(foundSignature.browser_download_url);
  if (response.status !== 200) {
    return null;
  }
  const signature = await response.text();
  return signature;
}
