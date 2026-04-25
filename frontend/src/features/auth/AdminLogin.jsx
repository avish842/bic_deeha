import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";
import appConfig from "../../config/app.config";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate("/admin", { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    if (success) {
      navigate("/admin", { replace: true });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-950 via-primary-900 to-dark-900 px-4 page-enter">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500 rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-500 rounded-full blur-[150px] opacity-15" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-primary-500/30">
            <span className="text-white font-bold text-2xl font-heading">C</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">{appConfig.APP_NAME}</h1>
          <p className="text-primary-300 text-sm mt-1">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white font-heading">Welcome back</h2>
            <p className="text-dark-400 text-sm mt-1">Sign in to your admin account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@college.com"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border-2 border-white/10 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-400/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border-2 border-white/10 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-400/10 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 disabled:opacity-50"
            >
              {loading ? (
                <Loader size="sm" />
              ) : (
                <>
                  <FiLogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
