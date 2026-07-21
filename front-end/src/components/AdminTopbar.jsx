import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  UserRound,
} from "lucide-react";

const AdminTopbar = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-40 flex h-[72px] items-center gap-2 border-b border-slate-200 bg-white px-3 sm:px-5 lg:px-6">
      
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={onMenuClick}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Title */}
      <div className="min-w-0 flex-1 overflow-hidden">
        <h1 className="truncate text-lg font-extrabold text-slate-950 sm:text-2xl">
          Dashboard
        </h1>

        <p className="truncate text-xs text-slate-500 sm:text-sm">
          Welcome back, Admin
        </p>
      </div>

      {/* Search */}
      <div className="hidden h-11 w-full max-w-[380px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-500 md:flex">
        <Search size={18} />

        <input
          type="search"
          placeholder="Search donors..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {/* Notification */}
      <button className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate-700 hover:bg-slate-100">
        <Bell size={20} />

        <span className="absolute right-0.5 top-0.5 grid h-4 w-4 place-items-center rounded-full bg-red-700 text-[10px] font-bold text-white">
          8
        </span>
      </button>

      {/* Profile */}
      <button className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 hover:bg-slate-50 sm:flex">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-200">
          <UserRound size={18} />
        </span>

        <div className="hidden text-left md:block">
          <strong className="block text-sm text-slate-950">
            Admin
          </strong>

          <small className="text-[11px] font-bold text-red-700">
            Full Access
          </small>
        </div>

        <ChevronDown size={16} />
      </button>
    </header>
  );
};

export default AdminTopbar;