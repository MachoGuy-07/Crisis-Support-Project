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
  { name: "Jubilee Hills", lat: 17.432, lng: 78.407, zone: "hyderabad" },
  { name: "Ameerpet", lat: 17.4375, lng: 78.4482, zone: "hyderabad" },
  { name: "S R Nagar", lat: 17.4503, lng: 78.4448, zone: "hyderabad" },
  { name: "Begumpet", lat: 17.4435, lng: 78.4677, zone: "hyderabad" },
  { name: "Himayatnagar", lat: 17.4006, lng: 78.4865, zone: "hyderabad" },
  { name: "Abids", lat: 17.3924, lng: 78.4764, zone: "hyderabad" },
  { name: "Nampally", lat: 17.392, lng: 78.4666, zone: "hyderabad" },
  { name: "Lakdikapul", lat: 17.4041, lng: 78.4564, zone: "hyderabad" },
  { name: "Mehdipatnam", lat: 17.3953, lng: 78.4395, zone: "hyderabad" },
  { name: "Tolichowki", lat: 17.4128, lng: 78.4219, zone: "hyderabad" },
  { name: "Gachibowli", lat: 17.4401, lng: 78.3489, zone: "hyderabad" },
  { name: "Kondapur", lat: 17.4698, lng: 78.3673, zone: "hyderabad" },
  { name: "Madhapur", lat: 17.4498, lng: 78.3908, zone: "hyderabad" },
  { name: "HITEC City", lat: 17.4448, lng: 78.3772, zone: "hyderabad" },
  { name: "Kukatpally", lat: 17.4949, lng: 78.399, zone: "hyderabad" },
  { name: "Miyapur", lat: 17.494, lng: 78.356, zone: "hyderabad" },
  { name: "Moosapet", lat: 17.4697, lng: 78.4236, zone: "hyderabad" },
  { name: "Erragadda", lat: 17.4569, lng: 78.4344, zone: "hyderabad" },
  { name: "Khairatabad", lat: 17.4116, lng: 78.4605, zone: "hyderabad" },
  { name: "Masab Tank", lat: 17.4034, lng: 78.452, zone: "hyderabad" },
  { name: "Malakpet", lat: 17.3731, lng: 78.5016, zone: "hyderabad" },
  { name: "Dilsukhnagar", lat: 17.3688, lng: 78.5247, zone: "hyderabad" },
  { name: "L B Nagar", lat: 17.3456, lng: 78.5525, zone: "hyderabad" },
  { name: "Attapur", lat: 17.3662, lng: 78.4315, zone: "hyderabad" },
  { name: "Rajendranagar", lat: 17.3213, lng: 78.4034, zone: "hyderabad" },
  { name: "Falaknuma", lat: 17.33, lng: 78.4717, zone: "hyderabad" },
  { name: "Charminar", lat: 17.3616, lng: 78.4747, zone: "hyderabad" },
];

const SECUNDERABAD_POINTS: CityReliefPoint[] = [
  { name: "Secunderabad", lat: 17.4399, lng: 78.4983, zone: "secunderabad" },
  { name: "Paradise", lat: 17.4433, lng: 78.4903, zone: "secunderabad" },
  { name: "West Marredpally", lat: 17.4489, lng: 78.5032, zone: "secunderabad" },
  { name: "East Marredpally", lat: 17.4519, lng: 78.5105, zone: "secunderabad" },
  { name: "Malkajgiri", lat: 17.4474, lng: 78.5383, zone: "secunderabad" },
  { name: "Alwal", lat: 17.5153, lng: 78.4993, zone: "secunderabad" },
  { name: "Bowenpally", lat: 17.4615, lng: 78.4794, zone: "secunderabad" },
  { name: "Trimulgherry", lat: 17.4788, lng: 78.5215, zone: "secunderabad" },
  { name: "Sainikpuri", lat: 17.4972, lng: 78.5446, zone: "secunderabad" },
  { name: "A S Rao Nagar", lat: 17.4819, lng: 78.5535, zone: "secunderabad" },
  { name: "Kapra", lat: 17.5102, lng: 78.557, zone: "secunderabad" },
  { name: "ECIL", lat: 17.4746, lng: 78.5725, zone: "secunderabad" },
  { name: "Kushaiguda", lat: 17.4852, lng: 78.5708, zone: "secunderabad" },
  { name: "Neredmet", lat: 17.4878, lng: 78.5318, zone: "secunderabad" },
  { name: "Yapral", lat: 17.5164, lng: 78.5488, zone: "secunderabad" },
  { name: "Bolarum", lat: 17.5413, lng: 78.5128, zone: "secunderabad" },
  { name: "Kompally", lat: 17.5464, lng: 78.4875, zone: "secunderabad" },
  { name: "Suchitra", lat: 17.4942, lng: 78.4828, zone: "secunderabad" },
  { name: "Tarnaka", lat: 17.4283, lng: 78.5386, zone: "secunderabad" },
  { name: "Habsiguda", lat: 17.4175, lng: 78.5421, zone: "secunderabad" },
  { name: "Uppal", lat: 17.4058, lng: 78.5591, zone: "secunderabad" },
  { name: "Nacharam", lat: 17.4292, lng: 78.5582, zone: "secunderabad" },
  { name: "Boduppal", lat: 17.4138, lng: 78.5783, zone: "secunderabad" },
  { name: "Moula Ali", lat: 17.461, lng: 78.5518, zone: "secunderabad" },
  { name: "Nagaram", lat: 17.4866, lng: 78.6102, zone: "secunderabad" },
  { name: "Safilguda", lat: 17.4757, lng: 78.5272, zone: "secunderabad" },
  { name: "Sitafalmandi", lat: 17.4306, lng: 78.506, zone: "secunderabad" },
  { name: "Chilkalguda", lat: 17.4357, lng: 78.5036, zone: "secunderabad" },
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

function randomInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createSupplies(point: CityReliefPoint, index: number) {
  const zoneFoodBoost = point.zone === "hyderabad" ? 12 : 4;
  const zoneMedicalBoost = point.zone === "secunderabad" ? 14 : 5;
  const zoneShelterBoost = point.zone === "hyderabad" ? 8 : 10;
  return {
    food: Math.min(500, randomInRange(110, 440) + zoneFoodBoost + (index % 9)),
    medical: Math.min(420, randomInRange(70, 360) + zoneMedicalBoost + (index % 7)),
    shelter: Math.min(320, randomInRange(40, 250) + zoneShelterBoost + (index % 6)),
  };
}

export const initialNgos: NGO[] = CITY_RELIEF_POINTS.map((point, index) => ({
  id: `ngo-${index + 1}`,
  name: `${point.name} ${centerNameSuffixes[index % centerNameSuffixes.length]}`,
  description: `Serving ${point.zone === "hyderabad" ? "Hyderabad" : "Secunderabad"} with ${centerProfiles[index % centerProfiles.length]}.`,
  location: { lat: point.lat, lng: point.lng },
  supplies: createSupplies(point, index),
  updatedAt: Date.now() - randomInRange(30_000, 12 * 60_000),
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
    description:
      "A relief camp near Malakpet has multiple diabetic patients and open-wound cases. Sterile dressing pads, pain relief tablets, and insulin support are needed before the evening round.",
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
      "Families stranded in inner Attapur lanes have had no cooked food since morning. Ready-to-eat meal packs and clean drinking water are requested for immediate distribution.",
    priority: "orange" as const,
    supplyType: "food" as const,
    itemsCount: 18,
    ageMinutes: 16,
  },
  {
    id: "req-3",
    title: "Temporary Shelter Mats for Night",
    areaName: "Yapral",
    description:
      "A group of displaced workers in Yapral requires floor mats, tarpaulin sheets, and dry shelter support for one night while relocation transport is arranged.",
    priority: "green" as const,
    supplyType: "shelter" as const,
    itemsCount: 6,
    ageMinutes: 23,
  },
  {
    id: "req-4",
    title: "Infant Nutrition and Formula Request",
    areaName: "Dilsukhnagar",
    description:
      "Community volunteers in Dilsukhnagar identified infants without access to safe formula milk. This custom request includes infant cereal, feeding bottles, and sanitizing liquid.",
    priority: "orange" as const,
    supplyType: "other" as const,
    itemsCount: 9,
    ageMinutes: 12,
  },
  {
    id: "req-5",
    title: "Burn Ointment and Gauze Refill",
    areaName: "Secunderabad",
    description:
      "A temporary clinic close to Secunderabad railway corridor treated multiple minor burn injuries. Burn cream tubes and sterile gauze are urgently required.",
    priority: "red" as const,
    supplyType: "medical" as const,
    itemsCount: 27,
    ageMinutes: 7,
  },
  {
    id: "req-6",
    title: "Dry Rations for Senior Citizens",
    areaName: "Himayatnagar",
    description:
      "Senior citizens in Himayatnagar need low-spice dry food kits, glucose biscuits, and fruit packs. Volunteers can deliver in one consolidated route.",
    priority: "green" as const,
    supplyType: "food" as const,
    itemsCount: 5,
    ageMinutes: 31,
  },
  {
    id: "req-7",
    title: "Women Safe-Shelter Bedding",
    areaName: "Sainikpuri",
    description:
      "A women-only shelter in Sainikpuri is short on bedding rolls and privacy partitions. Immediate shelter supplies are requested before late-night arrivals.",
    priority: "orange" as const,
    supplyType: "shelter" as const,
    itemsCount: 14,
    ageMinutes: 19,
  },
  {
    id: "req-8",
    title: "Wheelchair Transport Accessories",
    areaName: "Bowenpally",
    description:
      "Field teams in Bowenpally requested custom mobility aids including foldable wheelchairs, support belts, and transfer boards for evacuation support.",
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
