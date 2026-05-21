import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Icon } from "@iconify/react";
import InteractionLogModal from "./InteractionLogModal";

const API_URL = import.meta.env.VITE_API_URI;

function StatusBadge({ status }) {
  return (
    <span className={`badge ${status === "done" ? "bg-success" : "bg-warning text-dark"}`}>
      {status === "done" ? "Done" : "Open"}
    </span>
  );
}

export default function InteractionLogList({ customerId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editLog, setEditLog] = useState(null);
  const token = localStorage.getItem("token");

  const fetchLogs = () => {
    setLoading(true);
    axios
      .get(`${API_URL}/interaction-logs/by-customer/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setLogs(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, [customerId]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus log ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: "Batal",
      confirmButtonText: "Hapus",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/interaction-logs/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          fetchLogs();
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Gagal menghapus",
            text: err.response?.data?.message,
          });
        }
      }
    });
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="fw-semibold text-muted">{logs.length} interaksi tercatat</span>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => {
            setEditLog(null);
            setShowModal(true);
          }}
        >
          <Icon icon="lucide:plus" className="me-1" />
          Tambah Log
        </button>
      </div>

      {loading ? (
        <p className="text-muted text-center py-3">Memuat...</p>
      ) : logs.length === 0 ? (
        <p className="text-muted text-center py-3">
          Belum ada interaction log untuk outlet ini.
        </p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {logs.map((log) => (
            <div key={log.id} className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <span className="fw-semibold">{log.salesman_name}</span>
                    <span className="text-muted small ms-2">
                      {log.created_at?.slice(0, 10)}
                    </span>
                    {log.tap_in_id && (
                      <span className="badge bg-info text-dark ms-2 small">Kunjungan</span>
                    )}
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <StatusBadge status={log.status} />
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setEditLog(log);
                        setShowModal(true);
                      }}
                    >
                      <Icon icon="lucide:pencil" />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(log.id)}
                    >
                      <Icon icon="lucide:trash-2" />
                    </button>
                  </div>
                </div>

                <p className="mb-1">{log.notes}</p>

                {log.objection && (
                  <div className="alert alert-warning py-1 px-2 mb-1 small">
                    <Icon icon="lucide:alert-triangle" className="me-1" />
                    <strong>Keberatan:</strong> {log.objection}
                  </div>
                )}

                {log.follow_up_date && (
                  <div className="text-muted small">
                    <Icon icon="lucide:calendar" className="me-1" />
                    Follow-up: <strong>{log.follow_up_date}</strong>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <InteractionLogModal
          log={editLog}
          prefillCustomerId={customerId}
          onClose={() => setShowModal(false)}
          onSaved={fetchLogs}
        />
      )}
    </div>
  );
}
