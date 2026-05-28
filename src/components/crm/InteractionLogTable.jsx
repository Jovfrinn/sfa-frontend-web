import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URI;

function StatusBadge({ status }) {
  return (
    <span className={`badge ${status === "done" ? "bg-success" : "bg-warning text-dark"}`}>
      {status === "done" ? "Done" : "Open"}
    </span>
  );
}

export default function InteractionLogTable({ logs, onEdit, onRefresh }) {
  const token = localStorage.getItem("token");

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
          Swal.fire({ icon: "success", title: "Dihapus", timer: 1200, showConfirmButton: false });
          onRefresh();
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Gagal menghapus",
            text: err.response?.data?.message ?? err.message,
          });
        }
      }
    });
  };

  if (!logs.length) {
    return (
      <div className="text-center py-5">
        <Icon icon="mdi:inbox-outline" fontSize={32} style={{ display: "block", margin: "0 auto 8px", color: "#94a3b8" }} />
        <span style={{ color: "#94a3b8", fontSize: 14 }}>Belum ada interaction log.</span>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table user-table mb-0">
        <thead>
          <tr>
            <th>Outlet</th>
            <th>Salesman</th>
            <th>Catatan</th>
            <th>Keberatan</th>
            <th>Follow-up</th>
            <th>Status</th>
            <th>Tanggal</th>
            <th className="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="table-row">
              <td className="fw-semibold text-dark">{log.customer_name}</td>
              <td>{log.salesman_name}</td>
              <td style={{ maxWidth: 220 }}>
                <span
                  className="text-truncate d-block"
                  style={{ maxWidth: 200 }}
                  title={log.notes}
                >
                  {log.notes}
                </span>
              </td>
              <td style={{ maxWidth: 160 }}>
                {log.objection ? (
                  <span
                    className="text-truncate d-block"
                    style={{ maxWidth: 150 }}
                    title={log.objection}
                  >
                    {log.objection}
                  </span>
                ) : (
                  <span className="text-muted">-</span>
                )}
              </td>
              <td>{log.follow_up_date ?? <span className="text-muted">-</span>}</td>
              <td>
                <StatusBadge status={log.status} />
              </td>
              <td className="text-muted small">{log.created_at?.slice(0, 10)}</td>
              <td>
                <div className="d-flex gap-2 align-items-center justify-content-center">
                  <button
                    className="btn btn-warning btn-sm d-flex align-items-center justify-content-center"
                    style={{ borderRadius: "7px", width: "28px", height: "28px", padding: 0 }}
                    onClick={() => onEdit(log)}
                    title="Edit"
                  >
                    <Icon icon="mdi:pencil" width={16} />
                  </button>
                  <button
                    className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
                    style={{ borderRadius: "7px", width: "28px", height: "28px", padding: 0 }}
                    onClick={() => handleDelete(log.id)}
                    title="Hapus"
                  >
                    <Icon icon="mdi:trash" width={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
