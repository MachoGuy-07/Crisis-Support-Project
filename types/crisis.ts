export type UserRole = "victim" | "volunteer";

export type SupplyType = "food" | "medical" | "shelter" | "other";

export type UrgencyLevel = "low" | "moderate" | "critical";

export type RequestPriority = "red" | "orange" | "green";

export type RequestLoad = "heavy" | "medium" | "light";

export type RequestStatus = "open" | "assigned" | "closed";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface NgoSupply {
  food: number;
  medical: number;
  shelter: number;
}

export interface NGO {
  id: string;
  name: string;
  description: string;
  location: Coordinates;
  supplies: NgoSupply;
  updatedAt: number;
}

export interface CrisisRequest {
  id: string;
  title: string;
  description: string;
  location: Coordinates;
  areaName?: string;
  priority: RequestPriority;
  supplyType: SupplyType;
  itemsCount: number;
  status: RequestStatus;
  acceptedBy: string | null;
  createdAt: number;
}

export interface VolunteerSupplyState {
  foodAmount: number;
  medicalAmount: number;
  shelterAmount: number;
  customDescription: string;
}

export interface OrderPayload {
  ngoId: string;
  supplyType: Exclude<SupplyType, "other">;
  quantity: number;
  requesterEmail: string;
}

export interface OrderResult {
  ok: boolean;
  message: string;
}

export interface AcceptResult {
  ok: boolean;
  message: string;
}

export interface DataContextValue {
  userLocation: Coordinates | null;
  ngos: NGO[];
  requests: CrisisRequest[];
  volunteerSupply: VolunteerSupplyState;
  lastUpdatedAt: number;
  placeOrder: (payload: OrderPayload) => OrderResult;
  acceptRequest: (requestId: string, volunteerEmail: string) => AcceptResult;
  updateVolunteerSupply: (
    updates: Partial<VolunteerSupplyState>,
  ) => void;
}
