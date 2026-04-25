import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";
import staffApi from "../../services/staff.api";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";

const AdminStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    designation: "",
    experience: 0,
    subjects: "",
    qualification: "",
  });
  const [file, setFile] = useState(null);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (search) params.search = search;
      const res = await staffApi.getAll(params);
      setStaff(res.data?.staff || []);
    } catch (error) {
      toast.error("Failed to fetch staff.");
    }
    setLoading(false);
  };

  useEffect(() => { fetchStaff(); }, [search]);

  const resetForm = () => {
    setForm({ name: "", designation: "", experience: 0, subjects: "", qualification: "" });
    setFile(null);
    setEditing(null);
  };

  const openEdit = (member) => {
    setEditing(member);
    setForm({
      name: member.name,
      designation: member.designation,
      experience: member.experience,
      subjects: member.subjects?.join(", ") || "",
      qualification: member.qualification,
    });
    setFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("designation", form.designation);
    formData.append("experience", form.experience);
    formData.append("subjects", form.subjects);
    formData.append("qualification", form.qualification);
    if (file) formData.append("file", file);

    try {
      if (editing) {
        await staffApi.update(editing._id, formData);
        toast.success("Staff updated!");
      } else {
        await staffApi.create(formData);
        toast.success("Staff added!");
      }
      setShowModal(false);
      resetForm();
      fetchStaff();
    } catch (error) {
      toast.error(error.message || "Failed to save staff.");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this staff member?")) return;
    try {
      await staffApi.delete(id);
      toast.success("Deleted successfully!");
      fetchStaff();
    } catch (error) {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div className="page-enter">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-dark-900">Manage Staff</h1>
          <p className="text-dark-500 text-sm mt-1">Add and manage teaching faculty & clerks</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary">
          <FiPlus size={18} className="mr-2" /> Add Staff
        </button>
      </div>

      <div className="relative mb-6 max-w-md">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search staff, designation..."
          className="input-field pl-11"
        />
      </div>

      {loading ? (
        <Loader size="lg" className="py-20" />
      ) : staff.length === 0 ? (
        <div className="card p-12 text-center">
          <FiUsers className="mx-auto text-dark-300 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-dark-600">No staff found</h3>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-50 border-b border-dark-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-500 uppercase">Staff</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-500 uppercase">Designation</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-500 uppercase">Qual / Exp</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-500 uppercase">Subjects</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-dark-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100">
                {staff.map((s) => (
                  <tr key={s._id} className="hover:bg-dark-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {s.image?.url ? (
                          <img src={s.image.url} alt={s.name} className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center font-bold text-sm text-primary-700">
                            {s.name.charAt(0)}
                          </div>
                        )}
                        <span className="font-medium text-dark-900">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-dark-600 text-sm">{s.designation}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="text-dark-900">{s.qualification}</div>
                      <div className="text-xs text-dark-500">{s.experience} Months</div>
                    </td>
                    <td className="px-6 py-4 text-dark-600 text-sm break-words max-w-[200px]">
                      {s.subjects?.join(", ")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(s)} className="p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100">
                          <FiEdit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(s._id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editing ? "Edit Staff" : "Add Staff"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Full Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field" placeholder="Ram Kumar" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Designation *</label>
              <input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} required className="input-field" placeholder="Assistant Teacher" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Experience (Months)</label>
              <input type="number" value={form.experience} onChange={(e) => setForm({ ...form, experience: Number(e.target.value) })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Qualification</label>
              <input value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} className="input-field" placeholder="Post Graduate" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Subjects (Comma separated)</label>
            <input value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} className="input-field" placeholder="English, Hindi, SC" />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Profile Photo</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="input-field" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? <Loader size="sm" /> : editing ? "Update" : "Add"}</button>
            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminStaff;
