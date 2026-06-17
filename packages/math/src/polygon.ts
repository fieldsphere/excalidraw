import { pointFrom, pointsEqual } from "./point";
import { lineSegment, pointOnLineSegment } from "./segment";
import { PRECISION } from "./utils";

import type { GlobalPoint, LocalPoint, Polygon } from "./types";

export function polygon<Point extends GlobalPoint | LocalPoint>(
  ...points: Point[]
) {
  return polygonClose(points) as Polygon<Point>;
}

export function polygonFromPoints<Point extends GlobalPoint | LocalPoint>(
  points: Point[],
) {
  return polygonClose(points) as Polygon<Point>;
}

export const polygonIncludesPoint = <Point extends LocalPoint | GlobalPoint>(
  point: Point,
  polygon: Polygon<Point>,
) => {
  const x = point[0];
  const y = point[1];
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    if (
      ((yi > y && yj <= y) || (yi <= y && yj > y)) &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    ) {
      inside = !inside;
    }
  }

  return inside;
};

export const polygonIncludesPointNonZero = <Point extends [number, number]>(
  point: Point,
  polygon: Point[],
): boolean => {
  const [x, y] = point;
  let windingNumber = 0;

  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    if (yi <= y) {
      if (yj > y) {
        if ((xj - xi) * (y - yi) - (x - xi) * (yj - yi) > 0) {
          windingNumber++;
        }
      }
    } else if (yj <= y) {
      if ((xj - xi) * (y - yi) - (x - xi) * (yj - yi) < 0) {
        windingNumber--;
      }
    }
  }

  return windingNumber !== 0;
};

export const pointOnPolygon = <Point extends LocalPoint | GlobalPoint>(
  p: Point,
  poly: Polygon<Point>,
  threshold = PRECISION,
) => {
  let on = false;

  for (let i = 0, l = poly.length - 1; i < l; i++) {
    if (pointOnLineSegment(p, lineSegment(poly[i], poly[i + 1]), threshold)) {
      on = true;
      break;
    }
  }

  return on;
};

/**
 * Compute the area enclosed by a polygon using the shoelace formula.
 *
 * Works for both open and closed point lists, as well as for vertices
 * given in either clockwise or counter-clockwise winding order (the
 * result is always non-negative). Self-intersecting polygons are not
 * supported and may yield unexpected values.
 *
 * @param polygon The polygon to measure
 * @returns The absolute area enclosed by the polygon
 */
export const polygonArea = <Point extends GlobalPoint | LocalPoint>(
  polygon: Polygon<Point>,
): number => Math.abs(polygonSignedArea(polygon));

/**
 * Compute the centroid (center of mass) of a polygon.
 *
 * Uses the area-weighted centroid formula. For degenerate polygons with
 * zero area (e.g. all points collinear or coincident) it falls back to
 * the arithmetic mean of the vertices so a sensible point is still
 * returned.
 *
 * @param polygon The polygon to measure
 * @returns The centroid as a point of the same kind as the input
 */
export const polygonCentroid = <Point extends GlobalPoint | LocalPoint>(
  polygon: Polygon<Point>,
): Point => {
  const points = polygonClose(polygon);
  const signedArea = polygonSignedArea(points);

  if (Math.abs(signedArea) < PRECISION) {
    return pointAverage(points);
  }

  let cx = 0;
  let cy = 0;

  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const cross = points[j][0] * points[i][1] - points[i][0] * points[j][1];
    cx += (points[j][0] + points[i][0]) * cross;
    cy += (points[j][1] + points[i][1]) * cross;
  }

  const factor = 1 / (6 * signedArea);

  return pointFrom(cx * factor, cy * factor);
};

function polygonSignedArea<Point extends LocalPoint | GlobalPoint>(
  polygon: Point[],
): number {
  let sum = 0;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    sum += polygon[j][0] * polygon[i][1] - polygon[i][0] * polygon[j][1];
  }

  return sum / 2;
}

function pointAverage<Point extends LocalPoint | GlobalPoint>(
  polygon: Point[],
): Point {
  const sum = polygon.reduce((acc, [x, y]) => [acc[0] + x, acc[1] + y], [0, 0]);

  return pointFrom(sum[0] / polygon.length, sum[1] / polygon.length);
}

function polygonClose<Point extends LocalPoint | GlobalPoint>(
  polygon: Point[],
) {
  return polygonIsClosed(polygon)
    ? polygon
    : ([...polygon, polygon[0]] as Polygon<Point>);
}

function polygonIsClosed<Point extends LocalPoint | GlobalPoint>(
  polygon: Point[],
) {
  return pointsEqual(polygon[0], polygon[polygon.length - 1]);
}
