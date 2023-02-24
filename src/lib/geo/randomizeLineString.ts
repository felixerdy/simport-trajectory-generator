import simplify from "@turf/simplify";
import { distanceToDegrees } from "@turf/turf";
import { resampleLineString } from "./normalizeLineString";

export function randomizeLineString(
  lineString: GeoJSON.LineString,
  maxDistance: number
): GeoJSON.LineString {
  const randLineString: GeoJSON.LineString = {
    type: "LineString",
    coordinates: [],
  };

  const normalized = simplify(lineString, {
    tolerance: distanceToDegrees(10, "meters"),
    highQuality: true,
  });

  for (const coord of normalized.coordinates) {
    const [lon, lat] = coord;

    // Add random noise to latitude
    const randLat = lat + ((Math.random() - 0.5) * maxDistance) / 111111;

    // Add random noise to longitude
    const randLon =
      lon + ((Math.random() - 0.5) * maxDistance) / (111111 * Math.cos(lat));

    randLineString.coordinates.push([randLon, randLat]);
  }

  return randLineString;
}
