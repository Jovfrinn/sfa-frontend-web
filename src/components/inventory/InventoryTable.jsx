import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { Icon } from "@iconify/react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import ExcelUploadModal from "./ExcelUploadModal";
import Loader from "../loader/loader";

const InventoryTable = () => {
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URI;

  // Filter States
  const [search, setSearch] = useState("");
  const [filterSatuan, setFilterSatuan] = useState(null);
  const [filterSelected, setFilterSelected] = useState({
    selectedCategory: null,
    selectedBrand: null,
  });
  const [satuanList, setSatuanList] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [openModalImport, setOpenModalImport] = useState(false);

  // Table States
  const [inventory, setInventory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Modal/Form States
  const [mode, setMode] = useState(""); // "add" or "edit"
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    id: null,
    nama: "",
    category_id: null,
    brand_id: null,
    satuan: "",
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = () => setRefreshTrigger((prev) => prev + 1);

  // Fetch Filters (Satuan)
  useEffect(() => {
    fetchFilters();
  }, [API_URL]);

  const fetchFilters = async () => {
    try {
      setLoadingFilters(true);
      const response = await axios.get(`${API_URL}/inventories/filters`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSatuanList(
        response.data.satuan.map((k) => ({ value: k, label: k })) || []
      );
    } catch (err) {
      console.error("Error fetching filters:", err);
      setSatuanList([]);
    } finally {
      setLoadingFilters(false);
    }
  };

  // Fetch Data Table
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterSelected, filterSatuan]);

  useEffect(() => {
    fetchData();
  }, [currentPage, perPage, filterSelected, filterSatuan, search, refreshTrigger]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/inventories`, {
        params: {
          page: currentPage,
          per_page: perPage,
          search: search,
          category_id: filterSelected.selectedCategory?.value,
          brand_id: filterSelected.selectedBrand?.value,
          satuan: filterSatuan?.value,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setInventory(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
      setTotal(response.data.total);
      setPerPage(response.data.per_page);
      setFrom(response.data.from);
      setTo(response.data.to);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Shared Select Loaders
  const getCategory = async (inputValue) => {
    try {
      const res = await axios.get(`${API_URL}/inventories/get-category`, {
        params: { search: inputValue },
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data.data.map((item) => ({ value: item.id, label: item.nama }));
    } catch (error) {
      return [];
    }
  };

  const getBrand = async (inputValue) => {
    try {
      const res = await axios.get(`${API_URL}/inventories/get-brand`, {
        params: { search: inputValue },
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data.data.map((item) => ({ value: item.id, label: item.nama }));
    } catch (error) {
      return [];
    }
  };

  // Handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Edit logic
  const handleEditClick = async (item) => {
    setMode("edit");
    setFormData({
      id: item.id,
      nama: item.nama,
      satuan: item.satuan,
      category_id: null,
      brand_id: null,
    });
    setFormErrors({});
    setShowModal(true);
    setIsSubmitting(true);
    try {
      const [catRes, brandRes] = await Promise.all([
        axios.get(`${API_URL}/inventories/get-category/${item.category_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/inventories/get-brand/${item.brand_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setFormData((prev) => ({
        ...prev,
        category_id: { value: catRes.data.data.id, label: catRes.data.data.nama },
        brand_id: { value: brandRes.data.data.id, label: brandRes.data.data.nama },
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add/Edit Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.nama.trim()) errors.nama = "Nama Barang harus diisi";
    if (!formData.satuan) errors.satuan = "Satuan harus dipilih";
    if (!formData.category_id) errors.category_id = "Kategori harus dipilih";
    if (!formData.brand_id) errors.brand_id = "Brand harus dipilih";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        nama: formData.nama,
        satuan: formData.satuan,
        category_id: formData.category_id?.value,
        brand_id: formData.brand_id?.value,
      };

      let response;
      if (mode === "edit") {
        response = await axios.put(`${API_URL}/inventories/${formData.id}`, data, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
      } else {
        response = await axios.post(`${API_URL}/inventories`, data, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
      }

      await Swal.fire({
        title: mode === "edit" ? "Updated!" : "Berhasil!",
        text: response.data.message || `Data berhasil ${mode === "edit" ? "diperbarui" : "ditambahkan"}!`,
        icon: "success",
        confirmButtonColor: "#3085d6",
      });

      handleCloseModal();
      refresh();
    } catch (err) {
      if (err.response?.status === 422) {
        setFormErrors(err.response.data.errors || {});
        Swal.fire({ title: "Validation Error", text: "Please check the form for errors", icon: "error" });
      } else {
        Swal.fire({
          title: "Gagal!",
          text: err.response?.data?.message || "Terjadi kesalahan saat menyimpan data.",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setMode("");
    setFormData({
      id: null,
      nama: "",
      category_id: null,
      brand_id: null,
      satuan: "",
    });
    setFormErrors({});
  };

  const handleDeleteClick = (item) => {
    Swal.fire({
      title: "Are you sure?",
      html: `<p>You are about to delete:</p><strong>${item.nama}</strong><br><small>Kode: ${item.kode_original_inv}</small>`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${API_URL}/inventories/${item.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire("Deleted!", response.data.message || "Your inventory has been deleted.", "success");
          if (inventory.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
          else refresh();
        } catch (error) {
          Swal.fire("Error", "Failed to delete inventory", "error");
        }
      }
    });
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await axios({
        url: `${API_URL}/inventories/export-inventories`,
        params: {
          selectedCategory: filterSelected.selectedCategory?.value,
          selectedBrand: filterSelected.selectedBrand?.value,
          filterSatuan: filterSatuan?.value,
        },
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      const today = new Date().toISOString().slice(0, 10);
      link.setAttribute("download", `export-inventories-${today}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      Swal.fire({ icon: "error", title: "Export Gagal", text: "Terjadi kesalahan saat mengunduh file." });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFormat = async () => {
    setLoading(true);
    try {
      const res = await axios({
        url: `${API_URL}/inventories/export-format-inventories`,
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `export-format-inventories.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      Swal.fire({ icon: "error", title: "Export Gagal", text: "Terjadi kesalahan saat mengunduh file." });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    setLoading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await axios.post(`${API_URL}/inventories/import-inventories`, formDataUpload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      refresh();
      setOpenModalImport(false);
      Swal.fire("Berhasil!", response.data.message || "Data berhasil ditambahkan!", "success");
    } catch (error) {
      Swal.fire("Gagal!", error.response?.data?.message || "Terjadi kesalahan saat mengupload file.", "error");
    } finally {
      setLoading(false);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (lastPage <= maxVisible) {
      for (let i = 1; i <= lastPage; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(lastPage);
      } else if (currentPage >= lastPage - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = lastPage - 3; i <= lastPage; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(lastPage);
      }
    }
    return pages;
  };

  const renderTooltip = (text) => (props) => (
    <Tooltip {...props}>{text}</Tooltip>
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

  return (
    <>
      <style>{`
        .table-row:hover { cursor: pointer; background: #f8fafc !important; }
        .custom-table th { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; background: #f8fafc; border-bottom: 2px solid #e2e8f0; padding: 10px 12px; white-space: nowrap; }
        .custom-table td { font-size: 13px; color: #334155; padding: 10px 12px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; white-space: nowrap; }
        .act-btn { height: ${H}; width: ${H}; border-radius: ${R}; border: ${B}; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #fff; color: #64748b; }
        .act-btn:hover { background: #f1f5f9; }
        .act-btn.green { background: #dcfce7; border-color: #86efac; color: #16a34a; }
        .act-btn.green:hover { background: #bbf7d0; }
        .act-btn.blue { background: #dbeafe; border-color: #93c5fd; color: #2563eb; }
        .act-btn.blue:hover { background: #bfdbfe; }
        .search-input { height: ${H}; border: ${B}; border-radius: ${R}; padding: 0 12px 0 34px; font-size: ${F}; outline: none; width: 190px; color: #334155; background: #fff; }
        .search-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
        .search-wrap { position: relative; display: flex; align-items: center; }
        .search-wrap .s-icon { position: absolute; left: 10px; color: #94a3b8; pointer-events: none; }
        .filter-collapse { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; }
        .filter-collapse.show { max-height: 500px; overflow: visible; transition: max-height 0.3s ease-in; }
        .child-import { position: absolute; top: 40px; right: 0; background: white; border: 1px solid #e2e8f0; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); z-index: 100; min-width: 170px; overflow: hidden; }
        .child-import ul { list-style: none; margin: 0; padding: 6px; }
        .child-import ul li { padding: 8px 12px; font-size: 13px; border-radius: 6px; cursor: pointer; color: #334155; display: flex; align-items: center; gap: 8px; }
        .child-import ul li:hover { background: #f8fafc; }
        .section-import { position: relative; z-index: 100; }
      `}</style>

      <div className="col-lg-12">
        <div className="card h-100" style={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <div className="card-header" style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", borderRadius: "12px 12px 0 0", padding: "14px 18px" }}>
            <div className="d-flex align-items-center gap-2">
              <div style={{ width: 3, height: 18, background: "#3b82f6", borderRadius: 3 }} />
              <h5 className="card-title mb-0" style={{ fontSize: "15px", fontWeight: 600, color: "#1e293b" }}>Table Inventory</h5>
            </div>
          </div>
          <div className="card-body" style={{ padding: "14px 18px" }}>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px 14px" }}>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <div className="d-flex align-items-center me-1">
                  <span className="me-1" style={{ fontSize: "13px", color: "#64748b" }}>Show </span>
                  <Select
                    options={[{ value: 10, label: "10" }, { value: 20, label: "20" }, { value: 50, label: "50" }]}
                    onChange={(option) => { setPerPage(Number(option.value)); setCurrentPage(1); }}
                    defaultValue={{ value: perPage, label: `${perPage}` }}
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
                    placeholder="Search..."
                    className="search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                
                <div className="section-import">
                  <OverlayTrigger placement="top" overlay={renderTooltip("Data Import")}>
                    <button className="act-btn" onClick={() => setOpenImport(!openImport)}>
                      <Icon icon={"uil:import"} fontSize={18} />
                    </button>
                  </OverlayTrigger>
                  {openImport && (
                    <div className="child-import">
                      <ul>
                        <li onClick={handleDownloadFormat}>
                          <Icon icon={"tabler:file-download"} fontSize={16} /> Download Format
                        </li>
                        <li onClick={() => { setOpenModalImport(true); setOpenImport(false); }}>
                          <Icon icon={"uil:import"} fontSize={16} /> Upload
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                
                <OverlayTrigger placement="top" overlay={renderTooltip("Data Export")}>
                  <button className="act-btn green" onClick={handleDownload}>
                    <Icon icon="mdi:file-export-outline" fontSize={18} />
                  </button>
                </OverlayTrigger>

                <OverlayTrigger placement="top" overlay={renderTooltip("Filter")}>
                  <button className="act-btn" onClick={() => setShowFilters(!showFilters)}>
                    <Icon icon="line-md:filter" fontSize={18} />
                  </button>
                </OverlayTrigger>

                <OverlayTrigger placement="top" overlay={renderTooltip("Create Inventory")}>
                  <button className="act-btn blue" onClick={() => { setMode("add"); setShowModal(true); }}>
                    <Icon icon="mdi:plus" fontSize={20} />
                  </button>
                </OverlayTrigger>
              </div>
            </div>

            <div className={`filter-collapse ${showFilters ? "show" : ""}`}>
              <div className="row mb-3" style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <div className="col-md-4">
                  <label className="form-label" style={{ fontSize: 13, color: "#64748b" }}>Category</label>
                  <AsyncSelect cacheOptions defaultOptions isClearable loadOptions={getCategory} value={filterSelected.selectedCategory} onChange={(option) => setFilterSelected({ ...filterSelected, selectedCategory: option })} placeholder="Choose Category" styles={selectStyles} />
                </div>
                <div className="col-md-4">
                  <label className="form-label" style={{ fontSize: 13, color: "#64748b" }}>Brand</label>
                  <AsyncSelect cacheOptions defaultOptions isClearable loadOptions={getBrand} value={filterSelected.selectedBrand} onChange={(option) => setFilterSelected({ ...filterSelected, selectedBrand: option })} placeholder="Choose Brand" styles={selectStyles} />
                </div>
                <div className="col-md-4">
                  <label className="form-label" style={{ fontSize: 13, color: "#64748b" }}>Unit</label>
                  <Select options={satuanList} isClearable placeholder="Choose Unit" value={filterSatuan} onChange={(selected) => setFilterSatuan(selected)} isDisabled={loadingFilters} styles={selectStyles} />
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table custom-table mb-0">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Item Code</th>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Unit</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" className="text-center py-5"><Loader /></td></tr>
                  ) : inventory.length > 0 ? (
                    inventory.map((item, index) => (
                      <tr key={item.id} className="table-row">
                        <td style={{ color: "#94a3b8" }}>{from + index}</td>
                        <td style={{ fontFamily: "monospace" }}>{item.kode_original_inv}</td>
                        <td style={{ fontWeight: 600, color: "#1e293b" }}>{item.nama}</td>
                        <td>{item.category?.nama}</td>
                        <td>{item.brand?.nama}</td>
                        <td>{item.satuan}</td>
                        <td>
                          <div className="d-flex align-items-center justify-content-center gap-1">
                            <button className="btn btn-warning btn-sm d-flex align-items-center" style={{ borderRadius: 7 }} onClick={() => handleEditClick(item)}>
                              <Icon icon="mdi:pencil" width={15} />
                            </button>
                            <button className="btn btn-danger btn-sm d-flex align-items-center" style={{ borderRadius: 7 }} onClick={() => handleDeleteClick(item)}>
                              <Icon icon="material-symbols:delete-outline" width={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5" style={{ color: "#94a3b8", fontSize: 14 }}>
                        <Icon icon="mdi:inbox-outline" fontSize={32} style={{ display: "block", margin: "0 auto 8px" }} />
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <span style={{ fontSize: 13, color: "#64748b" }}>
                Showing {from || 0} to {to || 0} of {total} entries
              </span>
              <nav>
                <ul className="pagination mb-0" style={{ gap: 4 }}>
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" style={{ borderRadius: 8, fontSize: 13 }} onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                      ‹ Prev
                    </button>
                  </li>
                  {getPageNumbers().map((page, index) => (
                    <li key={index} className={`page-item ${currentPage === page ? "active" : ""} ${page === "..." ? "disabled" : ""}`}>
                      {page === "..." ? (
                        <span className="page-link" style={{ borderRadius: 8, fontSize: 13 }}>...</span>
                      ) : (
                        <button className="page-link" style={{ borderRadius: 8, fontSize: 13 }} onClick={() => handlePageChange(page)}>
                          {page}
                        </button>
                      )}
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === lastPage ? "disabled" : ""}`}>
                    <button className="page-link" style={{ borderRadius: 8, fontSize: 13 }} onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === lastPage}>
                      Next ›
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <ExcelUploadModal
        show={openModalImport}
        onHide={() => setOpenModalImport(false)}
        onUpload={handleUpload}
      />

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content" style={{ borderRadius: "12px", border: "none" }}>
              <div className="modal-header" style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", borderRadius: "12px 12px 0 0", padding: "16px 20px" }}>
                <h5 className="modal-title" style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b" }}>{mode === "edit" ? "Edit Inventory" : "Tambah Inventory Baru"}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal} disabled={isSubmitting}></button>
              </div>
              <div className="modal-body" style={{ padding: "20px" }}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label" style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>Nama Barang <span className="text-danger">*</span></label>
                    <input type="text" className={`form-control ${formErrors.nama ? "is-invalid" : ""}`} name="nama" value={formData.nama} onChange={handleInputChange} placeholder="Masukkan nama barang" disabled={isSubmitting} style={{ height: "38px", fontSize: "13px", borderRadius: "8px" }} />
                    {formErrors.nama && <div className="invalid-feedback">{formErrors.nama}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>Satuan <span className="text-danger">*</span></label>
                    <Select options={satuanList} placeholder="Pilih satuan..." value={formData.satuan ? { value: formData.satuan, label: formData.satuan } : null} onChange={(selected) => handleInputChange({ target: { name: "satuan", value: selected ? selected.value : "" } })} isDisabled={isSubmitting || loadingFilters} classNamePrefix="select" styles={{ control: (base) => ({ ...base, minHeight: "38px", borderRadius: "8px", fontSize: "13px" }) }} />
                    {formErrors.satuan && <div className="text-danger mt-1" style={{ fontSize: 12 }}>{formErrors.satuan}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>Kategori <span className="text-danger">*</span></label>
                    <AsyncSelect cacheOptions defaultOptions isClearable loadOptions={getCategory} value={formData.category_id} onChange={(option) => setFormData({ ...formData, category_id: option })} placeholder="Pilih Kategori" isDisabled={isSubmitting} styles={{ control: (base) => ({ ...base, minHeight: "38px", borderRadius: "8px", fontSize: "13px" }) }} />
                    {formErrors.category_id && <div className="text-danger mt-1" style={{ fontSize: 12 }}>{formErrors.category_id}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>Brand <span className="text-danger">*</span></label>
                    <AsyncSelect cacheOptions defaultOptions isClearable loadOptions={getBrand} value={formData.brand_id} onChange={(option) => setFormData({ ...formData, brand_id: option })} placeholder="Pilih Brand" isDisabled={isSubmitting} styles={{ control: (base) => ({ ...base, minHeight: "38px", borderRadius: "8px", fontSize: "13px" }) }} />
                    {formErrors.brand_id && <div className="text-danger mt-1" style={{ fontSize: 12 }}>{formErrors.brand_id}</div>}
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ borderTop: "1px solid #e2e8f0", padding: "16px 20px", background: "#f8fafc", borderRadius: "0 0 12px 12px" }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal} disabled={isSubmitting} style={{ borderRadius: "8px", fontSize: "13px", fontWeight: 500, padding: "8px 16px" }}>Batal</button>
                <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting} style={{ borderRadius: "8px", fontSize: "13px", fontWeight: 500, padding: "8px 16px", background: "#3b82f6", borderColor: "#3b82f6" }}>
                  {isSubmitting ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Menyimpan...</> : "Simpan Inventory"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InventoryTable;
