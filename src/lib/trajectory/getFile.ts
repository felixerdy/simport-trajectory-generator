import polyline from "google-polyline";

export function getFileContent(traj: GeoJSON.LineString) {
  const coordinatesEncoded = polyline.encode(
    traj.coordinates.map((c) => [c[1], c[0]])
  );

  const timestamps = traj.coordinates.map((c) =>
    // @ts-ignore
    new Date(c.timestamp).getTime()
  );
  const speed = traj.coordinates.map((c) => null);
  const accuracy = traj.coordinates.map((c) => null);
  const state = traj.coordinates.map((c) => null);
  // @ts-ignore
  const time0 = traj.coordinates[0].timestamp;
  // @ts-ignore
  const timeN = traj.coordinates[traj.coordinates.length - 1].timestamp;
  return {
    coordinates: coordinatesEncoded,
    timestamps: timestamps.slice(1).map((date, i) => {
      const prevDate = timestamps[i];
      return (date - prevDate) / 1000; // in seconds
    }),
    accuracy,
    speed,
    state,
    time0,
    timeN,
  };
}
