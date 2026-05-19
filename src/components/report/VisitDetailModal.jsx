import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URI;

function TabButton({ label, active, onClick }) {
  return (
    <button
      className={`btn btn-sm me-1 ${active ? "btn-primary" : "btn-outline-secondary"}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default function VisitDetailModal({ tapInId, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("stock");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_URL}/v2/tap-out/visit-detail/${tapInId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) setDetail(res.data.data);
      })
      .finally(() => setLoading(false));
  }, [tapInId]);

  const tabs = [
    { key: "stock", label: "Stock" },
    { key: "selling_out", label: "Selling Out" },
    { key: "competitor", label: "Competitor" },
    { key: "pre_order", label: "Pre Order" },
    { key: "posm", label: "POSM" },
  ];

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-scrollable"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Detail Kunjungan
              {detail && (
                <span className="text-muted fs-6 ms-2">
                  — {detail.tap_in.master_customer?.name} |{" "}
                  {detail.tap_in.tap_in_time?.slice(0, 10)}
                </span>
              )}
            </h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            {loading ? (
              <div className="text-center py-4">Memuat data...</div>
            ) : !detail ? (
              <div className="text-center py-4 text-danger">
                Gagal memuat data.
              </div>
            ) : (
              <>
                <div className="mb-3">
                  {tabs.map((t) => (
                    <TabButton
                      key={t.key}
                      label={t.label}
                      active={activeTab === t.key}
                      onClick={() => setActiveTab(t.key)}
                    />
                  ))}
                </div>

                {activeTab === "stock" && (
                  <StockTab stocks={detail.stocks} />
                )}
                {activeTab === "selling_out" && (
                  <SellingOutTab sellingOuts={detail.selling_outs} />
                )}
                {activeTab === "competitor" && (
                  <CompetitorTab competitors={detail.competitors} />
                )}
                {activeTab === "pre_order" && (
                  <PreOrderTab preOrders={detail.pre_orders} />
                )}
                {activeTab === "posm" && (
                  <PosmTab tapIn={detail.tap_in} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StockTab({ stocks }) {
  if (!stocks?.length)
    return <p className="text-muted">Tidak ada data stok.</p>;
  return (
    <table className="table table-sm table-bordered">
      <thead className="table-light">
        <tr>
          <th>Produk</th>
          <th>Alokasi</th>
          <th>Aktual</th>
          <th>Exp Date</th>
        </tr>
      </thead>
      <tbody>
        {stocks.map((s) => (
          <tr key={s.id}>
            <td>{s.master_inventory?.nama ?? "-"}</td>
            <td>{s.alokasi_stock ?? "-"}</td>
            <td>{s.actual_stock ?? "-"}</td>
            <td>{s.exp_date ?? "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SellingOutTab({ sellingOuts }) {
  if (!sellingOuts?.length)
    return <p className="text-muted">Tidak ada data selling out.</p>;
  return (
    <table className="table table-sm table-bordered">
      <thead className="table-light">
        <tr>
          <th>Kategori</th>
          <th>Tipe</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {sellingOuts.map((s) => (
          <tr key={s.id}>
            <td>{s.categories?.nama ?? "-"}</td>
            <td>{s.type}</td>
            <td>{s.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CompetitorTab({ competitors }) {
  if (!competitors?.length)
    return <p className="text-muted">Tidak ada data competitor.</p>;
  return (
    <table className="table table-sm table-bordered">
      <thead className="table-light">
        <tr>
          <th>Brand</th>
          <th>Harga Jual</th>
          <th>Promo</th>
          <th>Periode</th>
        </tr>
      </thead>
      <tbody>
        {competitors.map((c) => (
          <tr key={c.id}>
            <td>{c.brand_name}</td>
            <td>{c.price_sell ? `Rp ${Number(c.price_sell).toLocaleString("id-ID")}` : "-"}</td>
            <td>{c.promotion ?? "-"}</td>
            <td>
              {c.date_from && c.date_to
                ? `${c.date_from} – ${c.date_to}`
                : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PreOrderTab({ preOrders }) {
  if (!preOrders?.length)
    return <p className="text-muted">Tidak ada data pre order.</p>;
  return (
    <table className="table table-sm table-bordered">
      <thead className="table-light">
        <tr>
          <th>Produk</th>
          <th>Qty</th>
          <th>Unit</th>
        </tr>
      </thead>
      <tbody>
        {preOrders.map((p) => (
          <tr key={p.id}>
            <td>{p.master_inventory?.nama ?? "-"}</td>
            <td>{p.quantity}</td>
            <td>{p.unit ?? "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PosmTab({ tapIn }) {
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URI;
  return (
    <div>
      <p>
        <strong>POSM:</strong> {tapIn.posm?.posm ?? "-"}
      </p>
      <p>
        <strong>Result:</strong> {tapIn.result ?? "-"}
      </p>
      {tapIn.posm?.photo_path && (
        <img
          src={`${STORAGE_URL}/${tapIn.posm.photo_path}`}
          alt="POSM"
          style={{ maxWidth: "100%", maxHeight: 300, objectFit: "contain" }}
        />
      )}
    </div>
  );
}
