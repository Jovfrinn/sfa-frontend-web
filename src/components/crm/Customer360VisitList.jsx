import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import VisitDetailModal from "../report/VisitDetailModal";

const API_URL = import.meta.env.VITE_API_URI;

function formatDuration(tapIn, tapOut) {
  if (!tapOut) return "Masih di outlet";
  const diff = Math.round((new Date(tapOut) - new Date(tapIn)) / 60000);
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return h > 0 ? `${h}j ${m}m` : `${m}m`;
}

export default function Customer360VisitList({ customerId }) {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTapInId, setSelectedTapInId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!customerId) return;
    axios
      .get(`${API_URL}/tap-out/by-customer/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setVisits(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [customerId]);

  if (loading) return <p className="text-muted text-center py-3">Memuat...</p>;
  if (!visits.length) return <p className="text-muted text-center py-3">Belum ada kunjungan tercatat.</p>;

  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Tanggal</th>
              <th>Salesman</th>
              <th>Masuk</th>
              <th>Keluar</th>
              <th>Durasi</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((v) => (
              <tr key={v.id}>
                <td className="text-nowrap">{v.tap_in_time?.slice(0, 10)}</td>
                <td>{v.salesman_name ?? "-"}</td>
                <td className="text-nowrap">{v.tap_in_time?.slice(11, 16)}</td>
                <td className="text-nowrap">{v.tap_out_time?.slice(11, 16) ?? <span className="text-warning">-</span>}</td>
                <td className="text-muted small">{formatDuration(v.tap_in_time, v.tap_out_time)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setSelectedTapInId(v.id)}
                    title="Lihat detail kunjungan"
                  >
                    <Icon icon="lucide:eye" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTapInId && (
        <VisitDetailModal
          tapInId={selectedTapInId}
          onClose={() => setSelectedTapInId(null)}
        />
      )}
    </>
  );
}
