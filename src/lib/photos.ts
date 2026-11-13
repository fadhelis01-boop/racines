import { dbGet, dbSet } from "./db";

// Photos du journal : redimensionnées puis stockées sur l'appareil (IndexedDB)
export async function resizeImage(file: Blob, max = 1280, quality = 0.85): Promise<Blob> {
  const bmp = await createImageBitmap(file).catch(() => null);
  if (!bmp) return file;
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * scale);
  c.height = Math.round(bmp.height * scale);
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((res) => c.toBlob((b) => res(b ?? file), "image/jpeg", quality));
}

export async function savePhoto(blob: Blob): Promise<string> {
  const key = "photo:" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  await dbSet(key, await resizeImage(blob));
  return key;
}
export const loadPhoto = (key: string) => dbGet<Blob>(key);

