"use client";

import { motion, useMotionValueEvent, useSpring } from "framer-motion";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Cross,
  Droplets,
  Home,
  Loader2,
  MapPin,
  PackageOpen,
  Search,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { AnimatedStatCard } from "@/components/dashboard/shared/AnimatedStatCard";
import { VictimLeafletMap } from "@/components/maps/VictimLeafletMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDataContext } from "@/context/DataContext";
import { FALLBACK_LOCATION } from "@/mockData/crisisData";
import type { NGO } from "@/types/crisis";
import { distanceInKm, isWithinRadius } from "@/utils/geo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";
interface VictimDashboardProps {
  email: string;
}

export function VictimDashboard({ email }: VictimDashboardProps) {
  const { ngos, requests, placeOrder, userLocation } = useDataContext();
  const center = userLocation ?? FALLBACK_LOCATION;

  const [radiusKm, setRadiusKm] = useState(25);
  const [searchText, setSearchText] = useState("");
  const [scanActive, setScanActive] = useState(false);
  const [pulseScale, setPulseScale] = useState(1.08);
  const [statusMessage, setStatusMessage] = useState("");
  const scanTimeoutRef = useRef<number | null>(null);

  const radiusSpring = useSpring(radiusKm, {
    stiffness: 95,
    damping: 20,
    mass: 0.92,
  });
  const [animatedRadiusKm, setAnimatedRadiusKm] = useState(radiusKm);
  // Form state
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportType, setReportType] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    radiusSpring.set(radiusKm);
  }, [radiusKm, radiusSpring]);

  useMotionValueEvent(radiusSpring, "change", (latest) => {
    setAnimatedRadiusKm(Math.max(1, Number(latest.toFixed(2))));
  });

  useEffect(
    () => () => {
      if (scanTimeoutRef.current) window.clearTimeout(scanTimeoutRef.current);
    },
    [],
  );

  useEffect(() => {
    const triggerPulse = () => {
      setPulseScale(1.01);
      window.setTimeout(() => setPulseScale(1.16), 220);
      window.setTimeout(() => setPulseScale(1.01), 1600);
    };
    triggerPulse();
    const intervalId = window.setInterval(triggerPulse, 3000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!statusMessage) return undefined;
    const timeoutId = window.setTimeout(() => setStatusMessage(""), 2400);
    return () => window.clearTimeout(timeoutId);
  }, [statusMessage]);

  const filteredNgos = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return ngos.filter((ngo) => {
      const withinRadius = isWithinRadius(
        center,
        ngo.location,
        animatedRadiusKm,
      );
      if (!withinRadius) return false;
      if (!query) return true;
      return (
        ngo.name.toLowerCase().includes(query) ||
        ngo.description.toLowerCase().includes(query)
      );
    });
  }, [animatedRadiusKm, center, ngos, searchText]);

  const stats = useMemo(() => {
    return filteredNgos.reduce(
      (accumulator, ngo) => ({
        food: accumulator.food + ngo.supplies.food,
        medical: accumulator.medical + ngo.supplies.medical,
        shelter: accumulator.shelter + ngo.supplies.shelter,
      }),
      { food: 0, medical: 0, shelter: 0 },
    );
  }, [filteredNgos]);

  const volunteersReady = useMemo(
    () => requests.filter((request) => request.status === "open").length + 18,
    [requests],
  );

  const handleOrder = (ngo: NGO) => {
    setStatusMessage(`${ngo.name} supply updated successfully.`);
  };

  const handleRadiusChange = (nextRadius: number) => {
    if (nextRadius > radiusKm) {
      setScanActive(true);
      if (scanTimeoutRef.current) {
        window.clearTimeout(scanTimeoutRef.current);
      }
      scanTimeoutRef.current = window.setTimeout(
        () => setScanActive(false),
        900,
      );
    }
    setRadiusKm(nextRadius);
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
        number_of_people: numberOfPeople,
        location: locationWKT,
      });

      if (error) throw error;

      alert("Crisis reported successfully. Help is on the way.");
      setIsReportOpen(false);
      setReportType("");
      setReportDescription("");
      setNumberOfPeople(1);
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

  return (
    <div className="space-y-5">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[260px_1fr_auto]">
          <div className="rounded-2xl border border-white/10 bg-black/35 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Radius
            </p>
            <input
              type="range"
              min={1}
              max={65}
              value={radiusKm}
              onChange={(event) =>
                handleRadiusChange(Number(event.target.value))
              }
              className="w-full accent-rose-300"
            />
            <p className="mt-2 text-sm font-semibold text-zinc-200">
              {radiusKm} km
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/35 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Search NGOs
            </p>
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-black/45 px-3">
              <Search className="h-4 w-4 text-zinc-500" />
              <Input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search support centers..."
                className="h-10 border-0 bg-transparent px-0 focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Report Crisis Button rendering as a distinct block in the grid */}
          <div className="rounded-2xl border border-white/10 bg-black/35 p-3 flex flex-col justify-center">
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
                    Provide details about the situation and your current
                    location to request assistance.
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
                        <SelectItem value="medical">
                          Medical Emergency
                        </SelectItem>
                        <SelectItem value="food">
                          Food/Water Shortage
                        </SelectItem>
                        <SelectItem value="shelter">Need Shelter</SelectItem>
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
                    <Label htmlFor="peopleCount">
                      Number of People Affected
                    </Label>
                    <Input
                      id="peopleCount"
                      type="number"
                      min="1"
                      value={numberOfPeople}
                      onChange={(e) =>
                        setNumberOfPeople(parseInt(e.target.value) || 1)
                      }
                      required
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
        </div>
      </motion.section>

      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl sm:p-4">
        <VictimLeafletMap
          userLocation={center}
          ngos={filteredNgos}
          radiusKm={animatedRadiusKm}
          pulseScale={pulseScale}
          email={email}
          onPlaceOrder={(payload) => {
            const result = placeOrder(payload);
            if (result.ok) {
              const updatedNgo = ngos.find((ngo) => ngo.id === payload.ngoId);
              if (updatedNgo) handleOrder(updatedNgo);
            } else {
              setStatusMessage(result.message);
            }
            return result;
          }}
        />
        {scanActive ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-7 top-7 rounded-xl border border-white/20 bg-black/70 px-3 py-2 text-xs text-zinc-100"
          >
            <Loader2 className="mr-2 inline h-3.5 w-3.5 animate-spin" />
            Searching in {radiusKm} km...
          </motion.div>
        ) : null}
      </section>

      {statusMessage ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-emerald-300/35 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100"
        >
          {statusMessage}
        </motion.div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AnimatedStatCard
          label="Food Supplies"
          value={stats.food}
          icon={<Droplets className="h-5 w-5" />}
          accent="pink"
        />
        <AnimatedStatCard
          label="Medical Supplies"
          value={stats.medical}
          icon={<Cross className="h-5 w-5" />}
          accent="orange"
          delay={0.06}
        />
        <AnimatedStatCard
          label="Shelter Availability"
          value={stats.shelter}
          icon={<Home className="h-5 w-5" />}
          accent="green"
          delay={0.12}
        />
        <AnimatedStatCard
          label="Volunteers Ready"
          value={volunteersReady}
          icon={<Users className="h-5 w-5" />}
          accent="orange"
          delay={0.18}
        />
      </section>

      <section className="space-y-3">
        <h3 className="text-2xl font-bold text-white">Supply Monitoring</h3>
        <p className="text-sm text-zinc-400">
          Showing {filteredNgos.length} relief centers within {radiusKm} km.
          Using a fixed inventory snapshot for Hyderabad and Secunderabad.
        </p>
        <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
          {filteredNgos.map((ngo, index) => (
            <motion.div
              key={ngo.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="mb-4 break-inside-avoid"
            >
              <Card className="h-full border-white/12 bg-gradient-to-br from-[#0f0f12] to-[#0a0a0d] py-0 backdrop-blur-xl">
                <CardHeader className="space-y-3 px-6 pb-3 pt-6">
                  <CardTitle className="flex items-start justify-between gap-3 text-white">
                    <span className="flex min-w-0 items-start gap-3">
                      <Building2 className="mt-1 h-6 w-6 shrink-0 text-zinc-200" />
                      <span className="min-w-0 break-words text-2xl font-semibold leading-tight text-white">
                        {ngo.name}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs font-medium text-zinc-300">
                      {ngo.description.includes("Secunderabad")
                        ? "Secunderabad"
                        : "Hyderabad"}
                    </span>
                  </CardTitle>
                  <p className="pr-1 text-lg leading-relaxed text-zinc-400">
                    {ngo.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 px-6 pb-6">
                  <div className="grid grid-cols-1 gap-2 text-base sm:grid-cols-3">
                    <div className="rounded-lg border border-rose-300/30 bg-rose-500/12 px-4 py-2.5 text-rose-100">
                      Food:{" "}
                      <span className="font-semibold">{ngo.supplies.food}</span>
                    </div>
                    <div className="rounded-lg border border-emerald-300/30 bg-emerald-500/12 px-4 py-2.5 text-emerald-100">
                      Medical:{" "}
                      <span className="font-semibold">
                        {ngo.supplies.medical}
                      </span>
                    </div>
                    <div className="rounded-lg border border-sky-300/30 bg-sky-500/12 px-4 py-2.5 text-sky-100">
                      Shelter:{" "}
                      <span className="font-semibold">
                        {ngo.supplies.shelter}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-zinc-400">
                    Distance: {distanceInKm(center, ngo.location).toFixed(1)} km
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        {filteredNgos.length === 0 ? (
          <div className="rounded-2xl border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            <AlertTriangle className="mr-2 inline h-4 w-4" />
            No NGOs match this radius and search.
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-rose-300/20 bg-rose-500/5 p-4 text-sm text-zinc-300">
        <PackageOpen className="mr-2 inline h-4 w-4 text-rose-200" />
        Click any NGO marker on the map to select supply type, enter quantity,
        and place an order instantly.
      </section>
    </div>
  );
}
