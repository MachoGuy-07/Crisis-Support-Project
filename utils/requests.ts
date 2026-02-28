import type {
  CrisisRequest,
  RequestLoad,
  RequestPriority,
  SupplyType,
  UrgencyLevel,
  VolunteerSupplyState,
} from "@/types/crisis";

export function getRequestLoad(itemsCount: number): RequestLoad {
  if (itemsCount > 30) return "heavy";
  if (itemsCount >= 5) return "medium";
  return "light";
}

// export function requestPriorityFromUrgency(
//   urgency: UrgencyLevel,
// ): RequestPriority {
//   if (urgency === "critical") return "red";
//   if (urgency === "moderate") return "orange";
//   return "green";
// }

// export function getUrgencyPalette(priority: RequestPriority | UrgencyLevel) {
//   if (priority === "critical" || priority === "red") {
//     return {
//       color: "#ef4444",
//       border: "border-red-400/40",
//       bg: "bg-red-500/10",
//       glow: "shadow-[0_0_40px_-20px_rgba(239,68,68,0.95)]",
//       label: "Critical",
//     };
//   }
//   if (priority === "moderate" || priority === "orange") {
//     return {
//       color: "#f59e0b",
//       border: "border-orange-300/40",
//       bg: "bg-orange-400/10",
//       glow: "shadow-[0_0_40px_-22px_rgba(245,158,11,0.9)]",
//       label: "Moderate",
//     };
//   }
//   return {
//     color: "#22c55e",
//     border: "border-emerald-300/35",
//     bg: "bg-emerald-400/10",
//     glow: "shadow-[0_0_40px_-26px_rgba(34,197,94,0.8)]",
//     label: "Low",
//   };
// }

export function canVolunteerAcceptRequest(
  request: CrisisRequest,
  supply: VolunteerSupplyState,
): boolean {
  return request.status === "open";
}

export function formatSupplyLabel(type: SupplyType) {
  if (type === "food") return "Food Supplies";
  if (type === "medical") return "Medical Supplies";
  if (type === "shelter") return "Shelter";
  return "Other";
}
