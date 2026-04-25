import { useEffect, useState } from "react";
import { FiUsers, FiSearch } from "react-icons/fi";
import staffApi from "../services/staff.api";
import Loader from "../components/Loader";

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const params = { limit: 100 };
        if (search) params.search = search;
        const res = await staffApi.getAll(params);
        setStaffList(res.data?.staff || []);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
      setLoading(false);
    };
    fetchStaff();
  }, [search]);

  return (
    <div className="page-enter py-20 min-h-screen bg-dark-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-dark-900 mb-4">Our Teaching Faculty & Staff</h1>
          <p className="text-lg text-dark-500 max-w-2xl mx-auto">
            Meet the dedicated educators and support staff committed to shaping the future of our students.
          </p>
        </div>

        <div className="max-w-md mx-auto mb-10 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, subject, or designation..."
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-dark-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
          />
        </div>

        {loading ? (
          <Loader size="lg" className="py-20" />
        ) : staffList.length === 0 ? (
          <div className="text-center py-20">
            <FiUsers size={48} className="mx-auto text-dark-300 mb-4" />
            <h3 className="text-xl font-semibold text-dark-700">No staff members found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffList.map((member) => (
              <div key={member._id} className="bg-white rounded-2xl shadow-sm border border-dark-100 overflow-hidden hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-4 p-5 border-b border-dark-100 bg-gradient-to-r from-primary-50/50 to-white">
                  {member.image?.url ? (
                    <img src={member.image.url} alt={member.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary-100" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary-100/50 text-primary-600 flex items-center justify-center font-bold text-xl border-2 border-primary-100">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-dark-900 group-hover:text-primary-600 transition-colors">{member.name}</h3>
                    <span className="inline-block px-2.5 py-1 mt-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full uppercase tracking-wide">
                      {member.designation}
                    </span>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-dark-500">Qualification</span>
                    <span className="font-medium text-dark-900">{member.qualification}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-dark-500">Experience</span>
                    <span className="font-medium text-dark-900">{member.experience} Months</span>
                  </div>
                  {member.subjects && member.subjects.length > 0 && member.subjects[0] !== "NA" && (
                    <div className="pt-3 border-t border-dark-50">
                      <span className="block text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">Subjects</span>
                      <div className="flex flex-wrap gap-1.5">
                        {member.subjects.map((sub, i) => (
                          <span key={i} className="px-2 py-0.5 bg-dark-50 text-dark-600 text-xs rounded border border-dark-100">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Staff;
