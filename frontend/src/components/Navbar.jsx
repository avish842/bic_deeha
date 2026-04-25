import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { FiLogIn, FiLogOut, FiSettings, FiBook } from "react-icons/fi";
import appConfig from "../config/app.config";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-dark-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2.5 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl text-white shadow-md shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-all duration-300 transform group-hover:-translate-y-0.5">
              <FiBook size={24} className="group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-xl sm:text-2xl font-black font-heading text-dark-900 leading-none tracking-tight">
                BIC<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 ml-1">DEEHA</span>
              </span>
              <span className="text-[0.6rem] sm:text-xs font-bold uppercase tracking-[0.2em] text-dark-400 leading-none mt-1.5 ml-0.5">
                EST. 1965
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {appConfig.NAVBAR_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-dark-600 hover:text-dark-900 hover:bg-dark-50"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
                >
                  <FiSettings size={16} />
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all hover:-translate-y-0.5"
              >
                <FiLogIn size={16} />
                Admin Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-dark-600 hover:bg-dark-50 transition-colors"
          >
            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-dark-100 animate-slide-down">
            <div className="flex flex-col gap-1">
              {appConfig.NAVBAR_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-dark-600 hover:text-dark-900 hover:bg-dark-50"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <hr className="my-2 border-dark-100" />
              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 rounded-lg text-sm font-medium text-primary-700 hover:bg-primary-50 transition-colors flex items-center gap-2"
                  >
                    <FiSettings size={16} /> Admin Panel
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 text-left"
                  >
                    <FiLogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors flex items-center gap-2"
                >
                  <FiLogIn size={16} /> Admin Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
