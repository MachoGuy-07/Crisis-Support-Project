import React from "react";
import {
  Heart,
  LogOut,
  Search,
  SlidersHorizontal,
  ChevronUp,
  LocateFixed,
  Package,
  PlusSquare,
  Home,
  Users,
  MapPin,
} from "lucide-react";

export default function VictimPage() {
  return (
    <div className="min-h-screen bg-[#0E0E11] text-white p-6 md:px-10 lg:px-16 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between pb-6 mb-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-pink-500/20 p-2 rounded-xl">
            <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
          </div>
          <h1 className="text-xl font-semibold tracking-wide">
            Crisis Support
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-white/5 rounded-full px-4 py-2 border border-white/10">
            <span className="text-sm text-gray-400">viswa567go@gmail.com</span>
          </div>
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 transition rounded-full px-4 py-2 border border-white/10 text-sm font-medium">
            <LogOut className="w-4 h-4 text-gray-400" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        {/* Radius Filter */}
        <div className="flex items-center bg-[#18181B] rounded-2xl px-5 py-3 border border-white/5 w-full md:w-auto">
          <span className="text-sm text-gray-400 mr-4">Radius</span>
          {/* Custom Slider Mockup */}
          <div className="flex-1 w-32 relative flex items-center mr-4">
            <div className="h-1 w-full bg-white/10 rounded-full relative">
              <div className="absolute top-0 left-0 h-1 bg-white rounded-full w-[40%]"></div>
            </div>
            <div className="absolute left-[40%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-[3px] border-[#18181B] cursor-pointer"></div>
          </div>
          <span className="text-sm font-medium">10 km ▾</span>
        </div>

        {/* Search */}
        <div className="flex flex-1 items-center bg-[#18181B] rounded-2xl px-5 py-3 border border-white/5 w-full">
          <Search className="w-5 h-5 text-gray-500 mr-3" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-500"
          />
        </div>

        {/* Action Buttons */}
        <button className="bg-[#18181B] p-3 rounded-2xl border border-white/5 hover:bg-white/5 transition flex-shrink-0">
          <SlidersHorizontal className="w-5 h-5 text-gray-300" />
        </button>
        <button className="bg-pink-400 hover:bg-pink-500 text-black px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition flex-shrink-0">
          <ChevronUp className="w-5 h-5" />
          Ask for Help
        </button>
      </div>

      {/* Map Section */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-pink-500/20 p-2 rounded-xl">
            <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
          </div>
          <h2 className="text-2xl font-semibold tracking-wide flex items-center gap-2">
            NGO Support Locations{" "}
            <span className="text-gray-500 text-xl font-normal">(Live)</span>
          </h2>
        </div>
        <p className="text-gray-400 text-sm mb-6 ml-[3.25rem]">
          Currently active NGOs providing crisis aid in the selected area.
        </p>

        {/* Map Placeholder Container */}
        <div className="relative w-full h-[400px] md:h-[450px] bg-[#101014] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
          {/* Simulated Dark Map Background using CSS gradients and noise */}
          <div
            className="absolute inset-0 opacity-40 bg-[url('https://api.maptiler.com/maps/dataviz-dark/256/0/0/0.png')] bg-repeat"
            style={{
              backgroundImage:
                "radial-gradient(circle at center, #2A2A35 0%, #101014 100%)",
            }}
          >
            {/* Street/Grid Lines Mockup */}
            <div
              className="w-full h-full opacity-10"
              style={{
                backgroundImage:
                  "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            ></div>
          </div>

          {/* Radar Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[450px] md:h-[450px] border border-yellow-500/40 rounded-full animate-pulse z-0 bg-yellow-500/5"></div>

          {/* Map Markers (Mocked Positions) */}
          <div className="absolute top-[30%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative group cursor-pointer">
              <MapPin className="w-10 h-10 text-red-500 fill-red-500" />
              <div className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[70%]">
                <Package className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          <div className="absolute top-[40%] left-[60%] -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative group cursor-pointer">
              <MapPin className="w-10 h-10 text-green-500 fill-green-500" />
              <div className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[70%]">
                <PlusSquare className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          <div className="absolute top-[25%] left-[65%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
            <div className="relative group cursor-pointer drop-shadow-lg">
              <MapPin className="w-10 h-10 text-blue-500 fill-blue-500" />
              <div className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[70%]">
                <Home className="w-4 h-4 text-white fill-white" />
              </div>
            </div>
          </div>

          <div className="absolute top-[55%] left-[40%] -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative group cursor-pointer">
              <MapPin className="w-10 h-10 text-blue-500 fill-blue-500" />
              <div className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[70%]">
                <Home className="w-4 h-4 text-white fill-white" />
              </div>
            </div>
          </div>

          <div className="absolute top-[60%] left-[30%] -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative group cursor-pointer border-white">
              <MapPin className="w-10 h-10 text-green-500 fill-green-500" />
              <div className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[70%]">
                <PlusSquare className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Current Location Icon Bottom Right */}
          <div className="absolute bottom-6 right-6 z-20">
            <button className="bg-[#18181B] p-3 rounded-full border border-white/10 hover:bg-white/10 shadow-lg">
              <LocateFixed className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Section */}
      <div className="bg-[#121215] border border-white/5 rounded-3xl p-6 md:p-8">
        <h3 className="text-xl font-semibold mb-1">
          Live Inventory In Selected Radius
        </h3>
        <p className="text-sm text-gray-500 mb-8">
          Realtime resource availability based on the scanned area.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-[#1A1A1E] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex -space-x-1">
                <span className="text-xl">🥫</span>
                <span className="text-xl">🥛</span>
              </div>
              <span className="text-sm font-medium text-gray-300">
                Food & Water Supplies
              </span>
            </div>
            <div className="text-4xl font-bold tracking-tight">840</div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#1A1A1E] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition">
            <div className="flex items-center gap-3 mb-4">
              <PlusSquare className="w-6 h-6 text-green-500 fill-green-500/20" />
              <span className="text-sm font-medium text-gray-300">
                Medical Supplies
              </span>
            </div>
            <div className="text-4xl font-bold tracking-tight">254</div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#1A1A1E] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition">
            <div className="flex items-center gap-3 mb-4">
              <Home className="w-6 h-6 text-blue-500 fill-blue-500/20" />
              <span className="text-sm font-medium text-gray-300">
                Shelter Availability
              </span>
            </div>
            <div className="text-4xl font-bold tracking-tight">106</div>
          </div>

          {/* Card 4 */}
          <div className="bg-[#1A1A1E] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-orange-400 fill-orange-400/20" />
              <span className="text-sm font-medium text-gray-300">
                Volunteers Ready
              </span>
            </div>
            <div className="text-4xl font-bold tracking-tight">185</div>
          </div>
        </div>
      </div>
    </div>
  );
}
