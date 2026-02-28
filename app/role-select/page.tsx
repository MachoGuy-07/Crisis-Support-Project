"use client";

import { motion } from "framer-motion";
import { HandHeart, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { RoleSelectorCircle } from "@/components/dashboard/RoleSelectorCircle";
import { Button } from "@/components/ui/button";
import { clearSession, getUserEmail, setUserRole } from "@/lib/session";

export default function RoleSelectPage() {
  const router = useRouter();
  const [email] = useState(() => getUserEmail() ?? "");

  useEffect(() => {
    if (!email) {
      router.replace("/login");
    }
  }, [email, router]);

  const handleRoleChoose = (role: "victim" | "volunteer") => {
    setUserRole(role);
    router.push(`/dashboard/${role}`);
  };

  const handleSignOut = () => {
    clearSession();
    router.replace("/login");
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#080808] px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(244,114,182,0.22),transparent_34%),radial-gradient(circle_at_85%_2%,rgba(251,146,60,0.2),transparent_33%),linear-gradient(120deg,#030303,#0c0c0c_50%,#050505)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:42px_42px]" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-5xl rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_40px_120px_-50px_rgba(0,0,0,0.95)] backdrop-blur-2xl sm:p-10"
      >
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            Choose Your Role
          </h1>
          <p className="mt-3 text-zinc-400">
            Signed in as <span className="font-semibold text-zinc-200">{email}</span>.
            Pick your mode to continue.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:gap-12">
          <RoleSelectorCircle
            title="Victim"
            subtitle="Request aid, track NGO resources, and monitor nearby support."
            icon={<ShieldAlert className="h-7 w-7" />}
            accent="victim"
            onClick={() => handleRoleChoose("victim")}
          />
          <RoleSelectorCircle
            title="Volunteer"
            subtitle="Respond to active requests, handle tasks, and coordinate relief."
            icon={<HandHeart className="h-7 w-7" />}
            accent="volunteer"
            onClick={() => handleRoleChoose("volunteer")}
          />
        </div>

        <div className="mt-10 text-center">
          <Button
            type="button"
            variant="outline"
            onClick={handleSignOut}
            className="rounded-xl border-white/20 bg-white/[0.03] text-zinc-200 hover:bg-white/[0.08]"
          >
            Sign Out
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
