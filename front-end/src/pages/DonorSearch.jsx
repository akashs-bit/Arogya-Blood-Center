import {
  Search,
  MapPin,
  Phone,
  Mail,
  Droplets,
  Filter,
  HeartHandshake,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

import axios from "axios";

const DonorSearch = () => {
  const [donors, setDonors] = useState([]);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [bloodGroup, setBloodGroup] = useState("");

  const fetchDonors = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        "https://arogya-blood-center.onrender.com/api/donors/search",
        {
          params: {
            search,
            bloodGroup,
          },
        },
      );

      setDonors(data.donors);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [search, bloodGroup]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#fafafa] pt-6 sm:pt-8 lg:pt-10 pb-16">
      {/* Background Blur */}
      <div className="absolute left-0 top-0 h-[320px] w-[320px] rounded-full bg-red-200/20 blur-3xl"></div>

      <div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-red-300/20 blur-3xl"></div>

      {/* MAIN CONTAINER */}
      <div className="relative mx-auto max-w-[1550px] px-3 sm:px-4 lg:px-5">
        {/* ================= HERO SECTION ================= */}
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-red-700 via-red-700 to-red-600 p-6 sm:p-10 lg:p-14 text-white shadow-[0_20px_60px_rgba(220,38,38,0.25)]">
          {/* Glow */}
          <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-white/10 blur-3xl"></div>

          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* LEFT CONTENT */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur-xl sm:text-sm">
                <HeartHandshake size={16} />
                Blood Donor Search
              </div>

              <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                Find Blood Donors Faster During Emergencies
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-red-50 sm:text-base">
                Search verified blood donors by blood group and location to
                quickly connect during urgent medical situations.
              </p>

              {/* SEARCH SECTION */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                {/* SEARCH INPUT */}
                <div className="flex h-14 flex-1 items-center gap-3 rounded-2xl bg-white px-4 shadow-xl">
                  <Search className="text-slate-400" size={20} />

                  <input
                    type="text"
                    placeholder="Search donor..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-full w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* BLOOD GROUP */}
                <div className="flex h-14 items-center gap-3 rounded-2xl bg-white px-4 shadow-xl">
                  <Filter className="text-slate-400" size={20} />

                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="bg-transparent text-sm text-slate-700 outline-none"
                  >
                    <option value="">All Groups</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="O+">O+</option>
                    <option value="AB+">AB+</option>
                  </select>
                </div>
              </div>

              {/* STATS */}
              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard number="10K+" text="Registered Donors" />

                <StatCard number="24/7" text="Emergency Support" />

                <StatCard number="100%" text="Verified Data" />
              </div>
            </div>

            {/* RIGHT SIDE ICON UI */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="relative flex h-[420px] w-[420px] items-center justify-center rounded-full bg-white/10 backdrop-blur-xl">
                {/* Inner Circle */}
                <div className="flex h-[260px] w-[260px] items-center justify-center rounded-full bg-white/10 animate-pulse">
                  <div className="flex h-[180px] w-[180px] items-center justify-center rounded-full bg-white text-red-700 shadow-2xl">
                    <Droplets size={90} fill="currentColor" />
                  </div>
                </div>

                {/* Floating Cards */}
                <FloatingCard
                  icon={<HeartPulse size={22} />}
                  text="Emergency Ready"
                  className="top-10 left-0 animate-bounce"
                />

                <FloatingCard
                  icon={<ShieldCheck size={22} />}
                  text="Verified Donors"
                  className="bottom-12 left-6 animate-pulse"
                />

                <FloatingCard
                  icon={<MapPin size={22} />}
                  text="Nearby Search"
                  className="right-0 top-1/2 -translate-y-1/2 animate-bounce"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= DONOR LIST ================= */}
        {/* ================= DONOR LIST (PREMIUM TABLE VIEW) ================= */}
        <div className="mt-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
            <h2 className="text-3xl font-black text-slate-950">
              Available Donors
            </h2>
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <p className="text-xs font-bold text-slate-600">
                {donors.length} Donors Active
              </p>
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Donor Details
                    </th>
                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Blood Group
                    </th>
                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Location
                    </th>
                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Contact
                    </th>
                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Status
                    </th>
                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-wider text-slate-400 text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {donors.map((donor) => (
                    <tr
                      key={donor._id}
                      className="group hover:bg-red-50/30 transition-all duration-300"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
                            {donor.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">
                              {donor.fullName}
                            </p>
                            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                              Donor
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 font-black text-red-600 text-lg">
                        {donor.bloodGroup}
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-600 font-medium">
                        {donor.address}
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-600 font-mono">
                        {donor.phone}
                      </td>
                      <td className="px-8 py-5">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            donor.isAvailable
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {donor.isAvailable ? "Available" : "Busy"}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <button className="bg-slate-900 hover:bg-red-700 text-white text-[11px] font-bold px-5 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-200">
                          CONTACT
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* EMPTY STATE */}
        {!loading && donors.length === 0 && (
          <div className="mt-10 rounded-[28px] bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-700">
              <Search size={36} />
            </div>

            <h3 className="mt-5 text-2xl font-black text-slate-900">
              No Donors Found
            </h3>

            <p className="mt-3 text-slate-500">
              Try searching with another blood group or donor name.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

/* ================= COMPONENTS ================= */

const StatCard = ({ number, text }) => {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-2">
      <h3 className="text-3xl font-black text-white">{number}</h3>

      <p className="mt-2 text-sm font-medium text-red-50">{text}</p>
    </div>
  );
};

const FloatingCard = ({ icon, text, className }) => {
  return (
    <div
      className={`absolute flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-bold text-slate-800 shadow-2xl ${className}`}
    >
      <span className="text-red-700">{icon}</span>
      {text}
    </div>
  );
};

export default DonorSearch;
