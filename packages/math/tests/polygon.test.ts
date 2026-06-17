import { pointFrom } from "../src/point";
import { polygon, polygonArea, polygonCentroid } from "../src/polygon";

import type { GlobalPoint } from "../src/types";

describe("polygon area", () => {
  it("should measure the area of an axis-aligned square", () => {
    const square = polygon<GlobalPoint>(
      pointFrom(0, 0),
      pointFrom(4, 0),
      pointFrom(4, 4),
      pointFrom(0, 4),
    );

    expect(polygonArea(square)).toBeCloseTo(16);
  });

  it("should measure the area of a triangle", () => {
    const triangle = polygon<GlobalPoint>(
      pointFrom(0, 0),
      pointFrom(4, 0),
      pointFrom(0, 3),
    );

    expect(polygonArea(triangle)).toBeCloseTo(6);
  });

  it("should be independent of winding order", () => {
    const clockwise = polygon<GlobalPoint>(
      pointFrom(0, 0),
      pointFrom(0, 4),
      pointFrom(4, 4),
      pointFrom(4, 0),
    );

    expect(polygonArea(clockwise)).toBeCloseTo(16);
  });

  it("should return zero for a degenerate polygon", () => {
    const collinear = polygon<GlobalPoint>(
      pointFrom(0, 0),
      pointFrom(2, 0),
      pointFrom(4, 0),
    );

    expect(polygonArea(collinear)).toBeCloseTo(0);
  });
});

describe("polygon centroid", () => {
  it("should find the center of a square", () => {
    const square = polygon<GlobalPoint>(
      pointFrom(0, 0),
      pointFrom(4, 0),
      pointFrom(4, 4),
      pointFrom(0, 4),
    );

    const [x, y] = polygonCentroid(square);

    expect(x).toBeCloseTo(2);
    expect(y).toBeCloseTo(2);
  });

  it("should find the centroid of a triangle", () => {
    const triangle = polygon<GlobalPoint>(
      pointFrom(0, 0),
      pointFrom(6, 0),
      pointFrom(0, 6),
    );

    const [x, y] = polygonCentroid(triangle);

    expect(x).toBeCloseTo(2);
    expect(y).toBeCloseTo(2);
  });

  it("should fall back to the vertex average for a degenerate polygon", () => {
    const collinear = polygon<GlobalPoint>(
      pointFrom(0, 0),
      pointFrom(2, 0),
      pointFrom(4, 0),
    );

    const [x, y] = polygonCentroid(collinear);

    expect(x).toBeCloseTo(1.5);
    expect(y).toBeCloseTo(0);
  });
});
