import axios from "axios";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Select from "react-select";
import Loader from "../loader/loader";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import AsyncSelect from "react-select/async";
import VisitDetailModal from "./VisitDetailModal";

const VisitTable = () => {
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const api = import.meta.env.VITE_API_URI;
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [links, setLinks] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();
  const [total, setTotal] = useState(0);
  const [showExport, setShowExport] = useState(false);
  const [company, setCompany] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [salesman, setSalesman] = useState([]);
  const [selectedSalesman, setSelectedSalesman] = useState(null);
  const [selectedFromDate, setSelectedFromDate] = useState(formatDate(firstDayOfMonth));
  const [selectedToDate, setSelectedToDate] = useState(formatDate(lastDayOfMonth));
  const [show, setShow] = useState([
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
  ]);
  const [perPage, setPerPage] = useState(show[0].value);
  const [showFilter, setShowFilter] = useState(false);

  const [userRole, setUserRole] = useState(localStorage.getItem("role") ?? "");
  const isManager = userRole.toLowerCase().includes("manager");
  const [selectedTapInId, setSelectedTapInId] = useState(null);


  const fetchMe = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${api}/report/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserRole(res.data.data.role ?? "");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const VITE_STORAGE_URI = import.meta.env.VITE_STORAGE_URI;

  const fetchVisit = async ({
    page = "",
    perPage = "",
    userId = "",
    companyId = "",
    role = "",
    from = "",
    to = "",
  } = {}) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page,
        per_page: perPage,
        user_id: userId,
        company_id: companyId,
        role,
        from,
        to,
      });
      const res = await axios.get(`${api}/report/visit?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { data, current_page, links, last_page, per_page, total } = res.data.data;
      setCurrentData(data);
      setLinks(links);
      setPage(current_page);
      setTotal(last_page);
      setPerPage(per_page);
      setTotal(total);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const runExport = async ({
    page = "",
    perPage = "",
    userId = "",
    companyId = "",
    role = "",
    from = "",
    to = "",
  } = {}) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page,
        per_page: perPage,
        user_id: userId,
        company_id: companyId,
        role,
        from,
        to,
      });
      const res = await axios.get(`${api}/report/export?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });
      const today = new Date().toISOString().slice(0, 10);
      const fileNameParts = ["report_visit"];
      if (from && to) fileNameParts.push(`${from}_${to}`);
      if (companyId) fileNameParts.push(`company-${companyId}`);
      if (userId) fileNameParts.push(`user-${userId}`);
      if (role) fileNameParts.push(`role-${role}`);
      const fileName = `${fileNameParts.join("_")}_${today}.xlsx`;
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const fetchCompany = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URI}/company/select`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setCompany(res.data);
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  const fetchRole = async (companyId) => {
    try {
      const token = localStorage.getItem("token");
      const params = {};
      if (companyId) params.company_id = companyId;
      const res = await axios.get(`${api}/report/role`, {
        params,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setRoles(res.data);
    } catch (error) {
      console.error("Error fetching role data:", error);
    }
  };

  const fetchSalesman = async (inputValue, companyId, roleId) => {
    try {
      const token = localStorage.getItem("token");
      const params = { search: inputValue };
      if (companyId) params.company_id = companyId;
      if (roleId) params.role = roleId;
      const res = await axios.get(
        `${import.meta.env.VITE_API_URI}/report/get-salesman-select/`,
        {
          params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching salesman data:", error);
    }
  };

  console.log(selectedCompany?.value, selectedRole?.value);
  const loadSalesmanOptions = (inputValue) => {
    return fetchSalesman(inputValue, selectedCompany?.value, selectedRole?.value);
  };

  useEffect(() => {
    fetchMe();
    fetchVisit({
      page: page,
      perPage: perPage,
      userId: selectedSalesman?.value ?? "",
      companyId: selectedCompany?.value ?? "",
      role: selectedRole?.value ?? "",
      from: selectedFromDate,
      to: selectedToDate,
    });
    fetchCompany();
    fetchRole(selectedCompany?.value);
  }, [selectedCompany, selectedSalesman, selectedFromDate, selectedRole, selectedToDate]);

  const handlePageChange = (url) => {
    const pageParam = new URL(url).searchParams.get("page");
    fetchVisit({
      page: pageParam,
      perPage: perPage,
      userId: selectedSalesman?.value ?? "",
      companyId: selectedCompany?.value ?? "",
      role: selectedRole?.value ?? "",
      from: selectedFromDate,
      to: selectedToDate,
    });
  };

  const handleChangeShow = (e) => {
    setPerPage(e.value);
    fetchVisit({
      page: page,
      perPage: e.value,
      userId: selectedSalesman?.value ?? "",
      companyId: selectedCompany?.value ?? "",
      role: selectedRole?.value ?? "",
      from: selectedFromDate,
      to: selectedToDate,
    });
  };

  const handleExport = () => {
    runExport({
      page: page,
      perPage: perPage,
      userId: selectedSalesman?.value ?? "",
      companyId: selectedCompany?.value ?? "",
      role: selectedRole?.value ?? "",
      from: selectedFromDate,
      to: selectedToDate,
    });
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

  function getCompactLinks(links, currentPage) {
    if (!links) return [];
    const numbered = links.filter((l) => !isNaN(Number(l.label)));
    const activeIndex = numbered.findIndex((l) => l.active);
    const start = Math.max(activeIndex - 1, 0);
    const end = Math.min(activeIndex + 1, numbered.length - 1);
    const compact = numbered.slice(start, end + 1);
    const first = numbered[0];
    const last = numbered[numbered.length - 1];
    const result = [];
    if (first.label !== compact[0].label) {
      result.push(first);
      if (Number(compact[0].label) - Number(first.label) > 1)
        result.push({ label: "...", url: null, active: false });
    }
    result.push(...compact);
    if (last.label !== compact[compact.length - 1].label) {
      if (Number(last.label) - Number(compact[compact.length - 1].label) > 1)
        result.push({ label: "...", url: null, active: false });
      result.push(last);
    }
    const prev = links.find((l) => l.label.includes("Previous"));
    const next = links.find((l) => l.label.includes("Next"));
    return [prev, ...result, next].filter(Boolean);
  }

  const renderTooltip = (text) => (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {text}
    </Tooltip>
  );

  const getStatusBadge = (status) => {
    if (status === "unregis") {
      return <span className="badge rounded-pill text-bg-secondary">Unregistered</span>;
    } else if (status === "registered") {
      return <span className="badge rounded-pill text-bg-success">Registered</span>;
    } else {
      return <span className="badge rounded-pill text-bg-warning">On Check</span>;
    }
  };

  return (
    <>
      <style>{`
        .table-row:hover { cursor: pointer; background: #f8fafc !important; }
        .user-table th { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; background: #f8fafc; border-bottom: 2px solid #e2e8f0; padding: 10px 12px; white-space: nowrap; }
        .user-table td { font-size: 13px; color: #334155; padding: 10px 12px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; white-space: nowrap; }
        .act-btn { height: ${H}; width: ${H}; border-radius: ${R}; border: ${B}; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #fff; color: #64748b; }
        .act-btn:hover { background: #f1f5f9; }
        .act-btn.blue { background: #dbeafe; border-color: #93c5fd; color: #2563eb; }
        .act-btn.blue:hover { background: #bfdbfe; }
        .act-btn.green { background: #dcfce7; border-color: #86efac; color: #16a34a; }
        .act-btn.green:hover { background: #bbf7d0; }
        .search-input { height: ${H}; border: ${B}; border-radius: ${R}; padding: 0 12px 0 34px; font-size: ${F}; outline: none; width: 190px; color: #334155; background: #fff; }
        .search-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
        .search-wrap { position: relative; display: flex; align-items: center; }
        .search-wrap .s-icon { position: absolute; left: 10px; color: #94a3b8; pointer-events: none; }
        .fdivider { width: 1px; height: 20px; background: #e2e8f0; flex-shrink: 0; }
      `}</style>
      
      {isLoading && <Loader />}
      
      <div className="col-lg-12">
        <div className="card h-100" style={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <div className="card-header d-flex justify-content-between align-items-center" style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", borderRadius: "12px 12px 0 0", padding: "14px 18px" }}>
            <div className="d-flex align-items-center gap-2">
              <div style={{ width: 3, height: 18, background: "#3b82f6", borderRadius: 3 }} />
              <h5 className="card-title mb-0" style={{ fontSize: "15px", fontWeight: 600, color: "#1e293b" }}>Report Visit</h5>
            </div>
          </div>

          <div className="card-body" style={{ padding: "14px 18px" }}>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px 14px" }}>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <div className="d-flex align-items-center">
                  <span className="me-2" style={{ fontSize: "13px", color: "#64748b" }}>Show</span>
                  <Select
                    options={show}
                    onChange={(e) => handleChangeShow(e)}
                    value={{ value: perPage, label: `${perPage}` }}
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
                
                {showFilter && (
                  <button
                    className="act-btn green"
                    title="Export"
                    onClick={() => handleExport()}
                  >
                    <Icon icon="mdi:file-export-outline" fontSize={18} />
                  </button>
                )}
                
                <button
                  className={`act-btn ${showFilter ? 'blue' : ''}`}
                  onClick={() => setShowFilter(!showFilter)}
                  title="Filter"
                >
                  <Icon icon="line-md:filter" fontSize={18}/>
                </button>
              </div>
            </div>

            {showFilter && (
              <div className="row g-2 mb-3" style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <div className={isManager ? "col-md-6 col-lg-4" : "col-md-4 col-lg-3"}>
                  <Select
                    id="company-select"
                    options={company}
                    onChange={(e) => {
                      if (e) {
                        setSelectedCompany(e);
                        fetchRole(e.value);
                      } else {
                        setSelectedCompany(null);
                        setRoles([]);
                        fetchRole(null);
                      }
                      setSelectedRole(null);
                      setSelectedSalesman(null);
                    }}
                    value={selectedCompany}
                    placeholder="Company"
                    styles={selectStyles}
                    isClearable
                  />
                </div>

                {!isManager && (
                  <div className="col-md-4 col-lg-3">
                    <Select
                      id="role-select"
                      options={roles}
                      value={selectedRole}
                      onChange={(e) => {
                        setSelectedRole(e);
                        setSelectedSalesman(null);
                      }}
                      placeholder="Role"
                      styles={selectStyles}
                      isClearable
                    />
                  </div>
                )}

                <div className={isManager ? "col-md-6 col-lg-4" : "col-md-4 col-lg-2"}>
                  <AsyncSelect
                    key={`${selectedCompany?.value}-${selectedRole?.value}`}
                    cacheOptions
                    defaultOptions
                    loadOptions={loadSalesmanOptions}
                    value={selectedSalesman}
                    onChange={setSelectedSalesman}
                    placeholder="Salesman"
                    styles={selectStyles}
                    isClearable
                    id="salesman-select"
                  />
                </div>

                <div className={isManager ? "col-md-6 col-lg-2" : "col-md-4 col-lg-2"}>
                  <input
                    type="date"
                    defaultValue={selectedFromDate}
                    onChange={(e) => setSelectedFromDate(e.target.value)}
                    id="date-from-input"
                    className="form-control"
                    style={{ height: H, borderColor: "#e2e8f0", borderRadius: R, fontSize: F }}
                    title="From Date"
                  />
                </div>

                <div className={isManager ? "col-md-6 col-lg-2" : "col-md-4 col-lg-2"}>
                  <input
                    type="date"
                    id="date-to-input"
                    className="form-control"
                    onChange={(e) => setSelectedToDate(e.target.value)}
                    defaultValue={selectedToDate}
                    style={{ height: H, borderColor: "#e2e8f0", borderRadius: R, fontSize: F }}
                    title="To Date"
                  />
                </div>
              </div>
            )}

            <div className="table-responsive">
              <table className="table user-table mb-0">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Salesman</th>
                    <th>Role</th>
                    <th>Company</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Address</th>
                    <th>Tap In</th>
                    <th>Tap Out</th>
                    <th>Location</th>
                    <th>Photo</th>
                    <th>Objective</th>
                    <th>PO</th>
                    <th>Result POSM</th>
                    <th>Photo POSM</th>
                    <th>Result</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((v, i) => (
                      <tr key={i} className="table-row">
                        <td style={{ color: "#94a3b8" }}>{(page - 1) * perPage + (i + 1)}</td>
                        <td style={{ fontWeight: 600, color: "#1e293b" }}>{v.user?.full_name ?? "-"}</td>
                        <td>{v.user?.role?.name ?? "-"}</td>
                        <td>{v.user?.company?.name ?? "-"}</td>
                        <td>{v.master_customer?.name ?? "-"}</td>
                        <td>{getStatusBadge(v.master_customer?.status)}</td>
                        <td>
                          <span className="text-truncate d-block" style={{ maxWidth: 250 }} title={v.master_customer?.alamat}>
                            {v.master_customer?.alamat ?? "-"}
                          </span>
                        </td>
                        <td>{v.tap_in_time}</td>
                        <td>{v.tap_out_time}</td>
                        <td>
                          <a
                            href={`https://www.google.com/maps?q=${v.latitude},${v.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary text-decoration-none"
                          >
                            See Location
                          </a>
                        </td>
                        <td>
                          <a
                            href={`${VITE_STORAGE_URI}/storage/${v.photo_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary text-decoration-none"
                          >
                            See Photo
                          </a>
                        </td>
                        <td>{v.objective ?? "-"}</td>
                        <td>{v.po ?? "-"}</td>
                        <td>{v.posm_relation?.posm ?? "-"}</td>
                        <td>
                          {v.posm_relation?.photo_path ? (
                            <a
                              href={`${VITE_STORAGE_URI}/storage/${v.posm_relation?.photo_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary text-decoration-none"
                            >
                              See Photo POSM
                            </a>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>{v.result ?? "-"}</td>
                        <td>
                          <div className="d-flex gap-2 align-items-center justify-content-center">
                            <button
                              className="btn btn-primary btn-sm d-flex align-items-center justify-content-center"
                              style={{ borderRadius: "7px", width: "28px", height: "28px", padding: 0 }}
                              onClick={() => setSelectedTapInId(v.id)}
                              title="Detail"
                            >
                              <Icon icon="lucide:eye" width={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="17" className="text-center py-5" style={{ color: "#94a3b8", fontSize: 14 }}>
                        Data tidak ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <span style={{ fontSize: 13, color: "#64748b" }}>
                Showing {indexOfFirstRow + 1} to {Math.min(indexLastRow, total)} of {total} entries
              </span>
              <nav>
                <ul className="pagination mb-0" style={{ gap: 4 }}>
                  {links && links.length > 0 ? (
                    getCompactLinks(links, page).map((link, index) => {
                      const isPrev = link.label.includes("Previous");
                      const isNext = link.label.includes("Next");
                      const label = isPrev ? "‹ Prev" : isNext ? "Next ›" : link.label;
                      return (
                        <li
                          key={index}
                          className={`page-item ${link.active ? "active" : ""} ${!link.url ? "disabled" : ""}`}
                        >
                          {link.url ? (
                            <button
                              type="button"
                              className="page-link"
                              style={{ borderRadius: 8, fontSize: 13 }}
                              onClick={() => handlePageChange(link.url)}
                              dangerouslySetInnerHTML={{ __html: label }}
                            />
                          ) : (
                            <span
                              className="page-link"
                              style={{ borderRadius: 8, fontSize: 13 }}
                              dangerouslySetInnerHTML={{ __html: label }}
                            />
                          )}
                        </li>
                      );
                    })
                  ) : (
                    <li className="page-item disabled">
                      <span className="page-link" style={{ borderRadius: 8, fontSize: 13 }}>No pages</span>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {selectedTapInId && (
        <VisitDetailModal
          tapInId={selectedTapInId}
          onClose={() => setSelectedTapInId(null)}
        />
      )}
    </>
  );
};

export default VisitTable;