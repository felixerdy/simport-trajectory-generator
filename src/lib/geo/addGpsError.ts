import { GeoJSON } from "geojson";

export function addGpsError(
  point: GeoJSON.Point,
  maxErrorMeters: number,
  numPoints: number
): GeoJSON.LineString {
  const [lng, lat] = point.coordinates;
  const r = maxErrorMeters / 111300; // Convert error radius from meters to degrees

  // Generate random GPS errors using normal distribution
  const noisyCoords: number[][] = [];
  for (let i = 0; i < numPoints; i++) {
    const lngError =
      r *
      Math.cos(2 * Math.PI * Math.random()) *
      Math.sqrt(-2 * Math.log(Math.random()));
    const latError =
      r *
      Math.sin(2 * Math.PI * Math.random()) *
      Math.sqrt(-2 * Math.log(Math.random()));

    // Add error to original coordinates
    const noisyLng = lng + lngError;
    const noisyLat = lat + latError;

    noisyCoords.push([noisyLng, noisyLat]);
  }

  // Create GeoJSON LineString object from the noisy coordinates
  const noisyLineString: GeoJSON.LineString = {
    type: "LineString",
    coordinates: noisyCoords,
  };

  return noisyLineString;
}
