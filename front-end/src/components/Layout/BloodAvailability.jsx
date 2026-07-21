import { ArrowRight, Droplet } from "lucide-react";
import { Link } from "react-router-dom";

const bloodGroups = [
  { group: "A+", units: 28 },
  { group: "A-", units: 12 },
  { group: "B+", units: 35 },
  { group: "B-", units: 8 },
  { group: "AB+", units: 18 },
  { group: "AB-", units: 6 },
  { group: "O+", units: 42 },
  { group: "O-", units: 9 },
];

const getStatusFromUnits = (units) => {
  if (units <= 10) return "Critical";
  if (units <= 25) return "Low";
  return "Good";
};

const statusStyles = {
  Good: {
    icon: "text-green-600 fill-green-600",
    badge: "border-green-200 bg-green-50 text-green-700",
  },
  Low: {
    icon: "text-red-600 fill-red-600",
    badge: "border-orange-200 bg-orange-50 text-orange-600",
  },
  Critical: {
    icon: "text-red-600 fill-red-600",
    badge: "border-red-200 bg-red-50 text-red-700",
  },
};

const BloodAvailability = () => {
  return (
    <section className="bg-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1720px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-extrabold text-slate-950">
              <Droplet size={24} className="fill-red-600 text-red-600" />
              Blood Availability
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Real-time overview of available blood units
            </p>
          </div>

          <Link
            to=""
            className="inline-flex items-center gap-2 text-sm font-bold text-red-600 transition hover:gap-3"
          >
            View All Stock
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8">
          {bloodGroups.map((item) => {
            const status = getStatusFromUnits(item.units);
            const style = statusStyles[status];

            return (
              <article
                key={item.group}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center justify-center gap-3">
                  <Droplet
                    size={28}
                    className={style.icon}
                    fill="currentColor"
                  />
                  <h3 className="text-2xl font-extrabold text-slate-950">
                    {item.group}
                  </h3>
                </div>

                <p className="mt-5 text-lg font-medium text-slate-700">
                  {item.units} Units
                </p>

                <span
                  className={`mt-5 inline-flex min-w-[90px] items-center justify-center rounded-lg border px-4 py-2 text-sm font-bold ${style.badge}`}
                >
                  {status}
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BloodAvailability;
