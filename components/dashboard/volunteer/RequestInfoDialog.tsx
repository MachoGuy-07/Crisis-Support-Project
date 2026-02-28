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
    return <Sandwich className="h-12 w-12 text-blue-500" />;
  if (request.supplyType === "medical") {
    return <HeartPulse className="h-12 w-12 text-blue-500" />;
  }
  if (request.supplyType === "shelter")
    return <Home className="h-12 w-12 text-blue-500" />;
  return <Package className="h-12 w-12 text-blue-500" />;
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
}: RequestInfoDialogProps) {
  const approved = request.status === "accepted";
  const statusText = approved ? "Request Approved" : "Awaiting Volunteer";
  const statusClasses = approved
    ? "border-emerald-300 bg-emerald-100 text-emerald-900"
    : "border-amber-300 bg-amber-100 text-amber-900";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto border-slate-200 bg-[#f4f5f7] p-0 text-slate-800">
        <div className="space-y-6 p-6 sm:p-8">
          <DialogHeader className="space-y-3 text-left">
            <DialogTitle className="text-4xl font-semibold tracking-tight text-slate-800">
              <span className="mr-4 inline-flex align-middle">
                {requestTypeIcon(request)}
              </span>
              <span className="align-middle">{requestTypeLabel(request)}</span>
            </DialogTitle>
            <DialogDescription className="text-lg text-slate-500">
              Request details and location snapshot.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 text-slate-700">
            <p className="text-4xl font-medium text-slate-700">
              <Users className="mr-3 inline h-8 w-8 text-slate-400" />
              {request.itemsCount} people
            </p>

            <p className="max-w-4xl text-3xl leading-[1.45] text-slate-700 sm:text-2xl">
              {request.description}
            </p>

            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-4xl font-medium text-slate-700 sm:text-2xl">
                <MapPin className="mr-2 inline h-8 w-8 text-amber-500" />
                {locationLabel(request)}
              </p>
              <span
                className={`inline-flex items-center rounded-xl border px-4 py-2 text-xl font-medium sm:text-lg ${statusClasses}`}
              >
                <ShieldAlert className="mr-2 h-5 w-5" />
                {statusText}
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-[0_18px_38px_-22px_rgba(15,23,42,0.45)]">
            <iframe
              title={`Map preview for ${request.title}`}
              src={toEmbedMapUrl(request.location.lat, request.location.lng)}
              className="h-[360px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
