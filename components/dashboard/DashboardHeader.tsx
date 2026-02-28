"use client";

import { motion } from "framer-motion";
import {
  Heart,
  LogOut,
  Menu,
  Search,
  TriangleAlert,
  HandHeart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  email: string;
  radiusKm: number;
  search: string;
  role: "victim" | "volunteer";
  onRadiusChange: (value: number) => void;
  onSearchChange: (value: string) => void;
  onActionClick: () => void;
  onSignOut: () => void;
}

export function DashboardHeader({
  email,
  radiusKm,
  search,
  role,
  onRadiusChange,
  onSearchChange,
  onActionClick,
  onSignOut,
}: DashboardHeaderProps) {
  const actionLabel = role === "victim" ? "Ask for Help" : "Offer Help";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
      <div className="mx-auto w-full max-w-[1320px] px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 sm:inline-block">
              {email}
            </span>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl border-white/20 bg-white/5 text-zinc-200 hover:bg-white/10"
              onClick={onSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-[260px_1fr_auto_auto]">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl"
          >
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Radius
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={50}
                value={radiusKm}
                onChange={(event) => onRadiusChange(Number(event.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-700 accent-white"
              />
              <span className="min-w-[58px] text-sm font-semibold text-zinc-200">
                {radiusKm} km
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.005 }}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 backdrop-blur-xl"
          >
            <Search className="h-4 w-4 text-zinc-500" />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search NGOs, requests, resources..."
              className="h-12 w-full bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
            />
          </motion.div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-2xl border-white/20 bg-white/[0.05] text-zinc-200 hover:bg-white/[0.1]"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <motion.div whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
            <Button
              type="button"
              onClick={onActionClick}
              className={cn(
                "h-12 w-full rounded-2xl px-5 text-sm font-semibold shadow-xl transition-all md:w-auto",
                role === "victim"
                  ? "bg-gradient-to-r from-rose-400 to-pink-300 text-zinc-900 hover:shadow-[0_0_34px_rgba(251,113,133,0.55)]"
                  : "bg-gradient-to-r from-orange-400 to-amber-300 text-zinc-900 hover:shadow-[0_0_34px_rgba(251,146,60,0.55)]",
              )}
            >
              {role === "victim" ? (
                <TriangleAlert className="mr-2 h-4 w-4" />
              ) : (
                <HandHeart className="mr-2 h-4 w-4" />
              )}
              {actionLabel}
            </Button>
          </motion.div>
        </div>

        <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
          <Heart
            className={cn(
              "h-3.5 w-3.5",
              role === "victim" ? "text-rose-300" : "text-orange-300",
            )}
          />
          Live updates active in selected radius
        </div>
      </div>
    </header>
  );
}
