import type { CrisisRequest, NGO, VolunteerSupplyState } from "@/types/crisis";

export const FALLBACK_LOCATION = {
  lat: 17.385,
  lng: 78.4867,
};

export const initialNgos: NGO[] = [
  {
    id: "ngo-1",
    name: "Food Bridge South",
    description: "Community meal packs and hydration support.",
    location: { lat: 17.3989, lng: 78.4824 },
    supplies: { food: 240, medical: 70, shelter: 45 },
    updatedAt: Date.now(),
  },
  {
    id: "ngo-2",
    name: "Rapid Medical Point",
    description: "Urgent medical kits and emergency response volunteers.",
    location: { lat: 17.3724, lng: 78.5108 },
    supplies: { food: 110, medical: 180, shelter: 20 },
    updatedAt: Date.now(),
  },
  {
    id: "ngo-3",
    name: "Shelter Line Hub",
    description: "Temporary shelter with family-safe zones.",
    location: { lat: 17.3585, lng: 78.4612 },
    supplies: { food: 160, medical: 55, shelter: 130 },
    updatedAt: Date.now(),
  },
  {
    id: "ngo-4",
    name: "North Relief Collective",
    description: "Food drop network and field health desk.",
    location: { lat: 17.4235, lng: 78.4751 },
    supplies: { food: 310, medical: 95, shelter: 64 },
    updatedAt: Date.now(),
  },
  {
    id: "ngo-5",
    name: "Water & Aid Point East",
    description: "Hydration and first-response relief supplies.",
    location: { lat: 17.4016, lng: 78.5291 },
    supplies: { food: 140, medical: 84, shelter: 42 },
    updatedAt: Date.now(),
  },
];

export const initialRequests: CrisisRequest[] = [
  {
    id: "req-1",
    title: "Camp 3 Medical Support",
    description: "Immediate medicine and first aid needed for multiple families.",
    location: { lat: 17.3891, lng: 78.5024 },
    priority: "red",
    supplyType: "medical",
    itemsCount: 38,
    status: "pending",
    acceptedBy: null,
    createdAt: Date.now() - 8 * 60 * 1000,
  },
  {
    id: "req-2",
    title: "Food Packs for Zone B",
    description: "Nutritional food packets needed before evening.",
    location: { lat: 17.3671, lng: 78.4893 },
    priority: "orange",
    supplyType: "food",
    itemsCount: 16,
    status: "pending",
    acceptedBy: null,
    createdAt: Date.now() - 15 * 60 * 1000,
  },
  {
    id: "req-3",
    title: "Temporary Shelter Bedding",
    description: "Bedding and shelter setup required for displaced people.",
    location: { lat: 17.4098, lng: 78.4703 },
    priority: "green",
    supplyType: "shelter",
    itemsCount: 4,
    status: "pending",
    acceptedBy: null,
    createdAt: Date.now() - 21 * 60 * 1000,
  },
  {
    id: "req-4",
    title: "Special Diet Supplies",
    description: "Need diabetic-safe food kits for isolated elders.",
    location: { lat: 17.3814, lng: 78.4519 },
    priority: "orange",
    supplyType: "other",
    itemsCount: 7,
    status: "pending",
    acceptedBy: null,
    createdAt: Date.now() - 5 * 60 * 1000,
  },
];

export const initialVolunteerSupply: VolunteerSupplyState = {
  foodAmount: 220,
  medicalAmount: 140,
  shelterAmount: 80,
  customDescription: "Can deliver custom aid packs and basic transport support.",
};
