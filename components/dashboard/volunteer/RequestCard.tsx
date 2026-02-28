"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  HandHeart,
  HeartPulse,
  Home,
  Info,
  MapPin,
  Package,
  Sandwich,
  Users,
} from "lucide-react";
import { useState } from "react";

import { RequestInfoDialog } from "@/components/dashboard/volunteer/RequestInfoDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CrisisRequest } from "@/types/crisis";

interface RequestCardProps {
  request: CrisisRequest;
  canAccept: boolean;
  onAccept: () => void;
}

function priorityText(priority: CrisisRequest["priority"]) {
  if (priority === "red") return "Heavy-Load";
  if (priority === "orange") return "Medium-Load";
  return "Light-Load";
}

function priorityTone(priority: CrisisRequest["priority"]) {
  if (priority === "red") {
    return {
      border: "border-red-300/35",
      badge: "bg-red-500/16 border-red-300/40 text-red-100",
      gradient:
        "from-[#1c090b] via-[#0d0d10] to-[#17090a] shadow-[0_20px_60px_-42px_rgba(239,68,68,0.7)]",
      button: "from-red-400 to-rose-300",
    };
  }
  if (priority === "orange") {
    return {
      border: "border-amber-300/30",
      badge: "bg-amber-500/16 border-amber-300/40 text-amber-100",
      gradient:
        "from-[#1b1308] via-[#0d0d10] to-[#171108] shadow-[0_20px_60px_-42px_rgba(245,158,11,0.72)]",
      button: "from-amber-300 to-orange-300",
    };
  }
  return {
    border: "border-emerald-300/28",
    badge: "bg-emerald-500/16 border-emerald-300/35 text-emerald-100",
    gradient:
      "from-[#0d1610] via-[#0d0d10] to-[#0a1212] shadow-[0_20px_60px_-44px_rgba(34,197,94,0.55)]",
    button: "from-emerald-300 to-lime-300",
  };
}

function requestTypeLabel(request: CrisisRequest) {
  if (request.supplyType === "food") return "Food Support";
  if (request.supplyType === "medical") return "Medical Support";
  if (request.supplyType === "shelter") return "Shelter Support";
  return "Custom Support";
}

function requestTypeIcon(request: CrisisRequest) {
  if (request.supplyType === "food") return <Sandwich className="h-6 w-6 text-sky-200" />;
  if (request.supplyType === "medical") {
    return <HeartPulse className="h-6 w-6 text-sky-200" />;
  }
  if (request.supplyType === "shelter") return <Home className="h-6 w-6 text-sky-200" />;
  return <Package className="h-6 w-6 text-sky-200" />;
}

function locationLabel(request: CrisisRequest) {
  if (request.areaName?.trim()) return request.areaName;
  return `${request.location.lat.toFixed(4)}, ${request.location.lng.toFixed(4)}`;
}

export function RequestCard({ request, canAccept, onAccept }: RequestCardProps) {
  const [infoOpen, setInfoOpen] = useState(false);
  const tone = priorityTone(request.priority);
  const accepted = request.status === "accepted";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.26 }}
      >
        <Card
          className={`border bg-gradient-to-br py-0 backdrop-blur-xl ${tone.border} ${tone.gradient}`}
        >
          <CardContent className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/5">
                  {requestTypeIcon(request)}
                </span>
                <div>
                  <h4 className="text-2xl font-semibold text-white sm:text-xl">
                    {requestTypeLabel(request)}
                  </h4>
                  <p className="text-sm text-zinc-400">{request.title}</p>
                </div>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${tone.badge}`}
              >
                {priorityText(request.priority)}
              </span>
            </div>

            <p className="text-xl font-medium text-zinc-100 sm:text-lg">
              <Users className="mr-2 inline h-5 w-5 text-zinc-300" />
              {request.itemsCount} people
            </p>

            <p className="min-h-[2.8rem] overflow-hidden text-sm leading-relaxed text-zinc-300 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
              {request.description}
            </p>

            <p className="rounded-xl border border-white/12 bg-black/35 px-3 py-2 text-sm text-zinc-200">
              <MapPin className="mr-2 inline h-4 w-4 text-amber-300" />
              {locationLabel(request)}
            </p>

            <div className="flex items-center justify-between gap-3">
              <span
                className={`inline-flex min-w-[130px] items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium ${
                  accepted
                    ? "border-emerald-300/35 bg-emerald-500/12 text-emerald-100"
                    : "border-amber-300/35 bg-amber-500/12 text-amber-100"
                }`}
              >
                {accepted ? "Accepted" : "Pending"}
              </span>
              <Button
                type="button"
                variant="outline"
                onClick={() => setInfoOpen(true)}
                className="h-10 min-w-[122px] rounded-xl border-sky-300/60 bg-transparent text-sky-200 hover:bg-sky-500/10"
              >
                <Info className="mr-2 h-4 w-4" />
                Info
              </Button>
            </div>

            <Button
              type="button"
              disabled={accepted || !canAccept}
              onClick={onAccept}
              className={`h-11 w-full rounded-xl bg-gradient-to-r text-zinc-900 ${
                canAccept ? tone.button : "from-zinc-500 to-zinc-500"
              } disabled:cursor-not-allowed disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-300`}
            >
              {accepted ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Accepted
                </>
              ) : canAccept ? (
                <>
                  <HandHeart className="mr-2 h-4 w-4" />
                  Accept Request
                </>
              ) : (
                <>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Insufficient Supplies
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <RequestInfoDialog
        open={infoOpen}
        onOpenChange={setInfoOpen}
        request={request}
        canAccept={canAccept}
        onAccept={onAccept}
      />
    </>
  );
}
