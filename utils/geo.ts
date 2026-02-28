import type { Coordinates } from "@/types/crisis";

const EARTH_RADIUS_KM = 6371;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function distanceInKm(from: Coordinates, to: Coordinates): number {
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const fromLat = toRadians(from.lat);
  const toLat = toRadians(to.lat);

  const haversine =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(dLng / 2) ** 2;

  return EARTH_RADIUS_KM * (2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine)));
}

export function isWithinRadius(
  center: Coordinates,
  point: Coordinates,
  radiusKm: number,
): boolean {
  return distanceInKm(center, point) <= radiusKm;
}
