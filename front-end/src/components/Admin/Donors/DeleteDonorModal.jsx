// ===========================
// FILE: DeleteDonorModal.jsx
// ===========================

import { Trash2, X, AlertTriangle } from "lucide-react";
const DeleteDonorModal = ({ open, setOpen, handleDelete, deleteLoading }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      {/* Modal */}
      <div className="relative w-full max-w-[420px] overflow-hidden rounded-[34px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        {/* TOP GRADIENT */}
        <div className="h-2 w-full bg-gradient-to-r from-red-700 to-red-500"></div>

        {/* BODY */}
        <div className="px-6 pb-6 pt-8 sm:px-8 sm:pb-8">
          {/* CLOSE BTN */}
          <button
            onClick={() => setOpen(false)}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition duration-300 hover:bg-red-50 hover:text-red-700"
          >
            <X size={18} />
          </button>

          {/* ICON */}
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-red-100 shadow-inner">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-200">
              <AlertTriangle size={30} />
            </div>
          </div>

          {/* CONTENT */}
          <div className="mt-7 text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-[38px]">
              Delete Donor?
            </h2>

            <p className="mx-auto mt-4 max-w-[300px] text-sm leading-7 text-slate-500 sm:text-[15px]">
              This donor record will be permanently deleted and cannot be
              recovered again.
            </p>
          </div>

          {/* WARNING BOX */}
          <div className="mt-7 rounded-2xl border border-red-100 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-red-600">
                <AlertTriangle size={18} />
              </div>

              <div>
                <h3 className="text-sm font-black text-red-700">Warning</h3>

                <p className="mt-1 text-xs leading-6 text-red-600">
                  All donor details, medical records, and donation history will
                  be removed.
                </p>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-col gap-3">
            {/* DELETE */}
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-red-700 to-red-600 text-sm font-black text-white"
            >
              <Trash2 size={18} />

              {deleteLoading ? "Deleting..." : "Delete Donor"}
            </button>

            {/* CANCEL */}
            <button
              onClick={() => setOpen(false)}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 transition duration-300 hover:bg-slate-50"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteDonorModal;
