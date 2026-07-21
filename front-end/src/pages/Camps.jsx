import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Loader2,
  MapPin,
  RefreshCw,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const getSafeNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getCampDateParts = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      day: "--",
      month: "---",
      fullDate: "Date to be announced",
    };
  }

  return {
    day: date.getDate(),
    month: new Intl.DateTimeFormat("en-IN", { month: "short" })
      .format(date)
      .toUpperCase(),
    fullDate: new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date),
  };
};

const getProgress = (registered, totalSlots) => {
  const safeRegistered = getSafeNumber(registered);
  const safeTotalSlots = getSafeNumber(totalSlots);

  if (safeTotalSlots <= 0) return 0;

  return Math.min(100, Math.round((safeRegistered / safeTotalSlots) * 100));
};

const getAvailabilityTone = (slotsLeft, progress) => {
  if (slotsLeft <= 0) {
    return {
      text: "Camp Full",
      className: "border-rose-200 bg-rose-50 text-rose-700",
    };
  }

  if (progress >= 80) {
    return {
      text: `${slotsLeft} slots left`,
      className: "border-amber-200 bg-amber-50 text-amber-700",
    };
  }

  return {
    text: `${slotsLeft} slots available`,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };
};

const Camps = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCamps = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get("http://localhost:5000/api/camps/all");

      setCamps(Array.isArray(data?.camps) ? data.camps : []);
    } catch (err) {
      console.log(err);
      setError("Unable to load camps right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCamps();
  }, []);

  // Filter out any ended camps based on the user's local timezone midnight
  const activeCamps = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return camps.filter((camp) => {
      const campDateObj = new Date(camp.campDate);
      if (Number.isNaN(campDateObj.getTime())) return false;

      // Create a local timeline date representation to accurately evaluate calendar days
      const localCampDate = new Date(
        campDateObj.getFullYear(),
        campDateObj.getMonth(),
        campDateObj.getDate()
      );

      return localCampDate >= today;
    });
  }, [camps]);

  // Derived statistics mapped dynamically against only the active camp instances
  const totalRegistered = activeCamps.reduce(
    (sum, camp) => sum + getSafeNumber(camp.registered),
    0,
  );

  const totalSlots = activeCamps.reduce(
    (sum, camp) => sum + getSafeNumber(camp.totalSlots),
    0,
  );

  return (
    <section className="bg-[radial-gradient(circle_at_top,_rgba(254,226,226,0.9),_transparent_35%),linear-gradient(180deg,_#fff1f2_0%,_#ffffff_42%,_#f8fafc_100%)] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14 xl:px-10">
      <div className="mx-auto w-full max-w-[1480px]">
        <div className="overflow-hidden rounded-[30px] border border-red-200 bg-gradient-to-br from-red-800 via-red-700 to-rose-600 px-5 py-6 text-white shadow-[0_24px_80px_-32px_rgba(185,28,28,0.75)] sm:px-7 sm:py-8 lg:px-8 lg:py-9">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] sm:text-sm">
            <CalendarDays size={16} />
            Blood Donation Camps
          </span>

          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_420px] lg:items-end">
            <div>
              <h1 className="text-[32px] font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                Upcoming Donation Camps
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-red-50 sm:text-base">
                Register for upcoming blood donation camps and help us plan
                donor slots, collection targets, and emergency availability
                across the city.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <HeroStat label="Upcoming Camps" value={activeCamps.length} />
              <HeroStat label="Registered" value={totalRegistered} />
              <HeroStat label="Total Capacity" value={totalSlots} />
            </div>
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="grid gap-5">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : error ? (
            <div className="rounded-[28px] border border-rose-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
                <RefreshCw size={22} />
              </div>

              <h2 className="mt-5 text-2xl font-extrabold text-slate-950">
                Couldn’t load camps
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">{error}</p>

              <button
                type="button"
                onClick={fetchCamps}
                className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-red-700 px-6 text-sm font-bold text-white transition hover:bg-red-800"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          ) : activeCamps.length === 0 ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-700">
                <CalendarDays size={22} />
              </div>

              <h2 className="mt-5 text-2xl font-extrabold text-slate-950">
                No camps available right now
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                New donation camps will appear here once they are published.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {activeCamps.map((camp) => {
                const registered = getSafeNumber(camp.registered);
                const totalCapacity = getSafeNumber(camp.totalSlots);
                const progress = getProgress(registered, totalCapacity);
                const slotsLeft = Math.max(totalCapacity - registered, 0);
                const availability = getAvailabilityTone(slotsLeft, progress);
                const { day, month, fullDate } = getCampDateParts(
                  camp.campDate,
                );

                return (
                  <article
                    key={camp._id || `${camp.campName}-${camp.campDate}`}
                    className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-[0_28px_80px_-44px_rgba(185,28,28,0.3)] sm:p-6"
                  >
                    <div className="grid gap-5 xl:grid-cols-[104px_minmax(0,1.35fr)_minmax(190px,0.8fr)_minmax(260px,1fr)_190px] xl:items-center">
                      <div className="grid h-24 w-24 place-items-center rounded-[24px] border border-red-200 bg-gradient-to-b from-red-50 to-white text-center text-red-700 shadow-sm">
                        <div>
                          <strong className="block text-[34px] font-extrabold leading-none">
                            {day}
                          </strong>
                          <span className="mt-1 block text-sm font-extrabold tracking-[0.18em]">
                            {month}
                          </span>
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${availability.className}`}
                          >
                            {availability.text}
                          </span>
                        </div>

                        <h2 className="mt-3 text-2xl font-extrabold leading-tight text-slate-950">
                          {camp.campName}
                        </h2>

                        <p className="mt-2 text-sm font-medium text-slate-500">
                          {fullDate}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-3">
                          <MetaBadge
                            icon={<MapPin size={16} className="text-red-700" />}
                            text={camp.campLocation || "Location not provided"}
                          />
                          <MetaBadge
                            icon={<Clock3 size={16} className="text-red-700" />}
                            text={camp.campTime || "Time to be announced"}
                          />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 xl:text-center">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                          Camp Timing
                        </p>
                        <div className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-slate-800 xl:justify-center">
                          <Clock3 size={17} className="text-red-700" />
                          {camp.campTime || "To be announced"}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-700">
                            <UsersRound size={20} />
                          </span>

                          <div>
                            <strong className="block text-xl font-extrabold text-slate-950">
                              {registered} / {totalCapacity}
                            </strong>
                            <span className="text-sm font-medium text-slate-500">
                              Registered donors
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-red-700 to-rose-500 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                          <span>Capacity</span>
                          <span>{progress}% filled</span>
                        </div>
                      </div>

                      <Link
                        to={`/register-camps/${camp._id}`}
                        state={{ camp }}
                        className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold text-white shadow-md transition ${
                          slotsLeft <= 0
                            ? "cursor-not-allowed bg-slate-400 shadow-slate-300 pointer-events-none"
                            : "bg-red-700 shadow-red-700/20 hover:bg-red-800"
                        }`}
                      >
                        {slotsLeft <= 0 ? "Camp Full" : "Register Now"}

                        {slotsLeft > 0 && <ArrowRight size={16} />}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const HeroStat = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-sm">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-100">
        {label}
      </p>
      <strong className="mt-2 block text-2xl font-extrabold text-white">
        {value}
      </strong>
    </div>
  );
};

const MetaBadge = ({ icon, text }) => {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
      {icon}
      <span>{text}</span>
    </div>
  );
};

const SkeletonCard = () => {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid animate-pulse gap-5 xl:grid-cols-[104px_minmax(0,1.35fr)_minmax(190px,0.8fr)_minmax(260px,1fr)_190px] xl:items-center">
        <div className="h-24 w-24 rounded-[24px] bg-slate-100" />
        <div className="space-y-3">
          <div className="h-4 w-28 rounded-full bg-slate-100" />
          <div className="h-8 w-4/5 rounded-xl bg-slate-100" />
          <div className="h-4 w-40 rounded-xl bg-slate-100" />
          <div className="h-10 w-56 rounded-full bg-slate-100" />
        </div>
        <div className="h-20 rounded-2xl bg-slate-100" />
        <div className="h-24 rounded-2xl bg-slate-100" />
        <div className="h-12 rounded-xl bg-slate-100" />
      </div>
    </div>
  );
};

export default Camps;