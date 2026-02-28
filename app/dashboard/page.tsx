"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { getUserEmail, getUserRole } from "@/lib/session";

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const email = getUserEmail();
    if (!email) {
      router.replace("/login");
      return;
    }

    const role = getUserRole();
    if (!role) {
      router.replace("/role-select");
      return;
    }

    router.replace(`/dashboard/${role}`);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#090909] text-zinc-300">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
