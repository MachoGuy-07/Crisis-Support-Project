"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { TopBar } from "@/components/dashboard/shared/TopBar";
import { VictimDashboard } from "@/components/dashboard/victim/VictimDashboard";
import { VolunteerDashboard } from "@/components/dashboard/volunteer/VolunteerDashboard";
import { clearSession, getUserEmail, getUserRole, setUserRole } from "@/lib/session";
import type { UserRole } from "@/types/crisis";

function toRole(value: string | string[] | undefined): UserRole | null {
  if (value === "victim") return "victim";
  if (value === "volunteer") return "volunteer";
  return null;
}

export default function RoleDashboardPage() {
  const params = useParams<{ role: string }>();
  const router = useRouter();
  const role = toRole(params?.role);

  const [email, setEmail] = useState<string | null>(null);
  const [volunteerMapOpen, setVolunteerMapOpen] = useState(false);

  useEffect(() => {
    if (!role) {
      router.replace("/role-select");
      return;
    }

    const storedEmail = getUserEmail();
    if (!storedEmail) {
      router.replace("/login");
      return;
    }
    // Hydration-safe: read browser storage only after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEmail(storedEmail);

    const storedRole = getUserRole();
    if (storedRole !== role) setUserRole(role);
  }, [role, router]);

  const signOut = () => {
    clearSession();
    router.replace("/login");
  };

  if (!role || !email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] text-zinc-200">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0f0f0f] pb-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(168,85,247,0.2),transparent_32%),radial-gradient(circle_at_86%_0%,rgba(251,146,60,0.2),transparent_28%),linear-gradient(125deg,#070707,#101010_52%,#060606)]" />
      <TopBar
        role={role}
        email={email}
        onSignOut={signOut}
        onMapOpen={role === "volunteer" ? () => setVolunteerMapOpen(true) : undefined}
      />
      <main className="relative z-10 mx-auto mt-6 w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {role === "victim" ? (
            <VictimDashboard email={email} />
          ) : (
            <VolunteerDashboard
              email={email}
              mapOpen={volunteerMapOpen}
              onMapOpenChange={setVolunteerMapOpen}
            />
          )}
        </motion.div>
      </main>
    </div>
  );
}
