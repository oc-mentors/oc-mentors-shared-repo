#!/usr/bin/env bash
# Rebuild launcher / PWA icons from branding/oc-mentors-title-card.png (ImageMagick).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${ROOT}/branding/oc-mentors-title-card.png"
MASTER="${ROOT}/public/oc-mark-raster.png"
command -v magick >/dev/null || { echo "Install ImageMagick (magick)"; exit 1; }
[[ -f "$SRC" ]] || { echo "Missing $SRC"; exit 1; }

# Isolate gradient OC mark: strip top banner, keep right strip, trim, pad to square.
magick "$SRC" -gravity North -chop 0x22% +repage \
  -gravity East -crop 24%x100%+0+0 +repage \
  -fuzz 1% -trim +repage \
  -resize 680x680 -background white -gravity center -extent 1024x1024 "$MASTER"

magick "$MASTER" -resize 512x512 "${ROOT}/public/icon-512.png"
magick "$MASTER" -resize 192x192 "${ROOT}/public/icon-192.png"
magick "$MASTER" -resize 180x180 "${ROOT}/public/apple-touch-icon.png"
cp "$MASTER" "${ROOT}/ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png"

for spec in "mipmap-mdpi:48" "mipmap-hdpi:72" "mipmap-xhdpi:96" "mipmap-xxhdpi:144" "mipmap-xxxhdpi:192"; do
  dir="${spec%%:*}"; s="${spec##*:}"
  magick "$MASTER" -resize "${s}x${s}" "${ROOT}/android/app/src/main/res/${dir}/ic_launcher.png"
  magick "$MASTER" -resize "${s}x${s}" "${ROOT}/android/app/src/main/res/${dir}/ic_launcher_round.png"
done

for spec in "mipmap-mdpi:108" "mipmap-hdpi:162" "mipmap-xhdpi:216" "mipmap-xxhdpi:324" "mipmap-xxxhdpi:432"; do
  dir="${spec%%:*}"; s="${spec##*:}"
  magick "$MASTER" -resize "${s}x${s}" "${ROOT}/android/app/src/main/res/${dir}/ic_launcher_foreground.png"
done

echo "Icons updated from $SRC"
