"use client";

import Link from "next/link";
import { HeartPulse } from "lucide-react";
import { AuthForm } from "@/components/AuthForm";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";

const handleOAuthLogin = async (provider: "google" | "facebook" | "apple") => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("OAuth error:", error.message);
  }
};

export default function RegisterPage() {
  // const handleOAuthLogin = async (
  //   provider: "google" | "facebook" | "apple",
  // ) => {
  //   await supabase.auth.signInWithOAuth({
  //     provider,
  //     options: {
  //       redirectTo: `${window.location.origin}/dashboard`,
  //     },
  //   });
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mt-10 flex flex-col items-center mb-4">
          <div className="bg-primary/20 p-2 rounded-xl text-primary scale-115">
            <HeartPulse className="w-8 h-8 fill-primary" />
          </div>

          <div className="space-y-3 pb-6 text-center mt-4">
            <div className="text-2xl font-bold tracking-tight">
              <span className="text-muted-foreground">Create your</span>{" "}
              <span className="text-primary">Crisis Support</span>{" "}
              <span className="text-muted-foreground">account</span>{" "}
            </div>
            <p className="text-sm text-muted-foreground">
              Join us and get access to personalized support tools.
            </p>
          </div>
        </div>

        <Card className="border-border bg-card/40 backdrop-blur-xl shadow-2xl rounded-2xl">
          <CardContent>

            {/* Register Form */}
            <AuthForm view="register" />

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or sign up with
                </span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="flex flex-row gap-x-2 justify-center">
              
              {/* Google */}
              <button
                onClick={() => handleOAuthLogin("google")}
                className="w-full flex items-center justify-center gap-3 rounded-lg border border-border bg-background hover:bg-muted px-4 py-4 text-sm font-medium transition"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
              </button>

              {/* Facebook */}
              <button
                onClick={() => handleOAuthLogin("facebook")}
                className="w-full flex items-center justify-center gap-3 rounded-lg border border-border bg-background hover:bg-muted px-4 py-4 text-sm font-medium transition"
              >
                <img
                  src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                  alt="Facebook"
                  className="w-5 h-5"
                />
              </button>

              {/* Apple */}
              <button
                onClick={() => handleOAuthLogin("apple")}
                className="w-full flex items-center justify-center gap-3 rounded-lg border border-border bg-background hover:bg-muted px-4 py-4 text-sm font-medium transition"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                </svg>
              </button>
            </div>

            {/* Login Redirect */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium transition-colors"
              >
                Sign in
              </Link>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
