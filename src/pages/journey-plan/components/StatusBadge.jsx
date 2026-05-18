const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { color: "bg-warning text-dark", text: "Pending" },
    approved: { color: "bg-primary text-white", text: "Approved" },
    rejected: { color: "bg-danger text-white", text: "Rejected" },
    completed: { color: "bg-success text-white", text: "Completed" },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return <span className={`badge ${config.color}`}>{config.text}</span>;
};

export default StatusBadge;