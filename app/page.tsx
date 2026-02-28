import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/navbar";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden container mx-auto px-6">
      <header className="flex items-center justify-between py-8">
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
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_hsla(var(--primary)/20%)]"
          >
            <Link href="/register">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center text-center max-w-4xl mx-auto py-20 px-4 z-10 animate-fade-in relative">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8">
          <span className="flex h-2 w-2 rounded-full bg-secondary mr-2 animate-pulse"></span>
          Live Crisis Updates
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
          Realtime Help in <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary pb-2">
            Times of Need.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl text-balance">
          Crisis Support helps you give and receive real-time updates for food,
          water, shelter, and medical assistance when it matters most.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_40px_hsla(var(--primary)/30%)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_hsla(var(--primary)/40%)] rounded-xl text-base h-14 px-8"
          >
            <Link href="/register">
              Create an account <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-border text-foreground hover:bg-accent transition-all duration-300 rounded-xl text-base h-14 px-8"
          >
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
