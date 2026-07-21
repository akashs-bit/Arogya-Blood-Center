import { Bell, CalendarCheck, Droplet, UsersRound } from "lucide-react";

const stats = [
  {
    icon: UsersRound,
    value: "10,000+",
    label: "Total Donors",
  },
  {
    icon: Droplet,
    value: "25,000+",
    label: "Units Collected",
  },
  {
    icon: CalendarCheck,
    value: "1,200+",
    label: "Camps Organized",
  },
  {
    icon: Bell,
    value: "5,000+",
    label: "Emergency Alerts Sent",
  },
];

const ImpactStats = () => {
  return (
    <section className="bg-gradient-to-r from-red-50 via-white to-red-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isLast = index === stats.length - 1;

          return (
            <div
              key={stat.label}
              className={`flex items-center justify-center gap-5 ${
                !isLast ? "lg:border-r lg:border-slate-300" : ""
              }`}
            >
              <Icon
                size={52}
                strokeWidth={2.2}
                className="shrink-0 text-red-700"
                fill={stat.label === "Units Collected" ? "currentColor" : "none"}
              />

              <div>
                <strong className="block text-3xl font-extrabold text-red-700 sm:text-4xl">
                  {stat.value}
                </strong>
                <span className="mt-1 block text-sm font-medium text-slate-700">
                  {stat.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ImpactStats;
