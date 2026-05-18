import axios from "axios";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import CustomerForm from "./CustomerForm";
import Select from "react-select";
import CustomerModalDetail from "./CustomerModalDetail";
import Swal from "sweetalert2";
import Loader from "../loader/loader";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import ExcelUploadModal from "./ExcelUploadModal";

const CustomerTable = ({ status }) => {
  const [search, setSearch] = useState("");
  const [currentData, setCurrentData] = useState([]);
  const [page, setPage] = useState(1);
  const [to, setTo] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [company, setCompany] = useState([]);
  const [companyId, setCompanyId] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [openModalImport, setOpenModalImport] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const api = import.meta.env.VITE_API_URI;
  const token = localStorage.getItem("token");

  const renderTooltip = (text) => (props) => (
    <Tooltip id="button-tooltip" {...props}>{text}</Tooltip>
  );

  const fetchCustomers = async (
    status, page = 1, perPage = 10, search = "",
    companyId = "", dateFrom = "", dateTo = ""
  ) => {
    try {
      setLoading(true);
      const res = await axios.get(`${api}/customers/${status}`, {
        params: { page, per_page: perPage, search, company_id: companyId, date_from: dateFrom, date_to: dateTo },
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      setCurrentData(res.data.data.data);
      setPage(res.data.data.current_page);
      setTotalPages(Math.ceil(res.data.data.total / res.data.data.per_page));
      setPerPage(res.data.data.per_page);
      setTo(res.data.data.to);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompany = async () => {
    try {
      const res = await axios.get(api + `/pre-order/get/company`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      setCompany(res.data.data);
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  useEffect(() => { setPage(1); }, [search, companyId, dateFrom, dateTo, status]);

  useEffect(() => {
    fetchCustomers(status, page, perPage, search, companyId?.value || "", dateFrom, dateTo);
    fetchCompany();
  }, [status, page, perPage, search, companyId?.value, dateFrom, dateTo]);

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

  const handleAddClick = () => setIsFormVisible(true);
  const handleEditClick = (customer) => { setFormMode("edit"); setSelectedCustomer(customer); setIsFormVisible(true); };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?", text: "You won't be able to revert this!", icon: "warning",
      showCancelButton: true, confirmButtonColor: "#3085d6", cancelButtonColor: "#d33", confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(api + `/customers/delete/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          Swal.fire("Deleted!", "Your customer has been deleted.", "success");
          fetchCustomers(status, page, perPage, search, companyId?.value || "", dateFrom, dateTo);
        } catch (error) { console.error(error); }
      }
    });
  };

  const handleDownload = async (search = "", company_id = "") => {
    setLoading(true);
    try {
      const res = await axios({ url: `${api}/customers/export/customers`, params: { search, company_id }, headers: { Authorization: `Bearer ${token}` }, method: "GET", responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a"); link.href = url; link.setAttribute("download", `export-customers.xlsx`);
      document.body.appendChild(link); link.click(); link.remove(); window.URL.revokeObjectURL(url);
    } catch (error) {
      Swal.fire({ icon: "error", title: "Export Gagal", text: error.response?.data?.message || "Terjadi kesalahan." });
    } finally { setLoading(false); Swal.fire({ icon: "success", title: "Export Berhasil", text: "Data berhasil diexport." }); }
  };

  const handleDownloadFormat = async () => {
    setLoading(true);
    try {
      const res = await axios({ url: `${api}/customers/export-format/customers?status=${status}`, headers: { Authorization: `Bearer ${token}` }, method: "GET", responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a"); link.href = url; link.setAttribute("download", `export-format-customers.xlsx`);
      document.body.appendChild(link); link.click(); link.remove(); window.URL.revokeObjectURL(url);
    } catch (error) {
      Swal.fire({ icon: "error", title: "Export Gagal", text: error.response?.data?.message || "Terjadi kesalahan." });
    } finally { setLoading(false); Swal.fire({ icon: "success", title: "Export Berhasil", text: "Format berhasil didownload." }); }
  };

  const handleUpload = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData(); formData.append("file", file);
      const response = await axios.post(`${api}/customers/import/customers`, formData, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });
      setLoading(false); setOpenModalImport(false);
      await Swal.fire({ title: "Berhasil!", text: response.data.message || "Data berhasil ditambahkan!", icon: "success", confirmButtonColor: "#3085d6" });
    } catch (error) {
      await Swal.fire({ title: "Gagal!", text: error.response?.data?.message || error.message || "Terjadi kesalahan.", icon: "error", confirmButtonColor: "#d33" });
      setLoading(false);
    }
  };

  const indexLastRow = page * perPage;
  const indexOfFirstRow = indexLastRow - perPage;

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

  const dateStyle = {
    height: H, width: "130px", border: B, borderRadius: R,
    padding: "0 8px", fontSize: F, color: "#334155",
    outline: "none", cursor: "pointer", background: "#fff",
  };

  return (
    <>
      <style>{`
        .table-row:hover { cursor: pointer; background: #f8fafc !important; }
        .customer-table th { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; background: #f8fafc; border-bottom: 2px solid #e2e8f0; padding: 10px 12px; white-space: nowrap; }
        .customer-table td { font-size: 13px; color: #334155; padding: 10px 12px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .status-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .status-unregis { background: #f1f5f9; color: #64748b; }
        .status-oncheck { background: #fef9c3; color: #a16207; }
        .status-registered { background: #dcfce7; color: #16a34a; }
        .child-import { position: absolute; top: 40px; right: 0; background: white; border: 1px solid #e2e8f0; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); z-index: 100; min-width: 170px; overflow: hidden; }
        .child-import ul { list-style: none; margin: 0; padding: 6px; }
        .child-import ul li { padding: 8px 12px; font-size: 13px; border-radius: 6px; cursor: pointer; color: #334155; display: flex; align-items: center; gap: 8px; }
        .child-import ul li:hover { background: #f8fafc; }
        .section-import { position: relative; }
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
        input[type="date"]:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
        input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; opacity: 0.5; }
        .fdivider { width: 1px; height: 20px; background: #e2e8f0; flex-shrink: 0; }
        .show-select { height: ${H}; border: ${B}; border-radius: ${R}; padding: 0 8px; font-size: ${F}; color: #334155; background: #fff; cursor: pointer; outline: none; }
      `}</style>

      <div className="col-lg-12">
        <div className="card h-100" style={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          {isFormVisible ? (
            <CustomerForm mode={formMode} initialData={selectedCustomer} onCancel={() => setIsFormVisible(false)} />
          ) : (
            <>
              {loading ? <Loader /> : null}

              <div className="card-header" style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", borderRadius: "12px 12px 0 0", padding: "14px 18px" }}>
                <div className="d-flex align-items-center gap-2">
                  <div style={{ width: 3, height: 18, background: "#3b82f6", borderRadius: 3 }} />
                  <h5 className="card-title mb-0" style={{ fontSize: "15px", fontWeight: 600, color: "#1e293b" }}>Master Customer</h5>
                </div>
              </div>

              <div className="card-body" style={{ padding: "14px 18px" }}>
                {isModalVisible && (
                  <CustomerModalDetail
                    initialData={selectedCustomer}
                    onCancel={() => setIsModalVisible(false)}
                    refreshData={() => fetchCustomers(status, page, perPage, search, companyId?.value || "", dateFrom, dateTo)}
                    statuses={status}
                  />
                )}

                {/* Filter Bar */}
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3"
                  style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px 14px" }}>

                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    {/* Show */}
                    <div className="d-flex align-items-center me-1">
                      <span className="me-1 show-customer">Show </span>
                      <Select
                        options={[
                          { value: 10, label: "10" },
                          { value: 20, label: "20" },
                          { value: 50, label: "50" },
                        ]}
                        onChange={(selectedOption) => setPerPage(Number(selectedOption.value))}
                        defaultValue={{ value: perPage, label: `${perPage}` }}
                        classNamePrefix="select"
                        className="d-inline-block w-auto"
                        styles={selectStyles}
                      />
                    </div>

                    <div className="fdivider" />

                    {/* Company */}
                    <div style={{ minWidth: 150 }}>
                      <Select
                        placeholder="All Company"
                        isClearable
                        options={company.map((item) => ({ value: item.id, label: item.name }))}
                        value={companyId}
                        onChange={(opt) => setCompanyId(opt)}
                        styles={selectStyles}
                      />
                    </div>

                    <div className="fdivider" />

                    {/* Date Range - no labels */}
                    <div className="d-flex align-items-center gap-2">
                      <input type="date" style={dateStyle} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                      <span style={{ color: "#94a3b8", fontSize: "14px" }}>→</span>
                      <input type="date" style={dateStyle} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                    </div>
                  </div>

                  {/* Kanan */}
                  <div className="d-flex align-items-center gap-2">
                    <div className="search-wrap">
                      <Icon icon="mdi:magnify" className="s-icon" fontSize={16} />
                      <input type="text" placeholder="Search customer..." className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>

                    {["registered", "unregis"].includes(status) && (
                      <>
                        <div className="section-import">
                          <OverlayTrigger placement="top" overlay={renderTooltip("Import Data")}>
                            <button className="act-btn" onClick={() => setOpenImport(!openImport)}>
                              <Icon icon="uil:import" fontSize={18} />
                            </button>
                          </OverlayTrigger>
                          {openImport && (
                            <div className="child-import">
                              <ul>
                                <li onClick={handleDownloadFormat}><Icon icon="tabler:file-download" fontSize={16} /> Download Format</li>
                                <li onClick={() => setOpenModalImport(true)}><Icon icon="uil:import" fontSize={16} /> Upload File</li>
                              </ul>
                            </div>
                          )}
                        </div>
                        <OverlayTrigger placement="top" overlay={renderTooltip("Export Excel")}>
                          <button className="act-btn green" onClick={() => handleDownload(search, companyId?.value)}>
                            <Icon icon="mdi:file-export-outline" fontSize={18} />
                          </button>
                        </OverlayTrigger>
                      </>
                    )}

                    {status === "unregis" && (
                      <OverlayTrigger placement="top" overlay={renderTooltip("Tambah Customer")}>
                        <button className="act-btn blue" onClick={handleAddClick}>
                          <Icon icon="mdi:plus" fontSize={20} />
                        </button>
                      </OverlayTrigger>
                    )}

                    <ExcelUploadModal show={openModalImport} onHide={() => setOpenModalImport(false)} onUpload={handleUpload} />
                  </div>
                </div>

                {/* Table */}
                <div className="table-responsive">
                  <table className="table customer-table mb-0">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Code</th>
                        <th>Company</th>
                        <th>Customer</th>
                        <th>Telephone</th>
                        <th>Address</th>
                        <th>Reg. Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.length > 0 ? (
                        currentData.map((item, index) => (
                          <tr key={item.id} className="table-row"
                            onDoubleClick={() => { setSelectedCustomer(item); setIsModalVisible(true); }}>
                            <td style={{ color: "#94a3b8" }}>{indexOfFirstRow + index + 1}</td>
                            <td style={{ fontFamily: "monospace", fontSize: "12px" }}>{item.code_customer ?? "-"}</td>
                            <td>{item.company?.name ?? "-"}</td>
                            <td style={{ fontWeight: 600, color: "#1e293b" }}>{item.name ?? "-"}</td>
                            <td>{item.phone_1 ?? "-"}</td>
                            <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.alamat ?? "-"}</td>
                            <td style={{ whiteSpace: "nowrap" }}>{new Date(item.created_at).toLocaleDateString("id-ID") ?? "-"}</td>
                            <td>
                              {item.status === "unregis" ? (
                                <span className="status-badge status-unregis">Unregistered</span>
                              ) : item.status === "on_check_spv" || item.status === "on_check_manager" ? (
                                <span className="status-badge status-oncheck">On Check</span>
                              ) : (
                                <span className="status-badge status-registered">Registered</span>
                              )}
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-1">
                                {status === "unregis" ? (
                                  <>
                                    <button className="btn btn-success btn-sm d-flex align-items-center" style={{ borderRadius: 7 }} onClick={() => { setSelectedCustomer(item); setIsModalVisible(true); }}>
                                      <Icon icon="icon-park-outline:view-grid-detail" width={15} />
                                    </button>
                                    <button className="btn btn-warning btn-sm d-flex align-items-center" style={{ borderRadius: 7 }} onClick={() => handleEditClick(item)}>
                                      <Icon icon="mdi:pencil" width={15} />
                                    </button>
                                    <button className="btn btn-danger btn-sm d-flex align-items-center" style={{ borderRadius: 7 }} onClick={() => handleDelete(item.id)}>
                                      <Icon icon="material-symbols:delete-outline" width={15} />
                                    </button>
                                  </>
                                ) : status === "registered" ? (
                                  <button className="btn btn-primary btn-sm d-flex align-items-center" style={{ borderRadius: 7 }} onClick={() => { setSelectedCustomer(item); setIsModalVisible(true); }}>
                                    <Icon icon="icon-park-outline:view-grid-detail" width={15} />
                                  </button>
                                ) : (
                                  <button className="btn btn-success btn-sm" style={{ borderRadius: 7, fontSize: 12 }} onClick={() => { setSelectedCustomer(item); setIsModalVisible(true); }}>
                                    Check
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center py-5" style={{ color: "#94a3b8", fontSize: 14 }}>
                            <Icon icon="mdi:inbox-outline" fontSize={32} style={{ display: "block", margin: "0 auto 8px" }} />
                            {loading ? "Loading..." : "Tidak ada data"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span style={{ fontSize: 13, color: "#64748b" }}>Showing {indexOfFirstRow + 1}–{to} of {totalPages * perPage} entries</span>
                  <nav>
                    <ul className="pagination mb-0" style={{ gap: 4 }}>
                      <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                        <button className="page-link" style={{ borderRadius: 8, fontSize: 13 }} onClick={() => setPage(page - 1)}>‹ Prev</button>
                      </li>
                      {getPageNumbers(page, totalPages).map((pageNumber, index) => (
                        <li key={index} className={`page-item ${pageNumber === page ? "active" : ""} ${pageNumber === "..." ? "disabled" : ""}`}>
                          <button className="page-link" style={{ borderRadius: 8, fontSize: 13 }} onClick={() => pageNumber !== "..." ? setPage(pageNumber) : null}>
                            {pageNumber}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                        <button className="page-link" style={{ borderRadius: 8, fontSize: 13 }} onClick={() => setPage(page + 1)}>Next ›</button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomerTable;