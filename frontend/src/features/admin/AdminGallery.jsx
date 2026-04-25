import { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiImage } from "react-icons/fi";
import toast from "react-hot-toast";
import galleryApi from "../../services/gallery.api";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";

const AdminGallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({ title: "", category: "" });
  const [files, setFiles] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [galRes, catRes] = await Promise.all([
        galleryApi.getAll({ limit: 100 }),
        galleryApi.getCategories(),
      ]);
      setGalleries(galRes.data?.galleries || []);
      setCategories(catRes.data || []);
    } catch (error) {
      toast.error("Failed to load gallery data.");
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await galleryApi.createCategory({ name: categoryName });
      toast.success("Category created!");
      setCategoryName("");
      setShowCatModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.message || "Failed to create category.");
    }
    setSubmitting(false);
  };

  const handleCreateGallery = async (e) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      toast.error("Please select at least one image.");
      return;
    }
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("category", form.category);
    for (const file of files) {
      formData.append("files", file);
    }

    try {
      await galleryApi.create(formData);
      toast.success("Gallery created!");
      setShowModal(false);
      setForm({ title: "", category: "" });
      setFiles(null);
      fetchData();
    } catch (error) {
      toast.error(error.message || "Failed to create gallery.");
    }
    setSubmitting(false);
  };

  const handleDeleteGallery = async (id) => {
    if (!window.confirm("Delete this gallery and all its images?")) return;
    try {
      await galleryApi.delete(id);
      toast.success("Gallery deleted!");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete gallery.");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category and ALL associated galleries?")) return;
    try {
      await galleryApi.deleteCategory(id);
      toast.success("Category deleted!");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete category.");
    }
  };

  return (
    <div className="page-enter">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-dark-900">Manage Gallery</h1>
          <p className="text-dark-500 text-sm mt-1">Upload and organize photos</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowCatModal(true)} className="btn-secondary">
            <FiPlus size={18} className="mr-2" /> Category
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <FiPlus size={18} className="mr-2" /> Upload Photos
          </button>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-dark-500 uppercase tracking-wider mb-3">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <div key={cat._id} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-dark-200">
                <span className="text-sm text-dark-700">{cat.name}</span>
                <button
                  onClick={() => handleDeleteCategory(cat._id)}
                  className="text-dark-400 hover:text-red-500 transition-colors"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {loading ? (
        <Loader size="lg" className="py-20" />
      ) : galleries.length === 0 ? (
        <div className="card p-12 text-center">
          <FiImage className="mx-auto text-dark-300 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-dark-600">No galleries yet</h3>
          <p className="text-sm text-dark-400 mt-1">Upload your first photos!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <div key={gallery._id} className="card overflow-hidden">
              {/* Image Preview */}
              <div className="grid grid-cols-2 gap-1 h-48">
                {gallery.images.slice(0, 4).map((img, i) => (
                  <div key={i} className="relative overflow-hidden">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    {i === 3 && gallery.images.length > 4 && (
                      <div className="absolute inset-0 bg-dark-900/60 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">+{gallery.images.length - 4}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-dark-900">{gallery.title}</h3>
                  <p className="text-xs text-dark-400 mt-1">
                    {gallery.category?.name} • {gallery.images.length} images
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteGallery(gallery._id)}
                  className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Category Modal */}
      <Modal isOpen={showCatModal} onClose={() => setShowCatModal(false)} title="Create Category" size="sm">
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Category Name *</label>
            <input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required className="input-field" placeholder="e.g., Annual Day" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? <Loader size="sm" /> : "Create"}
            </button>
            <button type="button" onClick={() => setShowCatModal(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </Modal>

      {/* Upload Photos Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Upload Photos" size="md">
        <form onSubmit={handleCreateGallery} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="input-field" placeholder="Gallery title" />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Category *</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="input-field">
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Images * (up to 10)</label>
            <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} className="input-field" />
            {files && <p className="text-xs text-dark-400 mt-1">{files.length} file(s) selected</p>}
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? <Loader size="sm" /> : "Upload"}
            </button>
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminGallery;
