import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify/react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Customer360VisitList from "../../components/crm/Customer360VisitList";
import InteractionLogList from "../../components/crm/InteractionLogList";

const API_URL = import.meta.env.VITE_API_URI;

function StatusBadge({ status }) {
  const map = {
    registered: ["bg-success", "Registered"],
    on_check_spv: ["bg-warning text-dark", "On Check SPV"],
    on_check_manager: ["bg-info text-dark", "On Check Manager"],
    unregis: ["bg-secondary", "Unregistered"],
  };
  const [cls, label] = map[status] ?? ["bg-secondary", status];
  return <span className={`badge ${cls}`}>{label}</span>;
}

export default function Customer360Page() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const opts = { headers, signal: controller.signal };

    setLoading(true);
    setFetchError(false);

    Promise.all([
      axios.get(`${API_URL}/customers/show/${id}`, opts),
      axios.get(`${API_URL}/tap-out/by-customer/${id}`, opts),
    ])
      .then(([custRes, visitRes]) => {
        setCustomer(custRes.data.data ?? null);
        setVisits(visitRes.data.data ?? []);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) setFetchError(true);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <MasterLayout>
        <p className="text-muted text-center py-5">Memuat data outlet...</p>
      </MasterLayout>
    );
  }

  if (fetchError || !customer) {
    return (
      <MasterLayout>
        <p className="text-danger text-center py-5">Outlet tidak ditemukan atau akses ditolak.</p>
      </MasterLayout>
    );
  }

  return (
    <MasterLayout>
      <div className="px-24 py-16">
        {/* Back button */}
        <button
          className="btn btn-sm btn-outline-secondary mb-16 d-flex align-items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <Icon icon="lucide:arrow-left" />
          Kembali
        </button>

        {/* Header */}
        <div className="card border-0 shadow-sm mb-24 radius-12">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
              <div>
                <h4 className="fw-bold mb-4">{customer.name}</h4>
                <p className="text-secondary-light mb-2">
                  <Icon icon="lucide:map-pin" className="me-1" />
                  {[customer.alamat, customer.kecamatan, customer.kota].filter(Boolean).join(", ")}
                </p>
                {customer.channel && (
                  <p className="text-secondary-light mb-2">
                    <Icon icon="lucide:tag" className="me-1" />
                    {customer.channel} {customer.sub_channel ? `— ${customer.sub_channel}` : ""}
                  </p>
                )}
                {customer.pic && (
                  <p className="text-secondary-light mb-0">
                    <Icon icon="lucide:user" className="me-1" />
                    {customer.pic}
                    {customer.contact_pic ? ` (${customer.contact_pic})` : ""}
                  </p>
                )}
              </div>
              <StatusBadge status={customer.status} />
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="row g-3 mb-24">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm radius-12">
              <div className="card-body d-flex align-items-center gap-16">
                <div className="w-48-px h-48-px d-flex align-items-center justify-content-center bg-primary-light rounded-circle">
                  <Icon icon="lucide:map-pin-check" className="text-primary" width={22} />
                </div>
                <div>
                  <p className="text-secondary-light mb-0 small">Total Kunjungan</p>
                  <h5 className="fw-bold mb-0">{visits.length}x</h5>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 shadow-sm radius-12">
              <div className="card-body d-flex align-items-center gap-16">
                <div className="w-48-px h-48-px d-flex align-items-center justify-content-center bg-success-light rounded-circle">
                  <Icon icon="lucide:shopping-cart" className="text-success" width={22} />
                </div>
                <div>
                  <p className="text-secondary-light mb-0 small">Pre-Order</p>
                  <h5 className="fw-bold mb-0">
                    {customer.preorder_summary?.total_po ?? 0} PO
                    {customer.preorder_summary?.last_po_date && (
                      <span className="text-secondary-light fw-normal fs-6 ms-2">
                        terakhir {customer.preorder_summary.last_po_date}
                      </span>
                    )}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visit list */}
        <div className="card border-0 shadow-sm mb-24 radius-12">
          <div className="card-header bg-transparent border-0 pt-16 pb-0">
            <h6 className="fw-semibold mb-0">
              <Icon icon="lucide:calendar-check" className="me-2" />
              Kunjungan Terbaru (maks. 20)
            </h6>
          </div>
          <div className="card-body">
            <Customer360VisitList customerId={id} />
          </div>
        </div>

        {/* Interaction log */}
        <div className="card border-0 shadow-sm radius-12">
          <div className="card-header bg-transparent border-0 pt-16 pb-0">
            <h6 className="fw-semibold mb-0">
              <Icon icon="lucide:message-square-text" className="me-2" />
              Interaction Log
            </h6>
          </div>
          <div className="card-body">
            <InteractionLogList customerId={id} />
          </div>
        </div>
      </div>
    </MasterLayout>
  );
}
