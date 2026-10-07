#!/usr/bin/env python3
"""Split a two-colour logo PNG into the two alpha masks the stylesheet recolours.

Usage:
    python3 tools/split_logo.py path/to/new-logo.png

Writes assets/img/logo.png (cropped original, used as fallback), logo-ink.png
(the darker colour) and logo-accent.png (the lighter colour). The CSS in
css/style.css section 3 fills those masks with --logo-ink and --logo-accent.
After running, update `aspect-ratio` on `.logo` if the printed size changed.

Requires: pip install pillow numpy
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "assets" / "img"


def main(src: str) -> None:
    img = Image.open(src).convert("RGBA")
    px = np.asarray(img).astype(float)
    rgb, alpha = px[..., :3], px[..., 3] / 255

    # Find the two logo colours: start from the darkest and lightest solid pixels,
    # then refine with a few rounds of 2-means.
    solid = rgb[alpha > 0.95]
    luma = solid @ np.array([0.299, 0.587, 0.114])
    ink, accent = solid[luma.argmin()], solid[luma.argmax()]
    for _ in range(8):
        near_ink = np.linalg.norm(solid - ink, axis=1) < np.linalg.norm(solid - accent, axis=1)
        ink, accent = solid[near_ink].mean(0), solid[~near_ink].mean(0)

    # Position of every pixel on the ink -> accent line (0 = ink, 1 = accent)
    axis = accent - ink
    t = np.clip(((rgb - ink) @ axis) / (axis @ axis), 0, 1)

    # Trim transparent padding
    ys, xs = np.where(alpha > 0.04)
    box = (max(xs.min() - 4, 0), max(ys.min() - 4, 0), min(xs.max() + 5, img.width), min(ys.max() + 5, img.height))

    def save(mask: np.ndarray, name: str) -> None:
        out = np.full(px.shape, 255, dtype=np.uint8)
        out[..., 3] = np.round(mask * 255)
        Image.fromarray(out, "RGBA").crop(box).save(OUT / name, optimize=True)

    save(alpha * (1 - t), "logo-ink.png")
    save(alpha * t, "logo-accent.png")
    img.crop(box).save(OUT / "logo.png", optimize=True)

    w, h = box[2] - box[0], box[3] - box[1]
    print(f"ink colour    #{''.join(f'{int(c):02x}' for c in ink)}")
    print(f"accent colour #{''.join(f'{int(c):02x}' for c in accent)}")
    print(f"logo size     {w} x {h}  ->  .logo {{ aspect-ratio: {w} / {h}; }}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
