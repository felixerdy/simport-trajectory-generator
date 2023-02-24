import { getBicycleRoute } from "./getBicycleRoute";

const CACHE_KEY_PREFIX = "cached_bike_routes_";

function getCacheKey(start: GeoJSON.Point, end: GeoJSON.Point) {
  return `${CACHE_KEY_PREFIX}${start.coordinates.join(
    ","
  )}:${end.coordinates.join(",")}`;
}

export async function getCachedBicycleRoute(
  start: GeoJSON.Point,
  end: GeoJSON.Point
) {
  const cacheKey = getCacheKey(start, end);
  const cachedRouteJson = localStorage.getItem(cacheKey);
  if (cachedRouteJson) {
    return JSON.parse(cachedRouteJson);
  }
  const route = await getBicycleRoute(start, end);
  localStorage.setItem(cacheKey, JSON.stringify(route));
  return route;
}
