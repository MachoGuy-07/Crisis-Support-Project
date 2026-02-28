"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { clearUserRole, getUserEmail, getUserRole, setUserEmail } from "@/lib/session";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(() => getUserEmail() ?? "");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedEmail = getUserEmail();
    const storedRole = getUserRole();
    if (storedEmail && storedRole) {
      router.replace(`/dashboard/${storedRole}`);
    }
  }, [router]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError("Enter a valid email to continue.");
      return;
    }

    setUserEmail(normalizedEmail);
    clearUserRole();
    router.push("/role-select");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070707] px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(244,114,182,0.2),transparent_40%),radial-gradient(circle_at_85%_0%,rgba(251,146,60,0.18),transparent_30%),linear-gradient(135deg,#020202,#0d0d0d_50%,#030303)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:44px_44px]" />

      <motion.main
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xl rounded-3xl border border-white/15 bg-white/[0.045] p-6 shadow-[0_40px_120px_-50px_rgba(0,0,0,0.95)] backdrop-blur-3xl sm:p-8"
      >
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black tracking-tight text-white">
            Enter Command Center
          </h1>
          <p className="mt-3 text-zinc-400">
            Quick login with email only. You&apos;ll choose Victim or Volunteer on
            the next screen.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-zinc-300">
              Email
            </span>
            <div className="flex h-14 items-center gap-3 rounded-2xl border border-white/15 bg-black/40 px-4">
              <Mail className="h-4 w-4 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                className="h-full w-full bg-transparent text-base text-white outline-none placeholder:text-zinc-500"
                autoComplete="email"
              />
            </div>
          </label>

          {error ? (
            <p className="rounded-xl border border-rose-300/35 bg-rose-400/10 px-4 py-2 text-sm text-rose-100">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            className="h-14 w-full rounded-2xl bg-gradient-to-r from-rose-400 to-pink-300 text-base font-bold text-zinc-900 hover:shadow-[0_0_45px_rgba(251,113,133,0.45)]"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </motion.main>
    </div>
  );
}
