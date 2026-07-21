import {
  ArrowDownToLine,
  CalendarDays,
  Droplet,
  FileText,
  PieChart,
  TrendingUp,
  UsersRound,
} from "lucide-react";

const summaryCards = [
  {
    title: "Total Donations",
    value: "2,548",
    change: "+12.5%",
    tone: "success",
    icon: Droplet,
  },
  {
    title: "Active Donors",
    value: "1,842",
    change: "+8.2%",
    tone: "success",
    icon: UsersRound,
  },
  {
    title: "Camps Completed",
    value: "42",
    change: "+5 this month",
    tone: "neutral",
    icon: CalendarDays,
  },
  {
    title: "Reports Generated",
    value: "126",
    change: "+18 this week",
    tone: "success",
    icon: FileText,
  },
];

const bloodDistribution = [
  { group: "O+", percent: 35, units: 892, color: "bg-red-700" },
  { group: "A+", percent: 21, units: 535, color: "bg-red-500" },
  { group: "B+", percent: 15, units: 382, color: "bg-emerald-600" },
  { group: "O-", percent: 10, units: 255, color: "bg-amber-500" },
  { group: "A-", percent: 7, units: 178, color: "bg-blue-600" },
  { group: "AB+", percent: 6, units: 153, color: "bg-fuchsia-600" },
];

const monthlyData = [
  { month: "Jan", value: 180 },
  { month: "Feb", value: 245 },
  { month: "Mar", value: 310 },
  { month: "Apr", value: 265 },
  { month: "May", value: 350 },
  { month: "Jun", value: 415 },
];

const reportRows = [
  {
    name: "Daily Collection Report",
    type: "Donation",
    date: "12 May 2026",
    status: "Ready",
  },
  {
    name: "Monthly Blood Stock Summary",
    type: "Inventory",
    date: "01 May 2026",
    status: "Ready",
  },
  {
    name: "Camp Performance Report",
    type: "Camp",
    date: "24 Apr 2026",
    status: "Ready",
  },
  {
    name: "Emergency Alert Summary",
    type: "Alert",
    date: "18 Apr 2026",
    status: "Pending",
  },
];

const Reports = () => {
  const maxMonthlyValue = Math.max(...monthlyData.map((item) => item.value));

  return (
    <section className="bg-gradient-to-b from-white via-red-50/20 to-slate-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14 xl:px-10">
      <div className="mx-auto w-full max-w-[1480px]">
        <div className="rounded-[28px] border border-red-100 bg-gradient-to-r from-red-700 via-red-700 to-red-600 px-5 py-6 text-white shadow-lg shadow-red-700/15 sm:px-7 sm:py-7 lg:px-8 lg:py-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs font-bold sm:text-sm">
                <PieChart size={16} />
                Reports & Analytics
              </span>

              <h1 className="mt-4 text-[30px] font-extrabold leading-tight sm:mt-5 sm:text-4xl lg:text-5xl">
                Blood Centre Reports
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-red-50 sm:mt-4 sm:text-base sm:leading-7">
                View donation trends, blood group distribution, camp
                performance, and operational reports in one clean dashboard.
              </p>
            </div>

            <button className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-red-700 shadow-sm transition hover:bg-red-50">
              <ArrowDownToLine size={18} />
              Export Report
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            const badgeClass =
              card.tone === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-700";

            return (
              <article
                key={card.title}
                className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red-700">
                    <Icon size={24} />
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${badgeClass}`}
                  >
                    {card.change}
                  </span>
                </div>

                <p className="mt-5 text-sm font-medium text-slate-500">
                  {card.title}
                </p>
                <strong className="mt-2 block text-3xl font-extrabold tracking-tight text-slate-950">
                  {card.value}
                </strong>
              </article>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950 sm:text-2xl">
                  Monthly Donations
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Donation volume over the last 6 months
                </p>
              </div>

              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-red-50 text-red-700">
                <TrendingUp size={22} />
              </span>
            </div>

            <div className="mt-8 grid h-[320px] grid-cols-6 items-end gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:gap-4 sm:p-5">
              {monthlyData.map((item) => {
                const height = Math.max(
                  48,
                  (item.value / maxMonthlyValue) * 220,
                );

                return (
                  <div
                    key={item.month}
                    className="flex h-full flex-col items-center justify-end gap-3"
                  >
                    <span className="text-xs font-bold text-slate-400">
                      {item.value}
                    </span>

                    <div className="flex h-[230px] w-full items-end">
                      <div
                        className="w-full rounded-t-2xl bg-gradient-to-t from-red-700 via-red-600 to-red-400 shadow-sm transition hover:opacity-90"
                        style={{ height: `${height}px` }}
                      />
                    </div>

                    <span className="text-xs font-bold text-slate-500 sm:text-sm">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950 sm:text-2xl">
                  Blood Group Distribution
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Units collected by blood group
                </p>
              </div>

              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-red-50 text-red-700">
                <Droplet size={22} />
              </span>
            </div>

            <div className="mt-7 space-y-5">
              {bloodDistribution.map((item) => (
                <div key={item.group}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="font-extrabold text-slate-900">
                      {item.group}
                    </span>
                    <span className="text-slate-500">
                      {item.percent}% ({item.units})
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <article className="mt-6 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-950 sm:text-2xl">
                Recent Reports
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Generated reports available for review and export
              </p>
            </div>

            <select className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-50">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left">
                  <th className="rounded-l-xl px-4 py-4 text-sm font-extrabold text-slate-600">
                    Report Name
                  </th>
                  <th className="px-4 py-4 text-sm font-extrabold text-slate-600">
                    Type
                  </th>
                  <th className="px-4 py-4 text-sm font-extrabold text-slate-600">
                    Date
                  </th>
                  <th className="px-4 py-4 text-sm font-extrabold text-slate-600">
                    Status
                  </th>
                  <th className="rounded-r-xl px-4 py-4 text-sm font-extrabold text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {reportRows.map((row) => (
                  <tr
                    key={row.name}
                    className="border-b border-slate-100 transition hover:bg-slate-50/70"
                  >
                    <td className="px-4 py-4 text-sm font-bold text-slate-900">
                      {row.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {row.type}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {row.date}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          row.status === "Ready"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50 hover:text-red-800">
                        <ArrowDownToLine size={16} />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
};

export default Reports;
