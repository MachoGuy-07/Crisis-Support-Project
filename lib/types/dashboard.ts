export type UserRole = "victim" | "volunteer";

export type NgoCategory = "food" | "medical" | "water";

export type RequestType =
  | "medical"
  | "food"
  | "water"
  | "shelter"
  | "rescue"
  | "other";

export interface DashboardCenter {
  lat: number;
  lng: number;
}

export interface DashboardMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  kind: NgoCategory | "request";
  description?: string;
  priority?: "low" | "medium" | "high";
  status?: "pending" | "assigned" | "resolved";
  updatedAt?: string;
}

export interface VictimStats {
  foodWaterSupplies: number;
  medicalSupplies: number;
  shelterAvailability: number;
  volunteersReady: number;
}

export interface VolunteerStats {
  assignedTasks: number;
  pendingRequests: number;
  suppliesOnHand: number;
  volunteersInShift: number;
}

export interface VictimDashboardResponse {
  center: DashboardCenter;
  radiusKm: number;
  markers: DashboardMarker[];
  stats: VictimStats;
  updatedAt: string;
}

export interface VolunteerDashboardResponse {
  center: DashboardCenter;
  radiusKm: number;
  markers: DashboardMarker[];
  stats: VolunteerStats;
  updatedAt: string;
}

export interface CreateRequestPayload {
  requesterEmail: string;
  type: RequestType;
  description: string;
  lat: number;
  lng: number;
}

export interface OfferHelpPayload {
  volunteerEmail: string;
}
