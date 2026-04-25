import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiSearch, FiAward } from "react-icons/fi";
import toast from "react-hot-toast";
import studentApi from "../../services/student.api";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    admissionNumber: "",
    currentClass: 6,
    stream: "N/A",
    isTopper: false,
    passingYear: "",
    percentage: "",
  });
  const [file, setFile] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (search) params.search = search;
      const res = await studentApi.getAll(params);
      setStudents(res.data?.students || []);
    } catch (error) {
      toast.error("Failed to fetch students.");
    }
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, [search]);

  const resetForm = () => {
    setForm({ name: "", admissionNumber: "", currentClass: 6, stream: "N/A", isTopper: false, passingYear: "", percentage: "" });
    setFile(null);
    setEditing(null);
  };

  const openEdit = (student) => {
    setEditing(student);
    setForm({
      name: student.name,
      admissionNumber: student.admissionNumber,
      currentClass: student.currentClass,
      stream: student.stream,
      isTopper: student.isTopper || false,
      passingYear: student.passingYear || "",
      percentage: student.percentage || "",
    });
    setFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("admissionNumber", form.admissionNumber);
    formData.append("currentClass", form.currentClass);
    formData.append("stream", form.stream);
    formData.append("isTopper", form.isTopper);
    if (form.passingYear) formData.append("passingYear", form.passingYear);
    if (form.percentage) formData.append("percentage", form.percentage);
    if (file) formData.append("file", file);

    try {
      if (editing) {
        await studentApi.update(editing._id, formData);
        toast.success("Student updated!");
      } else {
        await studentApi.create(formData);
        toast.success("Student added!");
      }
      setShowModal(false);
      resetForm();
      fetchStudents();
    } catch (error) {
      toast.error(error.message || "Failed to save student.");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await studentApi.delete(id);
      toast.success("Student deleted!");
      fetchStudents();
    } catch (error) {
      toast.error("Failed to delete student.");
    }
  };

  return (
    <div className="page-enter">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-dark-900">Manage Students</h1>
          <p className="text-dark-500 text-sm mt-1">Add and manage student records</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary">
          <FiPlus size={18} className="mr-2" /> Add Student
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or admission number..."
          className="input-field pl-11"
        />
      </div>

      {loading ? (
        <Loader size="lg" className="py-20" />
      ) : students.length === 0 ? (
        <div className="card p-12 text-center">
          <FiUsers className="mx-auto text-dark-300 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-dark-600">No students found</h3>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-50 border-b border-dark-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-500 uppercase tracking-wider">Admission No.</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-500 uppercase tracking-wider">Stream</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-500 uppercase tracking-wider">Topper Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-dark-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100">
                {students.map((s) => (
                  <tr key={s._id} className="hover:bg-dark-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {s.profileImage?.url ? (
                          <img src={s.profileImage.url} alt={s.name} className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-700 font-bold text-sm">{s.name.charAt(0)}</span>
                          </div>
                        )}
                        <span className="font-medium text-dark-900">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-dark-600 font-mono text-sm">{s.admissionNumber}</td>
                    <td className="px-6 py-4 text-dark-600">{s.currentClass}</td>
                    <td className="px-6 py-4 text-dark-600">{s.stream}</td>
                    <td className="px-6 py-4">
                      {s.isTopper ? (
                        <div className="flex flex-col">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 self-start">
                            <FiAward className="mr-1" /> {s.percentage}% ({s.passingYear})
                          </span>
                        </div>
                      ) : (
                        <span className="text-dark-400 text-sm">-</span>
                      )}
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

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editing ? "Edit Student" : "Add Student"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Full Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Admission Number *</label>
              <input value={form.admissionNumber} onChange={(e) => setForm({ ...form, admissionNumber: e.target.value })} required className="input-field" placeholder="2024CS001" disabled={!!editing} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Class *</label>
              <select value={form.currentClass} onChange={(e) => setForm({ ...form, currentClass: parseInt(e.target.value) })} className="input-field" required>
                {[6, 7, 8, 9, 10, 11, 12].map((y) => (
                  <option key={y} value={y}>Class {y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Stream</label>
              <select value={form.stream} onChange={(e) => setForm({ ...form, stream: e.target.value })} className="input-field">
                {["Science", "Arts", "Commerce", "Agriculture", "N/A"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="border border-dark-200 p-4 rounded-xl space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isTopper} onChange={(e) => setForm({ ...form, isTopper: e.target.checked })} className="w-5 h-5 text-primary-600 rounded border-dark-300 focus:ring-primary-500" />
              <span className="font-semibold text-dark-800">Mark as Topper</span>
            </label>
            
            {form.isTopper && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1.5">Passing Year</label>
                  <input type="number" value={form.passingYear} onChange={(e) => setForm({ ...form, passingYear: e.target.value })} className="input-field" placeholder="e.g. 2024" min="1965" max="2100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1.5">Percentage (%)</label>
                  <input type="number" step="0.1" value={form.percentage} onChange={(e) => setForm({ ...form, percentage: e.target.value })} className="input-field" placeholder="e.g. 95.5" min="0" max="100" />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Profile Image</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="input-field" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? <Loader size="sm" /> : editing ? "Update" : "Add Student"}
            </button>
            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminStudents;
