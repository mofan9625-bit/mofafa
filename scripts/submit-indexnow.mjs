import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const endpoint = "https://api.indexnow.org/indexnow";
const sitemapPath = path.resolve(process.argv[2] ?? "public/sitemap.xml");
const staticPath = path.resolve("static");

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

async function loadKey() {
  const keyFiles = (await readdir(staticPath)).filter((file) =>
    /^[a-f0-9]{32}\.txt$/i.test(file),
  );

  if (keyFiles.length !== 1) {
    throw new Error(
      `Expected exactly one 32-character IndexNow key file in ${staticPath}, found ${keyFiles.length}.`,
    );
  }

  const key = path.basename(keyFiles[0], ".txt").toLowerCase();
  const contents = (await readFile(path.join(staticPath, keyFiles[0]), "utf8")).trim();

  if (contents.toLowerCase() !== key) {
    throw new Error(`IndexNow key file ${keyFiles[0]} must contain the key from its filename.`);
  }

  return key;
}

const [key, sitemap] = await Promise.all([
  loadKey(),
  readFile(sitemapPath, "utf8"),
]);

const urlList = [
  ...new Set(
    [...sitemap.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)].map((match) =>
      decodeXml(match[1].trim()),
    ),
  ),
];

if (urlList.length === 0) {
  throw new Error(`No URLs found in ${sitemapPath}.`);
}

const siteUrl = new URL(urlList[0]);
const host = siteUrl.host;

for (const url of urlList) {
  if (new URL(url).host !== host) {
    throw new Error(`Sitemap URL belongs to a different host: ${url}`);
  }
}

const keyLocation = `${siteUrl.protocol}//${host}/${key}.txt`;
const batches = [];
for (let index = 0; index < urlList.length; index += 10_000) {
  batches.push(urlList.slice(index, index + 10_000));
}

if (process.env.INDEXNOW_DRY_RUN === "1") {
  console.log(
    `IndexNow dry run: ${urlList.length} URL(s), host ${host}, key ${keyLocation}.`,
  );
  process.exit(0);
}

for (const [index, batch] of batches.entries()) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key, keyLocation, urlList: batch }),
  });

  if (response.status !== 200 && response.status !== 202) {
    const responseBody = await response.text();
    throw new Error(
      `IndexNow batch ${index + 1}/${batches.length} failed with HTTP ${response.status}${
        responseBody ? `: ${responseBody}` : ""
      }`,
    );
  }

  console.log(
    `IndexNow accepted batch ${index + 1}/${batches.length} (${batch.length} URL(s)): HTTP ${response.status}.`,
  );
}
