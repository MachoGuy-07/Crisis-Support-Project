"use client";

import { motion, useMotionValueEvent, useSpring } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnimatedStatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  accent: "pink" | "orange" | "green";
  delay?: number;
}

function Counter({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 80, damping: 18, mass: 0.85 });
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useMotionValueEvent(spring, "change", (latest) => {
    setDisplayValue(Math.round(latest));
  });

  return (
    <span className="text-4xl font-black tracking-tight text-white">
      {Intl.NumberFormat("en-US").format(displayValue)}
    </span>
  );
}

const accentMap = {
  pink: {
    border: "border-rose-300/35",
    glow: "hover:shadow-[0_20px_80px_-40px_rgba(251,113,133,1)]",
    icon: "text-rose-100 bg-rose-300/15",
  },
  orange: {
    border: "border-orange-300/35",
    glow: "hover:shadow-[0_20px_80px_-40px_rgba(245,158,11,1)]",
    icon: "text-orange-100 bg-orange-300/15",
  },
  green: {
    border: "border-emerald-300/35",
    glow: "hover:shadow-[0_20px_80px_-40px_rgba(34,197,94,1)]",
    icon: "text-emerald-100 bg-emerald-300/15",
  },
};

export function AnimatedStatCard({
  label,
  value,
  icon,
  accent,
  delay = 0,
}: AnimatedStatCardProps) {
  const palette = accentMap[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      <Card
        className={cn(
          "border bg-white/[0.04] py-0 backdrop-blur-xl transition-all duration-300",
          palette.border,
          palette.glow,
        )}
      >
        <CardContent className="p-5">
          <div className="mb-3 flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl border border-white/15",
                palette.icon,
              )}
            >
              {icon}
            </div>
            <p className="text-sm font-semibold text-zinc-300">{label}</p>
          </div>
          <Counter value={value} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
