"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, AlertCircle } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type AuthValues = z.infer<typeof authSchema>;

interface AuthFormProps {
  view: "login" | "register";
}

export function AuthForm({ view }: AuthFormProps) {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AuthValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: AuthValues) => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const { email, password } = values;

    try {
      if (view === "register") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccessMsg("Registration successful! Redirecting to dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1000);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setSuccessMsg("Successfully logged in! Redirecting...");
        // Usually, wait a second and push to dashboard
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1000);
      }
    } catch (error: any) {
      setErrorMsg(
        error.message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const buttonText = view === "register" ? "Create account" : "Sign in";

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center gap-3 text-secondary text-sm">
              <div className="w-2 h-2 rounded-full bg-secondary shrink-0" />
              {successMsg}
            </div>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    className="bg-input/50 border-border focus-visible:ring-primary h-12 rounded-xl transition-all"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between text-muted-foreground">
                  Password
                  {view === "login" && (
                    <span className="text-xs text-primary hover:underline cursor-pointer">
                      Forgot password?
                    </span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="bg-input/50 border-border focus-visible:ring-primary h-12 rounded-xl transition-all"
                    autoComplete={
                      view === "login" ? "current-password" : "new-password"
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-medium mt-6 shadow-[0_0_20px_hsla(var(--primary)/15%)]"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {buttonText}
          </Button>
        </form>
      </Form>
    </div>
  );
}
