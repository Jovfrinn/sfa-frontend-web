import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify/react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Select from "react-select";

const API_URL = import.meta.env.VITE_API_URI;

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

export default function FollowUpPage() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const token = localStorage.getItem("token");
    axios
      .get(`${API_URL}/interaction-logs?follow_up_due=true`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      })
      .then((res) => { if (active) setLogs(res.data.data ?? []); })
      .catch((err) => { if (active && !axios.isCancel(err)) setLogs([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; controller.abort(); };
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get(`${API_URL}/interaction-logs?follow_up_due=true`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setLogs(res.data.data ?? []))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  };

  const filteredLogs = logs.filter(log => 
    !searchTerm || 
    (log.customer_name && log.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (log.notes && log.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const totalPages = Math.ceil(filteredLogs.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredLogs.slice(indexOfFirstEntry, indexOfLastEntry);

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

  function rowClass(followUpDate) {
    const today = new Date().toISOString().slice(0, 10);
    if (followUpDate < today) return "row-danger";
    if (followUpDate === today) return "row-warning";
    return "";
  }

  return (
    <MasterLayout>
      <style>{`
        .table-row:hover { cursor: pointer; background: #f8fafc !important; }
        .row-danger { background-color: #fef2f2 !important; }
        .row-danger:hover { background-color: #fee2e2 !important; }
        .row-warning { background-color: #fffbeb !important; }
        .row-warning:hover { background-color: #fef3c7 !important; }
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

      <div className="card h-100" style={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <div className="card-header d-flex justify-content-between align-items-center" style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", borderRadius: "12px 12px 0 0", padding: "14px 18px" }}>
          <div className="d-flex align-items-center gap-2">
            <div style={{ width: 3, height: 18, background: "#3b82f6", borderRadius: 3 }} />
            <div>
              <h5 className="card-title mb-0" style={{ fontSize: "15px", fontWeight: 600, color: "#1e293b" }}>Follow-up Reminder</h5>
              <span style={{ fontSize: 12, color: "#64748b" }}>Outlet yang jadwal follow-up-nya sudah tiba atau terlewat</span>
            </div>
          </div>
          
          <div className="d-flex align-items-center gap-2">
            <button onClick={handleRefresh} className="header-view-btn" title="Refresh">
              <Icon icon="mdi:refresh" fontSize={16} />
            </button>
          </div>
        </div>

        <div className="card-body" style={{ padding: "14px 18px" }}>
          
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3"
            style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px 14px" }}>
            
            <div className="d-flex align-items-center gap-2 flex-wrap">
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
                  placeholder="Cari outlet/notes..." 
                  className="search-input" 
                  value={searchTerm} 
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }} 
                />
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table user-table mb-0">
              <thead>
                <tr>
                  <th>Outlet</th>
                  <th>Tanggal Follow-up</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-5" style={{ color: "#94a3b8", fontSize: 14 }}>
                      Memuat...
                    </td>
                  </tr>
                ) : !currentEntries.length ? (
                  <tr>
                    <td colSpan={5} className="text-center py-5" style={{ color: "#94a3b8", fontSize: 14 }}>
                      <Icon icon="lucide:bell-ring" fontSize={32} style={{ display: "block", margin: "0 auto 8px", opacity: 0.5 }} />
                      Tidak ada follow-up yang jatuh tempo saat ini.
                    </td>
                  </tr>
                ) : (
                  currentEntries.map((log) => (
                    <tr key={log.id} className={`table-row ${rowClass(log.follow_up_date)}`}>
                      <td className="fw-semibold text-dark">{log.customer_name ?? "-"}</td>
                      <td className="text-nowrap">{log.follow_up_date}</td>
                      <td style={{ maxWidth: 250 }}>
                        <span className="text-truncate d-block" style={{ maxWidth: 230 }} title={log.notes}>
                          {log.notes ?? "-"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            log.status === "open"
                              ? "bg-warning text-dark"
                              : "bg-success"
                          }`}
                        >
                          {log.status === "open" ? "Open" : "Done"}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2 align-items-center justify-content-center">
                          <button
                            className="btn btn-primary btn-sm d-flex align-items-center justify-content-center"
                            style={{ borderRadius: "7px", width: "28px", height: "28px", padding: 0 }}
                            onClick={() => navigate(`/crm/customer/${log.master_customer_id}`)}
                            title="Lihat Customer 360"
                          >
                            <Icon icon="lucide:layout-dashboard" width={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <span style={{ fontSize: 13, color: "#64748b" }}>
              Showing {filteredLogs.length === 0 ? 0 : indexOfFirstEntry + 1} to{" "}
              {Math.min(indexOfLastEntry, filteredLogs.length)} of{" "}
              {filteredLogs.length} entries
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
    </MasterLayout>
  );
}
