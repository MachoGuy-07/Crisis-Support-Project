"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Icon components for a more professional look
const UserIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);
const SettingsIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
const RequestIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("user");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [radius, setRadius] = useState(10);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [requestHistory, setRequestHistory] = useState<any[]>([]);

  const tabs = [
    { id: "user", label: "User", icon: <UserIcon /> },
    { id: "settings", label: "Settings", icon: <SettingsIcon /> },
    { id: "requests", label: "Requests", icon: <RequestIcon /> },
  ];

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUserEmail(session.user.email ?? null);
        const meta = session.user.user_metadata;
        setPhone(meta?.phone || "");
        setAddress(meta?.address || "");
        setRadius(meta?.radius || 10);
        setSmsEnabled(meta?.smsEnabled || false);
        setEmailEnabled(meta?.emailEnabled || false);
        setLocation(meta?.homeLocation || null);

        // Fetch actual request history from Supabase
        const { data: requests, error } = await supabase
          .from("requests")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (requests && !error) {
          // Format the data to match the UI expectations, mapped strictly to your DB columns
          const formattedRequests = requests.map((req: any) => ({
            id: req.id,
            type: req.type || "Service",
            description: req.description || "No description provided.",
            date: req.created_at
              ? new Date(req.created_at).toLocaleDateString()
              : "Recent",
            status: req.status || "open",
          }));
          setRequestHistory(formattedRequests);
        }
      } else {
        router.push("/login");
      }
      setIsLoading(false);
    };
    checkUser();
  }, [router]);

  const getLocation = () => {
    setIsGettingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            );
            const data = await response.json();
            if (data?.address) {
              const formatted =
                `${data.address.road || ""}, ${data.address.suburb || ""}, ${data.address.city || data.address.town || ""}, ${data.address.state || ""}, ${data.address.country || ""}`
                  .replace(/, ,/g, ",")
                  .trim();
              setAddress(formatted);
              setLocation({ lat, lng });
            }
          } catch (e) {
            console.error(e);
          }
          setIsGettingLocation(false);
        },
        () => setIsGettingLocation(false),
        { enableHighAccuracy: true },
      );
    }
  };

  const handleSaveProfile = async () => {
    await supabase.auth.updateUser({
      data: { phone, address, homeLocation: location },
    });
    alert("Profile updated ✅");
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-[#121212] border-r border-zinc-800 flex flex-col p-6">
        <div className="flex-1">
          <h2 className="text-sm font-bold tracking-widest text-zinc-500 uppercase mb-8 px-2">
            Account
          </h2>
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-pink-500/10 to-purple-600/10 text-pink-500 border border-pink-500/20 shadow-[0_0_20px_rgba(236,72,153,0.1)]"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <button
          onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
          className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 max-w-5xl">
        <div className="bg-[#161616] rounded-3xl border border-zinc-800 p-10 shadow-2xl">
          {activeTab === "user" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-bold mb-8 text-white">
                User Details
              </h1>

              <div className="space-y-6">
                <div className="group">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">
                    Email Address
                  </label>
                  <input
                    disabled
                    value={userEmail || ""}
                    className="w-full p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-zinc-500 cursor-not-allowed"
                  />
                </div>

                <div className="group">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block ml-1">
                    Phone Number
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full p-4 bg-[#1A1A1A] border border-zinc-800 rounded-2xl focus:border-pink-500 outline-none transition-all text-white"
                  />
                </div>

                <div className="group">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block ml-1">
                    Residential Address
                  </label>
                  <div className="relative">
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street, City, State, Country"
                      className="w-full p-4 bg-[#1A1A1A] border border-zinc-800 rounded-2xl focus:border-pink-500 outline-none transition-all text-white mb-4"
                    />
                    <button
                      onClick={getLocation}
                      className="text-xs font-medium text-pink-500 hover:text-pink-400 transition-colors flex items-center gap-2 ml-1"
                    >
                      <span className="text-base">📍</span>{" "}
                      {isGettingLocation
                        ? "Fetching..."
                        : "Use current location"}
                    </button>
                  </div>
                </div>

                {location && (
                  <div className="p-3 bg-zinc-900 rounded-xl inline-block border border-zinc-800 text-[10px] font-mono text-zinc-500">
                    COORDS: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </div>
                )}

                <div className="pt-6 border-t border-zinc-800 mt-8">
                  <button
                    onClick={handleSaveProfile}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-white shadow-[0_10px_30px_rgba(236,72,153,0.3)] hover:scale-[1.01] active:scale-95 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-bold mb-8 text-white">Settings</h1>
              <div className="space-y-8">
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 space-y-4">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-zinc-300 font-medium">
                      SMS Notifications
                    </span>
                    <input
                      type="checkbox"
                      checked={smsEnabled}
                      onChange={() => setSmsEnabled(!smsEnabled)}
                      className="w-5 h-5 accent-pink-500"
                    />
                  </label>
                  <div className="h-px bg-zinc-800 w-full" />
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-zinc-300 font-medium">
                      Email Alerts
                    </span>
                    <input
                      type="checkbox"
                      checked={emailEnabled}
                      onChange={() => setEmailEnabled(!emailEnabled)}
                      className="w-5 h-5 accent-pink-500"
                    />
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
                      Search Radius
                    </label>
                    <span className="text-pink-500 font-bold text-lg">
                      {radius} km
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                </div>

                <button
                  onClick={() => alert("Settings Saved")}
                  className="w-full py-4 rounded-2xl bg-zinc-100 text-black font-bold hover:bg-white transition-all"
                >
                  Update Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === "requests" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-bold mb-8 text-white">History</h1>
              <div className="space-y-3">
                {requestHistory.length === 0 ? (
                  <div className="text-center p-8 bg-zinc-900/50 rounded-2xl border border-zinc-800 text-zinc-500">
                    No requests found.
                  </div>
                ) : (
                  requestHistory.map((req) => (
                    <div
                      key={req.id}
                      className="bg-[#1A1A1A] p-5 rounded-2xl border border-zinc-800 flex justify-between items-center group hover:border-zinc-700 transition-all"
                    >
                      <div>
                        {/* Render the 'type' (e.g., rescue, food) with capitalization */}
                        <h4 className="font-semibold text-zinc-100 mb-1 capitalize text-lg">
                          {req.type}
                        </h4>
                        {/* Render the 'description' */}
                        <p className="text-sm text-zinc-400 mb-2">
                          {req.description}
                        </p>
                        <p className="text-[10px] text-zinc-600 font-mono">
                          {req.date}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          req.status?.toLowerCase() === "resolved"
                            ? "bg-green-500/10 text-green-500 border border-green-500/20"
                            : req.status?.toLowerCase() === "open"
                              ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                              : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
