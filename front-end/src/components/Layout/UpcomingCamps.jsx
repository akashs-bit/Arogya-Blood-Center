import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Loader2,
  MapPin,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const getSafeNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getProgress = (registered, totalSlots) => {
  const safeRegistered = getSafeNumber(registered);
  const safeTotalSlots = getSafeNumber(totalSlots);

  if (safeTotalSlots <= 0) return 0;

  return Math.min(100, Math.round((safeRegistered / safeTotalSlots) * 100));
};

const getAvailabilityTone = (registered, totalSlots) => {
  const safeRegistered = getSafeNumber(registered);
  const safeTotalSlots = getSafeNumber(totalSlots);
  const slotsLeft = Math.max(safeTotalSlots - safeRegistered, 0);
  const progress = getProgress(safeRegistered, safeTotalSlots);

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

const getCampDateParts = (campDate) => {
  const date = new Date(campDate);

  if (Number.isNaN(date.getTime())) {
    return {
      day: "--",
      month: "---",
    };
  }

  return {
    day: date.getDate(),
    month: new Intl.DateTimeFormat("en-IN", { month: "short" })
      .format(date)
      .toUpperCase(),
  };
};

const UpcomingCamps = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCamps = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get("https://arogya-blood-center.onrender.com/api/camps/all");

      setCamps(Array.isArray(data?.camps) ? data.camps : []);
    } catch (err) {
      console.log(err);
      setError("Unable to load upcoming camps right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCamps();
  }, []);

  const upcomingCamps = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return camps
      .filter((camp) => {
        const date = new Date(camp.campDate);
        return !Number.isNaN(date.getTime()) && date >= today;
      })
      .sort((a, b) => new Date(a.campDate) - new Date(b.campDate))
      .slice(0, 2);
  }, [camps]);

  const totalRegistered = upcomingCamps.reduce(
    (sum, camp) => sum + getSafeNumber(camp.registered),
    0,
  );

  const totalCapacity = upcomingCamps.reduce(
    (sum, camp) => sum + getSafeNumber(camp.totalSlots),
    0,
  );

  return (
    <section className="bg-white px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto w-full max-w-[1720px] rounded-[30px] border border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(254,226,226,0.55),_transparent_36%),linear-gradient(180deg,_#ffffff_0%,_#fffaf9_52%,_#f8fafc_100%)] p-5 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.28)] sm:p-6 lg:p-7">
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-red-50 text-red-700 shadow-sm">
              <CalendarDays size={26} strokeWidth={2.2} />
            </span>

            <div>
              <h2 className="text-2xl font-extrabold text-slate-950 sm:text-[30px]">
                Upcoming Camps
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Join our upcoming blood donation camps and reserve your slot for
                a smooth, well-planned donation experience.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <MiniStat label="Camps" value={upcomingCamps.length} />
            <MiniStat label="Registered" value={totalRegistered} />
            <MiniStat label="Capacity" value={totalCapacity} />

            <Link
              to="/camps"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-bold text-red-700 transition hover:border-red-300 hover:bg-red-50"
            >
              View All Camps
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="flex h-40 items-center justify-center rounded-[28px] border border-slate-200 bg-white">
              <div className="inline-flex items-center gap-3 text-sm font-semibold text-slate-500">
                <Loader2 size={18} className="animate-spin" />
                Loading upcoming camps...
              </div>
            </div>
          ) : error ? (
            <div className="rounded-[28px] border border-rose-200 bg-white p-8 text-center">
              <p className="text-sm font-semibold text-rose-700">{error}</p>

              <button
                type="button"
                onClick={fetchCamps}
                className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-red-700 px-5 text-sm font-bold text-white transition hover:bg-red-800"
              >
                Try Again
              </button>
            </div>
          ) : upcomingCamps.length === 0 ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center">
              <h3 className="text-xl font-extrabold text-slate-950">
                No upcoming camps available
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                New donation camps will appear here once they are published.
              </p>
            </div>
          ) : (
            upcomingCamps.map((camp) => {
              const registered = getSafeNumber(camp.registered);
              const totalSlots = getSafeNumber(camp.totalSlots);
              const progress = getProgress(registered, totalSlots);
              const slotsLeft = Math.max(totalSlots - registered, 0);
              const availability = getAvailabilityTone(registered, totalSlots);
              const { day, month } = getCampDateParts(camp.campDate);

              return (
                <article
                  key={camp._id || `${camp.campName}-${camp.campDate}`}
                  className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_-38px_rgba(15,23,42,0.25)] transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-[0_28px_80px_-44px_rgba(185,28,28,0.26)] sm:p-6"
                >
                  <div className="grid gap-5 xl:grid-cols-[104px_minmax(0,1.35fr)_minmax(190px,0.8fr)_minmax(250px,1fr)_180px] xl:items-center">
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
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${availability.className}`}
                      >
                        {availability.text}
                      </span>

                      <h3 className="mt-3 text-xl font-extrabold leading-tight text-slate-950 sm:text-2xl">
                        {camp.campName}
                      </h3>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <MetaBadge
                          icon={<MapPin size={16} className="text-red-700" />}
                          text={camp.campLocation || "Location not available"}
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 xl:text-center">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
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
                            {registered} / {totalSlots}
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
                        <span>{slotsLeft} left</span>
                        <span>{progress}% filled</span>
                      </div>
                    </div>

                    <Link
                      to={`/register-camps/${camp._id}`}
                      state={{ camp }}
                      className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold text-white shadow-md transition ${
                        slotsLeft <= 0
                          ? "pointer-events-none cursor-not-allowed bg-slate-400 shadow-slate-300"
                          : "bg-red-700 shadow-red-700/20 hover:bg-red-800"
                      }`}
                    >
                      {slotsLeft <= 0 ? "Camp Full" : "Register Now"}

                      {slotsLeft > 0 && <ArrowRight size={16} />}
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

const MiniStat = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <strong className="mt-1 block text-lg font-extrabold text-slate-950">
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

export default UpcomingCamps;
