"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

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

  // ✅ NEW SERVICE STATES (only addition)
  const [services, setServices] = useState<string[]>([]);
  const [otherServiceDescription, setOtherServiceDescription] = useState("");

  const dummyRequests = [
    { id: 1, date: "2026-02-20", request: "Food Assistance", status: "Resolved" },
    { id: 2, date: "2026-02-18", request: "Medical Help", status: "Pending" },
    { id: 3, date: "2026-02-15", request: "Shelter Request", status: "Accepted" },
    { id: 4, date: "2026-02-12", request: "Water Supply", status: "Resolved" },
    { id: 5, date: "2026-02-10", request: "Transportation Support", status: "Pending" },
    { id: 6, date: "2026-02-07", request: "Medical Supplies", status: "Accepted" },
    { id: 7, date: "2026-02-05", request: "Emergency Evacuation", status: "Resolved" },
  ];

  const accountTabs: Record<string, string> = {
  user: "User",
  settings: "Settings",
  requests: "Requests",
};

  // 🔐 Check session
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
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );

            const data = await response.json();

            if (data && data.address) {
              const {
                road,
                suburb,
                city,
                town,
                village,
                state,
                country,
              } = data.address;

              const formattedAddress = `
                ${road || ""}
                ${suburb ? ", " + suburb : ""}
                ${city || town || village ? " " + (city || town || village) : ""}
                ${state ? " " + state : ""}
                ${country ? " " + country : ""}
              `.trim();

              setAddress(formattedAddress);
              setLocation({ lat, lng });

              alert("Home location set successfully 📍");
            } else {
              alert("Could not retrieve address.");
            }
          } catch (error) {
            console.error("Reverse geocoding failed:", error);
            alert("Error retrieving address.");
          }

          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Location permission denied or unavailable.");
          setIsGettingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 20000 }
      );
    } else {
      alert("Geolocation not supported by browser.");
      setIsGettingLocation(false);
    }
  };

  const handleSaveProfile = async () => {
    await supabase.auth.updateUser({
      data: {
        phone,
        address,
        homeLocation: location,
      },
    });

    alert("Profile updated ✅");
  };

  const handleSaveSettings = async () => {
    await supabase.auth.updateUser({
      data: {
        radius,
        smsEnabled,
        emailEnabled,
      },
    });

    alert("Settings updated ✅");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">

      {/* Sidebar */}
      <div className="w-64 bg-zinc-900 p-6 border-r border-zinc-800 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-6">Account</h2>

          {Object.entries(accountTabs).map(([key, label]) => (
  <button
    key={key}
    onClick={() => setActiveTab(key)}
    className={`block w-full text-left mb-3 p-3 rounded-lg transition ${
      activeTab === key
        ? "bg-gradient-to-r from-pink-500 to-purple-600"
        : "hover:bg-zinc-800"
    }`}
  >
    {label}
  </button>
))}
        </div>

        <div className="pt-6 border-t border-zinc-700">
          <button
            onClick={handleLogout}
            className="w-full text-left p-3 rounded-lg bg-red-600 hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">

        {activeTab === "user" && (
          <div>
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              User Details
            </h1>

            <div className="mb-6">
              <label>Email</label>
              <input
                disabled
                value={userEmail || ""}
                className="w-full p-3 bg-zinc-800 rounded-lg mt-2"
              />
            </div>

            <div className="mb-6">
              <label>Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 bg-zinc-800 rounded-lg mt-2"
              />
            </div>

            <div className="mb-4">
              <label>Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 bg-zinc-800 rounded-lg mt-2"
              />
            </div>

            <div className="mb-6">
              <button
                onClick={getLocation}
                className="bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-2 rounded-lg"
              >
                {isGettingLocation ? "Getting Location..." : "Set Current Location as Home"}
              </button>

              {location && (
                <div className="text-sm text-zinc-400 mt-3">
                  Saved Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </div>
              )}
            </div>

            <button
              onClick={handleSaveProfile}
              className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 rounded-lg"
            >
              Save Profile
            </button>
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Settings
            </h1>

            <div className="mb-6 space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={smsEnabled}
                  onChange={() => setSmsEnabled(!smsEnabled)}
                  className="accent-pink-500"
                />
                Enable SMS Notifications
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={emailEnabled}
                  onChange={() => setEmailEnabled(!emailEnabled)}
                  className="accent-pink-500"
                />
                Enable Email Notifications
              </label>
            </div>

            <div className="mb-8">
              <label className="block mb-2 font-medium">
                Preferred Radius: <span className="text-pink-400">{radius} km</span>
              </label>

              <input
                type="range"
                min="1"
                max="50"
                step="5"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full accent-pink-500"
              />

              <div className="flex justify-between text-xs text-zinc-400 mt-2">
                <span>1</span>
                <span>10</span>
                <span>20</span>
                <span>30</span>
                <span>40</span>
                <span>50 km</span>
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 rounded-lg"
            >
              Save Settings
            </button>
          </div>
        )}

        {/* ✅ REQUESTS TAB */}
        {activeTab === "requests" && (
          <div>
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Request History
            </h1>

            <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
              <div className="grid grid-cols-3 bg-zinc-800 p-4 font-semibold text-sm">
                <div>Date</div>
                <div>Request</div>
                <div>Status</div>
              </div>

              {dummyRequests.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-3 p-4 border-t border-zinc-800 text-sm"
                >
                  <div>{item.date}</div>
                  <div>{item.request}</div>
                  <div
                    className={`font-medium ${
                      item.status === "Resolved"
                        ? "text-green-400"
                        : item.status === "Pending"
                        ? "text-yellow-400"
                        : "text-blue-400"
                    }`}
                  >
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
