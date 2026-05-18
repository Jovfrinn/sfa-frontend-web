import { Check, X } from "lucide-react";

const BulkActionBar = ({ selectedCount, onApprove, onReject, onClear }) => {
  return (
    <div
      className="card border-0 shadow-sm mt-3"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="card-body" style={{ padding: "12px 20px" }}>
        <div className="d-flex align-items-center justify-content-between">
          <span className="text-muted" style={{ fontSize: "14px" }}>
            <strong>{selectedCount}</strong> item dipilih
          </span>
          <div className="d-flex gap-2">
            <button
              onClick={onApprove}
              className="btn btn-success btn-sm"
              style={{ minWidth: "100px", fontSize: "13px" }}
            >
              <Check size={16} className="me-1" />
              Approve
            </button>
            <button
              onClick={onReject}
              className="btn btn-danger btn-sm"
              style={{ minWidth: "100px", fontSize: "13px" }}
            >
              <X size={16} className="me-1" />
              Reject
            </button>
            <button
              onClick={onClear}
              className="btn btn-outline-secondary btn-sm"
              style={{ fontSize: "13px" }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionBar;