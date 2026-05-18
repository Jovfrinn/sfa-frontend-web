import { Clock, CheckCircle, TrendingUp } from "lucide-react";

const StatsCards = ({ stats, targetDaily, onTargetClick }) => {
  return (
    <div className="row g-3 mb-4">
      <div className="col-12 col-md-6 col-lg-3">
        <div className="card border-0 shadow-sm">
          <div
            className="card-body"
            style={{ cursor: "pointer" }}
            onClick={onTargetClick}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small mb-1">Daily Target</p>
                <h2 className="fw-bold mb-0 fs-1">{targetDaily}</h2>
                <small className="text-muted">Target kunjungan per hari</small>
              </div>
              <Clock className="text-secondary" size={32} />
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6 col-lg-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small mb-1">Pending</p>
                <h2 className="fw-bold text-warning mb-0">{stats.pending}</h2>
              </div>
              <Clock className="text-warning" size={32} />
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6 col-lg-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small mb-1">Approved</p>
                <h2 className="fw-bold text-info mb-0">{stats.approved}</h2>
              </div>
              <CheckCircle className="text-info" size={32} />
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6 col-lg-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small mb-1">Completed</p>
                <h2 className="fw-bold text-success mb-0">{stats.completed}</h2>
              </div>
              <TrendingUp className="text-success" size={32} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;