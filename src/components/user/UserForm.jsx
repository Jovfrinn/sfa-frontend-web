import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import Swal from "sweetalert2";
import Loader from "../loader/loader";

const UserForm = ({ mode, userId }) => {
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_URI;
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  
  // Form State
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState({ value: "active", label: "Active" });
  
  // Options State
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    fetchCompanies();
    fetchRoles();
    fetchPositions();
    if (mode === "edit" && userId) {
      fetchUserData(userId);
    }
  }, [mode, userId]);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${api}/company/select`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      setCompanies(res.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${api}/roles`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (res.data && res.data.data) {
        const roleOptions = res.data.data.map(r => ({ value: r.id, label: r.name }));
        setRoles(roleOptions);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchPositions = async () => {
    try {
      const res = await axios.get(`${api}/user/positions`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      setPositions(res.data.data);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  const fetchUserData = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`${api}/user/show/${id}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      
      const user = res.data.data;
      setFullName(user.full_name || "");
      setUsername(user.username || "");
      setEmail(user.email || "");
      
      if (user.status) {
        setStatus({ value: user.status, label: user.status === "active" ? "Active" : "Inactive" });
      }
      
      if (user.company) {
        setSelectedCompany({ value: user.company.id, label: user.company.name });
      } else if (user.company_id) {
        setSelectedCompany({ value: user.company_id, label: `Company ID: ${user.company_id}` }); // Fallback
      }
      
      if (user.role) {
        setSelectedRole({ value: user.role.id, label: user.role.name });
      }
      
      if (user.position) {
        setSelectedPosition({ value: user.position, label: user.position });
      }
      
    } catch (error) {
      console.error("Error fetching user data:", error);
      Swal.fire({ icon: "error", title: "Error", text: "Gagal memuat data user." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return Swal.fire({ icon: "error", title: "Oops...", text: "Password dan Confirm Password tidak cocok!" });
    }
    
    if (mode === "create" && !password) {
      return Swal.fire({ icon: "error", title: "Oops...", text: "Password wajib diisi untuk user baru!" });
    }
    
    if (!selectedCompany) {
      return Swal.fire({ icon: "error", title: "Oops...", text: "Company wajib dipilih!" });
    }

    setLoading(true);
    
    const payload = {
      full_name: fullName,
      username: username,
      email: email,
      company_id: selectedCompany.value,
      role_id: selectedRole ? selectedRole.value : null,
      position: selectedPosition ? selectedPosition.value : null,
      status: status.value,
    };
    
    if (password) {
      payload.password = password;
    }

    try {
      if (mode === "create") {
        await axios.post(`${api}/user/store`, payload, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        Swal.fire({ icon: "success", title: "Berhasil!", text: "User berhasil ditambahkan." });
      } else {
        await axios.put(`${api}/user/update/${userId}`, payload, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        Swal.fire({ icon: "success", title: "Berhasil!", text: "User berhasil diperbarui." });
      }
      navigate('/setting/user');
    } catch (error) {
      Swal.fire({ 
        icon: "error", 
        title: "Gagal!", 
        text: error.response?.data?.message || "Terjadi kesalahan saat menyimpan data." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-lg-12">
      {loading && <Loader />}
      <div className="card" style={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <div className="card-header" style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", borderRadius: "12px 12px 0 0", padding: "14px 18px" }}>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <div style={{ width: 3, height: 18, background: "#3b82f6", borderRadius: 3 }} />
              <h5 className="card-title mb-0" style={{ fontSize: "15px", fontWeight: 600, color: "#1e293b" }}>
                {mode === "create" ? "Create New User" : "Edit User"}
              </h5>
            </div>
            <button 
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
              onClick={() => navigate('/setting/user')}
            >
              <Icon icon="mdi:arrow-left" /> Back
            </button>
          </div>
        </div>

        <div className="card-body" style={{ padding: "20px" }}>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-medium text-secondary">Full Name <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter full name" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  required 
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-medium text-secondary">Username <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-medium text-secondary">Email <span className="text-danger">*</span></label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Enter email address" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-medium text-secondary">Company <span className="text-danger">*</span></label>
                <Select
                  options={companies}
                  value={selectedCompany}
                  onChange={setSelectedCompany}
                  placeholder="Select Company..."
                  isClearable
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-medium text-secondary">Role</label>
                <Select
                  options={roles}
                  value={selectedRole}
                  onChange={setSelectedRole}
                  placeholder="Select Role..."
                  isClearable
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-medium text-secondary">Position</label>
                <CreatableSelect
                  options={positions}
                  value={selectedPosition}
                  onChange={setSelectedPosition}
                  placeholder="Select or type new Position..."
                  isClearable
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-medium text-secondary">Status</label>
                <Select
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" }
                  ]}
                  value={status}
                  onChange={setStatus}
                  isClearable={false}
                />
              </div>

              <div className="col-12 mt-3 mb-2">
                <h6 className="text-primary border-bottom pb-2">Authentication Security</h6>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-medium text-secondary">
                  Password {mode === "create" ? <span className="text-danger">*</span> : <span className="text-muted fw-normal">(Leave blank to keep unchanged)</span>}
                </label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Enter password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required={mode === "create"} 
                  minLength={8}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-medium text-secondary">
                  Confirm Password {mode === "create" ? <span className="text-danger">*</span> : ""}
                </label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Re-enter password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required={!!password} 
                  minLength={8}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button type="button" className="btn btn-light" onClick={() => navigate('/setting/user')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary d-flex align-items-center gap-2">
                <Icon icon="mdi:content-save" /> {mode === "create" ? "Save User" : "Update User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
