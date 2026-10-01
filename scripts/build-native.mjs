import { access, cp, mkdir, rm, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const webOutput = join(projectRoot, "dist");
const webFiles = [
  "index.html",
  "style.css",
  "script.js",
  "sw.js",
  "manifest.webmanifest",
];

await rm(webOutput, { recursive: true, force: true });
await mkdir(webOutput, { recursive: true });

for (const file of webFiles) {
  await copyFile(join(projectRoot, file), join(webOutput, file));
}

await cp(join(projectRoot, "assets"), join(webOutput, "assets"), { recursive: true });
console.log(`Prepared native web assets in ${webOutput}`);

const androidResources = join(projectRoot, "android", "app", "src", "main", "res");
try {
  await access(androidResources);
  const appIcon = join(projectRoot, "assets", "icon-512.png");
  const densities = ["mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi"];
  for (const density of densities) {
    const mipmap = join(androidResources, `mipmap-${density}`);
    await mkdir(mipmap, { recursive: true });
    for (const name of ["ic_launcher.png", "ic_launcher_round.png", "ic_launcher_foreground.png"]) {
      await copyFile(appIcon, join(mipmap, name));
    }
  }
  console.log("Updated Android launcher icons from assets/icon-512.png");
} catch {
  // The icon sync runs after `cap add android` creates the Android project.
}
