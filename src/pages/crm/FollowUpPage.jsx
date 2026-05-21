import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify/react";
import MasterLayout from "../../masterLayout/MasterLayout";

const API_URL = import.meta.env.VITE_API_URI;

function rowClass(followUpDate) {
  const today = new Date().toISOString().slice(0, 10);
  if (followUpDate < today) return "table-danger";
  if (followUpDate === today) return "table-warning";
  return "";
}

export default function FollowUpPage() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("token");
    axios
      .get(`${API_URL}/interaction-logs?follow_up_due=true`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      })
      .then((res) => setLogs(res.data.data ?? []))
      .catch((err) => { if (!axios.isCancel(err)) setLogs([]); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  return (
    <MasterLayout>
      <div className="px-24 py-16">
        <div className="mb-16">
          <h5 className="fw-semibold mb-0">Follow-up Reminder</h5>
          <p className="text-secondary-light small mb-0">
            Outlet yang jadwal follow-up-nya sudah tiba atau terlewat
          </p>
        </div>

        {loading ? (
          <p className="text-muted text-center py-5">Memuat...</p>
        ) : !logs.length ? (
          <div className="card border-0 shadow-sm radius-12">
            <div className="card-body text-center py-5 text-muted">
              <Icon
                icon="lucide:bell-ring"
                width={32}
                className="mb-2 d-block mx-auto opacity-50"
              />
              Tidak ada follow-up yang jatuh tempo saat ini.
            </div>
          </div>
        ) : (
          <div className="card border-0 shadow-sm radius-12">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Outlet</th>
                      <th>Tanggal Follow-up</th>
                      <th>Notes</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className={rowClass(log.follow_up_date)}>
                        <td className="fw-medium">{log.customer_name ?? "-"}</td>
                        <td className="text-nowrap">{log.follow_up_date}</td>
                        <td className="text-secondary-light small">{log.notes ?? "-"}</td>
                        <td>
                          <span
                            className={`badge ${
                              log.status === "open"
                                ? "bg-warning text-dark"
                                : "bg-success"
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              navigate(`/crm/customer/${log.master_customer_id}`)
                            }
                            title="Lihat Customer 360"
                          >
                            <Icon icon="lucide:layout-dashboard" width={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </MasterLayout>
  );
}
