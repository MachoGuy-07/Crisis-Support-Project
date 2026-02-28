"use client";

import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
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

function nextRequestTitle(supplyType: SupplyType) {
  if (supplyType === "food") return "Emergency Food Request";
  if (supplyType === "medical") return "Emergency Medical Request";
  if (supplyType === "shelter") return "Emergency Shelter Request";
  return "Custom Support Request";
}

function randomLocationNear(center: Coordinates): Coordinates {
  const latOffset = (Math.random() - 0.5) * 0.08;
  const lngOffset = (Math.random() - 0.5) * 0.08;
  return {
    lat: center.lat + latOffset,
    lng: center.lng + lngOffset,
  };
}

function deduceSupplyDescription(type: SupplyType) {
  if (type === "food") return "Food packets required for affected families.";
  if (type === "medical") return "Immediate medicine and aid kits required.";
  if (type === "shelter") return "Temporary shelter support needed urgently.";
  return "Custom request details provided by field coordinator.";
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
          if (Math.random() > 0.18) return request;

          const addedItems = randomInt(1, 4);
          const nextItems = clamp(request.itemsCount + addedItems, 1, 120);
          return {
            ...request,
            itemsCount: nextItems,
            priority: priorityFromItemsCount(nextItems),
          };
        });

        if (Math.random() > 0.45) return withAgingPressure;

        const supplyType = randomChoice<SupplyType>([
          "food",
          "medical",
          "shelter",
          "other",
        ]);
        const itemsCount = randomInt(2, 42);
        const createdAt = Date.now();
        const center = userLocation ?? FALLBACK_LOCATION;

        const liveRequest: CrisisRequest = {
          id: `live-${createdAt}`,
          title: nextRequestTitle(supplyType),
          description: deduceSupplyDescription(supplyType),
          location: randomLocationNear(center),
          priority: priorityFromItemsCount(itemsCount),
          supplyType,
          itemsCount,
          status: "pending",
          acceptedBy: null,
          createdAt,
        };

        return [liveRequest, ...withAgingPressure].slice(0, 50);
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
      const nextRequest: CrisisRequest = {
        id: `order-${createdAt}`,
        title: `${nextRequestTitle(supplyType)} from ${targetNgo.name}`,
        description: `Victim order by ${requesterEmail} for ${cleanQuantity} ${supplyType} items.`,
        location: { ...targetNgo.location },
        priority: priorityFromItemsCount(cleanQuantity),
        supplyType,
        itemsCount: cleanQuantity,
        status: "pending",
        acceptedBy: null,
        createdAt,
      };

      setRequests((previous) => [nextRequest, ...previous].slice(0, 50));
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

  const updateVolunteerSupply = useCallback(
    (updates: Partial<VolunteerSupplyState>) => {
      setVolunteerSupply((previous) => ({
        ...previous,
        ...updates,
      }));
      setLastUpdatedAt(Date.now());
    },
    [],
  );

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
