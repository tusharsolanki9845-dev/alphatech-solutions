# Build the AlphaTech Android APK

The website is packaged as a native Android app with Capacitor. The generated debug APK can be installed directly on Android phones. A release APK must be signed before public distribution.

## Latest generated APK

- File: `android/app/build/outputs/apk/debug/app-debug.apk`
- Application ID: `com.alphatech.solutions`
- Version: `1.0` (debug)
- SHA-256: `895E7369D6397435DD49D181304FAD30FC7B3E18B74C0D91398DB92578CCDB97`

## Requirements

- Node.js and npm
- Android Studio with the Android SDK and a supported JDK
- Windows: Android Studio installs or configures the required Gradle tooling

## Prepare the Android project

From the `Alpha Tech` folder:

```powershell
npm install
npm run android:sync
npm run android:open
```

Android Studio opens the native project. Let Gradle finish syncing, then use **Build → Build Bundle(s) / APK(s) → Build APK(s)**.

The debug APK is created at:

`android/app/build/outputs/apk/debug/app-debug.apk`

Copy that APK to a phone and open it to install. Android may ask you to allow installs from that file source.

## Build from PowerShell

After Android Studio and the SDK are installed and configured, run:

```powershell
npm run android:apk:debug
```

The APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`.

## Download the APK from GitHub Actions

The workflow at `.github/workflows/build-android-apk.yml` builds a debug APK on pushes to `main` or `master`. It can also be started manually from the repository's **Actions → Build Android APK → Run workflow** page. Download the `alphatech-android-debug-apk` artifact from the completed run; artifacts are kept for 30 days.

This workspace does not have a GitHub remote configured yet. To use the Actions download, add the project to a GitHub repository and push the `Alpha Tech` folder contents.

## Updating the app

After changing the website, run `npm run android:sync` before building again. This rebuilds the web assets and copies them into the Android app.

For Play Store or public release, configure a signing key in Android Studio and build a signed release APK or Android App Bundle. Do not commit signing keys or passwords to source control.
