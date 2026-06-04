import { AVATAR_MAX_BYTES, AVATAR_MAX_SIDE } from "./avatarImage.constants.js";

export { AVATAR_MAX_BYTES, AVATAR_MAX_SIDE };

/** Compress image to JPEG under AVATAR_MAX_BYTES; returns a data URL. */
export function compressImageFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const scale = Math.min(1, AVATAR_MAX_SIDE / Math.max(w, h));
      const cw = Math.round(w * scale);
      const ch = Math.round(h * scale);
      const canvas = document.createElement("canvas");
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.drawImage(img, 0, 0, cw, ch);

      const tryQuality = (quality: number): void => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Could not compress image"));
              return;
            }
            if (blob.size <= AVATAR_MAX_BYTES || quality <= 0.2) {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = () => reject(new Error("Could not read blob"));
              reader.readAsDataURL(blob);
              return;
            }
            tryQuality(Math.max(0.2, quality - 0.15));
          },
          "image/jpeg",
          quality
        );
      };
      tryQuality(0.85);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load image"));
    };
    img.src = url;
  });
}
