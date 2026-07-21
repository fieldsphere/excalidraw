import { COLOR_PALETTE } from "@excalidraw/common";

import { getRandomPaletteColor } from "../components/ColorPicker/colorPickerUtils";

describe("getRandomPaletteColor", () => {
  it("returns a color from the palette", () => {
    const paletteColors = Object.values(COLOR_PALETTE)
      .flat()
      .filter((color) => color !== "transparent");

    const color = getRandomPaletteColor(COLOR_PALETTE);

    expect(paletteColors).toContain(color);
  });

  it("never returns transparent", () => {
    for (let i = 0; i < 50; i++) {
      expect(getRandomPaletteColor(COLOR_PALETTE)).not.toBe("transparent");
    }
  });

  it("prefers a different color than the current one", () => {
    const currentColor = COLOR_PALETTE.red[2];
    const results = new Set<string>();

    for (let i = 0; i < 30; i++) {
      results.add(getRandomPaletteColor(COLOR_PALETTE, currentColor));
    }

    expect(results.has(currentColor)).toBe(false);
  });

  it("returns the only available color when palette has one entry", () => {
    expect(getRandomPaletteColor({ only: "#ff0000" }, "#ff0000")).toBe(
      "#ff0000",
    );
  });
});
