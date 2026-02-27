import Link from "next/link";
import { HeartPulse } from "lucide-react";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 group transition-opacity hover:opacity-80"
      aria-label="Home"
    >
      <div className="bg-primary/20 p-2 rounded-xl text-primary">
        <HeartPulse className="w-5 h-5 fill-primary" />
      </div>
      <span className="text-xl font-bold tracking-tight text-foreground">
        Crisis Support
      </span>
    </Link>
  );
}
