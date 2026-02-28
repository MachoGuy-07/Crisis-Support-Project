"use client";

import { motion } from "framer-motion";
import { LogOut, Map } from "lucide-react";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types/crisis";

interface TopBarProps {
  role: UserRole;
  email: string;
  onSignOut: () => void;
  onMapOpen?: () => void;
}

export function TopBar({ role, email, onSignOut, onMapOpen }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/45 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-zinc-300 sm:inline-flex">
            {email}
          </span>
          {role === "volunteer" && onMapOpen ? (
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Button
                type="button"
                variant="outline"
                onClick={onMapOpen}
                className="rounded-xl border-white/20 bg-white/[0.04] text-zinc-100 hover:bg-white/[0.12]"
              >
                <Map className="mr-2 h-4 w-4" />
                Request Map
              </Button>
            </motion.div>
          ) : null}
          <Button
            type="button"
            variant="outline"
            onClick={onSignOut}
            className="rounded-xl border-white/20 bg-white/[0.04] text-zinc-100 hover:bg-white/[0.12]"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
