import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiAward } from "react-icons/fi";
import toast from "react-hot-toast";
import achievementApi from "../../services/achievement.api";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import { ACHIEVEMENT_TYPE } from "../../constants";

const AdminAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: ACHIEVEMENT_TYPE.STUDENT,
    date: "",
  });
  const [file, setFile] = useState(null);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const res = await achievementApi.getAll({ limit: 100 });
      setAchievements(res.data?.achievements || []);
    } catch (error) {
      toast.error("Failed to fetch achievements.");
    }
    setLoading(false);
  };

  useEffect(() => { fetchAchievements(); }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", type: ACHIEVEMENT_TYPE.STUDENT, date: "" });
    setFile(null);
    setEditing(null);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description,
      type: item.type,
      date: item.date ? item.date.split("T")[0] : "",
    });
    setFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("type", form.type);
    if (form.date) formData.append("date", form.date);
    if (file) formData.append("file", file);

    try {
      if (editing) {
        await achievementApi.update(editing._id, formData);
        toast.success("Achievement updated!");
      } else {
        await achievementApi.create(formData);
        toast.success("Achievement created!");
      }
      setShowModal(false);
      resetForm();
      fetchAchievements();
    } catch (error) {
      toast.error(error.message || "Failed to save.");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this achievement?")) return;
    try {
      await achievementApi.delete(id);
      toast.success("Achievement deleted!");
      fetchAchievements();
    } catch (error) {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-dark-900">Manage Achievements</h1>
          <p className="text-dark-500 text-sm mt-1">Track and showcase accomplishments</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary">
          <FiPlus size={18} className="mr-2" /> Add Achievement
        </button>
      </div>

      {loading ? (
        <Loader size="lg" className="py-20" />
      ) : achievements.length === 0 ? (
        <div className="card p-12 text-center">
          <FiAward className="mx-auto text-dark-300 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-dark-600">No achievements yet</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((a) => (
            <div key={a._id} className="card overflow-hidden">
              {a.image?.url ? (
                <div className="h-48 overflow-hidden">
                  <img src={a.image.url} alt={a.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                  <FiAward className="text-amber-300" size={48} />
                </div>
              )}
              <div className="p-5">
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                  a.type === ACHIEVEMENT_TYPE.STUDENT ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                }`}>{a.type}</span>
                <h3 className="font-semibold text-dark-900 mt-2">{a.title}</h3>
                <p className="text-sm text-dark-500 mt-1 line-clamp-2">{a.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-dark-400">
                    {new Date(a.date).toLocaleDateString("en-IN")}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(a)} className="p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100">
                      <FiEdit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(a._id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editing ? "Edit Achievement" : "Add Achievement"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Description *</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className="input-field resize-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Type *</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                {Object.values(ACHIEVEMENT_TYPE).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Image</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="input-field" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? <Loader size="sm" /> : editing ? "Update" : "Create"}
            </button>
            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminAchievements;
