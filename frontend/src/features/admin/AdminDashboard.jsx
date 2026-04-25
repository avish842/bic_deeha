import { useEffect, useState } from "react";
import { FiFileText, FiImage, FiAward, FiUsers } from "react-icons/fi";
import noticeApi from "../../services/notice.api";
import galleryApi from "../../services/gallery.api";
import achievementApi from "../../services/achievement.api";
import studentApi from "../../services/student.api";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    notices: 0,
    galleries: 0,
    achievements: 0,
    students: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [n, g, a, s] = await Promise.all([
          noticeApi.getAll({ limit: 1 }),
          galleryApi.getAll({ limit: 1 }),
          achievementApi.getAll({ limit: 1 }),
          studentApi.getAll({ limit: 1 }),
        ]);
        setStats({
          notices: n.data?.pagination?.totalItems || 0,
          galleries: g.data?.pagination?.totalItems || 0,
          achievements: a.data?.pagination?.totalItems || 0,
          students: s.data?.pagination?.totalItems || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Notices", value: stats.notices, icon: FiFileText, color: "from-blue-500 to-blue-600", bg: "bg-blue-50" },
    { label: "Gallery Albums", value: stats.galleries, icon: FiImage, color: "from-purple-500 to-purple-600", bg: "bg-purple-50" },
    { label: "Achievements", value: stats.achievements, icon: FiAward, color: "from-amber-500 to-amber-600", bg: "bg-amber-50" },
    { label: "Students", value: stats.students, icon: FiUsers, color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="page-enter">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading text-dark-900">
          Welcome back, {user?.name || "Admin"} 👋
        </h1>
        <p className="text-dark-500 mt-1">Here's an overview of your college website.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card) => (
          <div key={card.label} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                <card.icon className="text-white" size={22} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-dark-900 font-heading">{card.value}</h3>
            <p className="text-sm text-dark-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-lg font-bold font-heading text-dark-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Add Notice", path: "/admin/notices", icon: FiFileText },
            { label: "Upload Photos", path: "/admin/gallery", icon: FiImage },
            { label: "Add Achievement", path: "/admin/achievements", icon: FiAward },
            { label: "Add Student", path: "/admin/students", icon: FiUsers },
          ].map((action) => (
            <a
              key={action.label}
              href={action.path}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-dark-200 hover:border-primary-300 hover:bg-primary-50 text-dark-500 hover:text-primary-600 transition-all"
            >
              <action.icon size={24} />
              <span className="text-sm font-medium">{action.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
