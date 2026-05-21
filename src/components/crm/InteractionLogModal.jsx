import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URI;

const EMPTY_FORM = {
  master_customer_id: "",
  tap_in_id: "",
  notes: "",
  objection: "",
  follow_up_date: "",
  status: "open",
};

export default function InteractionLogModal({
  log = null,
  prefillCustomerId = null,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const isEdit = !!log;

  useEffect(() => {
    if (isEdit) {
      setForm({
        master_customer_id: log.master_customer_id ?? "",
        tap_in_id: log.tap_in_id ?? "",
        notes: log.notes ?? "",
        objection: log.objection ?? "",
        follow_up_date: log.follow_up_date ?? "",
        status: log.status ?? "open",
      });
    } else if (prefillCustomerId) {
      setForm((f) => ({ ...f, master_customer_id: prefillCustomerId }));
    }
  }, [log, prefillCustomerId]);

  useEffect(() => {
    // Only fetch customer list when not editing and no prefill
    // VITE_API_URI already includes /api/v2, so endpoint is /customers/registered
    if (!isEdit && !prefillCustomerId) {
      axios
        .get(`${API_URL}/customers/registered`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { per_page: 200 },
        })
        .then((res) => setCustomers(res.data.data?.data ?? []))
        .catch(() => {});
    }
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        master_customer_id: form.master_customer_id,
        tap_in_id: form.tap_in_id || null,
        notes: form.notes,
        objection: form.objection || null,
        follow_up_date: form.follow_up_date || null,
        status: form.status,
      };

      if (isEdit) {
        await axios.put(`${API_URL}/interaction-logs/update/${log.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_URL}/interaction-logs/store`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      Swal.fire({
        icon: "success",
        title: isEdit ? "Log diperbarui" : "Log disimpan",
        timer: 1500,
        showConfirmButton: false,
      });
      onSaved();
      onClose();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal menyimpan",
        text: err.response?.data?.message ?? err.message,
      });
    } finally {
      setLoading(false);
    }
  };

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
              {isEdit ? "Edit Interaction Log" : "Tambah Interaction Log"}
            </h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {!isEdit && !prefillCustomerId && (
                <div className="mb-3">
                  <label className="form-label fw-semibold">Outlet *</label>
                  <select
                    name="master_customer_id"
                    className="form-select"
                    value={form.master_customer_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Pilih Outlet --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-semibold">Catatan / Notes *</label>
                <textarea
                  name="notes"
                  className="form-control"
                  rows={3}
                  value={form.notes}
                  onChange={handleChange}
                  required
                  placeholder="Catatan hasil interaksi dengan outlet..."
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Keberatan (Objection)</label>
                <textarea
                  name="objection"
                  className="form-control"
                  rows={2}
                  value={form.objection}
                  onChange={handleChange}
                  placeholder="Keberatan atau hambatan dari outlet (opsional)..."
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Tanggal Follow-up</label>
                  <input
                    type="date"
                    name="follow_up_date"
                    className="form-control"
                    value={form.follow_up_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Status</label>
                  <select
                    name="status"
                    className="form-select"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="open">Open</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Batal
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Log"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
