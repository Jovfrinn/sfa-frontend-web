import MasterLayout from "../../masterLayout/MasterLayout";
import { Breadcrumb } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const RolePage = () => {
  const api = import.meta.env.VITE_API_URI;
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [roles, setRoles]       = useState([]);
  const [loading, setLoading]   = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editRole, setEditRole]  = useState(null);
  const [form, setForm]          = useState({ name: "", parent_id: "" });
  const [saving, setSaving]      = useState(false);
  const [error, setError]        = useState("");

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${api}/roles`, { headers });
      setRoles(res.data?.data ?? []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRoles(); }, []);

  const openCreate = () => {
    setEditRole(null);
    setForm({ name: "", parent_id: "" });
    setError("");
    setShowModal(true);
  };

  const openEdit = (role) => {
    setEditRole(role);
    setForm({ name: role.name, parent_id: role.parent_id ?? "" });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = { name: form.name, parent_id: form.parent_id || null };
      if (editRole) {
        await axios.put(`${api}/roles/${editRole.id}`, payload, { headers });
      } else {
        await axios.post(`${api}/roles`, payload, { headers });
      }
      setShowModal(false);
      fetchRoles();
    } catch (e) {
      setError(e.response?.data?.message ?? "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (role) => {
    if (!window.confirm(`Hapus role "${role.name}"?`)) return;
    try {
      await axios.delete(`${api}/roles/${role.id}`, { headers });
      fetchRoles();
    } catch (e) {
      alert(e.response?.data?.message ?? "Gagal menghapus");
    }
  };

  return (
    <MasterLayout>
      <Breadcrumb title="Master - Role Management" />
      <div className="card h-100 p-0 radius-12">
        <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
          <h6 className="text-lg fw-semibold mb-0">Daftar Role</h6>
          <button className="btn btn-primary px-20 py-11" onClick={openCreate}>
            <Icon icon="ic:round-plus" className="me-4" /> Tambah Role
          </button>
        </div>
        <div className="card-body p-24">
          {loading ? (
            <p className="text-center text-secondary-light">Memuat...</p>
          ) : (
            <div className="table-responsive scroll-sm">
              <table className="table bordered-table sm-table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nama Role</th>
                    <th>Parent Role</th>
                    <th className="text-center">Jumlah User</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-20">Belum ada role</td></tr>
                  )}
                  {roles.map((role, idx) => (
                    <tr key={role.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <span className="badge bg-primary-50 text-primary-600 px-12 py-6 radius-4">
                          {role.name}
                        </span>
                      </td>
                      <td>{role.parent_name ?? <span className="text-secondary-light">—</span>}</td>
                      <td className="text-center">{role.user_count}</td>
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <button className="btn btn-outline-primary-600 px-14 py-8"
                            onClick={() => openEdit(role)}>
                            Edit
                          </button>
                          <button className="btn btn-outline-danger-600 px-14 py-8"
                            onClick={() => handleDelete(role)}>
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content radius-12">
              <div className="modal-header border-bottom px-24 py-16">
                <h6 className="modal-title fw-semibold">{editRole ? "Edit Role" : "Tambah Role Baru"}</h6>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body px-24 py-20">
                {error && <div className="alert alert-danger py-8 mb-16">{error}</div>}
                <div className="mb-16">
                  <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                    Nama Role <span className="text-danger-600">*</span>
                  </label>
                  <input type="text" className="form-control radius-8"
                    placeholder="Contoh: Manager Sales" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="mb-16">
                  <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                    Parent Role (opsional)
                  </label>
                  <select className="form-control radius-8 form-select"
                    value={form.parent_id} onChange={(e) => setForm({ ...form, parent_id: e.target.value })}>
                    <option value="">— Tidak ada parent (top-level) —</option>
                    {roles
                      .filter((r) => r.id !== editRole?.id)
                      .map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer border-top px-24 py-16 gap-2">
                <button className="btn btn-outline-secondary px-24" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button className="btn btn-primary px-24" onClick={handleSave} disabled={saving || !form.name}>
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MasterLayout>
  );
};

export default RolePage;
