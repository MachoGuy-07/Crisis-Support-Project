"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  AlertTriangle,
  LogOut,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportType, setReportType] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setUserEmail(session.user.email ?? "");
        setIsLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const getLocation = () => {
    setIsGettingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          let errorMessage =
            "Could not get your location. Please ensure location permissions are granted.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location request denied by user. Please enable location permissions in your browser.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "The request to get user location timed out.";
              break;
          }
          alert(errorMessage);
          setIsGettingLocation(false);
        },
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 },
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsGettingLocation(false);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportType || !reportDescription || !location) {
      alert("Please fill in all fields and get your location.");
      return;
    }

    setIsSubmitting(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("You must be logged in to report a crisis.");
        return;
      }

      const locationWKT = `POINT(${location.lng} ${location.lat})`;

      const { error } = await supabase.from("requests").insert({
        user_id: session.user.id,
        type: reportType,
        description: reportDescription,
        location: locationWKT,
      });

      if (error) throw error;

      alert("Crisis reported successfully. Help is on the way.");
      setIsReportOpen(false);
      setReportType("");
      setReportDescription("");
      setLocation(null);
    } catch (error: unknown) {
      console.error("Error submitting report:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit report.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col animate-fade-in relative overflow-hidden">
      {/* Background ambient light effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block bg-input/50 px-3 py-1.5 rounded-full border border-border">
              {userEmail}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 rounded-xl transition-all"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-10 z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1 text-balance">
              Welcome to the Command Center
            </h1>
            <p className="text-muted-foreground">
              Monitor and report critical situations in real-time.
            </p>
          </div>
          <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_hsla(var(--primary)/25%)] hover:shadow-[0_0_30px_hsla(var(--primary)/35%)] rounded-xl transition-all hover:-translate-y-0.5">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Report Crisis
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Report a Crisis</DialogTitle>
                <DialogDescription>
                  Provide details about the situation and your current location
                  to request assistance.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitReport} className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Crisis Type</Label>
                  <Select
                    value={reportType}
                    onValueChange={setReportType}
                    required
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select crisis type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medical">Medical Emergency</SelectItem>
                      <SelectItem value="food">Food/Water Shortage</SelectItem>
                      <SelectItem value="shelter">Need Shelter</SelectItem>
                      <SelectItem value="rescue">Evacuation/Rescue</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the situation, number of people involved, and specific needs..."
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    required
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Location</Label>
                  {location ? (
                    <div className="flex items-center gap-2 text-sm text-green-500 bg-green-500/10 p-3 rounded-md border border-green-500/20">
                      <CheckCircle2 className="h-4 w-4" />
                      Location acquired ({location.lat.toFixed(4)},{" "}
                      {location.lng.toFixed(4)})
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={getLocation}
                      disabled={isGettingLocation}
                      className="w-full"
                    >
                      {isGettingLocation ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Acquiring Location...
                        </>
                      ) : (
                        <>
                          <MapPin className="mr-2 h-4 w-4" />
                          Get Current Location
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full mt-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Report...
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {/* Mock content for the dashboard */}
          <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6 shadow-sm hover:border-accent/40 hover:bg-card transition-all duration-300 group">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 group-hover:text-accent transition-colors">
              <span className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_8px_hsla(var(--accent)/60%)] animate-pulse" />
              Active Shelters
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Realtime capacity updates for registered shelters in your area.
            </p>
            <div className="text-4xl font-extrabold text-foreground">12</div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6 shadow-sm hover:border-primary/40 hover:bg-card transition-all duration-300 group">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 group-hover:text-primary transition-colors">
              <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_hsla(var(--primary)/60%)] animate-pulse" />
              Food & Water Drops
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Recent distribution points and supply levels.
            </p>
            <div className="text-4xl font-extrabold text-foreground">8</div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6 shadow-sm hover:border-secondary/40 hover:bg-card transition-all duration-300 group">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 group-hover:text-secondary transition-colors">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_8px_hsla(var(--secondary)/60%)] animate-pulse" />
              Medical Assistance
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Available first aid centers and medical personnel.
            </p>
            <div className="text-4xl font-extrabold text-foreground">5</div>
          </div>
        </div>
      </main>
    </div>
  );
}
