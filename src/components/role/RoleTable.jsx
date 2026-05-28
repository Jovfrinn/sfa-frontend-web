import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Select from "react-select";
import Loader from "../loader/loader";
// import { Icon } from "@iconify/react";

const RoleTable = () => {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [modalMode, setModalMode] = useState("Create");

  const [roleSelect, setRoleSelect] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [name, setName] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  // Pagination & Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handleShow = () => setIsShow(true);
  const handleClose = () => setIsShow(false);

  useEffect(() => {
    getRoles();
  }, []);

  const handleRefresh = () => {
    setRoles([]);
    setSearchTerm("");
    setCurrentPage(1);
    getRoles();
  };

  const getRoles = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URI}/roles`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data && res.data.data) {
        setRoles(res.data.data);
        const options = res.data.data.map((role) => ({
          value: role.id,
          label: role.name,
        }));
        setRoleSelect(options);
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const formData = {
        parent_id: selectedRole ? selectedRole.value : null,
        name: name,
      };

      await axios.post(
        `${import.meta.env.VITE_API_URI}/roles/store`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        title: "Berhasil!",
        text: "Data role berhasil disimpan.",
        icon: "success",
        confirmButtonText: "OK",
      });

      setName("");
      setSelectedRole(null);
      setIsShow(false);
      getRoles();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat menyimpan data!";

      Swal.fire({
        title: "Gagal!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Coba Lagi",
      });
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const formData = {
        parent_id: selectedRole ? selectedRole.value : null,
        name: name,
      };

      await axios.put(
        `${import.meta.env.VITE_API_URI}/roles/update/${selectedRoleId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        title: "Berhasil!",
        text: "Data role berhasil diupdate.",
        icon: "success",
        confirmButtonText: "OK",
      });

      setName("");
      setSelectedRole(null);
      setIsShow(false);
      getRoles();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat menyimpan data!";

      Swal.fire({
        title: "Gagal!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Coba Lagi",
      });
      setIsLoading(false);
    }
  };

  const handleShowData = async (id) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URI}/roles/edit/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.role) {
        const roleData = response.data.role;
        const foundRole =
          roleSelect.find(
            (item) => String(item.value) === String(roleData.parent_id)
          ) || null;

        setSelectedRoleId(id);
        setSelectedRole(foundRole);
        setName(roleData.name);
      }
      setIsLoading(false);
      setModalMode("Update");
      setIsShow(true);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Apakah anda yakin ?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          const token = localStorage.getItem("token");
          const response = await axios.delete(
            `${import.meta.env.VITE_API_URI}/roles/destroy/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.message) {
            Swal.fire({
              title: "Berhasil!",
              text: "Data berhasil dihapus.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });

            getRoles();
          }
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            "Terjadi kesalahan saat menghapus data.";
          Swal.fire({
            title: "Gagal!",
            text: errorMessage,
            icon: "error",
          });
          setIsLoading(false);
        }
      }
    });
  };

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (role.parent_name &&
        role.parent_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredRoles.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredRoles.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const H = "36px";
  const B = "1px solid #e2e8f0";
  const R = "8px";
  const F = "13px";

  const selectStyles = {
    control: (base) => ({ ...base, minHeight: H, height: H, borderColor: "#e2e8f0", borderRadius: R, fontSize: F, boxShadow: "none", "&:hover": { borderColor: "#a0aec0" } }),
    valueContainer: (base) => ({ ...base, padding: "0 10px" }),
    indicatorsContainer: (base) => ({ ...base, height: H }),
    placeholder: (base) => ({ ...base, color: "#a0aec0", fontSize: F }),
    singleValue: (base) => ({ ...base, fontSize: F }),
  };

  function getPageNumbers(currentPage, totalPages) {
    const range = [], rangeWithDots = [];
    let l;
    const delta = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) range.push(i);
    }
    for (let i of range) {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  }

  return (
    <>
      <style>{`
        .table-row:hover { cursor: pointer; background: #f8fafc !important; }
        .user-table th { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; background: #f8fafc; border-bottom: 2px solid #e2e8f0; padding: 10px 12px; white-space: nowrap; }
        .user-table td { font-size: 13px; color: #334155; padding: 10px 12px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .act-btn { height: ${H}; width: ${H}; border-radius: ${R}; border: ${B}; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #fff; color: #64748b; }
        .act-btn:hover { background: #f1f5f9; }
        .act-btn.blue { background: #dbeafe; border-color: #93c5fd; color: #2563eb; }
        .act-btn.blue:hover { background: #bfdbfe; }
        .search-input { height: ${H}; border: ${B}; border-radius: ${R}; padding: 0 12px 0 34px; font-size: ${F}; outline: none; width: 190px; color: #334155; background: #fff; }
        .search-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
        .search-wrap { position: relative; display: flex; align-items: center; }
        .search-wrap .s-icon { position: absolute; left: 10px; color: #94a3b8; pointer-events: none; }
        .fdivider { width: 1px; height: 20px; background: #e2e8f0; flex-shrink: 0; }
        .header-view-btn { padding: 4px 10px; border-radius: 6px; border: 1px solid #e2e8f0; background: #fff; color: #64748b; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; transition: all 0.2s; }
        .header-view-btn.active { background: #f1f5f9; color: #1e293b; border-color: #cbd5e1; }
        .header-view-btn:hover { background: #f8fafc; }
      `}</style>

      {isLoading && <Loader />}

      <div className="col-lg-12">
        {isShow && (
          <div
            className="modal fade show"
            style={{
              display: "block",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1050
            }}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content" style={{ borderRadius: "12px", border: "none" }}>
                <div className="modal-header" style={{ borderBottom: "1px solid #f1f5f9", padding: "16px 20px" }}>
                  <h6 className="modal-title" style={{ fontWeight: 600, color: "#1e293b" }}>{modalMode} Role</h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setSelectedRoleId(null);
                      handleClose();
                    }}
                  ></button>
                </div>

                <div className="modal-body" style={{ padding: "20px" }}>
                  <div className="row">
                    <div className="col-12">
                      <label className="form-label fw-medium text-secondary" style={{ fontSize: "13px" }}>Role Parent</label>
                      <Select
                        options={roleSelect}
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e)}
                        isClearable
                        placeholder="Pilih Parent Role..."
                        styles={{
                          control: (base) => ({ ...base, minHeight: '38px', borderRadius: '8px', borderColor: '#e2e8f0' }),
                        }}
                      />
                    </div>
                    <div className="col-12 mt-3">
                      <label className="form-label fw-medium text-secondary" style={{ fontSize: "13px" }}>Role Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Eg : Admin, Manager"
                        value={name}
                        style={{ borderRadius: "8px", border: "1px solid #e2e8f0", padding: "8px 12px" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer" style={{ borderTop: "1px solid #f1f5f9", padding: "16px 20px" }}>
                  <button
                    type="button"
                    className="btn btn-light btn-sm px-3 py-2"
                    style={{ borderRadius: "8px" }}
                    onClick={() => {
                      setSelectedRoleId(null);
                      handleClose();
                    }}
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      if (modalMode === "Create") {
                        handleSave();
                      } else {
                        handleUpdate();
                      }
                    }}
                    type="button"
                    className="btn btn-primary btn-sm px-3 py-2 d-flex align-items-center gap-2"
                    style={{ borderRadius: "8px" }}
                    disabled={!name}
                  >
                    <Icon icon="mdi:content-save" /> {modalMode === "Create" ? "Simpan" : "Update"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card h-100" style={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <div className="card-header d-flex justify-content-between align-items-center" style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", borderRadius: "12px 12px 0 0", padding: "14px 18px" }}>
            <div className="d-flex align-items-center gap-2">
              <div style={{ width: 3, height: 18, background: "#3b82f6", borderRadius: 3 }} />
              <h5 className="card-title mb-0" style={{ fontSize: "15px", fontWeight: 600, color: "#1e293b" }}>Master Role</h5>
            </div>
            
            <div className="d-flex align-items-center gap-2">
              <button onClick={() => handleRefresh()} className="header-view-btn" title="Refresh">
                <Icon icon="mdi:refresh" fontSize={16} />
              </button>
              <div className="fdivider" style={{ height: "16px", margin: "0 4px" }} />
              <Link to={"/setting/role"} className="header-view-btn active" title="List View">
                <Icon icon="mdi:view-list" fontSize={16} /> List
              </Link>
              <Link to={"/setting/role/tree"} className="header-view-btn" title="Tree View">
                <Icon icon="mdi:family-tree" fontSize={16} /> Tree
              </Link>
            </div>
          </div>

          <div className="card-body" style={{ padding: "14px 18px" }}>
            
            {/* Filter Bar */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3"
              style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px 14px" }}>
              
              <div className="d-flex align-items-center gap-2 flex-wrap">
                {/* Show */}
                <div className="d-flex align-items-center">
                  <span className="me-2" style={{ fontSize: "13px", color: "#64748b" }}>Show</span>
                  <Select
                    options={[
                      { value: 10, label: "10" },
                      { value: 20, label: "20" },
                      { value: 50, label: "50" },
                    ]}
                    onChange={(selectedOption) => {
                      setEntriesPerPage(Number(selectedOption.value));
                      setCurrentPage(1);
                    }}
                    value={{ value: entriesPerPage, label: `${entriesPerPage}` }}
                    classNamePrefix="select"
                    className="d-inline-block w-auto"
                    styles={selectStyles}
                  />
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <div className="search-wrap">
                  <Icon icon="mdi:magnify" className="s-icon" fontSize={16} />
                  <input 
                    type="text" 
                    placeholder="Search role..." 
                    className="search-input" 
                    value={searchTerm} 
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }} 
                  />
                </div>

                <button 
                  className="act-btn blue" 
                  onClick={() => {
                    setModalMode("Create");
                    setSelectedRole(null);
                    setName("");
                    handleShow();
                  }}
                  title="Tambah Role"
                >
                  <Icon icon="mdi:plus" fontSize={20} />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table user-table mb-0">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Parent</th>
                    <th>User Count</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEntries.length > 0 ? (
                    currentEntries.map((val, index) => (
                      <tr key={val.id || index} className="table-row">
                        <td style={{ color: "#94a3b8", width: "50px" }}>{indexOfFirstEntry + index + 1}</td>
                        <td style={{ fontWeight: 600, color: "#1e293b" }}>{val.name}</td>
                        <td>{val.parent_name ?? "-"}</td>
                        <td>
                          <span className="badge bg-light text-secondary border px-2 py-1" style={{ fontSize: "12px", borderRadius: "6px" }}>
                            {val.user_count ?? 0} Users
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2 align-items-center justify-content-center">
                            <button
                              onClick={() => handleShowData(val.id)}
                              className="btn btn-warning btn-sm d-flex align-items-center justify-content-center"
                              style={{ borderRadius: "7px", width: "28px", height: "28px", padding: 0 }}
                              title="Edit Role"
                            >
                              <Icon icon="mdi:pencil" width={16} />
                            </button>

                            <button
                              onClick={() => handleDelete(val.id)}
                              className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
                              style={{ borderRadius: "7px", width: "28px", height: "28px", padding: 0 }}
                              title="Hapus Role"
                            >
                              <Icon icon="mdi:trash" width={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-5" style={{ color: "#94a3b8", fontSize: 14 }}>
                        <Icon icon="mdi:inbox-outline" fontSize={32} style={{ display: "block", margin: "0 auto 8px" }} />
                        {isLoading ? "Loading..." : "Tidak ada data."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span style={{ fontSize: 13, color: "#64748b" }}>
                Showing {indexOfFirstEntry + 1} to{" "}
                {Math.min(indexOfLastEntry, filteredRoles.length)} of{" "}
                {filteredRoles.length} entries
              </span>
              <nav>
                <ul className="pagination mb-0" style={{ gap: 4 }}>
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" style={{ borderRadius: 8, fontSize: 13 }} onClick={() => setCurrentPage(currentPage - 1)}>‹ Prev</button>
                  </li>
                  {getPageNumbers(currentPage, totalPages).map((pageNumber, index) => (
                    <li key={index} className={`page-item ${pageNumber === currentPage ? "active" : ""} ${pageNumber === "..." ? "disabled" : ""}`}>
                      <button className="page-link" style={{ borderRadius: 8, fontSize: 13 }} onClick={() => pageNumber !== "..." ? setCurrentPage(pageNumber) : null}>
                        {pageNumber}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}`}>
                    <button className="page-link" style={{ borderRadius: 8, fontSize: 13 }} onClick={() => setCurrentPage(currentPage + 1)}>Next ›</button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoleTable;
