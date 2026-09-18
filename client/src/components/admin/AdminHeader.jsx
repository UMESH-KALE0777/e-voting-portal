// client/src/components/admin/AdminHeader.jsx
const AdminHeader = ({ user }) => {
  const initial = user?.name?.charAt(0).toUpperCase() || "A";

  return (
    <div className="flex items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">

      {/* Title */}
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
          Election Commission
        </p>
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
          Admin Dashboard
        </h1>
      </div>

      {/* Admin badge */}
      <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 flex-shrink-0">
        <div className="w-7 h-7 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
          {initial}
        </div>
        <div className="hidden sm:block min-w-0">
          {/* ✅ FIX 2: safe fallback if user.name is undefined */}
          <p className="text-xs font-semibold text-orange-900 truncate max-w-[120px]">
            {user?.name || "Admin"}
          </p>
          {/* ✅ FIX 3: show real email instead of hardcoded role label */}
          <p className="text-xs text-orange-500 truncate max-w-[120px]">
            {user?.email || "Election Commission"}
          </p>
        </div>
      </div>

    </div>
  );
};

export default AdminHeader;