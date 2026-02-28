"use client";

import {
  HeartPulse,
  Home,
  MapPin,
  Package,
  Sandwich,
  ShieldAlert,
  Users,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CrisisRequest } from "@/types/crisis";

interface RequestInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: CrisisRequest;
  canAccept: boolean;
  onAccept: () => void;
}

function toEmbedMapUrl(lat: number, lng: number) {
  const delta = 0.02;
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lng}`;
}

function locationLabel(request: CrisisRequest) {
  if (request.areaName?.trim()) return request.areaName;
  return `${request.location.lat.toFixed(4)}, ${request.location.lng.toFixed(4)}`;
}

function requestTypeIcon(request: CrisisRequest) {
  if (request.supplyType === "food")
    return <Sandwich className="h-8 w-8 text-sky-300" />;
  if (request.supplyType === "medical") {
    return <HeartPulse className="h-8 w-8 text-sky-300" />;
  }
  if (request.supplyType === "shelter")
    return <Home className="h-8 w-8 text-sky-300" />;
  return <Package className="h-8 w-8 text-sky-300" />;
}

function requestTypeLabel(request: CrisisRequest) {
  if (request.supplyType === "food") return "Food";
  if (request.supplyType === "medical") return "Medical";
  if (request.supplyType === "shelter") return "Shelter";
  return "Custom Support";
}

export function RequestInfoDialog({
  open,
  onOpenChange,
  request,
  canAccept,
  onAccept,
}: RequestInfoDialogProps) {
  const approved = request.status === "assigned";
  const approvedClasses =
    "border-emerald-300/35 bg-emerald-500/15 text-emerald-100";
  const acceptClasses =
    request.priority === "red"
      ? "border-red-300/35 bg-red-500/15 text-red-100 hover:bg-red-500/22"
      : request.priority === "orange"
        ? "border-amber-300/35 bg-amber-500/15 text-amber-100 hover:bg-amber-500/22"
        : "border-emerald-300/35 bg-emerald-500/15 text-emerald-100 hover:bg-emerald-500/22";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[94vw] !max-w-[94vw] overflow-hidden border border-white/20 bg-[radial-gradient(circle_at_16%_0%,rgba(244,114,182,0.12),transparent_36%),radial-gradient(circle_at_88%_0%,rgba(251,146,60,0.12),transparent_36%),linear-gradient(135deg,#08080a,#111118_52%,#0a0a0e)] p-0 text-zinc-100 shadow-[0_34px_96px_-54px_rgba(0,0,0,0.95)] [&>[data-slot=dialog-close]]:top-4 [&>[data-slot=dialog-close]]:right-4 [&>[data-slot=dialog-close]]:z-30 [&>[data-slot=dialog-close]]:rounded-full [&>[data-slot=dialog-close]]:border [&>[data-slot=dialog-close]]:border-white/30 [&>[data-slot=dialog-close]]:bg-zinc-950/90 [&>[data-slot=dialog-close]]:p-2 [&>[data-slot=dialog-close]]:text-zinc-100 [&>[data-slot=dialog-close]]:opacity-100 [&>[data-slot=dialog-close]]:shadow-[0_10px_24px_-14px_rgba(0,0,0,0.95)] [&>[data-slot=dialog-close]]:hover:bg-zinc-900 sm:!max-w-[88vw] lg:!max-w-[58vw]">
        <div className="grid gap-4 p-4 pt-8 sm:p-5 sm:pt-9 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-[2rem]">
                <span className="mr-3 inline-flex align-middle">
                  {requestTypeIcon(request)}
                </span>
                <span className="align-middle">
                  {requestTypeLabel(request)}
                </span>
              </DialogTitle>
              <DialogDescription className="text-sm text-zinc-400 sm:text-base">
                Request details and location snapshot.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-zinc-200">
              <p className="text-base font-medium text-zinc-100 sm:text-lg -mt-4">
                <Users className="mr-2 inline h-4 w-4 text-zinc-400" />
                {request.itemsCount} people
              </p>

              <p className="max-w-5xl text-base leading-[1.45] text-zinc-400 sm:text-lg">
                {request.description}
              </p>

              <div className="flex items-center justify-between gap-3 pt-1">
                <p className="inline-flex h-10 items-center text-sm font-medium text-zinc-100 sm:text-base">
                  <MapPin className="mr-2 h-4 w-4 shrink-0 text-amber-300" />
                  <span className="leading-none">{locationLabel(request)}</span>
                </p>
                {approved ? (
                  <span
                    className={`inline-flex h-10 items-center rounded-xl border px-3 text-sm font-medium sm:text-base ${approvedClasses}`}
                  >
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    Request Approved
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={!canAccept}
                    onClick={() => {
                      onAccept();
                      onOpenChange(false);
                    }}
                    className={`inline-flex h-10 items-center rounded-xl border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:border-zinc-500/35 disabled:bg-zinc-600/20 disabled:text-zinc-400 sm:text-base ${acceptClasses}`}
                  >
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    {canAccept ? "Accept Request" : "Location Unavailable"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/40 shadow-[0_20px_44px_-28px_rgba(0,0,0,0.95)]">
            <iframe
              title={`Map preview for ${request.title}`}
              src={toEmbedMapUrl(request.location.lat, request.location.lng)}
              className="h-[180px] w-full sm:h-[210px] lg:h-full lg:min-h-[220px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
