import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const androidRoot = join(projectRoot, "android");
const isWindows = process.platform === "win32";
const command = isWindows ? process.env.ComSpec ?? "cmd.exe" : "./gradlew";
const args = isWindows
  ? ["/d", "/s", "/c", "gradlew.bat assembleDebug"]
  : ["assembleDebug"];
const build = spawn(command, args, {
  cwd: androidRoot,
  stdio: "inherit",
});

build.on("error", (error) => {
  console.error(`Could not start the Gradle wrapper: ${error.message}`);
  process.exitCode = 1;
});

build.on("exit", (code) => {
  process.exitCode = code ?? 1;
  if (code === 0) {
    console.log("Debug APK: android/app/build/outputs/apk/debug/app-debug.apk");
  }
});
