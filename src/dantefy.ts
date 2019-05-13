import * as fs from "fs";
import * as path from "path";
import { tmpdir } from "os";

import { createCanvas, loadImage } from "canvas";

import loadRemoteImage from "./images/load-remote-image";

const staticDataDir = path.join(__dirname, "../data");

const OUT_DIR = tmpdir();

let filenameIndex = 0;

let featuringDante: ImageBitmap;

const maxHeight = 800;

export async function dantefy({ url }: { url: string }): Promise<string> {
  if (!featuringDante) {
    featuringDante = await loadImage(
      path.join(staticDataDir, "featuring_dante.png")
    );
  }
  const image = await loadRemoteImage(url);

  const canvasAspect = image.width / image.height;

  const canvas = createCanvas(maxHeight * canvasAspect, maxHeight);
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(image, 0, 0, maxHeight * canvasAspect, maxHeight);

  const aspect = image.width / image.height;
  const scale = maxHeight / featuringDante.height;
  const size = 250 * scale;

  // FIXME
  ctx.drawImage(
    featuringDante,
    50 - (size * aspect) / 2,
    50 - size / 2,
    size * aspect,
    size
  );

  filenameIndex += 1;
  const filename = path.join(OUT_DIR, `featuring_dante_${filenameIndex}.png`);

  const pngStream = canvas.createPNGStream();
  const outStream = fs.createWriteStream(filename);
  pngStream.pipe(outStream);

  return new Promise<string>((res, rej) => {
    outStream.on("finish", () => res(filename));
    outStream.on("error", e => rej(e));
  });
}
