// ==========================================
// FILE: DonorsPage.jsx (Enterprise Refactor)
// ==========================================

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Search,
  Plus,
  Download,
  Filter,
  Pencil,
  Trash2,
  Phone,
  Mail,
  Users,
  CheckCircle2,
  AlertCircle,
  Activity,
  ChevronDown,
  X,
  MapPin,
  Calendar,
  Layers,
} from "lucide-react";

import AddDonorModal from "../../components/Admin/Donors/AddDonorModal";
import DeleteDonorModal from "../../components/Admin/Donors/DeleteDonorModal";

// Constants for UI mappings
const BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

const DonorsPage = () => {
  const navigate = useNavigate();

  // Modal Triggers
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // Data Pipeline States
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedDonorId, setSelectedDonorId] = useState(null);

  // Search & Multi-layer Filter States
  const [search, setSearch] = useState("");
  const [bloodFilter, setBloodFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  /**
   * HTTP: Fetch Donors Core Pipeline
   */
  const fetchDonors = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const { data } = await axios.get("http://localhost:5000/api/donors/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDonors(data?.donors || []);
    } catch (error) {
      console.error("Fetch Donors Error:", error);
      toast.error("Failed to safely fetch donors log roster.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDonors();
  }, [fetchDonors]);

  /**
   * HTTP: Delete Donor API Call
   */
  const handleDelete = async () => {
    if (!selectedDonorId) return;
    try {
      setDeleteLoading(true);
      const token = localStorage.getItem("token");

      const { data } = await axios.delete(
        `http://localhost:5000/api/donors/delete/${selectedDonorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(data.message || "Donor profile detached cleanly.");
      setDeleteModal(false);
      setSelectedDonorId(null);
      fetchDonors();
    } catch (error) {
      console.error("Delete Donor Error:", error);
      toast.error(error?.response?.data?.message || "Failed to scrub donor history");
    } finally {
      setDeleteLoading(false);
    }
  };

  /**
   * Performance Layer: Memoized KPI Aggregations
   */
  const metrics = useMemo(() => {
    return donors.reduce(
      (acc, donor) => {
        const status = (donor.status || donor.eligibility || "").toLowerCase();
        const emergency = (donor.emergency || donor.emergencyAvailability || "").toLowerCase();

        if (status === "eligible") acc.eligible++;
        if (emergency === "available" || emergency === "available anytime") acc.standby++;
        acc.donations += donor.donations || 0;

        return acc;
      },
      { total: donors.length, eligible: 0, standby: 0, donations: 0 }
    );
  }, [donors]);

  /**
   * Performance Layer: Memoized Filter & Search Matrix Processing
   */
  const filteredDonors = useMemo(() => {
    const searchClean = search.trim().toLowerCase();

    return donors.filter((donor) => {
      const nameStr = (donor.fullName || donor.name || "").toLowerCase();
      const emailStr = (donor.email || "").toLowerCase();
      const phoneStr = donor.phone || "";
      const bloodGroupStr = donor.bloodGroup || donor.blood || "";
      const statusStr = donor.status || donor.eligibility || "";

      const searchMatch =
        !searchClean ||
        nameStr.includes(searchClean) ||
        emailStr.includes(searchClean) ||
        phoneStr.includes(searchClean);

      const bloodMatch = !bloodFilter || bloodGroupStr === bloodFilter;
      const statusMatch = !statusFilter || statusStr === statusFilter;

      return searchMatch && bloodMatch && statusMatch;
    });
  }, [donors, search, bloodFilter, statusFilter]);

  // Safe Slice layout display limit
  const previewDonors = useMemo(() => filteredDonors.slice(0, 5), [filteredDonors]);

  /**
   * Helper JSX: Renders customized aesthetic color profiles based on Blood Type
   */
  const getBloodBadgeStyles = (blood) => {
    const isNegative = blood?.includes("-");
    return isNegative
      ? "bg-rose-50 text-rose-700 border-rose-200/60 font-black"
      : "bg-red-50 text-red-700 border-red-100/80 font-extrabold";
  };

  return (
    <>
      <div className="space-y-6 p-4 max-w-[1600px] mx-auto animate-fade-in antialiased text-slate-800">
        
        {/* ================= HEADER CONTROLS SECTION ================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
              Donors Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Overview analytics tracking pipeline, validation states, and emergency availability rosters.
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]">
              <Download size={14} className="text-slate-500" />
              Export Dataset
            </button>

            <button
              onClick={() => setOpenModal(true)}
              className="flex h-10 items-center gap-2 rounded-xl bg-red-600 px-4 text-xs font-bold text-white shadow-md shadow-red-600/10 transition-all duration-200 hover:bg-red-700 hover:shadow-lg hover:shadow-red-700/20 active:scale-[0.98]"
            >
              <Plus size={14} className="stroke-[3]" />
              Add Donor Record
            </button>
          </div>
        </div>

        {/* ================= CONDITIONALLY LOAD CORE PLATFORM STATES ================= */}
        {loading ? (
          <SkeletonLoader />
        ) : (
          <>
            {/* ================= ANALYTICAL KPIS / METRICS HIGHLIGHTS ================= */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard title="Total Pool" value={metrics.total} color="text-slate-900" bgIcon="bg-red-50 text-red-600 border-red-100/50" icon={<Users size={20} />} />
              <MetricCard title="Eligible Now" value={metrics.eligible} color="text-emerald-700" bgIcon="bg-emerald-50 text-emerald-600 border-emerald-100/50" icon={<CheckCircle2 size={20} />} />
              <MetricCard title="On Standby" value={metrics.standby} color="text-amber-700" bgIcon="bg-amber-50 text-amber-600 border-amber-100/50" icon={<AlertCircle size={20} />} />
              <MetricCard title="Total Donations" value={metrics.donations} color="text-blue-700" bgIcon="bg-blue-50 text-blue-600 border-blue-100/50" icon={<Activity size={20} />} />
            </div>

            {/* ================= CORE SYSTEM DATABASE WORKSPACE TABLE LAYER ================= */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
              
              {/* INTERACTIVE WORKSPACE CONTROL STRIP */}
              <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between bg-slate-50/30">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Recent Logs Overview</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Displaying up to 5 recently registered matches or records status updates.</p>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
                  {/* Dynamic Interactive Input Field */}
                  <div className="flex h-10 w-full sm:w-[260px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 transition-all duration-200 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/10">
                    <Search size={14} className="text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search profiles..."
                      className="h-full w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400/80"
                    />
                    {search && (
                      <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Toggle Advanced Multi-filters Area Button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex h-10 items-center justify-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition-all duration-200 ${
                      showFilters || bloodFilter || statusFilter
                        ? "border-red-200 bg-red-50/80 text-red-700 hover:bg-red-50"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <Filter size={13} />
                    Filters
                    <ChevronDown size={13} className={`transform transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`} />
                  </button>

                  <button
                    onClick={() => navigate("/admin/donors/all")}
                    className="flex h-10 items-center justify-center rounded-xl bg-slate-900 px-4 text-xs font-bold text-white transition-all duration-200 hover:bg-slate-800 active:scale-[0.98]"
                  >
                    View Full Registry &rarr;
                  </button>
                </div>
              </div>

              {/* EXPANDABLE MULTILEVEL FILTER SHELF BLOCK */}
              {(showFilters || bloodFilter || statusFilter) && (
                <div className="grid grid-cols-1 gap-4 border-b border-slate-100 bg-slate-50/50 p-5 sm:grid-cols-2 animate-slide-down">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Blood Group Filter</label>
                    <select
                      value={bloodFilter}
                      onChange={(e) => setBloodFilter(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all"
                    >
                      <option value="">All Types Matrix</option>
                      {BLOOD_GROUPS.map((b) => (
                        <option key={b} value={b}>🩸 Type {b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Eligibility Condition</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all"
                    >
                      <option value="">All Pipeline Statuses</option>
                      <option value="Eligible">Eligible For Verification</option>
                      <option value="Ineligible">Flagged Ineligible</option>
                    </select>
                  </div>
                </div>
              )}

              {/* ================= HYBRID MOBILE CARDS DRAWERS ================= */}
              <div className="grid grid-cols-1 gap-4 p-4 md:hidden bg-slate-50/40">
                {previewDonors.map((donor) => {
                  const nameVal = donor.fullName || donor.name || "Anonymous Profile";
                  const bloodGroupStr = donor.bloodGroup || donor.blood || "N/A";
                  const isEligible = (donor.status || donor.eligibility) === "Eligible";
                  const isStandby = donor.emergency === "Available" || donor.emergencyAvailability === "Available Anytime";

                  return (
                    <div key={donor._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 font-bold text-slate-700 border border-slate-200/60 text-sm shadow-inner">
                            {nameVal.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-sm truncate max-w-[160px]">{nameVal}</h4>
                            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">#{String(donor._id).slice(-6).toUpperCase()}</span>
                          </div>
                        </div>
                        <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs ${getBloodBadgeStyles(bloodGroupStr)}`}>
                          🩸 {bloodGroupStr}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-100 py-3 text-slate-600">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 truncate"><Phone size={12} className="text-slate-400 shrink-0" /> {donor.phone || "---"}</div>
                          <div className="flex items-center gap-1.5 truncate"><Mail size={12} className="text-slate-400 shrink-0" /> {donor.email || "---"}</div>
                        </div>
                        <div className="space-y-1.5 border-l border-slate-100 pl-3">
                          <div className="flex items-center gap-1.5 truncate"><MapPin size={12} className="text-slate-400 shrink-0" /> {donor.city || "---"}</div>
                          <div className="flex items-center gap-1.5 truncate"><Layers size={12} className="text-slate-400 shrink-0" /> {donor.donations ?? 0} Allocations</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex flex-wrap gap-1.5">
                          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border ${
                            isStandby ? "bg-amber-50 text-amber-700 border-amber-200/60" : "bg-slate-50 text-slate-500 border-slate-200/50"
                          }`}>
                            {donor.emergency || donor.emergencyAvailability || "Standby Off"}
                          </span>
                          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border ${
                            isEligible ? "bg-emerald-50 text-emerald-700 border-emerald-200/60" : "bg-rose-50 text-rose-700 border-rose-200/60"
                          }`}>
                            {isEligible ? "Active Pool" : "Suspended"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/donors/edit/${donor._id}`)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 shadow-sm"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDonorId(donor._id);
                              setDeleteModal(true);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-red-50/50 text-red-600 transition-all hover:bg-red-50 shadow-sm"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ================= CORE DESKTOP GRID DATATABLE FRAMEWORK ================= */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400/90 select-none">
                      <th className="px-6 py-4">Donor Profile</th>
                      <th className="px-6 py-4">Blood Status</th>
                      <th className="px-6 py-4">Secure Contacts</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4 text-center">Frequency</th>
                      <th className="px-6 py-4">Last Activity</th>
                      <th className="px-6 py-4">Roster Availability</th>
                      <th className="px-6 py-4">System State</th>
                      <th className="px-6 py-4 text-right">Actions Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
                    {previewDonors.map((donor) => {
                      const nameVal = donor.fullName || donor.name || "Anonymous";
                      const bloodGroupStr = donor.bloodGroup || donor.blood || "N/A";
                      const isEligible = (donor.status || donor.eligibility) === "Eligible";
                      const isStandby = donor.emergency === "Available" || donor.emergencyAvailability === "Available Anytime";

                      return (
                        <tr key={donor._id} className="transition duration-150 hover:bg-slate-50/40 group">
                          {/* Profile Column */}
                          <td className="whitespace-nowrap px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 font-bold text-slate-700 border border-slate-200/50 text-xs shadow-sm group-hover:scale-105 transition-transform">
                                {nameVal.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 block max-w-[140px] truncate">{nameVal}</span>
                                <span className="text-[10px] font-mono text-slate-400 block mt-0.5 tracking-tight">ID: {String(donor._id).slice(-6).toUpperCase()}</span>
                              </div>
                            </div>
                          </td>

                          {/* Blood Badge */}
                          <td className="whitespace-nowrap px-6 py-3.5">
                            <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs ${getBloodBadgeStyles(bloodGroupStr)}`}>
                              {bloodGroupStr}
                            </span>
                          </td>

                          {/* Contact Info */}
                          <td className="whitespace-nowrap px-6 py-3.5">
                            <div className="space-y-1 font-medium">
                              <div className="flex items-center gap-1.5 text-slate-700"><Phone size={12} className="text-slate-400 shrink-0" /> {donor.phone || "---"}</div>
                              <div className="flex items-center gap-1.5 text-slate-400"><Mail size={12} className="text-slate-400 shrink-0" /> <span className="max-w-[150px] truncate">{donor.email || "---"}</span></div>
                            </div>
                          </td>

                          {/* Location */}
                          <td className="whitespace-nowrap px-6 py-3.5 text-slate-700">
                            <div className="flex items-center gap-1"><MapPin size={12} className="text-slate-400" />{donor.city || "Unassigned"}</div>
                          </td>

                          {/* Count Dynamic Metrics */}
                          <td className="whitespace-nowrap px-6 py-3.5 text-center font-bold text-slate-900">
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md text-xs">{donor.donations ?? 0}</span>
                          </td>

                          {/* Dates */}
                          <td className="whitespace-nowrap px-6 py-3.5 text-slate-500">
                            <div className="flex items-center gap-1"><Calendar size={12} className="text-slate-400" />{donor.lastDonationDate || donor.lastDonation || "Never Logged"}</div>
                          </td>

                          {/* Standby Flag */}
                          <td className="whitespace-nowrap px-6 py-3.5">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                              isStandby
                                ? "bg-amber-50 text-amber-800 border-amber-200/50"
                                : "bg-slate-100 text-slate-500 border-transparent"
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${isStandby ? "bg-amber-500" : "bg-slate-400"}`} />
                              {donor.emergency || donor.emergencyAvailability || "Inactive"}
                            </span>
                          </td>

                          {/* Pipeline Status */}
                          <td className="whitespace-nowrap px-6 py-3.5">
                            <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-[11px] font-bold border ${
                              isEligible
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : "bg-rose-50 text-rose-700 border-rose-100"
                            }`}>
                              {isEligible ? "Verified Eligible" : "Flagged Blacklist"}
                            </span>
                          </td>

                          {/* Actions Panel */}
                          <td className="whitespace-nowrap px-6 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => navigate(`/admin/donors/edit/${donor._id}`)}
                                title="Edit Profile Config"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                              >
                                <Pencil size={12} />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedDonorId(donor._id);
                                  setDeleteModal(true);
                                }}
                                title="Purge Record File"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 shadow-sm transition-all duration-150 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* EMPTY STATES RESOLUTIONS VIEW */}
              {filteredDonors.length === 0 && (
                <div className="flex flex-col items-center justify-center bg-white py-14 px-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 border border-slate-200/60 shadow-inner">
                    <Search size={18} className="stroke-[2.5]" />
                  </div>
                  <h4 className="mt-4 text-sm font-bold text-slate-900">No Profile Coordinates Found</h4>
                  <p className="mt-1 text-xs text-slate-400 max-w-xs leading-relaxed">
                    We couldn't locate pipeline indices fitting those active inputs or search criteria modifications. Try adjusting parameters.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ================= MODALS LIFECYCLES INJECTIONS ================= */}
      <AddDonorModal open={openModal} setOpen={setOpenModal} fetchDonors={fetchDonors} />
      <DeleteDonorModal open={deleteModal} setOpen={setDeleteModal} handleDelete={handleDelete} deleteLoading={deleteLoading} />
    </>
  );
};

/**
 * Reusable Components Isolation for cleaner read structural framework
 */
const MetricCard = ({ title, value, icon, color, bgIcon }) => (
  <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group">
    <div className="flex items-center justify-between">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">{title}</span>
        <h3 className={`mt-2 text-2xl font-black tracking-tight ${color}`}>{value}</h3>
      </div>
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110 ${bgIcon}`}>
        {icon}
      </div>
    </div>
  </div>
);

const SkeletonLoader = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100 border border-slate-200/40" />
      ))}
    </div>
    <div className="h-72 animate-pulse rounded-2xl bg-slate-50 border border-slate-200/60" />
  </div>
);

export default DonorsPage;