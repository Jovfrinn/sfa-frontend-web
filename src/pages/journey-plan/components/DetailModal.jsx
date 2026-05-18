import StatusBadge from "./StatusBadge";

const DetailModal = ({ show, item, onClose }) => {
  if (!show || !item) return null;

  return (
    <>
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Detail Journey Plan</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="small text-muted">Company</label>
                  <p className="fw-semibold">
                    {item.user?.company?.name || "-"}
                  </p>
                </div>
                <div className="col-md-6">
                  <label className="small text-muted">Salesman</label>
                  <p className="fw-semibold">{item.user?.full_name || "-"}</p>
                </div>
                <div className="col-md-6">
                  <label className="small text-muted">Outlet</label>
                  <p className="fw-semibold">{item.customer?.name || "-"}</p>
                </div>
                <div className="col-md-6">
                  <label className="small text-muted">Tanggal Rencana</label>
                  <p className="fw-semibold">
                    {new Date(item.planned_visit_date).toLocaleDateString(
                      "id-ID"
                    )}
                  </p>
                </div>
                <div className="col-12">
                  <label className="small text-muted">Alamat</label>
                  <p className="fw-semibold">{item.customer?.alamat || "-"}</p>
                </div>
                <div className="col-md-6">
                  <label className="small text-muted">Status</label>
                  <div>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
                {item.tap_in && (
                  <>
                    <div className="col-md-6">
                      <label className="small text-muted">Tap In</label>
                      <p className="fw-semibold text-success">
                        {new Date(item.tap_in.tap_in_time).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <label className="small text-muted">Tap Out</label>
                      <p className="fw-semibold text-danger">
                        {new Date(item.tap_in.tap_out_time).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                    </div>
                    {item.tap_in.description && (
                      <div className="col-12">
                        <label className="small text-muted">Keterangan</label>
                        <p className="fw-semibold">
                          {item.tap_in.description}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  );
};

export default DetailModal;