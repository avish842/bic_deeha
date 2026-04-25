import { useEffect, useState } from "react";
import { FiDownload, FiCalendar, FiFilter } from "react-icons/fi";
import noticeApi from "../services/notice.api";
import PriorityBadge from "../components/PriorityBadge";
import Loader from "../components/Loader";
import { PRIORITY } from "../constants";

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [pagination, setPagination] = useState({});

  const fetchNotices = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10, isActive: "true" };
      if (filter !== "all") params.priority = filter;

      const res = await noticeApi.getAll(params);
      setNotices(res.data?.notices || []);
      setPagination(res.data?.pagination || {});
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotices();
  }, [filter]);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-dark-50 page-enter">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="section-title mb-2">Notices & Announcements</h1>
          <p className="section-subtitle">Stay updated with the latest information</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-8">
          <FiFilter className="text-dark-400" />
          {["all", PRIORITY.HIGH, PRIORITY.NORMAL].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-500/25"
                  : "bg-white text-dark-600 border border-dark-200 hover:border-primary-300"
              }`}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>

        {/* Notices List */}
        {loading ? (
          <Loader size="lg" className="py-20" />
        ) : notices.length === 0 ? (
          <div className="card p-12 text-center">
            <FiCalendar className="mx-auto text-dark-300 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-dark-600">No notices found</h3>
            <p className="text-sm text-dark-400 mt-1">Check back later for updates</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map((notice, index) => (
              <div
                key={notice._id}
                className="card p-6 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-dark-900">{notice.title}</h3>
                      <PriorityBadge priority={notice.priority} />
                    </div>
                    <p className="text-dark-600 text-sm leading-relaxed mb-3">{notice.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-dark-400">
                      <span className="flex items-center gap-1">
                        <FiCalendar size={12} />
                        {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </span>
                      {notice.expiryDate && (
                        <span className="text-amber-600">
                          Expires: {new Date(notice.expiryDate).toLocaleDateString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                  {notice.file?.url && (
                    <a
                      href={notice.file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-50 text-primary-700 text-sm font-semibold hover:bg-primary-100 transition-colors"
                    >
                      <FiDownload size={16} />
                      <span className="hidden sm:inline">Download</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchNotices(page)}
                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                  page === pagination.currentPage
                    ? "bg-primary-600 text-white shadow-lg"
                    : "bg-white text-dark-600 border border-dark-200 hover:border-primary-300"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notices;
