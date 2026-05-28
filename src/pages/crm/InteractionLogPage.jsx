import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import { Breadcrumb } from "react-bootstrap";
import MasterLayout from "../../masterLayout/MasterLayout";
import InteractionLogModal from "../../components/crm/InteractionLogModal";
import InteractionLogTable from "../../components/crm/InteractionLogTable";
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

export default function InteractionLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editLog, setEditLog] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    from: "",
    to: "",
    search: "",
  });
  
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  
  const token = localStorage.getItem("token");

  const fetchLogs = () => {
    setLoading(true);
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;
    if (filters.search) params.search = filters.search;

    axios
      .get(`${API_URL}/interaction-logs`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      })
      .then((res) => setLogs(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleFilterChange = (e) => {
    setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleFilterApply = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  const handleFilterReset = () => {
    const cleared = { status: "", from: "", to: "", search: "" };
    setFilters(cleared);
    // Call fetchLogs with cleared params directly (don't rely on state update side effect)
    setLoading(true);
    axios
      .get(`${API_URL}/interaction-logs`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setLogs(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  
  const filteredLogs = logs; // Filtered from API already
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

  return (
    <MasterLayout>
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
        .form-input-custom { height: ${H}; border: ${B}; border-radius: ${R}; padding: 0 12px; font-size: ${F}; outline: none; color: #334155; background: #fff; width: 100%; }
        .form-input-custom:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
      `}</style>

      <div className="card h-100" style={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <div className="card-header d-flex justify-content-between align-items-center" style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", borderRadius: "12px 12px 0 0", padding: "14px 18px" }}>
          <div className="d-flex align-items-center gap-2">
            <div style={{ width: 3, height: 18, background: "#3b82f6", borderRadius: 3 }} />
            <h5 className="card-title mb-0" style={{ fontSize: "15px", fontWeight: 600, color: "#1e293b" }}>Interaction Log</h5>
          </div>
          
          <button 
            className="act-btn blue" 
            onClick={() => {
              setEditLog(null);
              setShowModal(true);
            }}
            title="Tambah Log"
          >
            <Icon icon="mdi:plus" fontSize={20} />
          </button>
        </div>

        <div className="card-body" style={{ padding: "14px 18px" }}>
          
          <div className="d-flex flex-wrap align-items-end gap-2 mb-3" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px 14px" }}>
            
            <div className="d-flex align-items-center me-2">
              <span className="me-2" style={{ fontSize: "13px", color: "#64748b" }}>Show</span>
              <Select
                options={[
                  { value: 10, label: "10" },
                  { value: 20, label: "20" },
                  { value: 50, label: "50" },
                ]}
                onChange={(opt) => {
                  setEntriesPerPage(Number(opt.value));
                  setCurrentPage(1);
                }}
                value={{ value: entriesPerPage, label: `${entriesPerPage}` }}
                classNamePrefix="select"
                className="d-inline-block w-auto"
                styles={selectStyles}
              />
            </div>

            <div className="fdivider" style={{ margin: "0 4px", alignSelf: "center" }} />

            <div style={{ width: 140 }}>
              <Select
                placeholder="Status..."
                options={[
                  { value: "open", label: "Open" },
                  { value: "done", label: "Done" },
                ]}
                isClearable
                onChange={(opt) => setFilters(f => ({ ...f, status: opt ? opt.value : "" }))}
                value={filters.status ? { value: filters.status, label: filters.status === "done" ? "Done" : "Open" } : null}
                styles={selectStyles}
              />
            </div>

            <div style={{ width: 140 }}>
              <input
                type="date"
                name="from"
                className="form-input-custom"
                value={filters.from}
                onChange={handleFilterChange}
                placeholder="Dari"
                title="Dari Tanggal"
              />
            </div>

            <div style={{ width: 140 }}>
              <input
                type="date"
                name="to"
                className="form-input-custom"
                value={filters.to}
                onChange={handleFilterChange}
                placeholder="Sampai"
                title="Sampai Tanggal"
              />
            </div>

            <div className="fdivider" style={{ margin: "0 4px", alignSelf: "center" }} />

            <div className="search-wrap flex-grow-1" style={{ maxWidth: 220 }}>
              <Icon icon="mdi:magnify" className="s-icon" fontSize={16} />
              <input
                type="text"
                name="search"
                className="search-input w-100"
                placeholder="Cari notes..."
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>

            <button type="button" className="act-btn blue" onClick={handleFilterApply} title="Terapkan Filter">
              <Icon icon="mdi:filter" fontSize={18} />
            </button>
            <button type="button" className="act-btn" onClick={handleFilterReset} title="Reset Filter">
              <Icon icon="mdi:refresh" fontSize={18} />
            </button>
          </div>

          <InteractionLogTable
            logs={currentEntries}
            onEdit={(log) => {
              setEditLog(log);
              setShowModal(true);
            }}
            onRefresh={fetchLogs}
          />

          <div className="d-flex justify-content-between align-items-center mt-3">
            <span style={{ fontSize: 13, color: "#64748b" }}>
              Showing {indexOfFirstEntry + 1} to{" "}
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

      {showModal && (
        <InteractionLogModal
          log={editLog}
          onClose={() => setShowModal(false)}
          onSaved={fetchLogs}
        />
      )}
    </MasterLayout>
  );
}
