import { useState, useEffect } from "react";
import axios from "axios";
import {
  Download,
  TrendingUp,
  Users,
  Droplets,
  Activity,
  CalendarDays,
  AlertTriangle,
  Search,
  Eye,
  FileText,
  Loader2,
  X,
} from "lucide-react";

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    totalDonations: "0",
    activeDonors: "0",
    bloodUnits: "0",
    emergencyAlerts: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [bloodStock, setBloodStock] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [viewingReport, setViewingReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // AUTOMATIC ASYNC ENGINE TO SYNC DATA PIPELINES
  const fetchReportSuiteData = async () => {
    try {
      setLoading(true);
      let listUrl = `http://localhost:5000/api/reports?search=${searchQuery}`;
      if (selectedType !== "All") listUrl += `&type=${selectedType}`;

      const [listRes, analyticsRes] = await Promise.all([
        axios.get(listUrl),
        axios.get("http://localhost:5000/api/reports/analytics"),
      ]);

      if (listRes.data.success) setReports(listRes.data.reports);
      if (analyticsRes.data.success) {
        setStats(analyticsRes.data.stats);
        setChartData(analyticsRes.data.chartData);
        setBloodStock(analyticsRes.data.stock);
      }
    } catch (error) {
      console.error("Data connection sync failure:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReports = async () => {
    try {
      setExporting(true);
      const response = await axios.post(
        "http://localhost:5000/api/reports/generate",
        {
          type: selectedType === "All" ? "Donations" : selectedType,
        },
      );
      if (response.data.success) {
        await fetchReportSuiteData();
      }
    } catch (error) {
      alert("Failed to export report.");
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchReportSuiteData();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedType]);

  return (
    <div className="space-y-6 p-2 sm:p-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
            Reports & Analytics
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Monitor real-time donations, stocks and emergency profiles.
          </p>
        </div>

        <button
          onClick={handleExportReports}
          disabled={exporting}
          className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-red-700 to-red-600 px-6 text-sm font-bold text-white shadow-lg shadow-red-200 transition duration-300 hover:scale-[1.02] disabled:opacity-70"
        >
          {exporting ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Download size={18} /> Export Reports
            </>
          )}
        </button>
      </div>

      {/* ================= CORE LIVE STATS CARDS ================= */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatsCard
          title="Total Donations"
          value={stats.totalDonations}
          growth="+12%"
          icon={<Droplets size={24} />}
          color="red"
        />
        <StatsCard
          title="Active Donors"
          value={stats.activeDonors}
          growth="+8%"
          icon={<Users size={24} />}
          color="blue"
        />
        <StatsCard
          title="Emergency Alerts"
          value={stats.emergencyAlerts.toString()}
          growth="-4%"
          icon={<AlertTriangle size={24} />}
          color="orange"
        />
      </div>

      {/* ================= VISUAL DATA SECTIONS (DUMMY DATA FUELED) ================= */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* DONATION ANALYTICS CHART BOX */}
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 p-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Donation Analytics
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Monthly blood donation performance
              </p>
            </div>
          </div>
          <div className="p-6">
            <div className="flex h-[320px] items-end justify-between gap-2 sm:gap-3">
              {chartData.map((height, index) => {
                const maxVal = Math.max(...chartData, 1);
                const computedHeight = (height / maxVal) * 240;
                return (
                  <div
                    key={index}
                    className="flex flex-1 flex-col items-center"
                  >
                    <div
                      style={{ height: `${computedHeight}px` }}
                      className="w-full rounded-t-xl bg-gradient-to-t from-red-700 to-red-500 transition duration-300 hover:scale-105"
                      title={`${height} Units`}
                    ></div>
                    <p className="mt-3 text-[10px] sm:text-xs font-bold text-slate-400">
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
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BLOOD STOCK INVENTORY PANEL */}
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-2xl font-black text-slate-900">Blood Stock</h2>
            <p className="mt-1 text-sm text-slate-500">
              Current blood inventory
            </p>
          </div>
          <div className="space-y-4 p-6 max-h-[360px] overflow-y-auto">
            {bloodStock.map((item, index) => {
              const maxUnits = Math.max(...bloodStock.map((b) => b.units), 1);
              const fillPercentage = (item.units / maxUnits) * 100;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-100 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`rounded-xl border px-3 py-1 text-xs font-black ${item.color}`}
                    >
                      {item.group}
                    </div>
                    <p className="text-sm font-black text-slate-800">
                      {item.units} Units
                    </p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      style={{ width: `${fillPercentage}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-500"
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= MONITORING HISTORIC DATA TABLE ================= */}
      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Generated System Logs
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review and verify download exports.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 sm:w-[260px]">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-full w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center font-bold text-slate-500 animate-pulse">
            Syncing Database Clusters...
          </div>
        ) : reports.length === 0 ? (
          <div className="p-10 text-center font-bold text-slate-400">
            No report records tracked.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left">
                  <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">
                    Report Reference
                  </th>
                  <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">
                    Type
                  </th>
                  <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">
                    Date Compiled
                  </th>
                  <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-100 last:border-none transition hover:bg-slate-50/80"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white">
                          <FileText size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {report.title}
                          </h4>
                          <p className="text-xs text-slate-400">
                            #{report.reportId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                      {report.date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setViewingReport(report);
                            setIsModalOpen(true);
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                          <Eye size={16} />
                        </button>
                        <a
                          href={report.downloadUrl}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm hover:scale-105 transition"
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= PREVIEW OVERLAY MODAL ================= */}
      {isModalOpen && viewingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-[28px] bg-white p-6 shadow-2xl transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900">
                Document Blueprint Preview
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 font-mono text-xs text-slate-600 border border-slate-200 space-y-2">
              <p>TITLE: {viewingReport.title}</p>
              <p>TYPE: {viewingReport.type}</p>
              <p>DATE: {viewingReport.date}</p>
              <p>
                STATUS:{" "}
                <span className="text-green-600 font-bold">Verified</span>
              </p>
            </div>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="h-10 px-4 text-xs font-bold text-slate-400 hover:bg-slate-50 rounded-xl"
              >
                Close
              </button>
              <a
                href={viewingReport.downloadUrl}
                onClick={() => setIsModalOpen(false)}
                className="flex h-10 items-center gap-2 rounded-xl bg-red-600 px-4 text-xs font-bold text-white shadow-md shadow-red-100"
              >
                <Download size={14} /> Download File
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatsCard = ({ title, value, growth, icon, color }) => {
  const colors = {
    red: "bg-red-50 text-red-700",
    blue: "bg-blue-50 text-blue-700",
    orange: "bg-orange-50 text-orange-700",
  };
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <h2 className="mt-2 text-4xl font-black text-slate-900 tracking-tight">
            {value}
          </h2>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-green-600">
            <TrendingUp size={14} />
            {growth} Live Data
          </div>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors[color]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
