"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  CITY_RELIEF_POINTS,
  FALLBACK_LOCATION,
  initialNgos,
  initialRequests,
  initialVolunteerSupply,
} from "@/mockData/crisisData";
import type {
  AcceptResult,
  Coordinates,
  CrisisRequest,
  DataContextValue,
  NGO,
  OrderPayload,
  OrderResult,
  RequestPriority,
  SupplyType,
  VolunteerSupplyState,
} from "@/types/crisis";
import { canVolunteerAcceptRequest } from "@/utils/requests";

const DataContext = createContext<DataContextValue | undefined>(undefined);

const requestTitleTemplates: Record<SupplyType, readonly string[]> = {
  food: [
    "Meal Pack Dispatch",
    "Cooked Food Delivery",
    "Dry Ration Allocation",
    "Community Kitchen Supply",
  ],
  medical: [
    "Emergency Medical Support",
    "Clinic Refill Request",
    "First-Aid Priority Dispatch",
    "Critical Medicine Requirement",
  ],
  shelter: [
    "Night Shelter Allocation",
    "Temporary Housing Support",
    "Bedding and Cover Request",
    "Emergency Shelter Coordination",
  ],
  other: [
    "Custom Assistance Requirement",
    "Special Aid Request",
    "Field Coordinator Escalation",
    "Priority Custom Support",
  ],
};

const requestDescriptionTemplates: Record<SupplyType, readonly string[]> = {
  food: [
    "Families have skipped at least one meal and need ready-to-eat packs with clean water support.",
    "Community volunteers flagged households without gas supply, so shelf-stable food kits are required.",
    "Children and elderly residents need immediate meal support before the next civic distribution window.",
    "The local kitchen network is overloaded, and cooked food packets are needed for short-term relief.",
  ],
  medical: [
    "A field triage desk is short on dressings, antiseptics, and common emergency medicine kits.",
    "Patients with chronic conditions are running out of medicine, requiring urgent refill support.",
    "Recent injuries increased clinic load, and first-aid consumables must be replenished quickly.",
    "On-ground health volunteers requested pain-management and infection-control medical supplies.",
  ],
  shelter: [
    "Displaced families need sleeping mats, tarpaulin cover, and weather-safe temporary shelter setup.",
    "Night-time relocation requires basic bedding and partition supplies for safety and privacy.",
    "Rain-affected households need dry shelter materials and temporary sleeping space support.",
    "Transit shelters are near capacity and need additional cots, covers, and emergency housing kits.",
  ],
  other: [
    "Field teams requested custom assistance packages for vulnerable households with specific needs.",
    "Community coordinators need non-standard aid bundles to support special care cases.",
    "A local group requested custom logistics support including mobility and hygiene accessories.",
    "Relief volunteers asked for specialized kits beyond standard food, medical, and shelter categories.",
  ],
};

const requestFollowupTemplates = [
  "On-site volunteer verification is complete.",
  "Local coordinator confirmed this as the next dispatch priority.",
  "Distribution is planned within the next operational cycle.",
  "Support is needed before the next weather-impact window.",
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(values: readonly T[]): T {
  return values[randomInt(0, values.length - 1)];
}

function priorityFromItemsCount(itemsCount: number): RequestPriority {
  if (itemsCount > 30) return "red";
  if (itemsCount >= 6) return "orange";
  return "green";
}

function nextRequestTitle(supplyType: SupplyType, areaName: string) {
  return `${randomChoice(requestTitleTemplates[supplyType])} - ${areaName}`;
}

function composeRequestDescription(
  supplyType: SupplyType,
  areaName: string,
  itemsCount: number,
) {
  const base = randomChoice(requestDescriptionTemplates[supplyType]);
  const followup = randomChoice(requestFollowupTemplates);
  return `${base} Around ${itemsCount} people are currently mapped in ${areaName}. ${followup}`;
}

function jitterLocation(location: Coordinates, spread = 0.01): Coordinates {
  return {
    lat: location.lat + (Math.random() - 0.5) * spread,
    lng: location.lng + (Math.random() - 0.5) * spread,
  };
}

function isDistinctLocation(candidate: Coordinates, existing: CrisisRequest[]) {
  return !existing.some((request) => {
    const latDelta = Math.abs(request.location.lat - candidate.lat);
    const lngDelta = Math.abs(request.location.lng - candidate.lng);
    return latDelta < 0.0014 && lngDelta < 0.0014;
  });
}

function uniqueLocationNear(base: Coordinates, existing: CrisisRequest[]) {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const candidate = jitterLocation(base, 0.008 + attempt * 0.0012);
    if (isDistinctLocation(candidate, existing)) {
      return candidate;
    }
  }

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const candidate = jitterLocation(FALLBACK_LOCATION, 0.035 + attempt * 0.003);
    if (isDistinctLocation(candidate, existing)) {
      return candidate;
    }
  }

  return jitterLocation(base, 0.02);
}

function pickUniqueArea(existing: CrisisRequest[]) {
  const usedAreas = new Set(
    existing
      .map((request) => request.areaName)
      .filter((areaName): areaName is string => Boolean(areaName)),
  );
  const shuffled = [...CITY_RELIEF_POINTS].sort(() => Math.random() - 0.5);

  const availablePoint = shuffled.find((point) => !usedAreas.has(point.name));
  const selectedPoint = availablePoint ?? randomChoice(shuffled);

  return {
    areaName: selectedPoint.name,
    baseLocation: { lat: selectedPoint.lat, lng: selectedPoint.lng },
  };
}

function getRequiredSupply(type: SupplyType) {
  if (type === "food" || type === "medical" || type === "shelter") return type;
  return null;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(FALLBACK_LOCATION);
  const [ngos, setNgos] = useState<NGO[]>(() =>
    initialNgos.map((ngo) => ({ ...ngo, supplies: { ...ngo.supplies } })),
  );
  const [requests, setRequests] = useState<CrisisRequest[]>(() =>
    initialRequests.map((request) => ({ ...request, location: { ...request.location } })),
  );
  const [volunteerSupply, setVolunteerSupply] = useState<VolunteerSupplyState>({
    ...initialVolunteerSupply,
  });
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number>(
    initialRequests[0]?.createdAt ?? 0,
  );

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => undefined,
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 10000 },
    );
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNgos((previous) =>
        previous.map((ngo) => ({
          ...ngo,
          supplies: {
            food: clamp(ngo.supplies.food + randomInt(-8, 12), 0, 500),
            medical: clamp(ngo.supplies.medical + randomInt(-6, 9), 0, 420),
            shelter: clamp(ngo.supplies.shelter + randomInt(-5, 7), 0, 320),
          },
          updatedAt: Date.now(),
        })),
      );

      setRequests((previous) => {
        const withAgingPressure = previous.map((request) => {
          if (request.status !== "pending") return request;
          if (Math.random() > 0.2) return request;

          const addedItems = randomInt(1, 4);
          const nextItems = clamp(request.itemsCount + addedItems, 1, 120);
          return {
            ...request,
            itemsCount: nextItems,
            priority: priorityFromItemsCount(nextItems),
          };
        });

        if (Math.random() > 0.43) return withAgingPressure;

        const supplyType = randomChoice<SupplyType>([
          "food",
          "medical",
          "shelter",
          "other",
        ]);
        const itemsCount = randomInt(3, 45);
        const createdAt = Date.now();
        const area = pickUniqueArea(withAgingPressure);
        const location = uniqueLocationNear(area.baseLocation, withAgingPressure);

        const liveRequest: CrisisRequest = {
          id: `live-${createdAt}`,
          title: nextRequestTitle(supplyType, area.areaName),
          description: composeRequestDescription(supplyType, area.areaName, itemsCount),
          areaName: area.areaName,
          location,
          priority: priorityFromItemsCount(itemsCount),
          supplyType,
          itemsCount,
          status: "pending",
          acceptedBy: null,
          createdAt,
        };

        return [liveRequest, ...withAgingPressure].slice(0, 60);
      });

      setLastUpdatedAt(Date.now());
    }, 8000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [userLocation]);

  const placeOrder = useCallback(
    (payload: OrderPayload): OrderResult => {
      const { ngoId, supplyType, quantity, requesterEmail } = payload;
      const cleanQuantity = Math.floor(quantity);

      if (cleanQuantity <= 0) {
        return {
          ok: false,
          message: "Quantity must be at least 1.",
        };
      }

      const targetNgo = ngos.find((ngo) => ngo.id === ngoId);
      if (!targetNgo) {
        return {
          ok: false,
          message: "NGO not found.",
        };
      }

      const available = targetNgo.supplies[supplyType];
      if (cleanQuantity > available) {
        return {
          ok: false,
          message: `Only ${available} items available in this NGO.`,
        };
      }

      setNgos((previous) =>
        previous.map((ngo) =>
          ngo.id === ngoId
            ? {
                ...ngo,
                supplies: {
                  ...ngo.supplies,
                  [supplyType]: clamp(ngo.supplies[supplyType] - cleanQuantity, 0, 500),
                },
                updatedAt: Date.now(),
              }
            : ngo,
        ),
      );

      const createdAt = Date.now();

      setRequests((previous) => {
        const areaName = targetNgo.name;
        const location = uniqueLocationNear(targetNgo.location, previous);
        const nextRequest: CrisisRequest = {
          id: `order-${createdAt}`,
          title: nextRequestTitle(supplyType, areaName),
          description: `Placed by ${requesterEmail}: ${composeRequestDescription(supplyType, areaName, cleanQuantity)}`,
          areaName,
          location,
          priority: priorityFromItemsCount(cleanQuantity),
          supplyType,
          itemsCount: cleanQuantity,
          status: "pending",
          acceptedBy: null,
          createdAt,
        };

        return [nextRequest, ...previous].slice(0, 60);
      });

      setLastUpdatedAt(createdAt);

      return {
        ok: true,
        message: `Order placed successfully for ${cleanQuantity} ${supplyType} items.`,
      };
    },
    [ngos],
  );

  const acceptRequest = useCallback(
    (requestId: string, volunteerEmail: string): AcceptResult => {
      const targetRequest = requests.find((request) => request.id === requestId);
      if (!targetRequest) {
        return {
          ok: false,
          message: "Request not found.",
        };
      }

      if (!canVolunteerAcceptRequest(targetRequest, volunteerSupply)) {
        return {
          ok: false,
          message: "Insufficient volunteer supplies or request already accepted.",
        };
      }

      setRequests((previous) =>
        previous.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status: "accepted",
                acceptedBy: volunteerEmail,
              }
            : request,
        ),
      );

      const required = getRequiredSupply(targetRequest.supplyType);
      if (required) {
        setVolunteerSupply((previous) => {
          if (required === "food") {
            return {
              ...previous,
              foodAmount: clamp(previous.foodAmount - targetRequest.itemsCount, 0, 2000),
            };
          }
          if (required === "medical") {
            return {
              ...previous,
              medicalAmount: clamp(
                previous.medicalAmount - targetRequest.itemsCount,
                0,
                2000,
              ),
            };
          }
          return {
            ...previous,
            shelterAmount: clamp(
              previous.shelterAmount - targetRequest.itemsCount,
              0,
              2000,
            ),
          };
        });
      }

      setLastUpdatedAt(Date.now());
      return {
        ok: true,
        message: "Request accepted and assigned to your shift.",
      };
    },
    [requests, volunteerSupply],
  );

  const updateVolunteerSupply = useCallback((updates: Partial<VolunteerSupplyState>) => {
    setVolunteerSupply((previous) => ({
      ...previous,
      ...updates,
    }));
    setLastUpdatedAt(Date.now());
  }, []);

  const value = useMemo<DataContextValue>(
    () => ({
      userLocation,
      ngos,
      requests,
      volunteerSupply,
      lastUpdatedAt,
      placeOrder,
      acceptRequest,
      updateVolunteerSupply,
    }),
    [
      acceptRequest,
      lastUpdatedAt,
      ngos,
      placeOrder,
      requests,
      updateVolunteerSupply,
      userLocation,
      volunteerSupply,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useDataContext() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used inside DataProvider");
  }
  return context;
}
