import Link from "next/link";
import { Logo } from "@/components/Logo";
import { AuthForm } from "@/components/AuthForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background relative z-0">
      <div className="hidden lg:flex relative bg-zinc-900 border-r border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 via-background to-primary/20 opacity-30" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30 grayscale" />
        <div className="relative z-10 flex flex-col justify-end p-12 mt-auto w-full">
          <blockquote className="space-y-2 max-w-lg mb-8">
            <p className="text-lg font-medium text-white/90">
              “Join the creative vanguard. Start building secure, scalable
              projects faster than ever before.”
            </p>
            <footer className="text-sm text-white/60">David Chang, CTO</footer>
          </blockquote>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center px-4 py-12 relative animate-fade-in z-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 pl-1">
            <Logo />
          </div>
          <Card className="border-border bg-card/40 backdrop-blur-xl shadow-2xl rounded-2xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Create an account
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your details below to activate your new account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuthForm view="register" />
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-secondary hover:text-secondary-foreground hover:underline font-medium transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
