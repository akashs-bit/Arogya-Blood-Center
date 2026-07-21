import {
  Bell,
  CalendarCheck,
  ChartNoAxesColumnIncreasing,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Donor Registry",
    description:
      "Register and manage donor profiles, track donation history, eligibility, and donor activity from one central dashboard.",
  },
  {
    icon: Bell,
    title: "Emergency Alerts",
    description:
      "Send urgent WhatsApp and SMS alerts instantly for critical blood requirements and time-sensitive emergencies.",
  },
  {
    icon: CalendarCheck,
    title: "Camp Management",
    description:
      "Plan blood donation camps, handle registrations, coordinate donors, and monitor outcomes with less manual work.",
  },
  {
    icon: ChartNoAxesColumnIncreasing,
    title: "Reports & Analytics",
    description:
      "Generate clear reports and operational insights to support smarter decisions and better blood centre performance.",
  },
];

const Features = () => {
  return (
    <section className="bg-gradient-to-b from-white via-red-50/30 to-white px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-[1720px]">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="group relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl sm:p-7"
              >
                <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-red-600 via-red-500 to-orange-400 opacity-0 transition group-hover:opacity-100" />

                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-700 transition group-hover:bg-red-700 group-hover:text-white sm:h-16 sm:w-16">
                  <Icon size={30} strokeWidth={2.1} />
                </div>

                <h3 className="mt-6 text-xl font-extrabold text-slate-950">
                  {feature.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>

                <button
                  type="button"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-red-700 transition group-hover:gap-3"
                >
                  Learn more
                  <span aria-hidden="true">→</span>
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
