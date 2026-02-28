import type {
  CreateRequestPayload,
  OfferHelpPayload,
  UserRole,
  VictimDashboardResponse,
  VolunteerDashboardResponse,
} from "@/lib/types/dashboard";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:5000/api";

const fallbackCenter = { lat: 17.385, lng: 78.4867 };

const fallbackVictimDashboard: VictimDashboardResponse = {
  center: fallbackCenter,
  radiusKm: 10,
  updatedAt: new Date().toISOString(),
  markers: [
    {
      id: "ngo-food-1",
      name: "Food Relief Hub",
      lat: 17.4102,
      lng: 78.4771,
      kind: "food",
      description: "Emergency food kits and clean drinking water.",
    },
    {
      id: "ngo-medical-1",
      name: "Rapid Medical Point",
      lat: 17.3752,
      lng: 78.5085,
      kind: "medical",
      description: "First aid and urgent medical support.",
    },
    {
      id: "ngo-water-1",
      name: "Hydration Outpost",
      lat: 17.3632,
      lng: 78.4521,
      kind: "water",
      description: "Clean water distribution and refill station.",
    },
  ],
  stats: {
    foodWaterSupplies: 840,
    medicalSupplies: 254,
    shelterAvailability: 106,
    volunteersReady: 185,
  },
};

const fallbackVolunteerDashboard: VolunteerDashboardResponse = {
  center: fallbackCenter,
  radiusKm: 10,
  updatedAt: new Date().toISOString(),
  markers: [
    {
      id: "request-1",
      name: "Medical Assistance Request",
      lat: 17.4014,
      lng: 78.4865,
      kind: "request",
      priority: "high",
      status: "pending",
      description: "Two people require immediate first aid.",
    },
    {
      id: "request-2",
      name: "Food Supply Request",
      lat: 17.3712,
      lng: 78.5122,
      kind: "request",
      priority: "medium",
      status: "pending",
      description: "Relief camp supplies expected to run out in 2 hours.",
    },
  ],
  stats: {
    assignedTasks: 4,
    pendingRequests: 2,
    suppliesOnHand: 608,
    volunteersInShift: 17,
  },
};

interface DashboardQuery {
  radiusKm: number;
  search: string;
  lat: number;
  lng: number;
}

function toQuery(params: DashboardQuery) {
  const query = new URLSearchParams();
  query.set("radiusKm", String(params.radiusKm));
  query.set("search", params.search);
  query.set("lat", String(params.lat));
  query.set("lng", String(params.lng));
  return query.toString();
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getDashboardData(
  role: UserRole,
  query: DashboardQuery,
): Promise<VictimDashboardResponse | VolunteerDashboardResponse> {
  try {
    if (role === "victim") {
      return await request<VictimDashboardResponse>(
        `/dashboard/victim?${toQuery(query)}`,
      );
    }

    return await request<VolunteerDashboardResponse>(
      `/dashboard/volunteer?${toQuery(query)}`,
    );
  } catch {
    if (role === "victim") {
      return {
        ...fallbackVictimDashboard,
        radiusKm: query.radiusKm,
      };
    }

    return {
      ...fallbackVolunteerDashboard,
      radiusKm: query.radiusKm,
    };
  }
}

export async function createHelpRequest(payload: CreateRequestPayload) {
  return request<{ success: boolean; message: string; requestId: string }>(
    "/requests",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function offerHelp(payload: OfferHelpPayload) {
  return request<{ success: boolean; message: string }>("/volunteers/offer", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
