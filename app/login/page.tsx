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

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background relative z-0">
      <div className="flex flex-col justify-center items-center px-4 py-12 relative animate-fade-in z-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 pl-1">
            <Logo />
          </div>
          <Card className="border-border bg-card/40 backdrop-blur-xl shadow-2xl rounded-2xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Welcome back
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your credentials to sign in to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuthForm view="login" />
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary hover:underline font-medium transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="hidden lg:flex relative bg-zinc-900 border-l border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 opacity-30" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30 grayscale" />
        <div className="relative z-10 flex flex-col justify-end p-12 mt-auto w-full">
          <blockquote className="space-y-2 max-w-lg mb-8">
            <p className="text-lg font-medium text-white/90">
              “Building the future requires a seamless integration of beautiful
              aesthetics and uncompromising utility.”
            </p>
            <footer className="text-sm text-white/60">
              Sofia Anderson, Lead Architect
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
