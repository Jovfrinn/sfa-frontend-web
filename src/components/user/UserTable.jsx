import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Select from "react-select";
import Loader from "../loader/loader";

const UserTable = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentData, setCurrentData] = useState([]);
  const [page, setPage] = useState(1);
  const [to, setTo] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  
  const [company, setCompany] = useState([]);
  const [companyId, setCompanyId] = useState("");
  
  const [positions, setPositions] = useState([]);
  const [positionVal, setPositionVal] = useState("");
  
  const [loading, setLoading] = useState(false);

  const api = import.meta.env.VITE_API_URI;
  const token = localStorage.getItem("token");

  const fetchUsers = async (page = 1, perPage = 10, search = "", companyId = "", position = "") => {
    try {
      setLoading(true);
      const res = await axios.get(`${api}/user/list`, {
        params: { page, per_page: perPage, search, company_id: companyId, position },
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      setCurrentData(res.data.data.data);
      setPage(res.data.data.current_page);
      setTotalPages(Math.ceil(res.data.data.total / res.data.data.per_page));
      setPerPage(res.data.data.per_page);
      setTo(res.data.data.to);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompany = async () => {
    try {
      const res = await axios.get(api + `/company/select`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      setCompany(res.data);
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  const fetchPositions = async () => {
    try {
      const res = await axios.get(api + `/user/positions`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      setPositions(res.data.data);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  useEffect(() => { setPage(1); }, [search, companyId, positionVal]);

  useEffect(() => {
    fetchUsers(page, perPage, search, companyId?.value || "", positionVal?.value || "");
    fetchCompany();
    fetchPositions();
  }, [page, perPage, search, companyId?.value, positionVal?.value]);

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

  return (
    <>
      <style>{`
        .table-row:hover { cursor: pointer; background: #f8fafc !important; }
        .user-table th { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; background: #f8fafc; border-bottom: 2px solid #e2e8f0; padding: 10px 12px; white-space: nowrap; }
        .user-table td { font-size: 13px; color: #334155; padding: 10px 12px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .status-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .status-inactive { background: #fee2e2; color: #dc2626; }
        .status-active { background: #dcfce7; color: #16a34a; }
        .act-btn { height: ${H}; width: ${H}; border-radius: ${R}; border: ${B}; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #fff; color: #64748b; }
        .act-btn:hover { background: #f1f5f9; }
        .act-btn.blue { background: #dbeafe; border-color: #93c5fd; color: #2563eb; }
        .act-btn.blue:hover { background: #bfdbfe; }
        .search-input { height: ${H}; border: ${B}; border-radius: ${R}; padding: 0 12px 0 34px; font-size: ${F}; outline: none; width: 190px; color: #334155; background: #fff; }
        .search-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
        .search-wrap { position: relative; display: flex; align-items: center; }
        .search-wrap .s-icon { position: absolute; left: 10px; color: #94a3b8; pointer-events: none; }
        .fdivider { width: 1px; height: 20px; background: #e2e8f0; flex-shrink: 0; }
      `}</style>

      <div className="col-lg-12">
        <div className="card h-100" style={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          {loading ? <Loader /> : null}

          <div className="card-header" style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", borderRadius: "12px 12px 0 0", padding: "14px 18px" }}>
            <div className="d-flex align-items-center gap-2">
              <div style={{ width: 3, height: 18, background: "#3b82f6", borderRadius: 3 }} />
              <h5 className="card-title mb-0" style={{ fontSize: "15px", fontWeight: 600, color: "#1e293b" }}>Users</h5>
            </div>
          </div>

          <div className="card-body" style={{ padding: "14px 18px" }}>

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
                    options={company}
                    value={companyId}
                    onChange={(opt) => setCompanyId(opt)}
                    styles={selectStyles}
                  />
                </div>

                <div className="fdivider" />

                {/* Position */}
                <div style={{ minWidth: 150 }}>
                  <Select
                    placeholder="All Position"
                    isClearable
                    options={positions}
                    value={positionVal}
                    onChange={(opt) => setPositionVal(opt)}
                    styles={selectStyles}
                  />
                </div>
              </div>

              {/* Kanan */}
              <div className="d-flex align-items-center gap-2">
                <div className="search-wrap">
                  <Icon icon="mdi:magnify" className="s-icon" fontSize={16} />
                  <input type="text" placeholder="Search user..." className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>

                <button className="act-btn blue" onClick={() => navigate('/setting/user/create')} title="Tambah User">
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
                    <th>Username</th>
                    <th>Role</th>
                    <th>Position</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((item, index) => (
                      <tr key={item.id} className="table-row">
                        <td style={{ color: "#94a3b8" }}>{indexOfFirstRow + index + 1}</td>
                        <td style={{ fontWeight: 600, color: "#1e293b" }}>{item.full_name ?? "-"}</td>
                        <td>{item.username ?? "-"}</td>
                        <td>{item.role?.name ?? "-"}</td>
                        <td>{item.position ?? "-"}</td>
                        <td>{item.company?.name ?? "-"}</td>
                        <td>
                          {item.status === "active" ? (
                            <span className="status-badge status-active">Active</span>
                          ) : (
                            <span className="status-badge status-inactive">Inactive</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm d-flex align-items-center"
                            style={{ borderRadius: 7 }}
                            onClick={() => navigate(`/setting/user/edit/${item.id}`)}
                            title="Edit User"
                          >
                            <Icon icon="mdi:pencil" width={15} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-5" style={{ color: "#94a3b8", fontSize: 14 }}>
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
        </div>
      </div>
    </>
  );
};

export default UserTable;
