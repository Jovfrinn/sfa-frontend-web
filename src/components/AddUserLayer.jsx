import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import { useEffect, useState } from "react";

const AddUserLayer = ({ onSuccess }) => {
  const api = import.meta.env.VITE_API_URI;
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    full_name: "", email: "", username: "", password: "",
    company_id: "", role_id: "",
  });
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    axios.get(`${api}/company/select`, { headers })
      .then((r) => setCompanies(r.data?.data ?? r.data))
      .catch(console.error);
    axios.get(`${api}/roles`, { headers })
      .then((r) => setRoles(r.data?.data ?? []))
      .catch(console.error);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${api}/user/store`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ full_name: "", email: "", username: "", password: "", company_id: "", role_id: "" });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message ?? "Gagal menyimpan user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-body p-24">
        <div className="row justify-content-center">
          <div className="col-xxl-6 col-xl-8 col-lg-10">
            <div className="card border">
              <div className="card-body">
                <h6 className="text-md text-primary-light mb-16">Tambah User Baru</h6>
                {error && <div className="alert alert-danger py-8">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-20">
                    <label htmlFor="full_name" className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Full Name <span className="text-danger-600">*</span>
                    </label>
                    <input type="text" className="form-control radius-8" id="full_name"
                      placeholder="Masukkan nama lengkap" value={form.full_name} onChange={handleChange} required />
                  </div>
                  <div className="mb-20">
                    <label htmlFor="email" className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Email <span className="text-danger-600">*</span>
                    </label>
                    <input type="email" className="form-control radius-8" id="email"
                      placeholder="Masukkan email" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="mb-20">
                    <label htmlFor="username" className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Username <span className="text-danger-600">*</span>
                    </label>
                    <input type="text" className="form-control radius-8" id="username"
                      placeholder="Masukkan username" value={form.username} onChange={handleChange} required />
                  </div>
                  <div className="mb-20">
                    <label htmlFor="password" className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Password <span className="text-danger-600">*</span>
                    </label>
                    <input type="password" className="form-control radius-8" id="password"
                      placeholder="Minimal 8 karakter" value={form.password} onChange={handleChange} required />
                  </div>
                  <div className="mb-20">
                    <label htmlFor="company_id" className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Company <span className="text-danger-600">*</span>
                    </label>
                    <select className="form-control radius-8 form-select" id="company_id"
                      value={form.company_id} onChange={handleChange} required>
                      <option value="">-- Pilih Company --</option>
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-20">
                    <label htmlFor="role_id" className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Role
                    </label>
                    <select className="form-control radius-8 form-select" id="role_id"
                      value={form.role_id} onChange={handleChange}>
                      <option value="">-- Pilih Role --</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="d-flex align-items-center justify-content-center gap-3">
                    <button type="button" onClick={() => setForm({ full_name: "", email: "", username: "", password: "", company_id: "", role_id: "" })}
                      className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8">
                      Reset
                    </button>
                    <button type="submit" disabled={loading}
                      className="btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8">
                      {loading ? "Menyimpan..." : "Simpan"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserLayer;
