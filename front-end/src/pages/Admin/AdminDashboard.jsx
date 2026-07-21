import {
  Bell,
  CalendarDays,
  Droplet,
  Eye,
  Pencil,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { FaWhatsapp } from "react-icons/fa6";
import { MdMessage } from "react-icons/md";

const metrics = [
  {
    title: "Total Donors",
    value: "2,548",
    note: "↑ 120 this month",
    icon: UsersRound,
    color: "bg-red-50 text-red-700",
  },
  {
    title: "Eligible Today",
    value: "312",
    note: "↑ 18 this week",
    icon: ShieldCheck,
    color: "bg-green-50 text-green-700",
  },
  {
    title: "Low Stock Groups",
    value: "3",
    note: "Needs immediate attention",
    icon: Droplet,
    color: "bg-orange-50 text-orange-600",
  },
  {
    title: "Camps This Month",
    value: "4",
    note: "↑ 1 upcoming",
    icon: CalendarDays,
    color: "bg-blue-50 text-blue-700",
  },
];

const bloodStock = [
  { group: "A+", units: 28, status: "Low" },
  { group: "A-", units: 12, status: "Low" },
  { group: "B+", units: 35, status: "Good" },
  { group: "B-", units: 8, status: "Critical" },
  { group: "AB+", units: 18, status: "Good" },
  { group: "AB-", units: 6, status: "Low" },
  { group: "O+", units: 42, status: "Good" },
  { group: "O-", units: 9, status: "Low" },
];

const donors = [
  [
    "Rahul Sharma",
    "O+",
    "9876543210",
    "12 Apr 2025",
    "12 Jul 2025",
    "Eligible",
  ],
  ["Priya Patel", "A+", "9876543211", "18 Mar 2025", "18 Jun 2025", "Eligible"],
  [
    "Amit Verma",
    "B+",
    "9876543212",
    "05 Jan 2025",
    "05 Apr 2025",
    "Not Eligible",
  ],
  ["Neha Singh", "AB+", "9876543213", "22 Feb 2025", "22 May 2025", "Eligible"],
  [
    "Vikram Joshi",
    "O-",
    "9876543214",
    "10 Dec 2024",
    "10 Mar 2025",
    "Not Eligible",
  ],
];

const suggestedDonors = [
  {
    name: "Rohan Mehta",
    group: "O+",
    distance: "2.4 km away",
    last: "12 Apr 2025",
  },
  {
    name: "Kunal Shah",
    group: "O+",
    distance: "3.1 km away",
    last: "22 Feb 2025",
  },
  {
    name: "Mehul Desai",
    group: "O+",
    distance: "4.0 km away",
    last: "05 Mar 2025",
  },
  {
    name: "Harsh Patel",
    group: "O+",
    distance: "4.5 km away",
    last: "18 Jan 2025",
  },
];

const camps = [
  {
    date: "24",
    month: "MAY",
    title: "City Centre Blood Donation Camp",
    place: "Ahmedabad, Gujarat",
    count: "120/150",
    color: "bg-green-50 text-green-700",
  },
  {
    date: "31",
    month: "MAY",
    title: "Community Blood Drive",
    place: "Gandhinagar, Gujarat",
    count: "80/100",
    color: "bg-blue-50 text-blue-700",
  },
  {
    date: "07",
    month: "JUN",
    title: "Corporate Blood Donation Camp",
    place: "Ahmedabad, Gujarat",
    count: "60/100",
    color: "bg-orange-50 text-orange-700",
  },
];

const chartPoints = [
  190, 245, 310, 265, 350, 415, 345, 280, 225, 290, 340, 405,
];

const AdminDashboard = () => {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
      {/* LEFT SECTION */}
      <section className="min-w-0 space-y-5">
        {/* METRICS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <article
                key={metric.title}
                className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <span
                    className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl ${metric.color}`}
                  >
                    <Icon size={28} />
                  </span>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-600">
                      {metric.title}
                    </p>

                    <strong className="mt-1 block text-2xl font-extrabold text-slate-950 sm:text-3xl">
                      {metric.value}
                    </strong>

                    <small
                      className={`mt-1 block text-xs font-bold ${
                        metric.note.includes("Needs")
                          ? "text-orange-600"
                          : "text-green-700"
                      }`}
                    >
                      {metric.note}
                    </small>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* STOCK + CHART */}
        <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          <Panel title="Blood Stock Overview" action="View All">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {bloodStock.map((item) => (
                <BloodCard key={item.group} {...item} />
              ))}
            </div>
          </Panel>

          <Panel title="Monthly Donations" action="This Year">
            <div className="mt-4 h-[240px] rounded-xl border border-slate-100 p-3 sm:p-4">
              <div className="flex h-full items-end gap-2 sm:gap-3">
                {chartPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div
                      className="w-full rounded-t-lg bg-red-700"
                      style={{ height: `${point / 5}px` }}
                    />

                    <span className="text-[10px] text-slate-500">
                      {
                        [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ][index]
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </div>

        {/* BLOOD GROUP */}
        <Panel title="Blood Group Distribution">
          <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
            <div className="mx-auto grid h-44 w-44 place-items-center rounded-full bg-[conic-gradient(#dc2626_0_35%,#991b1b_35%_56%,#15803d_56%_71%,#ea580c_71%_81%,#2563eb_81%_88%,#7c3aed_88%_94%,#ec4899_94%_98%,#14b8a6_98%_100%)]">
              <div className="grid h-24 w-24 place-items-center rounded-full bg-white text-center shadow-sm">
                <div>
                  <strong className="block text-2xl font-extrabold text-slate-950">
                    2,548
                  </strong>

                  <span className="text-xs text-slate-500">Total</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["O+", "35% (892)", "bg-red-600"],
                ["A+", "21% (535)", "bg-red-900"],
                ["B+", "15% (382)", "bg-green-700"],
                ["O-", "10% (255)", "bg-orange-600"],
                ["A-", "7% (178)", "bg-blue-600"],
                ["AB+", "6% (153)", "bg-purple-600"],
                ["B-", "4% (102)", "bg-pink-400"],
                ["AB-", "2% (51)", "bg-teal-500"],
              ].map(([group, value, color]) => (
                <div
                  key={group}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <span className={`h-3 w-3 rounded-full ${color}`} />
                    {group}
                  </span>

                  <span className="text-sm text-slate-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        {/* RECENT DONORS */}
        <Panel title="Recent Donors" action="View All Donors">
          <div className="mt-4 w-full overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="bg-slate-50 text-left text-sm text-slate-600">
                  <th className="px-4 py-3 font-extrabold">Name</th>
                  <th className="px-4 py-3 font-extrabold">Blood Group</th>
                  <th className="px-4 py-3 font-extrabold">Mobile</th>
                  <th className="px-4 py-3 font-extrabold">Last Donation</th>
                  <th className="px-4 py-3 font-extrabold">Next Eligible</th>
                  <th className="px-4 py-3 font-extrabold">Status</th>
                  <th className="px-4 py-3 font-extrabold">Action</th>
                </tr>
              </thead>

              <tbody>
                {donors.map((donor) => (
                  <tr
                    key={donor[0]}
                    className="border-b border-slate-100 text-sm"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {donor[0]}
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded-md bg-red-700 px-2 py-1 text-xs font-bold text-white">
                        {donor[1]}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-600">{donor[2]}</td>

                    <td className="px-4 py-3 text-slate-600">{donor[3]}</td>

                    <td className="px-4 py-3 text-slate-600">{donor[4]}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-bold ${
                          donor[5] === "Eligible"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {donor[5]}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200">
                          <Eye size={15} />
                        </button>

                        <button className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200">
                          <Pencil size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </section>

      {/* RIGHT SECTION */}
      <aside className="min-w-0 space-y-5">
        {/* EMERGENCY */}
        <section className="rounded-2xl border border-red-200 bg-white p-4 sm:p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-red-700 sm:text-xl">
            <Bell size={22} />
            Emergency Alert
          </h2>

          <div className="mt-5 space-y-4">
            <Label title="Blood Group Needed">
              <select className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none">
                <option>O+</option>
                <option>O-</option>
                <option>A+</option>
              </select>
            </Label>

            <Label title="Location">
              <select className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none">
                <option>Ahmedabad</option>
                <option>Gandhinagar</option>
              </select>
            </Label>

            <div className="grid gap-3 sm:grid-cols-2">
              <Label title="Units Required">
                <input
                  defaultValue="3"
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none"
                />
              </Label>

              <Label title="Urgency">
                <select className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none">
                  <option>High</option>
                  <option>Medium</option>
                </select>
              </Label>
            </div>

            <button className="h-12 w-full rounded-xl bg-red-700 text-sm font-extrabold text-white shadow-lg shadow-red-700/20">
              Find Donors
            </button>
          </div>

          {/* SUGGESTED DONORS */}
          <div className="mt-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-950">
                Suggested Donors
                <span className="ml-1 text-slate-500">(12)</span>
              </h3>
            </div>

            {/* DONOR LIST */}
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {suggestedDonors.map((donor, index) => (
                <article
                  key={donor.name}
                  className={`flex items-center justify-between gap-3 px-4 py-4 transition hover:bg-slate-50 ${
                    index !== suggestedDonors.length - 1
                      ? "border-b border-slate-100"
                      : ""
                  }`}
                >
                  {/* LEFT */}
                  <div className="min-w-0 flex-1">
                    {/* NAME + GROUP */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="truncate text-sm font-extrabold text-slate-900 sm:text-base">
                        {donor.name}
                      </h4>

                      <span className="rounded-md border border-red-300 bg-red-50 px-2 py-[2px] text-[11px] font-bold text-red-700">
                        {donor.group}
                      </span>
                    </div>

                    {/* DETAILS */}
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-slate-500 sm:text-sm">
                      <span>{donor.distance}</span>

                      <span className="hidden sm:block">•</span>

                      <span>
                        Last:
                        <span className="ml-1 font-medium text-slate-600">
                          {donor.last}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex shrink-0 items-center gap-2">
                    {/* WHATSAPP */}
                    <button className="grid h-10 w-10 place-items-center rounded-full text-green-600 transition hover:bg-green-50">
                      <FaWhatsapp size={24} />
                    </button>

                    {/* SMS */}
                    <button className="grid h-10 w-10 place-items-center rounded-full text-red-600 transition hover:bg-red-50">
                      <MdMessage size={24} />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* BOTTOM BUTTONS */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* WHATSAPP */}
              <button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 text-sm font-extrabold text-white shadow-md transition hover:bg-green-700">
                <FaWhatsapp size={24} />
                Send WhatsApp
              </button>

              {/* SMS */}
              <button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-extrabold text-white shadow-md transition hover:bg-red-700">
                <MdMessage size={24} />
                Send SMS
              </button>
            </div>
          </div>
        </section>

        {/* UPCOMING CAMPS */}
        <Panel title="Upcoming Camps" action="View All">
          <div className="mt-4 space-y-4">
            {camps.map((camp) => (
              <article key={camp.title} className="flex gap-3">
                <div className="grid h-16 w-14 shrink-0 place-items-center rounded-lg border border-red-200 text-center text-red-700">
                  <div>
                    <strong className="block text-xl leading-none">
                      {camp.date}
                    </strong>

                    <span className="text-xs font-bold">{camp.month}</span>
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-extrabold text-slate-950">
                    {camp.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">{camp.place}</p>
                </div>

                <span
                  className={`h-fit rounded-full px-2 py-1 text-xs font-bold ${camp.color}`}
                >
                  {camp.count}
                </span>
              </article>
            ))}
          </div>
        </Panel>
      </aside>
    </div>
  );
};

const Panel = ({ title, action, children }) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-extrabold text-slate-950 sm:text-xl">
          {title}
        </h2>

        {action && (
          <button className="text-sm font-bold text-red-700">{action}</button>
        )}
      </div>

      <div className="mt-4">{children}</div>
    </section>
  );
};

const BloodCard = ({ group, units, status }) => {
  const isGood = status === "Good";
  const isCritical = status === "Critical";

  return (
    <article className="rounded-xl border border-slate-200 p-3 text-center sm:p-4">
      <div className="flex items-center justify-center gap-2">
        <Droplet
          size={24}
          fill="currentColor"
          className={
            isGood
              ? "text-green-700"
              : isCritical
                ? "text-orange-600"
                : "text-red-700"
          }
        />

        <strong className="text-xl text-slate-950">{group}</strong>
      </div>

      <p className="mt-3 text-sm text-slate-600">{units} Units</p>

      <span
        className={`mt-3 inline-flex rounded-md px-2 py-1 text-xs font-bold ${
          isGood
            ? "bg-green-50 text-green-700"
            : isCritical
              ? "bg-red-50 text-red-700"
              : "bg-orange-50 text-orange-700"
        }`}
      >
        {status}
      </span>
    </article>
  );
};

const Label = ({ title, children }) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {title}
      </span>

      {children}
    </label>
  );
};

export default AdminDashboard;
