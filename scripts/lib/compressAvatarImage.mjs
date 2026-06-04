/**
 * Node port of compressImageFileToDataUrl (EditProfileModal / avatarImage.ts).
 */
import sharp from "sharp";
import { AVATAR_MAX_BYTES, AVATAR_MAX_SIDE } from "../../src/app/lib/avatarImage.constants.js";

export { AVATAR_MAX_BYTES, AVATAR_MAX_SIDE };

/** @returns {Promise<{ buffer: Buffer; contentType: string }>} */
export async function compressImageFile(inputPath) {
  const inputBuffer = await sharp(inputPath).toBuffer();
  const meta = await sharp(inputBuffer).metadata();
  const w = meta.width ?? 1;
  const h = meta.height ?? 1;
  const scale = Math.min(1, AVATAR_MAX_SIDE / Math.max(w, h));
  const cw = Math.max(1, Math.round(w * scale));
  const ch = Math.max(1, Math.round(h * scale));

  let quality = 85;
  let buffer;
  while (true) {
    buffer = await sharp(inputBuffer)
      .resize(cw, ch, { fit: "fill" })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
    if (buffer.length <= AVATAR_MAX_BYTES || quality <= 20) break;
    quality = Math.max(20, quality - 15);
  }

  return { buffer, contentType: "image/jpeg" };
}
