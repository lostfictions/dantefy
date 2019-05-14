import * as fs from "fs";
import * as path from "path";
import { tmpdir } from "os";

import { createCanvas, loadImage } from "canvas";

import loadRemoteImage from "./images/load-remote-image";

const staticDataDir = path.join(__dirname, "../data");

const OUT_DIR = tmpdir();

/** The output image will be constrained to be at most this wide/tall. */
const MAX_WIDTH_OR_HEIGHT = 800;

/** What proportion of the image should the badge take up? */
const BADGE_SIZE_ON_IMAGE = 0.25;

let filenameIndex = 0;

let danteBadge: ImageBitmap;

export async function dantefy({ url }: { url: string }): Promise<string> {
  if (!danteBadge) {
    danteBadge = await loadImage(
      path.join(staticDataDir, "featuring_dante.png")
    );
  }
  const image = await loadRemoteImage(url);

  const [canvasWidth, canvasHeight] = getConstrainedProportions(
    image.width,
    image.height,
    MAX_WIDTH_OR_HEIGHT
  );

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);

  const [badgeWidth, badgeHeight] = getConstrainedProportions(
    danteBadge.width,
    danteBadge.height,
    Math.max(canvasWidth, canvasHeight) * BADGE_SIZE_ON_IMAGE
  );

  ctx.drawImage(
    danteBadge,
    canvasWidth * 0.98 - badgeWidth, // inset badge from edge of image by 2%
    canvasHeight * 0.98 - badgeHeight,
    badgeWidth,
    badgeHeight
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

function getConstrainedProportions(
  width: number,
  height: number,
  max: number
): [number, number] {
  const imageMax = Math.max(width, height);

  if (imageMax < max) return [width, height];

  if (imageMax === width) {
    return [max, height * (max / imageMax)];
  }
  return [width * (max / imageMax), max];
}
