import { feature, point } from "@turf/helpers";
import { getCoords, lineDistance } from "@turf/turf";
import * as turf from "@turf/turf";
import { combineLineStrings } from "./combineLineStrings";

export function resampleLineString(
  lineString: GeoJSON.LineString,
  distance: number
): GeoJSON.LineString {
  // Get the length of the line in meters
  const lineLength = turf.length(feature(lineString), { units: "meters" });

  // Create an empty array to hold the new coordinates
  const newCoords: GeoJSON.Position[] = [];

  // Keep track of the distance travelled along the line
  let distanceTravelled = 0;

  // Loop through each pair of coordinates in the line
  for (let i = 0; i < lineString.coordinates.length - 1; i++) {
    const fromCoords = lineString.coordinates[i];
    const toCoords = lineString.coordinates[i + 1];

    // Calculate the distance between the two coordinates
    const segmentLength = turf.distance(fromCoords, toCoords, {
      units: "meters",
    });

    // Calculate the number of segments needed to achieve the desired distance between points
    const numSegments = Math.ceil(segmentLength / distance);

    // Calculate the actual distance between points, including a random offset
    const actualDistance =
      segmentLength / numSegments +
      ((Math.random() * distance) / 2 - distance / 4);

    // Calculate the unit vector between the two coordinates
    const bearing = turf.bearing(fromCoords, toCoords);
    const bearingRadians = turf.degreesToRadians(bearing);
    const unitVector = [Math.sin(bearingRadians), Math.cos(bearingRadians)];

    // Add the first coordinate to the new array
    if (newCoords.length === 0) {
      newCoords.push(fromCoords);
    }

    // Loop through each segment and add a new coordinate
    for (let j = 1; j < numSegments; j++) {
      // Calculate the distance to the new coordinate along the unit vector
      const distanceToNewCoord = j * actualDistance + distanceTravelled;

      // Calculate the new coordinate
      const newCoord = turf.destination(
        fromCoords,
        distanceToNewCoord,
        bearing,
        { units: "meters" }
      ).geometry.coordinates;

      // Add the new coordinate to the array
      newCoords.push(newCoord);
    }

    // Add the last coordinate to the new array
    newCoords.push(toCoords);

    // Update the distance travelled along the line
    distanceTravelled += segmentLength;
  }

  // Create a new LineString from the new array of coordinates
  const resampledLine = turf.lineString(newCoords);

  // Return the new LineString
  return resampledLine.geometry;
}

// export function resampleLineString(
//   lineString: GeoJSON.LineString,
//   distance: number
// ): GeoJSON.LineString {
//   // Get the length of the line in meters
//   const lineLength = turf.length(feature(lineString), { units: "meters" });

//   // Calculate the number of segments needed to achieve the desired distance between points
//   const numSegments = Math.ceil(lineLength / distance);

//   // Calculate the actual distance between points, including a random offset
//   const actualDistance =
//     lineLength / numSegments + ((Math.random() * distance) / 2 - distance / 4);

//   // Resample the line with the desired distance between points
//   const resampledLine = turf.lineChunk(lineString, actualDistance, {
//     units: "meters",
//   });

//   const lineStrings = resampledLine.features.map((f) => f.geometry);

//   const combined = combineLineStrings(...lineStrings);

//   if (combined.coordinates[52]) {
//     const pointA = point(combined.coordinates[52]);
//     const pointB = point(combined.coordinates[53]);
//     console.log(
//       turf.rhumbDistance(pointA, pointB, {
//         units: "meters",
//       })
//     );
//   }

//   // Return the new line string
//   return combined;
// }
