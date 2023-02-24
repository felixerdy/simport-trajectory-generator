import { GeoJSON } from "geojson";

export function combineLineStrings(
  ...lineStrings: GeoJSON.LineString[]
): GeoJSON.LineString {
  const combinedCoordinates = lineStrings.reduce(
    (accumulator: GeoJSON.Position[], currentValue: GeoJSON.LineString) => {
      return accumulator.concat(currentValue.coordinates);
    },
    []
  );

  return {
    type: "LineString",
    coordinates: combinedCoordinates,
  };
}
