export function addTimestampsToLineString(
  lineString: GeoJSON.LineString,
  startDate: Date,
  endDate: Date
): GeoJSON.LineString {
  const timestampedLineString: GeoJSON.LineString = {
    type: "LineString",
    coordinates: [],
  };

  // Calculate the total time range in milliseconds
  const timeRange = endDate.getTime() - startDate.getTime();

  // Loop through each coordinate in the input LineString
  for (let i = 0; i < lineString.coordinates.length; i++) {
    const coord = lineString.coordinates[i];

    // Calculate the timestamp for this coordinate based on its position in the LineString
    const timestamp = new Date(
      startDate.getTime() +
        (i / (lineString.coordinates.length - 1)) * timeRange
    ).toISOString();

    // Add the timestamp to the coordinate and push it to the new LineString
    timestampedLineString.coordinates.push(
      Object.assign([], coord, { timestamp })
    );
  }

  return timestampedLineString;
}
