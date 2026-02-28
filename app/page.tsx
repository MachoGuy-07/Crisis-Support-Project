import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ArrowRight, UsersRound } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#070707]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(244,114,182,0.2),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(251,146,60,0.18),transparent_33%),linear-gradient(125deg,#030303,#0d0d0d_50%,#050505)]" />
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:44px_44px]" />

      <header className="relative z-10 mx-auto flex w-full max-w-[1320px] items-center justify-between px-6 py-8">
        <Logo />
        <nav className="flex items-center gap-4">
          <Button
            variant="ghost"
            asChild
            className="hidden sm:inline-flex text-muted-foreground hover:text-foreground"
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button
            asChild
            className="rounded-xl bg-gradient-to-r from-rose-400 to-pink-300 text-zinc-900 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(251,113,133,0.45)]"
          >
            <Link href="/login">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-8 inline-flex items-center rounded-full border border-rose-200/25 bg-rose-300/10 px-4 py-1 text-sm font-medium text-rose-100">
          <span className="mr-2 flex h-2 w-2 rounded-full bg-rose-300 animate-pulse"></span>
          Live Crisis Updates
        </div>

        <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white md:text-7xl">
          Realtime Help in <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-rose-300 via-pink-200 to-orange-200 bg-clip-text text-transparent">
            Times of Need.
          </span>
        </h1>

        <p className="mb-10 max-w-2xl text-lg text-zinc-300 md:text-xl">
          Crisis Support connects victims and volunteers in one live command
          system with geospatial aid tracking, inventory monitoring, and
          realtime request handling.
        </p>

        <div className="flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-14 w-full rounded-xl bg-gradient-to-r from-rose-400 to-pink-300 px-8 text-base text-zinc-900 shadow-[0_0_45px_rgba(251,113,133,0.45)] transition-all duration-300 hover:scale-105 sm:w-auto"
          >
            <Link href="/register">
              Create an account <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-14 w-full rounded-xl border-white/20 bg-white/[0.03] px-8 text-base text-white transition-all duration-300 hover:bg-white/[0.08] sm:w-auto"
          >
            <Link href="/role-select">
              <UsersRound className="mr-2 h-5 w-5" />
              Choose Role
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
