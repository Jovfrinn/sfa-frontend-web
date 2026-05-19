import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import { useEffect, useState } from "react";

const AssignRoleLayer = () => {
  const api = import.meta.env.VITE_API_URI;
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [users, setUsers]     = useState([]);
  const [roles, setRoles]     = useState([]);
  const [search, setSearch]   = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId]     = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [saving, setSaving]   = useState(false);

  const fetchUsers = async (s = "") => {
    setLoading(true);
    try {
      const res = await axios.get(`${api}/user/list`, {
        headers, params: { search: s, per_page: 20 },
      });
      setUsers(res.data?.data?.data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${api}/roles`, { headers });
      setRoles(res.data?.data ?? []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchUsers(); fetchRoles(); }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchUsers(e.target.value);
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setSelectedRole(user.role_id ?? "");
  };

  const saveRole = async (userId) => {
    setSaving(true);
    try {
      await axios.put(`${api}/user/assign-role/${userId}`, { role_id: selectedRole || null }, { headers });
      setEditingId(null);
      fetchUsers(search);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <form className="navbar-search">
            <input type="text" className="bg-base h-40-px w-auto"
              placeholder="Cari nama..." value={search} onChange={handleSearch} />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
        </div>
      </div>
      <div className="card-body p-24">
        {loading ? (
          <p className="text-center text-secondary-light">Memuat data...</p>
        ) : (
          <div className="table-responsive scroll-sm">
            <table className="table bordered-table sm-table mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th className="text-center">Role</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-20">Tidak ada data</td></tr>
                )}
                {users.map((user, idx) => (
                  <tr key={user.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <span className="text-md fw-normal text-secondary-light">{user.full_name}</span>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.company?.name ?? "-"}</td>
                    <td className="text-center">
                      {editingId === user.id ? (
                        <select className="form-select form-select-sm w-auto"
                          value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                          <option value="">-- Tanpa Role --</option>
                          {roles.map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="badge bg-primary-50 text-primary-600 px-10 py-4 radius-4">
                          {user.role?.name ?? "-"}
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      {editingId === user.id ? (
                        <div className="d-flex gap-2 justify-content-center">
                          <button className="btn btn-sm btn-primary px-12" onClick={() => saveRole(user.id)} disabled={saving}>
                            {saving ? "..." : "Simpan"}
                          </button>
                          <button className="btn btn-sm btn-outline-secondary px-12" onClick={() => setEditingId(null)}>
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button className="btn btn-outline-primary-600 px-14 py-8" onClick={() => startEdit(user)}>
                          Edit Role
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignRoleLayer;
