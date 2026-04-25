import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiFileText, FiImage, FiAward, FiUsers, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import appConfig from "../../config/app.config";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: FiHome, exact: true },
  { label: "Hero Banner", path: "/admin/hero", icon: FiImage },
  { label: "Notices", path: "/admin/notices", icon: FiFileText },
  { label: "Gallery", path: "/admin/gallery", icon: FiImage },
  { label: "Achievements", path: "/admin/achievements", icon: FiAward },
  { label: "Students", path: "/admin/students", icon: FiUsers },
  { label: "Staff", path: "/admin/staff", icon: FiUsers },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-dark-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-dark-100 px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-dark-600 hover:bg-dark-50"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <span className="font-bold font-heading text-dark-900">Admin Panel</span>
        <div className="w-10" />
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-dark-900/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-72 bg-white border-r border-dark-100 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="px-6 py-6 border-b border-dark-100">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h2 className="font-bold font-heading text-dark-900 text-sm">{appConfig.APP_NAME}</h2>
                <p className="text-xs text-dark-400">Admin Panel</p>
              </div>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(item)
                    ? "bg-primary-50 text-primary-700 shadow-sm"
                    : "text-dark-600 hover:text-dark-900 hover:bg-dark-50"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="px-4 py-4 border-t border-dark-100">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-bold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || "A"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-dark-900 truncate">{user?.name}</p>
                <p className="text-xs text-dark-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <FiLogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
