import { GeoJSON } from "geojson";

interface OpenRouteServiceResponse {
  features: GeoJSON[];
}

export async function getBicycleRoute(
  start: GeoJSON.Point,
  end: GeoJSON.Point
): Promise<GeoJSON.LineString> {
  const apiUrl =
    "https://api.openrouteservice.org/v2/directions/cycling-regular/geojson";

  const headers = new Headers();
  headers.append("Authorization", import.meta.env.VITE_OPENROUTESERVICE_KEY); // Replace YOUR_API_KEY with your actual API key
  headers.append("Content-type", "application/json");

  const body = JSON.stringify({
    coordinates: [start.coordinates, end.coordinates],
    format: "geojson",
  });

  const response = await fetch(apiUrl, {
    method: "POST",
    headers,
    body,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch bike route: ${response.status} ${response.statusText}`
    );
  }

  const data: OpenRouteServiceResponse = await response.json();

  if (data.features.length < 1) {
    throw new Error("No features returned from OpenRouteService");
  }

  const lineString = data.features[0] as GeoJSON.Feature;

  // @ts-ignore
  return lineString.geometry;
}
