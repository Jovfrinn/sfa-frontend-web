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
    return <p className="text-muted text-center py-4">Belum ada interaction log.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Outlet</th>
            <th>Salesman</th>
            <th>Catatan</th>
            <th>Keberatan</th>
            <th>Follow-up</th>
            <th>Status</th>
            <th>Tanggal</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="fw-semibold">{log.customer_name}</td>
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
                <button
                  className="btn btn-sm btn-outline-primary me-1"
                  onClick={() => onEdit(log)}
                  title="Edit"
                >
                  <Icon icon="lucide:pencil" />
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(log.id)}
                  title="Hapus"
                >
                  <Icon icon="lucide:trash-2" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
