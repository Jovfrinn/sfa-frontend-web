import { Check, X } from "lucide-react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const ActionButtons = ({ item, onUpdateStatus }) => {
  if (item.status !== "pending") return "-";

  return (
    <div className="d-flex gap-1 justify-content-center">
      <OverlayTrigger placement="top" overlay={<Tooltip>Approve</Tooltip>}>
        <button
          onClick={() => onUpdateStatus(item.id, "approved")}
          className="btn btn-sm btn-success"
        >
          <Check size={16} />
        </button>
      </OverlayTrigger>

      <OverlayTrigger placement="top" overlay={<Tooltip>Reject</Tooltip>}>
        <button
          onClick={() => onUpdateStatus(item.id, "rejected")}
          className="btn btn-sm btn-danger"
        >
          <X size={16} />
        </button>
      </OverlayTrigger>
    </div>
  );
};

export default ActionButtons;