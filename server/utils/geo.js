const DEFAULT_CENTER = {
  lat: 17.385,
  lng: 78.4867,
};

function parseNumber(value, fallback) {
  const numberValue = Number(value);
  if (Number.isFinite(numberValue)) return numberValue;
  return fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function parseGeoQuery(query) {
  const lat = clamp(parseNumber(query.lat, DEFAULT_CENTER.lat), -90, 90);
  const lng = clamp(parseNumber(query.lng, DEFAULT_CENTER.lng), -180, 180);
  const radiusKm = clamp(parseNumber(query.radiusKm, 10), 1, 50);

  return { lat, lng, radiusKm };
}

function geoNearCondition(lat, lng, radiusKm) {
  return {
    $nearSphere: {
      $geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
      $maxDistance: Math.round(radiusKm * 1000),
    },
  };
}

module.exports = {
  DEFAULT_CENTER,
  clamp,
  parseGeoQuery,
  geoNearCondition,
};
