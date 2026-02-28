"use client";

import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Filter,
  Handshake,
  HeartPulse,
  Home,
  Loader2,
  Map,
  Pill,
  Sandwich,
  Search,
  ShieldAlert,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AnimatedStatCard } from "@/components/dashboard/shared/AnimatedStatCard";
import { RequestCard } from "@/components/dashboard/volunteer/RequestCard";
import { VolunteerMapDialog } from "@/components/dashboard/volunteer/VolunteerMapDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDataContext } from "@/context/DataContext";
import { FALLBACK_LOCATION } from "@/mockData/crisisData";
import type { CrisisRequest } from "@/types/crisis";
import { canVolunteerAcceptRequest } from "@/utils/requests";

interface VolunteerDashboardProps {
  email: string;
  mapOpen: boolean;
  onMapOpenChange: (open: boolean) => void;
}

type FilterType = "all" | "food" | "medical" | "shelter" | "other";

function SectionPanel({
  title,
  subtitle,
  color,
  children,
}: {
  title: string;
  subtitle: string;
  color: "red" | "orange" | "green";
  children: React.ReactNode;
}) {
  const classes =
    color === "red"
      ? "border-red-300/35 bg-red-500/5 shadow-[0_20px_70px_-45px_rgba(239,68,68,1)]"
      : color === "orange"
        ? "border-orange-300/35 bg-orange-500/5 shadow-[0_20px_70px_-50px_rgba(245,158,11,0.9)]"
        : "border-emerald-300/25 bg-emerald-500/5";

  return (
    <section className={`rounded-3xl border p-4 backdrop-blur-xl sm:p-5 ${classes}`}>
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      <p className="mb-4 mt-1 text-sm text-zinc-400">{subtitle}</p>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

export function VolunteerDashboard({
  email,
  mapOpen,
  onMapOpenChange,
}: VolunteerDashboardProps) {
  const {
    requests,
    volunteerSupply,
    updateVolunteerSupply,
    acceptRequest,
    userLocation,
    lastUpdatedAt,
  } = useDataContext();
  const center = userLocation ?? FALLBACK_LOCATION;

  const [filterType, setFilterType] = useState<FilterType>("all");
  const [otherQuery, setOtherQuery] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      if (filterType === "all") return true;
      if (filterType === "other") {
        if (request.supplyType !== "other") return false;
        const query = otherQuery.trim().toLowerCase();
        if (!query) return true;
        return (
          request.title.toLowerCase().includes(query) ||
          request.description.toLowerCase().includes(query)
        );
      }
      return request.supplyType === filterType;
    });
  }, [filterType, otherQuery, requests]);

  const grouped = useMemo(() => {
    return {
      red: filteredRequests.filter((request) => request.priority === "red"),
      orange: filteredRequests.filter((request) => request.priority === "orange"),
      green: filteredRequests.filter((request) => request.priority === "green"),
    };
  }, [filteredRequests]);

  const stats = useMemo(() => {
    const assigned = requests.filter((request) => request.status === "accepted").length;
    const pending = requests.filter((request) => request.status === "pending").length;
    const supplies =
      volunteerSupply.foodAmount +
      volunteerSupply.medicalAmount +
      volunteerSupply.shelterAmount;

    return {
      assigned,
      pending,
      supplies,
      inShift: Math.max(12, Math.round(pending / 2) + 11),
    };
  }, [requests, volunteerSupply]);

  const handleAccept = (request: CrisisRequest) => {
    const result = acceptRequest(request.id, email);
    setFeedback(result.message);
  };

  const handleSupplyInput = (
    field: "foodAmount" | "medicalAmount" | "shelterAmount",
    value: number,
  ) => {
    updateVolunteerSupply({
      [field]: Number.isFinite(value) ? Math.max(0, value) : 0,
    });
  };

  const saveEditorState = () => {
    setIsSaving(true);
    window.setTimeout(() => {
      setIsSaving(false);
      setFeedback("Volunteer inventory synced successfully.");
    }, 500);
  };

  return (
    <div className="space-y-5">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-orange-300/25 bg-white/[0.04] p-5 backdrop-blur-xl"
      >
        <h1 className="text-4xl font-black tracking-tight text-white">
          Welcome, Volunteers
        </h1>
        <p className="mt-2 text-zinc-400">
          Emergency inbox prioritization and supply coordination in real-time.
        </p>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AnimatedStatCard
          label="Assigned Tasks"
          value={stats.assigned}
          icon={<ClipboardCheck className="h-5 w-5" />}
          accent="orange"
        />
        <AnimatedStatCard
          label="Pending Requests"
          value={stats.pending}
          icon={<ShieldAlert className="h-5 w-5" />}
          accent="pink"
          delay={0.06}
        />
        <AnimatedStatCard
          label="Supplies On Hand"
          value={stats.supplies}
          icon={<Handshake className="h-5 w-5" />}
          accent="green"
          delay={0.12}
        />
        <AnimatedStatCard
          label="Volunteers In Shift"
          value={stats.inShift}
          icon={<HeartPulse className="h-5 w-5" />}
          accent="orange"
          delay={0.18}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card className="border-white/10 bg-white/[0.04] py-0 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Filter className="h-4 w-4 text-orange-200" />
              Volunteer Filter Section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pb-5">
            <div className="flex flex-wrap gap-2">
              {(["all", "food", "medical", "shelter", "other"] as const).map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant={filterType === value ? "default" : "outline"}
                  onClick={() => setFilterType(value)}
                  className={
                    filterType === value
                      ? "rounded-full bg-gradient-to-r from-orange-400 to-amber-300 text-zinc-900"
                      : "rounded-full border-white/20 bg-white/[0.02] text-zinc-100"
                  }
                >
                  {value === "all" ? "All" : value === "food" ? "Food Supplies" : value === "medical" ? "Medical Supplies" : value === "shelter" ? "Shelter" : "Other"}
                </Button>
              ))}
            </div>
            {filterType === "other" ? (
              <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-black/35 px-3">
                <Search className="h-4 w-4 text-zinc-500" />
                <Input
                  value={otherQuery}
                  onChange={(event) => setOtherQuery(event.target.value)}
                  placeholder="Filter custom requests by description..."
                  className="h-10 border-0 bg-transparent px-0 focus-visible:ring-0"
                />
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.04] py-0 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Volunteer Supply Editor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pb-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Food Amount</label>
                <Input
                  type="number"
                  value={volunteerSupply.foodAmount}
                  onChange={(event) =>
                    handleSupplyInput("foodAmount", Number(event.target.value))
                  }
                  className="border-white/20 bg-black/35"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Medical Amount</label>
                <Input
                  type="number"
                  value={volunteerSupply.medicalAmount}
                  onChange={(event) =>
                    handleSupplyInput("medicalAmount", Number(event.target.value))
                  }
                  className="border-white/20 bg-black/35"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Shelter Amount</label>
                <Input
                  type="number"
                  value={volunteerSupply.shelterAmount}
                  onChange={(event) =>
                    handleSupplyInput("shelterAmount", Number(event.target.value))
                  }
                  className="border-white/20 bg-black/35"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Custom Description</label>
              <Textarea
                value={volunteerSupply.customDescription}
                onChange={(event) =>
                  updateVolunteerSupply({ customDescription: event.target.value })
                }
                className="min-h-[86px] border-white/20 bg-black/35"
              />
            </div>
            <Button
              type="button"
              onClick={saveEditorState}
              className="h-10 rounded-xl bg-gradient-to-r from-orange-400 to-amber-300 text-zinc-900"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Volunteer Data"
              )}
            </Button>
          </CardContent>
        </Card>
      </section>

      {feedback ? (
        <div className="rounded-2xl border border-orange-300/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-100">
          {feedback}
        </div>
      ) : null}

      <SectionPanel
        title="Red - Urgent"
        subtitle="Critical requests requiring immediate action."
        color="red"
      >
        {grouped.red.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            canAccept={canVolunteerAcceptRequest(request, volunteerSupply)}
            onAccept={() => handleAccept(request)}
          />
        ))}
        {grouped.red.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-zinc-400">
            No urgent requests at the moment.
          </div>
        ) : null}
      </SectionPanel>

      <SectionPanel
        title="Orange - Moderate"
        subtitle="Requests that need attention during this shift."
        color="orange"
      >
        {grouped.orange.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            canAccept={canVolunteerAcceptRequest(request, volunteerSupply)}
            onAccept={() => handleAccept(request)}
          />
        ))}
        {grouped.orange.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-zinc-400">
            No moderate requests with current filter.
          </div>
        ) : null}
      </SectionPanel>

      <SectionPanel
        title="Green - Low Priority"
        subtitle="Lower urgency requests still needing follow-up."
        color="green"
      >
        {grouped.green.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            canAccept={canVolunteerAcceptRequest(request, volunteerSupply)}
            onAccept={() => handleAccept(request)}
          />
        ))}
        {grouped.green.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-zinc-400">
            No low priority requests for this filter.
          </div>
        ) : null}
      </SectionPanel>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-400">
        <Sandwich className="mr-1.5 inline h-4 w-4 text-orange-200" />
        Live updates last synced at {new Date(lastUpdatedAt).toLocaleTimeString()}.
        <Pill className="mx-2 inline h-4 w-4 text-orange-200" />
        Current supplies: Food {volunteerSupply.foodAmount}, Medical{" "}
        {volunteerSupply.medicalAmount}, Shelter {volunteerSupply.shelterAmount}.
        <Home className="mx-2 inline h-4 w-4 text-orange-200" />
        Map center: {center.lat.toFixed(3)}, {center.lng.toFixed(3)}.
      </section>

      <VolunteerMapDialog
        open={mapOpen}
        onOpenChange={onMapOpenChange}
        center={center}
        requests={requests}
      />

      <button
        type="button"
        onClick={() => onMapOpenChange(true)}
        className="fixed bottom-5 right-5 z-30 rounded-full border border-orange-300/35 bg-orange-400/20 p-4 text-orange-100 shadow-[0_10px_40px_-20px_rgba(245,158,11,1)] backdrop-blur-xl lg:hidden"
      >
        <Map className="h-5 w-5" />
      </button>
    </div>
  );
}
