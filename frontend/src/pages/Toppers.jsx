import { useEffect, useState } from "react";
import { FiAward, FiBook, FiUser } from "react-icons/fi";
import studentApi from "../services/student.api";
import Loader from "../components/Loader";
import appConfig from "../config/app.config";

const Toppers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToppers = async () => {
      setLoading(true);
      try {
        const res = await studentApi.getToppers();
        setData(res.data?.students || []);
      } catch (error) {
        console.error("Error fetching toppers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchToppers();
  }, []);

  // Group toppers by passingYear
  const groupedToppers = data.reduce((acc, student) => {
    const year = student.passingYear || "Unknown Year";
    if (!acc[year]) acc[year] = [];
    acc[year].push(student);
    return acc;
  }, {});

  // Sort years descending
  const sortedYears = Object.keys(groupedToppers).sort((a, b) => b - a);

  return (
    <div className="page-enter pt-24 pb-12">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-900 to-secondary-900 text-white py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Our Bright Toppers</h1>
          <p className="text-primary-100 max-w-2xl mx-auto text-lg">
            Celebrating the academic excellence and hard work of our top-performing students at {appConfig.APP_NAME}.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-20"><Loader size="lg" /></div>
        ) : sortedYears.length > 0 ? (
          sortedYears.map((year) => (
            <div key={year} className="mb-16">
              <h2 className="text-3xl font-bold text-dark-900 mb-8 border-b-2 border-primary-500 pb-2 inline-block">
                Class of {year}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {groupedToppers[year]
                  .sort((a, b) => b.percentage - a.percentage)
                  .map((student) => (
                    <div key={student._id} className="card overflow-hidden hover:shadow-xl transition-all duration-300 group">
                      <div className="bg-gradient-to-br from-amber-400 to-orange-500 h-32 relative flex justify-center">
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur text-white px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1 shadow-sm">
                          <FiAward /> {student.percentage}%
                        </div>
                        {student.profileImage?.url ? (
                          <img 
                            src={student.profileImage.url} 
                            alt={student.name}
                            className="w-24 h-24 rounded-full object-cover border-4 border-white absolute bottom-0 translate-y-1/2 shadow-lg bg-white"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full border-4 border-white absolute bottom-0 translate-y-1/2 shadow-lg bg-dark-50 flex items-center justify-center">
                            <span className="text-3xl font-bold text-amber-500">{student.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="pt-16 pb-6 px-6 text-center">
                        <h3 className="text-xl font-bold font-heading text-dark-900 mb-1 group-hover:text-primary-600 transition-colors">
                          {student.name}
                        </h3>
                        <p className="text-sm font-medium text-dark-500 mb-4">
                           {student.stream !== "N/A" ? `${student.stream} Stream` : `Class ${student.currentClass}`}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dark-100">
            <FiAward className="mx-auto text-dark-300 mb-4" size={48} />
            <h3 className="text-xl font-bold font-heading text-dark-900 mb-2">No toppers found</h3>
            <p className="text-dark-500">Topper students will be displayed here soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Toppers;
