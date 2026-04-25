import { useEffect, useState } from "react";
import { FiImage, FiX } from "react-icons/fi";
import galleryApi from "../services/gallery.api";
import Loader from "../components/Loader";

const Gallery = () => {
  const [categories, setCategories] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await galleryApi.getCategories();
        setCategories(res.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchGalleries = async () => {
      setLoading(true);
      try {
        let res;
        if (activeCategory === "all") {
          res = await galleryApi.getAll({ limit: 50 });
          setGalleries(res.data?.galleries || []);
        } else {
          res = await galleryApi.getByCategory(activeCategory);
          setGalleries(res.data?.galleries || []);
        }
      } catch (error) {
        console.error("Error fetching galleries:", error);
      }
      setLoading(false);
    };
    fetchGalleries();
  }, [activeCategory]);

  // Flatten all images for display
  const allImages = galleries.flatMap((g) =>
    g.images.map((img) => ({ ...img, title: g.title, galleryId: g._id }))
  );

  return (
    <div className="min-h-screen pt-24 pb-16 bg-dark-50 page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="section-title mb-2">Photo Gallery</h1>
          <p className="section-subtitle">Capturing moments that matter</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeCategory === "all"
                ? "bg-primary-600 text-white shadow-lg shadow-primary-500/25"
                : "bg-white text-dark-600 border border-dark-200 hover:border-primary-300"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat.slug
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-500/25"
                  : "bg-white text-dark-600 border border-dark-200 hover:border-primary-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <Loader size="lg" className="py-20" />
        ) : allImages.length === 0 ? (
          <div className="card p-12 text-center">
            <FiImage className="mx-auto text-dark-300 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-dark-600">No images found</h3>
            <p className="text-sm text-dark-400 mt-1">Gallery is empty for this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {allImages.map((img, index) => (
              <div
                key={`${img.publicId}-${index}`}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer card border-0 shadow-md"
                onClick={() => setLightbox(img)}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-sm font-semibold truncate">{img.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {lightbox && (
          <div
            className="fixed inset-0 z-50 bg-dark-900/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              onClick={() => setLightbox(null)}
            >
              <FiX size={20} />
            </button>
            <img
              src={lightbox.url}
              alt={lightbox.title}
              className="max-w-full max-h-[85vh] rounded-2xl animate-scale-in shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
