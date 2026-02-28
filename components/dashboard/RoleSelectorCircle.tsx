"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface RoleSelectorCircleProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  accent: "victim" | "volunteer";
  onClick: () => void;
}

export function RoleSelectorCircle({
  title,
  subtitle,
  icon,
  accent,
  onClick,
}: RoleSelectorCircleProps) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      onClick={onClick}
      className={cn(
        "group relative flex h-[260px] w-[260px] flex-col items-center justify-center gap-3 rounded-full border text-center backdrop-blur-2xl transition-all sm:h-[300px] sm:w-[300px]",
        accent === "victim"
          ? "border-rose-200/40 bg-rose-400/10 hover:shadow-[0_0_80px_-30px_rgba(251,113,133,0.9)]"
          : "border-orange-200/40 bg-orange-300/10 hover:shadow-[0_0_80px_-30px_rgba(251,146,60,0.9)]",
      )}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          accent === "victim"
            ? "bg-[radial-gradient(circle_at_30%_30%,rgba(244,114,182,0.5),transparent_55%)]"
            : "bg-[radial-gradient(circle_at_30%_30%,rgba(251,146,60,0.45),transparent_55%)]",
        )}
      />
      <div className="relative z-10">
        <div
          className={cn(
            "mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border",
            accent === "victim"
              ? "border-rose-200/30 bg-rose-300/20 text-rose-100"
              : "border-orange-200/30 bg-orange-300/20 text-orange-100",
          )}
        >
          {icon}
        </div>
        <h2 className="text-3xl font-black tracking-tight text-white">{title}</h2>
        <p className="mt-1 px-8 text-sm text-zinc-300">{subtitle}</p>
      </div>
    </motion.button>
  );
}
