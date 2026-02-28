"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Boxes,
  ClipboardCheck,
  Clock3,
  Droplets,
  House,
  Loader2,
  Pill,
  ShieldAlert,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MapSection } from "@/components/dashboard/MapSection";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createHelpRequest, getDashboardData, offerHelp } from "@/lib/api/dashboardApi";
import { clearSession, getUserEmail, getUserRole, setUserRole } from "@/lib/session";
import { getSocketClient } from "@/lib/socketClient";
import type {
  DashboardMarker,
  RequestType,
  UserRole,
  VictimDashboardResponse,
  VolunteerDashboardResponse,
} from "@/lib/types/dashboard";

const DEFAULT_CENTER = { lat: 17.385, lng: 78.4867 };

function toRole(roleParam: string | string[] | undefined): UserRole | null {
  if (roleParam === "victim") return "victim";
  if (roleParam === "volunteer") return "volunteer";
  return null;
}

function isVictimPayload(
  payload: VictimDashboardResponse | VolunteerDashboardResponse | null,
): payload is VictimDashboardResponse {
  return Boolean(payload && "foodWaterSupplies" in payload.stats);
}

export default function RoleDashboardPage() {
  const params = useParams<{ role: string }>();
  const router = useRouter();
  const role = toRole(params?.role);

  const [email, setEmail] = useState("");
  const [radiusKm, setRadiusKm] = useState(10);
  const [search, setSearch] = useState("");
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState("");
  const [selectedMarker, setSelectedMarker] = useState<DashboardMarker | null>(
    null,
  );
  const [requestType, setRequestType] = useState<RequestType>("medical");
  const [requestDescription, setRequestDescription] = useState("");
  const [dashboardData, setDashboardData] = useState<
    VictimDashboardResponse | VolunteerDashboardResponse | null
  >(null);

  const isVictim = role === "victim";
  const title = isVictim ? "NGO Support Locations (Live)" : "Emergency Requests (Live)";
  const subtitle = isVictim
    ? "Currently active NGOs providing crisis aid in the selected area."
    : "Active emergency signals that need immediate volunteer response.";

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        // Falls back to default center when geolocation is unavailable.
      },
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 120000 },
    );
  }, []);

  useEffect(() => {
    if (!role) {
      router.replace("/role-select");
      return;
    }

    const sessionEmail = getUserEmail();
    if (!sessionEmail) {
      router.replace("/login");
      return;
    }

    setEmail(sessionEmail);
    const storedRole = getUserRole();
    if (storedRole !== role) setUserRole(role);
  }, [role, router]);

  const refreshDashboard = useCallback(async () => {
    if (!role) return;

    setIsLoading(true);
    const payload = await getDashboardData(role, {
      radiusKm,
      search,
      lat: center.lat,
      lng: center.lng,
    });

    setDashboardData(payload);
    setIsLoading(false);
  }, [center.lat, center.lng, radiusKm, role, search]);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      void (async () => {
        if (cancelled) return;
        try {
          await refreshDashboard();
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      })();
    }, 180);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [refreshDashboard]);

  useEffect(() => {
    if (!role) return;

    const socket = getSocketClient();
    const onConnect = () => socket.emit("dashboard:subscribe", { role });
    const onStatsUpdate = (payload: {
      role: UserRole;
      stats: Record<string, number>;
      updatedAt: string;
    }) => {
      if (payload.role !== role) return;
      setDashboardData((previous) => {
        if (!previous) return previous;
        if (payload.role === "victim" && isVictimPayload(previous)) {
          return {
            ...previous,
            stats: {
              ...previous.stats,
              ...payload.stats,
            } as VictimDashboardResponse["stats"],
            updatedAt: payload.updatedAt,
          };
        }

        if (payload.role === "volunteer" && !isVictimPayload(previous)) {
          return {
            ...previous,
            stats: {
              ...previous.stats,
              ...payload.stats,
            } as VolunteerDashboardResponse["stats"],
            updatedAt: payload.updatedAt,
          };
        }

        return previous;
      });
    };

    const onRequestNew = (marker: DashboardMarker) => {
      if (role !== "volunteer") return;
      setDashboardData((previous) => {
        if (!previous || isVictimPayload(previous)) return previous;
        if (previous.markers.some((item) => item.id === marker.id)) return previous;
        return {
          ...previous,
          markers: [marker, ...previous.markers].slice(0, 30),
          stats: {
            ...previous.stats,
            pendingRequests: previous.stats.pendingRequests + 1,
          },
        };
      });
    };

    socket.on("connect", onConnect);
    socket.on("stats:update", onStatsUpdate);
    socket.on("request:new", onRequestNew);
    if (socket.connected) onConnect();

    return () => {
      socket.emit("dashboard:unsubscribe", { role });
      socket.off("connect", onConnect);
      socket.off("stats:update", onStatsUpdate);
      socket.off("request:new", onRequestNew);
    };
  }, [role]);

  const onSignOut = () => {
    clearSession();
    router.replace("/login");
  };

  const onActionSubmit = async () => {
    if (!role) return;
    setIsActionLoading(true);
    try {
      if (role === "victim") {
        if (!requestDescription.trim()) {
          setActionNotice("Enter a description before submitting your request.");
          return;
        }
        await createHelpRequest({
          requesterEmail: email,
          type: requestType,
          description: requestDescription.trim(),
          lat: center.lat,
          lng: center.lng,
        });
        setRequestDescription("");
        setActionNotice("Help request submitted. Nearby volunteers are being notified.");
      } else {
        await offerHelp({ volunteerEmail: email });
        setActionNotice("You are now marked as active in the current volunteer shift.");
      }

      setActionDialogOpen(false);
      await refreshDashboard();
    } finally {
      setIsActionLoading(false);
    }
  };

  const statCards = useMemo(() => {
    if (!dashboardData) return [];

    if (isVictimPayload(dashboardData)) {
      return [
        {
          title: "Food & Water Supplies",
          value: dashboardData.stats.foodWaterSupplies,
          subtitle: "Realtime resource availability from connected NGOs.",
          icon: Droplets,
        },
        {
          title: "Medical Supplies",
          value: dashboardData.stats.medicalSupplies,
          subtitle: "Emergency medical units in current operating radius.",
          icon: Pill,
        },
        {
          title: "Shelter Availability",
          value: dashboardData.stats.shelterAvailability,
          subtitle: "Open shelter slots currently available.",
          icon: House,
        },
        {
          title: "Volunteers Ready",
          value: dashboardData.stats.volunteersReady,
          subtitle: "Active volunteers standing by for dispatch.",
          icon: UsersRound,
        },
      ];
    }

    return [
      {
        title: "Assigned Tasks",
        value: dashboardData.stats.assignedTasks,
        subtitle: "Tasks currently assigned to volunteer teams.",
        icon: ClipboardCheck,
      },
      {
        title: "Pending Requests",
        value: dashboardData.stats.pendingRequests,
        subtitle: "Open requests waiting for response.",
        icon: Clock3,
      },
      {
        title: "Supplies On Hand",
        value: dashboardData.stats.suppliesOnHand,
        subtitle: "Total supplies available in volunteer network.",
        icon: Boxes,
      },
      {
        title: "Volunteers In Shift",
        value: dashboardData.stats.volunteersInShift,
        subtitle: "Currently active volunteers in this shift.",
        icon: UserRoundCheck,
      },
    ];
  }, [dashboardData]);

  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090909] text-zinc-200">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0f0f0f] pb-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(244,114,182,0.17),transparent_33%),radial-gradient(circle_at_85%_0%,rgba(251,146,60,0.17),transparent_32%),linear-gradient(120deg,#070707,#101010_50%,#060606)]" />

      <DashboardHeader
        email={email}
        role={role}
        radiusKm={radiusKm}
        search={search}
        onRadiusChange={setRadiusKm}
        onSearchChange={setSearch}
        onActionClick={() => setActionDialogOpen(true)}
        onSignOut={onSignOut}
      />

      <main className="relative z-10 mx-auto mt-6 w-full max-w-[1320px] space-y-5 px-4 sm:px-6 lg:px-8">
        {role === "volunteer" ? (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl"
          >
            <h1 className="text-4xl font-black tracking-tight text-white">
              Welcome, Volunteers
            </h1>
            <p className="mt-2 text-zinc-400">
              Monitor and respond to nearby crisis aid requests in real-time.
            </p>
          </motion.section>
        ) : null}

        <MapSection
          role={role}
          title={title}
          subtitle={subtitle}
          center={center}
          radiusKm={radiusKm}
          markers={dashboardData?.markers ?? []}
          onMarkerSelect={role === "volunteer" ? setSelectedMarker : undefined}
        />

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-2xl sm:p-6">
          <div className="mb-5">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              {role === "victim"
                ? "Live Inventory In Selected Radius"
                : "Task Assignment and Volunteer Resources"}
            </h2>
            <p className="mt-1 text-zinc-400">
              {role === "victim"
                ? "Realtime resource availability based on the scanned area."
                : "Realtime assignments and readiness for the current response zone."}
            </p>
          </div>

          {isLoading && !dashboardData ? (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-white/10 bg-black/35">
              <Loader2 className="h-7 w-7 animate-spin text-zinc-300" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card, index) => (
                <StatCard
                  key={card.title}
                  title={card.title}
                  value={card.value}
                  subtitle={card.subtitle}
                  icon={card.icon}
                  accent={role}
                  delay={index * 0.06}
                />
              ))}
            </div>
          )}
        </section>

        <AnimatePresence>
          {actionNotice ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="rounded-2xl border border-emerald-200/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100"
            >
              {actionNotice}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="border-white/20 bg-[#111111] text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {role === "victim" ? "Ask for Help" : "Offer Help"}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {role === "victim"
                ? "Share what you need and nearby volunteers will be alerted."
                : "Confirm your availability to receive new task assignments."}
            </DialogDescription>
          </DialogHeader>

          {role === "victim" ? (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-zinc-300">
                  Request Type
                </span>
                <select
                  value={requestType}
                  onChange={(event) => setRequestType(event.target.value as RequestType)}
                  className="h-11 w-full rounded-xl border border-white/15 bg-black/50 px-3 text-sm text-zinc-100 outline-none"
                >
                  <option value="medical">Medical Emergency</option>
                  <option value="food">Food Assistance</option>
                  <option value="water">Water Support</option>
                  <option value="shelter">Shelter Required</option>
                  <option value="rescue">Rescue / Evacuation</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-zinc-300">
                  Description
                </span>
                <textarea
                  value={requestDescription}
                  onChange={(event) => setRequestDescription(event.target.value)}
                  className="min-h-[110px] w-full rounded-xl border border-white/15 bg-black/50 px-3 py-2 text-sm text-zinc-100 outline-none"
                  placeholder="Describe the situation, urgency, and number of people affected..."
                />
              </label>
            </div>
          ) : (
            <div className="rounded-xl border border-orange-200/20 bg-orange-400/10 p-4 text-sm text-orange-100">
              You&apos;re about to join the active volunteer queue. New nearby tasks
              will appear live on your map.
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              onClick={onActionSubmit}
              disabled={isActionLoading}
              className={
                role === "victim"
                  ? "bg-gradient-to-r from-rose-400 to-pink-300 text-zinc-900"
                  : "bg-gradient-to-r from-orange-400 to-amber-300 text-zinc-900"
              }
            >
              {isActionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : role === "victim" ? (
                "Submit Help Request"
              ) : (
                "Confirm Availability"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(selectedMarker)}
        onOpenChange={(open) => {
          if (!open) setSelectedMarker(null);
        }}
      >
        <DialogContent className="border-white/20 bg-[#111111] text-zinc-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <ShieldAlert className="h-5 w-5 text-orange-300" />
              Request Details
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Detailed view for selected emergency marker.
            </DialogDescription>
          </DialogHeader>

          {selectedMarker ? (
            <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
              <div>
                <p className="text-zinc-400">Title</p>
                <p className="font-semibold text-zinc-100">{selectedMarker.name}</p>
              </div>
              <div>
                <p className="text-zinc-400">Description</p>
                <p className="text-zinc-200">
                  {selectedMarker.description || "No additional details provided."}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-zinc-400">Priority</p>
                  <p className="font-medium capitalize text-zinc-100">
                    {selectedMarker.priority || "medium"}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-400">Status</p>
                  <p className="font-medium capitalize text-zinc-100">
                    {selectedMarker.status || "pending"}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedMarker(null)}
              className="border-white/20 bg-white/[0.03] text-zinc-100 hover:bg-white/[0.08]"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
