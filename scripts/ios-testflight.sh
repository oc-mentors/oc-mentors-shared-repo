#!/usr/bin/env bash
# Build + archive + upload OC Mentors to App Store Connect (TestFlight).
# Prereqs: Xcode with iOS platform installed, ~10GB free disk, Apple ID signed into Xcode.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ARCHIVE_DIR="${HOME}/Library/Developer/Xcode/Archives/$(date +%Y-%m-%d)"
ARCHIVE_PATH="${ARCHIVE_DIR}/OCMentors-1.0.xcarchive"
EXPORT_PLIST="${ROOT}/build/ExportOptions-AppStore.plist"
EXPORT_DIR="${ROOT}/build/ios-export"
TEAM_ID="H3UF49W743"

mkdir -p "$ARCHIVE_DIR" "$EXPORT_DIR"

echo "==> Web build + Capacitor sync"
cd "$ROOT"
npm run ios:prep

echo "==> Archive"
cd "${ROOT}/ios/App"
xcodebuild -workspace App.xcworkspace \
  -scheme App \
  -configuration Release \
  -destination 'generic/platform=iOS' \
  -archivePath "$ARCHIVE_PATH" \
  DEVELOPMENT_TEAM="$TEAM_ID" \
  -allowProvisioningUpdates \
  archive

echo "==> Export / upload to App Store Connect"
xcodebuild -exportArchive \
  -archivePath "$ARCHIVE_PATH" \
  -exportOptionsPlist "$EXPORT_PLIST" \
  -exportPath "$EXPORT_DIR" \
  -allowProvisioningUpdates

echo "Done. Archive: $ARCHIVE_PATH"
echo "If upload succeeded, check App Store Connect → TestFlight (processing can take a few minutes)."
