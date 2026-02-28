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

export const CITY_RELIEF_POINTS: CityReliefPoint[] = [
  { name: "Banjara Hills", lat: 17.4126, lng: 78.4347, zone: "hyderabad" },
  { name: "Jubilee Hills", lat: 17.432, lng: 78.407, zone: "hyderabad" },
  { name: "L B Nagar", lat: 17.3456, lng: 78.5525, zone: "hyderabad" },
  { name: "Attapur", lat: 17.3662, lng: 78.4315, zone: "hyderabad" },
  { name: "Kushaiguda", lat: 17.4852, lng: 78.5708, zone: "secunderabad" },
  { name: "Neredmet", lat: 17.4878, lng: 78.5318, zone: "secunderabad" },
  { name: "Alwal", lat: 17.5153, lng: 78.4993, zone: "secunderabad" },
  { name: "Malkajgiri", lat: 17.4474, lng: 78.5383, zone: "secunderabad" },
];

const FIXED_UPDATED_AT = new Date("2026-03-01T08:00:00+05:30").getTime();

export const initialNgos: NGO[] = [
  {
    id: "ngo-1",
    name: "Banjara Hills Relief Hub",
    description: "Serving Hyderabad with meal packs and hydration support.",
    location: { lat: 17.4126, lng: 78.4347 },
    supplies: { food: 338, medical: 152, shelter: 102 },
    updatedAt: FIXED_UPDATED_AT,
  },
  {
    id: "ngo-2",
    name: "Jubilee Hills Aid Point",
    description: "Serving Hyderabad with rapid first-aid and pharmacy support.",
    location: { lat: 17.432, lng: 78.407 },
    supplies: { food: 326, medical: 173, shelter: 57 },
    updatedAt: FIXED_UPDATED_AT,
  },
  {
    id: "ngo-3",
    name: "L B Nagar Field Unit",
    description: "Serving Hyderabad with ration dispatch and family care kits.",
    location: { lat: 17.3456, lng: 78.5525 },
    supplies: { food: 302, medical: 244, shelter: 166 },
    updatedAt: FIXED_UPDATED_AT,
  },
  {
    id: "ngo-4",
    name: "Attapur Relief Hub",
    description: "Serving Hyderabad with shelter setup and emergency meals.",
    location: { lat: 17.3662, lng: 78.4315 },
    supplies: { food: 373, medical: 196, shelter: 139 },
    updatedAt: FIXED_UPDATED_AT,
  },
  {
    id: "ngo-5",
    name: "Kushaiguda Care Node",
    description: "Serving Secunderabad with women and child safe-space support.",
    location: { lat: 17.4852, lng: 78.5708 },
    supplies: { food: 396, medical: 329, shelter: 229 },
    updatedAt: FIXED_UPDATED_AT,
  },
  {
    id: "ngo-6",
    name: "Neredmet Field Unit",
    description: "Serving Secunderabad with ration and medical dispatch.",
    location: { lat: 17.4878, lng: 78.5318 },
    supplies: { food: 430, medical: 243, shelter: 87 },
    updatedAt: FIXED_UPDATED_AT,
  },
  {
    id: "ngo-7",
    name: "Alwal Support Station",
    description: "Serving Secunderabad with emergency nutrition and medicine aid.",
    location: { lat: 17.5153, lng: 78.4993 },
    supplies: { food: 312, medical: 214, shelter: 121 },
    updatedAt: FIXED_UPDATED_AT,
  },
  {
    id: "ngo-8",
    name: "Malkajgiri Response Center",
    description: "Serving Secunderabad with shelter and first-response supplies.",
    location: { lat: 17.4474, lng: 78.5383 },
    supplies: { food: 284, medical: 189, shelter: 144 },
    updatedAt: FIXED_UPDATED_AT,
  },
];

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
    areaName: "L B Nagar",
    description:
      "A relief camp near L B Nagar has multiple diabetic patients and open-wound cases. Sterile dressing pads and insulin support are needed before evening rounds.",
    priority: "red" as const,
    supplyType: "medical" as const,
    itemsCount: 31,
    ageMinutes: 9,
  },
  {
    id: "req-2",
    title: "Cooked Meal Packs for Flooded Lane",
    areaName: "Attapur",
    description:
      "Families in Attapur inner lanes need cooked meal packs and clean drinking water for immediate distribution.",
    priority: "orange" as const,
    supplyType: "food" as const,
    itemsCount: 18,
    ageMinutes: 16,
  },
  {
    id: "req-3",
    title: "Temporary Shelter Mats for Night",
    areaName: "Malkajgiri",
    description:
      "A group of displaced workers requires floor mats and temporary shelter support for one night.",
    priority: "green" as const,
    supplyType: "shelter" as const,
    itemsCount: 6,
    ageMinutes: 23,
  },
  {
    id: "req-4",
    title: "Infant Nutrition and Formula Request",
    areaName: "Kushaiguda",
    description:
      "Community volunteers identified infants without safe formula access. This request includes infant cereal and sanitizing liquid.",
    priority: "orange" as const,
    supplyType: "other" as const,
    itemsCount: 9,
    ageMinutes: 12,
  },
  {
    id: "req-5",
    title: "Burn Ointment and Gauze Refill",
    areaName: "Neredmet",
    description:
      "A temporary clinic treated multiple minor burn injuries. Burn cream and sterile gauze are required urgently.",
    priority: "red" as const,
    supplyType: "medical" as const,
    itemsCount: 27,
    ageMinutes: 7,
  },
  {
    id: "req-6",
    title: "Dry Rations for Senior Citizens",
    areaName: "Banjara Hills",
    description:
      "Senior citizens need low-spice dry food kits, glucose biscuits, and fruit packs.",
    priority: "green" as const,
    supplyType: "food" as const,
    itemsCount: 5,
    ageMinutes: 31,
  },
  {
    id: "req-7",
    title: "Women Safe-Shelter Bedding",
    areaName: "Alwal",
    description:
      "A women-only shelter is short on bedding rolls and privacy partitions for late-night arrivals.",
    priority: "orange" as const,
    supplyType: "shelter" as const,
    itemsCount: 14,
    ageMinutes: 19,
  },
  {
    id: "req-8",
    title: "Wheelchair Transport Accessories",
    areaName: "Jubilee Hills",
    description:
      "Field teams requested custom mobility aids including foldable wheelchairs and support belts.",
    priority: "red" as const,
    supplyType: "other" as const,
    itemsCount: 25,
    ageMinutes: 6,
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
    createdAt: Date.now() - request.ageMinutes * 60 * 1000,
  };
});

export const initialVolunteerSupply: VolunteerSupplyState = {
  foodAmount: 220,
  medicalAmount: 140,
  shelterAmount: 80,
  customDescription: "Can deliver custom aid packs and basic transport support.",
};
