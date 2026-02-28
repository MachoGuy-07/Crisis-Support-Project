"use client";

import { motion, useMotionValueEvent, useSpring } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  accent: "victim" | "volunteer";
  icon: LucideIcon;
  delay?: number;
}

function AnimatedCounter({ value }: { value: number }) {
  const spring = useSpring(value, {
    mass: 0.85,
    stiffness: 90,
    damping: 18,
  });
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useMotionValueEvent(spring, "change", (latest) => {
    setDisplayValue(Math.max(0, Math.round(latest)));
  });

  return (
    <span className="text-4xl font-black tracking-tight text-white">
      {Intl.NumberFormat("en-US").format(displayValue)}
    </span>
  );
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.01 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-white/[0.035] p-5 backdrop-blur-xl transition-all duration-300",
        accent === "victim"
          ? "border-white/10 hover:border-rose-300/45 hover:shadow-[0_20px_60px_-28px_rgba(255,107,149,0.7)]"
          : "border-white/10 hover:border-orange-300/45 hover:shadow-[0_20px_60px_-28px_rgba(255,168,85,0.7)]",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -top-16 right-[-20%] h-36 w-36 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-90",
          accent === "victim" ? "bg-rose-500/30" : "bg-orange-500/30",
        )}
      />
      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl border",
              accent === "victim"
                ? "border-rose-300/30 bg-rose-400/10 text-rose-200"
                : "border-orange-300/30 bg-orange-400/10 text-orange-200",
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="mb-4 text-sm text-zinc-400">{subtitle}</p>
        <AnimatedCounter value={value} />
      </div>
    </motion.article>
  );
}
