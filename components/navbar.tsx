import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export default function Navbar() {
  return (
    <div>
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
    </div>
  );
}
