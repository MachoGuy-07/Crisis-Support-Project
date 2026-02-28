"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { LogOut } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session && session.user?.email) {
        setUserEmail(session.user.email);
      }
      setIsLoading(false);
    };

    checkUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          {!isLoading && userEmail ? (
            <>
              <Link href="/account">
                <span className="text-sm font-medium text-muted-foreground inline-block bg-input/50 px-3 py-1.5 rounded-full border border-border">
                  {userEmail}
                </span>
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 rounded-xl transition-all"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : !isLoading && !userEmail ? (
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="border-border hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
              >
                Sign In
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
