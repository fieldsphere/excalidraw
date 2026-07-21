import { afterEach, describe, expect, it, vi } from "vitest";

import {
  COLOR_PALETTE,
  DEFAULT_ELEMENT_STROKE_COLOR_PALETTE,
} from "@excalidraw/common";

import { getRandomColor } from "./colorPickerUtils";

describe("getRandomColor", () => {
  const palette = DEFAULT_ELEMENT_STROKE_COLOR_PALETTE;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a color from the palette", () => {
    const color = getRandomColor(palette, null);
    const paletteColors = Object.values(palette)
      .flat()
      .filter((c) => c !== "transparent");

    expect(paletteColors).toContain(color);
  });

  it("excludes transparent", () => {
    for (let i = 0; i < 50; i++) {
      expect(getRandomColor(palette, null)).not.toBe(COLOR_PALETTE.transparent);
    }
  });

  it("avoids the current color when alternatives exist", () => {
    const current = COLOR_PALETTE.black;
    vi.spyOn(Math, "random").mockReturnValue(0);

    const color = getRandomColor(palette, current);
    expect(color).not.toBe(current);
  });

  it("can return the current color when it is the only option", () => {
    const singleColorPalette = { only: "#ff0000" };
    expect(getRandomColor(singleColorPalette, "#ff0000")).toBe("#ff0000");
  });
});
