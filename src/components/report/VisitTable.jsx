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
      {isLoading && <Loader />}
      <div className="col-lg-12 body-visit">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0 filter-title">Filter & Export</h5>
            <div className="d-flex gap-1">
              {showFilter && (
                <OverlayTrigger
                  placement="top"
                  overlay={renderTooltip("Export Data")}
                >
                  <button
                    onClick={() => handleExport()}
                    className="btn btn-success btn-sm"
                  >
                    <Icon icon={"mdi:file-export-outline"} fontSize={24} />
                  </button>
                </OverlayTrigger>
              )}
              <OverlayTrigger
                placement="top"
                overlay={renderTooltip("Filter")}
              >
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2 filter-button"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-title="Tooltip on top"
                >
                  <Icon icon={"mdi:filter-outline"} className="icon" fontSize={24} />
                </button>
              </OverlayTrigger>
            </div>
          </div>
          {showFilter && (
            <div className="card-body">
              <div className="row g-3">
                <div className={isManager ? "col-md-6" : "col-md-4"}>
                  <label htmlFor="company-select" className="form-label">
                    Company
                  </label>
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
                    placeholder="Choose Company"
                    isClearable
                  />
                </div>

                {!isManager && (
                  <div className="col-md-4">
                    <label htmlFor="role-select" className="form-label">
                      Role
                    </label>
                    <Select
                      id="role-select"
                      options={roles}
                      value={selectedRole}
                      onChange={(e) => {
                        setSelectedRole(e);
                        setSelectedSalesman(null);
                      }}
                      placeholder="Choose Role"
                      isClearable
                    />
                  </div>
                )}

                <div className={isManager ? "col-md-6" : "col-md-4"}>
                  <label htmlFor="salesman-select" className="form-label">
                    Salesman
                  </label>
                  <AsyncSelect
                    key={`${selectedCompany?.value}-${selectedRole?.value}`}
                    cacheOptions
                    defaultOptions
                    loadOptions={loadSalesmanOptions}
                    value={selectedSalesman}
                    onChange={setSelectedSalesman}
                    placeholder="Choose Salesman"
                    isClearable
                    id="salesman-select"
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="date-from-input" className="form-label">
                    From
                  </label>
                  <input
                    type="date"
                    defaultValue={selectedFromDate}
                    onChange={(e) => setSelectedFromDate(e.target.value)}
                    id="date-from-input"
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="date-to-input" className="form-label">
                    To
                  </label>
                  <input
                    type="date"
                    id="date-to-input"
                    className="form-control"
                    onChange={(e) => setSelectedToDate(e.target.value)}
                    defaultValue={selectedToDate}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card h-100 mt-3">
          <div className="card-header d-flex justify-content-between align-items-center report-visit-section">
            <h5 className="card-title mb-0 report-visit">Report Visit</h5>
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center navbar-search">
                <input type="text" name="search" placeholder="Search" />
                <Icon icon="ion:search-outline" className="icon" />
              </div>
              <div className="d-flex align-items-center">
                <Select
                  options={show}
                  onChange={(e) => handleChangeShow(e)}
                  defaultValue={show[0]}
                  classNamePrefix="select-show"
                />
                <span className="ms-1 show-text">Show</span>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="table-responsive">
              <table className="table basic-border-table mb-0">
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
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((v, i) => (
                      <tr key={i}>
                        <td>{(page - 1) * perPage + (i + 1)}</td>
                        <td>{v.user.full_name}</td>
                        <td>{v.user.role ? v.user.role.name : "-"}</td>
                        <td>{v.user.company.name}</td>
                        <td>{v.master_customer.name}</td>
                        <td>{getStatusBadge(v.master_customer.status)}</td>
                        <td>{v.master_customer.alamat}</td>
                        <td>{v.tap_in_time}</td>
                        <td>{v.tap_out_time}</td>
                        <td>
                          <a
                            href={`https://www.google.com/maps?q=${v.latitude},${v.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary"
                          >
                            See Location
                          </a>
                        </td>
                        <td>
                          <a
                            href={`${VITE_STORAGE_URI}/storage/${v.photo_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary"
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
                              className="text-primary"
                            >
                              See Photo POSM
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>{v.result ?? "-"}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setSelectedTapInId(v.id)}
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="16" className="text-center text-muted py-3">
                        Data tidak ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3 section-pagination">
              <span>
                Showing {indexOfFirstRow + 1} to {indexLastRow} of {total} entries
              </span>
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center mt-3">
                  {links && links.length > 0 ? (
                    getCompactLinks(links, page).map((link, index) => (
                      <li
                        key={index}
                        className={`page-item ${link.active ? "active" : ""} ${!link.url ? "disabled" : ""}`}
                      >
                        {link.url ? (
                          <button
                            type="button"
                            className="page-link"
                            onClick={() => handlePageChange(link.url)}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                          />
                        ) : (
                          <span
                            className="page-link"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                          />
                        )}
                      </li>
                    ))
                  ) : (
                    <li className="page-item disabled">
                      <span className="page-link">No pages</span>
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