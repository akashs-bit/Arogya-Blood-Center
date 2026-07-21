import { ArrowRight, Droplet, ShieldCheck, UserRoundPlus } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserRoundPlus,
    title: "Register",
    description:
      "Create your donor profile in just a few minutes with your basic details and donation information.",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Check Eligibility",
    description:
      "We review your eligibility status and notify you so the donation process stays simple and safe.",
  },
  {
    number: "03",
    icon: Droplet,
    title: "Donate & Track",
    description:
      "Donate blood and keep track of your contribution, donation history, and overall impact.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-gradient-to-b from-white via-red-50/20 to-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-[1720px]">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-950 sm:text-4xl lg:text-5xl">
            How It Works
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-red-700" />
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.title} className="relative">
                <article className="group h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl sm:p-7">
                  <div className="flex items-start gap-5">
                    <div className="relative shrink-0">
                      <div className="grid h-20 w-20 place-items-center rounded-full bg-red-50 text-red-700 transition group-hover:bg-red-700 group-hover:text-white sm:h-24 sm:w-24">
                        <Icon size={36} strokeWidth={2} />
                      </div>

                      <span className="absolute -right-2 top-0 grid h-9 w-9 place-items-center rounded-full bg-red-700 text-sm font-extrabold text-white shadow-md">
                        {step.number}
                      </span>
                    </div>

                    <div className="min-w-0 pt-1">
                      <h3 className="text-xl font-extrabold text-slate-950 sm:text-2xl">
                        {step.title}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                        {step.description}
                      </p>

                      <div className="mt-5 h-1 w-16 rounded-full bg-red-100 transition group-hover:bg-red-700" />
                    </div>
                  </div>
                </article>

                {!isLast && (
                  <div className="pointer-events-none absolute left-full top-1/2 hidden -translate-y-1/2 lg:flex lg:-translate-x-4 xl:-translate-x-2">
                    <div className="flex items-center gap-2">
                      <span className="block w-10 border-t-2 border-dashed border-slate-300 xl:w-14" />
                      <ArrowRight size={18} className="text-red-700" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
