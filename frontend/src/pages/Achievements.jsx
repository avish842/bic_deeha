import { useEffect, useState } from "react";
import { FiAward, FiFilter, FiCalendar } from "react-icons/fi";
import achievementApi from "../services/achievement.api";
import Loader from "../components/Loader";
import { ACHIEVEMENT_TYPE } from "../constants";

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      try {
        const params = { limit: 50 };
        if (typeFilter !== "all") params.type = typeFilter;

        const res = await achievementApi.getAll(params);
        setAchievements(res.data?.achievements || []);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      }
      setLoading(false);
    };
    fetchAchievements();
  }, [typeFilter]);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-dark-50 page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="section-title mb-2">Achievements</h1>
          <p className="section-subtitle">Celebrating our triumphs and milestones</p>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-3 mb-10">
          <FiFilter className="text-dark-400" />
          {["all", ...Object.values(ACHIEVEMENT_TYPE)].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                typeFilter === t
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-500/25"
                  : "bg-white text-dark-600 border border-dark-200 hover:border-primary-300"
              }`}
            >
              {t === "all" ? "All" : t}
            </button>
          ))}
        </div>

        {/* Cards */}
        {loading ? (
          <Loader size="lg" className="py-20" />
        ) : achievements.length === 0 ? (
          <div className="card p-12 text-center">
            <FiAward className="mx-auto text-dark-300 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-dark-600">No achievements found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((a, index) => (
              <div
                key={a._id}
                className="card overflow-hidden group animate-slide-up"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {a.image?.url ? (
                  <div className="h-56 overflow-hidden">
                    <img
                      src={a.image.url}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="h-56 bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                    <FiAward className="text-amber-300" size={56} />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      a.type === ACHIEVEMENT_TYPE.STUDENT
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {a.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-dark-900 mb-2 font-heading">{a.title}</h3>
                  <p className="text-sm text-dark-500 line-clamp-3 mb-3">{a.description}</p>
                  <div className="flex items-center gap-1 text-xs text-dark-400">
                    <FiCalendar size={12} />
                    {new Date(a.date).toLocaleDateString("en-IN", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
