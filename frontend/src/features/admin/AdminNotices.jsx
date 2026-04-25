import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiDownload } from "react-icons/fi";
import toast from "react-hot-toast";
import noticeApi from "../../services/notice.api";
import PriorityBadge from "../../components/PriorityBadge";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import { PRIORITY } from "../../constants";

const AdminNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: PRIORITY.NORMAL,
    expiryDate: "",
    isActive: true,
  });
  const [file, setFile] = useState(null);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await noticeApi.getAll({ limit: 100 });
      setNotices(res.data?.notices || []);
    } catch (error) {
      toast.error("Failed to fetch notices.");
    }
    setLoading(false);
  };

  useEffect(() => { fetchNotices(); }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", priority: PRIORITY.NORMAL, expiryDate: "", isActive: true });
    setFile(null);
    setEditingNotice(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (notice) => {
    setEditingNotice(notice);
    setForm({
      title: notice.title,
      description: notice.description,
      priority: notice.priority,
      expiryDate: notice.expiryDate ? notice.expiryDate.split("T")[0] : "",
      isActive: notice.isActive,
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
    formData.append("priority", form.priority);
    if (form.expiryDate) formData.append("expiryDate", form.expiryDate);
    formData.append("isActive", form.isActive);
    if (file) formData.append("file", file);

    try {
      if (editingNotice) {
        await noticeApi.update(editingNotice._id, formData);
        toast.success("Notice updated!");
      } else {
        await noticeApi.create(formData);
        toast.success("Notice created!");
      }
      setShowModal(false);
      resetForm();
      fetchNotices();
    } catch (error) {
      toast.error(error.message || "Failed to save notice.");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;

    try {
      await noticeApi.delete(id);
      toast.success("Notice deleted!");
      fetchNotices();
    } catch (error) {
      toast.error("Failed to delete notice.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-dark-900">Manage Notices</h1>
          <p className="text-dark-500 text-sm mt-1">Create and manage announcements</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <FiPlus size={18} className="mr-2" /> Add Notice
        </button>
      </div>

      {loading ? (
        <Loader size="lg" className="py-20" />
      ) : notices.length === 0 ? (
        <div className="card p-12 text-center">
          <h3 className="text-lg font-semibold text-dark-600">No notices yet</h3>
          <p className="text-sm text-dark-400 mt-1">Click "Add Notice" to create your first one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <div key={notice._id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className="font-semibold text-dark-900">{notice.title}</h3>
                    <PriorityBadge priority={notice.priority} />
                    {!notice.isActive && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-dark-100 text-dark-500">Inactive</span>
                    )}
                  </div>
                  <p className="text-sm text-dark-500 line-clamp-2">{notice.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-dark-400">
                    <span>{new Date(notice.createdAt).toLocaleDateString("en-IN")}</span>
                    {notice.file?.url && (
                      <a href={notice.file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary-600 hover:underline">
                        <FiDownload size={12} /> File
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(notice)}
                    className="p-2.5 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(notice._id)}
                    className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title={editingNotice ? "Edit Notice" : "Create Notice"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required className="input-field" placeholder="Notice title" />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className="input-field resize-none" placeholder="Write description..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
                {Object.values(PRIORITY).map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Expiry Date</label>
              <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} className="input-field" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Attachment (PDF/Image)</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="input-field" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx" />
            {editingNotice?.file?.url && !file && (
              <p className="text-xs text-dark-400 mt-1">Current file: {editingNotice.file.fileName || "Attached"}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} id="isActive" className="w-4 h-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500" />
            <label htmlFor="isActive" className="text-sm font-medium text-dark-700">Active</label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? <Loader size="sm" /> : editingNotice ? "Update Notice" : "Create Notice"}
            </button>
            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminNotices;
