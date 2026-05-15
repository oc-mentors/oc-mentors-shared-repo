#!/usr/bin/env bash
# Rebuild launcher / PWA icons from branding/oc-mark-logo.png (ImageMagick).
# Source: OC mark on a flat light background (white/near-white); transparency is applied to that backdrop only.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${ROOT}/branding/oc-mark-logo.png"
MASTER="${ROOT}/public/oc-mark-raster.png"
command -v magick >/dev/null || { echo "Install ImageMagick (magick)"; exit 1; }
[[ -f "$SRC" ]] || { echo "Missing $SRC"; exit 1; }

# App primary blue (matches theme-color / brand).
ICON_BG="#4361d9"

# Drop flat white backdrop so the mark can sit on blue; trim, scale (mask-safe), center on blue tile.
magick "$SRC" -fuzz 8% -transparent white -trim +repage \
  -resize 532x532 \
  \( -size 1024x1024 "xc:${ICON_BG}" \) +swap -gravity center -compose over -composite \
  -alpha off "$MASTER"

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
