import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiArrowRight, FiFileText, FiImage, FiAward, FiUsers } from "react-icons/fi";
import appConfig from "../config/app.config";
import noticeApi from "../services/notice.api";
import achievementApi from "../services/achievement.api";
import heroApi from "../services/hero.api";
import PriorityBadge from "../components/PriorityBadge";

const fallbackImages = [
  "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1523050853064-db0ef33e2b1b?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80",
];

const Home = () => {
  const [notices, setNotices] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [heroImages, setHeroImages] = useState(fallbackImages);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [noticeRes, achieveRes, heroRes] = await Promise.all([
          noticeApi.getAll({ limit: 5, isActive: "true" }),
          achievementApi.getAll({ limit: 4 }),
          heroApi.getActive(),
        ]);
        setNotices(noticeRes.data?.notices || []);
        setAchievements(achieveRes.data?.achievements || []);
        if (heroRes.data && heroRes.data.length > 0) {
          setHeroImages(heroRes.data.map(img => img.imageUrl));
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };
    fetchData();
  }, []);

  const features = [
    { icon: FiFileText, label: "Notices", desc: "Stay updated with latest announcements", path: "/notices", color: "from-blue-500 to-blue-600" },
    { icon: FiImage, label: "Gallery", desc: "Explore our campus memories", path: "/gallery", color: "from-purple-500 to-purple-600" },
    { icon: FiAward, label: "Achievements", desc: "Celebrating excellence", path: "/achievements", color: "from-amber-500 to-amber-600" },
    { icon: FiUsers, label: "Students", desc: "Find student profiles", path: "/students", color: "from-emerald-500 to-emerald-600" },
  ];

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Slider */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="absolute inset-0 bg-black/60 z-10" />
              <img
                src={img}
                alt={`School ${index + 1}`}
                className="w-full h-full object-cover scale-105 animate-slow-zoom"
              />
            </div>
          ))}
        </div>

        {/* Floating Gradients & Shapes */}
        <div className="absolute inset-0 z-10 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500 rounded-full blur-[150px]" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10 z-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-sm text-primary-200 mb-8">
              <span className="w-2 h-2 bg-secondary-400 rounded-full animate-pulse" />
              Welcome to {appConfig.APP_NAME}
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-heading text-white leading-tight mb-6">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-primary-300 to-secondary-400 bg-clip-text text-transparent">
                Balbhadra Inter College
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-dark-100 leading-relaxed mb-10 max-w-2xl font-light">
              Established in 1965, we are an aided co-educational institution located in Deeha, Pratapgarh. We are committed to academic development and overall student growth, providing quality education in a peaceful environment that supports learning and discipline.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/notices" className="btn-primary text-lg px-8 py-4 shadow-xl shadow-primary-500/20">
                View Notices
                <FiArrowRight className="ml-2" />
              </Link>
              <Link to="/gallery" className="btn-secondary text-lg px-8 py-4 !bg-white/10 !text-white !border-white/20 hover:!bg-white/20 backdrop-blur-sm">
                Explore Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">About Our Institution</h2>
            <p className="max-w-3xl mx-auto text-lg text-dark-600 leading-relaxed text-justify mb-4">
              Balbhadra Inter College, Deeha is a co-educational institution located in the village of Deeha, in Kunda, Pratapgarh district of the Prayagraj Division, Uttar Pradesh. Established in 1965 and officially recognized in 1972, the college has been serving the local community for decades by providing quality education to students from the surrounding rural and semi-urban areas. It operates as an aided institution and focuses on academic development along with overall student growth.
            </p>
            <p className="max-w-3xl mx-auto text-lg text-dark-600 leading-relaxed text-justify">
              The college is situated in a peaceful environment that supports learning and discipline. It has been a key educational center in the region, helping students build strong academic foundations and achieve success in various fields. Over the years, it has contributed significantly to improving literacy and educational standards in the area.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Explore Our Campus</h2>
            <p className="section-subtitle mx-auto">
              Everything you need to stay connected with college life
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.path}
                to={feature.path}
                className="group card p-6 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-dark-900 mb-2 font-heading">{feature.label}</h3>
                <p className="text-sm text-dark-500">{feature.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-primary-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <FiArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Notices */}
      {notices.length > 0 && (
        <section className="py-24 bg-dark-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="section-title mb-2">Latest Notices</h2>
                <p className="section-subtitle">Important announcements and updates</p>
              </div>
              <Link to="/notices" className="hidden sm:inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                View All <FiArrowRight />
              </Link>
            </div>

            <div className="space-y-4">
              {notices.map((notice) => (
                <div key={notice._id} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-dark-900">{notice.title}</h3>
                      <PriorityBadge priority={notice.priority} />
                    </div>
                    <p className="text-sm text-dark-500 line-clamp-1">{notice.description}</p>
                  </div>
                  <div className="text-xs text-dark-400 whitespace-nowrap">
                    {new Date(notice.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
              ))}
            </div>

            <div className="sm:hidden mt-6 text-center">
              <Link to="/notices" className="btn-primary">View All Notices</Link>
            </div>
          </div>
        </section>
      )}

      {/* Achievements Preview */}
      {achievements.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="section-title mb-2">Our Achievements</h2>
                <p className="section-subtitle">Celebrating academic and campus excellence</p>
              </div>
              <Link to="/achievements" className="hidden sm:inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                View All <FiArrowRight />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((a) => (
                <div key={a._id} className="card overflow-hidden group">
                  {a.image?.url ? (
                    <div className="h-48 overflow-hidden">
                      <img src={a.image.url} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                      <FiAward className="text-primary-300" size={48} />
                    </div>
                  )}
                  <div className="p-5">
                    <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">{a.type}</span>
                    <h3 className="font-semibold text-dark-900 mt-1 line-clamp-2">{a.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
