const TargetModal = ({ show, targetDaily, onTargetChange, onSave, onClose }) => {
  if (!show) return null;

  return (
    <>
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Set Target Company</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Target Harian</label>
                <input
                  type="number"
                  value={targetDaily}
                  onChange={(e) => onTargetChange(parseInt(e.target.value) || 0)}
                  className="form-control"
                  min="1"
                  placeholder="Masukkan target harian"
                />
                <small className="text-muted">Target kunjungan per hari</small>
              </div>
              <div className="alert alert-info mb-0">
                <small>
                  <strong>Info:</strong> Target akan diterapkan untuk semua
                  salesman.
                </small>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Batal
              </button>
              <button type="button" className="btn btn-primary" onClick={onSave}>
                Simpan Target
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  );
};

export default TargetModal;