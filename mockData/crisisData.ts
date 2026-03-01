import type { CrisisRequest, NGO, VolunteerSupplyState } from "@/types/crisis";

export const FALLBACK_LOCATION = {
  lat: 17.385,
  lng: 78.4867,
};

export interface CityReliefPoint {
  name: string;
  lat: number;
  lng: number;
  zone: "hyderabad" | "secunderabad";
}

const HYDERABAD_POINTS: CityReliefPoint[] = [
  { name: "Banjara Hills", lat: 17.4126, lng: 78.4347, zone: "hyderabad" },
  { name: "S R Nagar", lat: 17.4503, lng: 78.4448, zone: "hyderabad" },
];

const SECUNDERABAD_POINTS: CityReliefPoint[] = [
  { name: "Secunderabad", lat: 17.4399, lng: 78.4983, zone: "secunderabad" },
  { name: "Malkajgiri", lat: 17.4474, lng: 78.5383, zone: "secunderabad" },
];

export const CITY_RELIEF_POINTS: CityReliefPoint[] = [
  ...HYDERABAD_POINTS,
  ...SECUNDERABAD_POINTS,
];

const centerNameSuffixes = [
  "Relief Hub",
  "Aid Point",
  "Support Station",
  "Response Center",
  "Care Node",
  "Field Unit",
];

const centerProfiles = [
  "meal packs, hydration sachets, and blanket handouts",
  "rapid first-aid triage and pharmacy refills",
  "night shelter check-ins and bedding allocations",
  "elderly outreach and mobility support kits",
  "women and child safe-space coordination",
  "fresh ration mapping and doorstep dispatch",
];

function stableSeed(min: number, max: number, offset: number) {
  return min + ((offset * 17) % (max - min + 1));
}

function createSupplies(point: CityReliefPoint, index: number) {
  const zoneFoodBoost = point.zone === "hyderabad" ? 12 : 4;
  const zoneMedicalBoost = point.zone === "secunderabad" ? 14 : 5;
  const zoneShelterBoost = point.zone === "hyderabad" ? 8 : 10;
  return {
    food: Math.min(500, stableSeed(110, 440, index) + zoneFoodBoost + (index % 9)),
    medical: Math.min(420, stableSeed(70, 360, index + 3) + zoneMedicalBoost + (index % 7)),
    shelter: Math.min(320, stableSeed(40, 250, index + 5) + zoneShelterBoost + (index % 6)),
  };
}

export const initialNgos: NGO[] = CITY_RELIEF_POINTS.map((point, index) => ({
  id: `ngo-${index + 1}`,
  name: `${point.name} ${centerNameSuffixes[index % centerNameSuffixes.length]}`,
  description: `Serving ${point.zone === "hyderabad" ? "Hyderabad" : "Secunderabad"} with ${centerProfiles[index % centerProfiles.length]}.`,
  location: { lat: point.lat, lng: point.lng },
  supplies: createSupplies(point, index),
  updatedAt: 1718000000000 - stableSeed(30_000, 12 * 60_000, index),
}));

function pointLocation(name: string) {
  const match = CITY_RELIEF_POINTS.find((point) => point.name === name);
  if (match) {
    return {
      areaName: match.name,
      location: { lat: match.lat, lng: match.lng },
    };
  }
  return {
    areaName: "Hyderabad Command Sector",
    location: { ...FALLBACK_LOCATION },
  };
}

const requestSeedData = [
  {
    id: "req-1",
    title: "Insulin and Dressing Support",
    areaName: "Malakpet",
    description: "Sterile dressing pads, pain relief tablets, and insulin support are needed.",
    priority: "red" as const,
    supplyType: "medical" as const,
    itemsCount: 31,
    ageMinutes: 9,
  },
  {
    id: "req-2",
    title: "Cooked Meal Packs for Flooded Lane",
    areaName: "Attapur",
    description: "Ready-to-eat meal packs and clean drinking water are requested.",
    priority: "orange" as const,
    supplyType: "food" as const,
    itemsCount: 18,
    ageMinutes: 16,
  },
  {
    id: "req-3",
    title: "Temporary Shelter Mats for Night",
    areaName: "Yapral",
    description: "Requires floor mats, tarpaulin sheets, and dry shelter support.",
    priority: "green" as const,
    supplyType: "shelter" as const,
    itemsCount: 6,
    ageMinutes: 23,
  },
];

export const initialRequests: CrisisRequest[] = requestSeedData.map((request) => {
  const point = pointLocation(request.areaName);
  return {
    id: request.id,
    title: request.title,
    description: request.description,
    areaName: point.areaName,
    location: point.location,
    priority: request.priority,
    supplyType: request.supplyType,
    itemsCount: request.itemsCount,
    status: "pending",
    acceptedBy: null,
    createdAt: 1718000000000 - request.ageMinutes * 60 * 1000,
  };
});

export const initialVolunteerSupply: VolunteerSupplyState = {
  foodAmount: 220,
  medicalAmount: 140,
  shelterAmount: 80,
  customDescription: "Can deliver custom aid packs and basic transport support.",
};
