import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import { Breadcrumb } from "react-bootstrap";
import MasterLayout from "../../masterLayout/MasterLayout";
import InteractionLogModal from "../../components/crm/InteractionLogModal";
import InteractionLogTable from "../../components/crm/InteractionLogTable";

const API_URL = import.meta.env.VITE_API_URI;

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
    setFilters({ status: "", from: "", to: "", search: "" });
  };

  useEffect(() => {
    if (!filters.status && !filters.from && !filters.to && !filters.search) {
      fetchLogs();
    }
  }, [filters]);

  return (
    <MasterLayout>
      <Breadcrumb title="CRM - Interaction Log" />

      <div className="d-flex justify-content-between align-items-center mb-24">
        <div>
          <h4 className="mb-0 fw-bold">Interaction Log</h4>
          <p className="text-secondary-light mb-0">Catatan interaksi sales dengan outlet</p>
        </div>
        <button
          className="btn btn-primary radius-8 px-20 py-10"
          onClick={() => {
            setEditLog(null);
            setShowModal(true);
          }}
        >
          <Icon icon="lucide:plus" className="me-1" />
          Tambah Log
        </button>
      </div>

      {/* Filter bar */}
      <div className="card radius-12 mb-24">
        <div className="card-body px-24 py-16">
          <form onSubmit={handleFilterApply} className="row g-2 align-items-end">
            <div className="col-md-3">
              <label className="form-label fw-semibold text-secondary-light">Status</label>
              <select
                name="status"
                className="form-select"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">Semua Status</option>
                <option value="open">Open</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label fw-semibold text-secondary-light">Dari Tanggal</label>
              <input
                type="date"
                name="from"
                className="form-control"
                value={filters.from}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label fw-semibold text-secondary-light">Sampai Tanggal</label>
              <input
                type="date"
                name="to"
                className="form-control"
                value={filters.to}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold text-secondary-light">Cari</label>
              <input
                type="text"
                name="search"
                className="form-control"
                placeholder="Cari notes atau keberatan..."
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-2 d-flex gap-2">
              <button type="submit" className="btn btn-primary radius-8 flex-fill">
                <Icon icon="lucide:search" className="me-1" />
                Cari
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary radius-8"
                onClick={handleFilterReset}
                title="Reset filter"
              >
                <Icon icon="lucide:x" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Table */}
      <div className="card radius-12 p-0">
        <div className="card-body p-0">
          {loading ? (
            <p className="text-secondary-light text-center py-40">Memuat data...</p>
          ) : (
            <InteractionLogTable
              logs={logs}
              onEdit={(log) => {
                setEditLog(log);
                setShowModal(true);
              }}
              onRefresh={fetchLogs}
            />
          )}
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
