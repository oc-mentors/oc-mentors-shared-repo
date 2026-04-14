/**
 * Generate a QR code PNG for your app URL (e.g. ngrok or Firebase Hosting).
 *
 * Usage:
 *   node scripts/qr-code.js https://your-url.ngrok-free.dev
 *   node scripts/qr-code.js https://your-project.web.app
 *
 * Output: qr-code.png in the project root (open or share it).
 */

import QRCode from "qrcode";
import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "..", "qr-code.png");

const url = process.argv[2];
if (!url || !url.startsWith("http")) {
  console.error("Usage: node scripts/qr-code.js <URL>");
  console.error("Example: node scripts/qr-code.js https://blindly-metrical-pamala.ngrok-free.dev");
  process.exit(1);
}

QRCode.toFile(outPath, url, { width: 400, margin: 2 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("QR code saved to: qr-code.png");
  console.log("URL:", url);
});
