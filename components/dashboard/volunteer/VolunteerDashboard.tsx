"use client";

import { ChevronDown, ChevronUp, Map, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { RequestCard } from "@/components/dashboard/volunteer/RequestCard";
import { VolunteerMapDialog } from "@/components/dashboard/volunteer/VolunteerMapDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const filterOptions: Array<{ value: Exclude<FilterType, "all">; label: string }> = [
  { value: "food", label: "Food" },
  { value: "medical", label: "Medical" },
  { value: "shelter", label: "Shelter" },
  { value: "other", label: "Other" },
];

const priorityRank = {
  red: 0,
  orange: 1,
  green: 2,
};

export function VolunteerDashboard({
  email,
  mapOpen,
  onMapOpenChange,
}: VolunteerDashboardProps) {
  const { requests, volunteerSupply, acceptRequest, userLocation } = useDataContext();
  const center = userLocation ?? FALLBACK_LOCATION;

  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [otherQuery, setOtherQuery] = useState("");
  const visibleLimit = 9;

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      if (filterType === "all") return true;
      if (filterType === "other") {
        if (request.supplyType !== "other") return false;
        const query = otherQuery.trim().toLowerCase();
        if (!query) return true;
        return (
          request.title.toLowerCase().includes(query) ||
          request.description.toLowerCase().includes(query) ||
          (request.areaName?.toLowerCase().includes(query) ?? false)
        );
      }
      return request.supplyType === filterType;
    });
  }, [filterType, otherQuery, requests]);

  const prioritizedRequests = useMemo(() => {
    return [...filteredRequests].sort((a, b) => {
      if (a.status !== b.status) return a.status === "pending" ? -1 : 1;
      if (a.priority !== b.priority) return priorityRank[a.priority] - priorityRank[b.priority];
      return b.createdAt - a.createdAt;
    });
  }, [filteredRequests]);

  const visibleRequests = useMemo(
    () => prioritizedRequests.slice(0, visibleLimit),
    [prioritizedRequests],
  );

  const handleAccept = (request: CrisisRequest) => {
    acceptRequest(request.id, email);
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-white/15 bg-[radial-gradient(circle_at_50%_0%,rgba(148,163,184,0.08),transparent_44%),linear-gradient(90deg,rgba(28,16,54,0.96),rgba(11,16,32,0.96)_52%,rgba(51,33,14,0.94))] p-4 shadow-[0_18px_52px_-28px_rgba(0,0,0,0.88),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-xl">
        <Button
          type="button"
          variant="outline"
          onClick={() => setFilterOpen((value) => !value)}
          className="h-9 rounded-full border-white/30 bg-gradient-to-b from-white/[0.11] to-white/[0.03] px-4 text-zinc-50 shadow-[0_10px_22px_-14px_rgba(0,0,0,0.9)]"
        >
          Help Type Filter
          {filterOpen ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button>

        {filterOpen ? (
          <div className="mt-3 space-y-3">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={filterType === option.value ? "default" : "outline"}
                  onClick={() => setFilterType(option.value)}
                  className={
                    filterType === option.value
                      ? "h-9 rounded-full bg-gradient-to-r from-orange-400 to-amber-300 px-4 text-zinc-900 shadow-[0_10px_24px_-16px_rgba(245,158,11,0.95)]"
                      : "h-9 rounded-full border-white/30 bg-gradient-to-b from-white/[0.11] to-white/[0.02] px-4 text-zinc-100 shadow-[0_8px_18px_-14px_rgba(0,0,0,0.95)] hover:from-white/[0.16] hover:to-white/[0.04]"
                  }
                >
                  {option.label}
                </Button>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFilterType("all");
                  setOtherQuery("");
                }}
                className="h-9 rounded-full border-white/30 bg-gradient-to-b from-white/[0.11] to-white/[0.02] px-4 text-zinc-100 shadow-[0_8px_18px_-14px_rgba(0,0,0,0.95)] hover:from-white/[0.16] hover:to-white/[0.04]"
              >
                Show All
              </Button>
            </div>
            {filterType === "other" ? (
              <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-black/50 px-3">
                <Search className="h-4 w-4 text-zinc-500" />
                <Input
                  value={otherQuery}
                  onChange={(event) => setOtherQuery(event.target.value)}
                  placeholder="Search custom requests..."
                  className="h-10 border-0 bg-transparent px-0 text-zinc-100 focus-visible:ring-0"
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl sm:p-5">
        {visibleRequests.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                canAccept={canVolunteerAcceptRequest(request, volunteerSupply)}
                onAccept={() => handleAccept(request)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-300">
            No requests match the current filter.
          </div>
        )}
      </section>

      <VolunteerMapDialog
        open={mapOpen}
        onOpenChange={onMapOpenChange}
        center={center}
        requests={prioritizedRequests}
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
