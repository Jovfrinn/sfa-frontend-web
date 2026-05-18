import { Icon } from "@iconify/react";
import Select from "react-select";
import StatusBadge from "./StatusBadge";
import ActionButtons from "./ActionButtons";

const JourneyPlanTableView = ({
  data,
  isLoading,
  search,
  perPage,
  currentPage,
  pagination,
  selectedIds,
  onSearchChange,
  onPerPageChange,
  onPageChange,
  onSelectAll,
  onSelectOne,
  onUpdateStatus,
  onViewDetail,
  getPendingItems,
  isAllSelected,
  isSomeSelected,
}) => {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-bottom">
        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between">
          <h5 className="card-title mb-0">Journey Plan</h5>

          <div className="d-flex align-items-center gap-2">
            <div className="d-flex align-items-center navbar-search">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{ width: "250px" }}
              />
              <Icon icon="ion:search-outline" className="icon" />
            </div>
            <Select
              options={[
                { value: 10, label: "10" },
                { value: 20, label: "20" },
                { value: 50, label: "50" },
              ]}
              onChange={(opt) => onPerPageChange(Number(opt.value))}
              defaultValue={{ value: perPage, label: `${perPage}` }}
              styles={{
                container: (base) => ({ ...base, width: "80px" }),
              }}
            />
            <span className="small">Show</span>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-3">Loading data...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">Tidak ada data journey plan</p>
            </div>
          ) : (
            <>
              <table className="table basic-border-table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th
                      style={{
                        width: "60px",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isAllSelected()}
                          ref={(input) => {
                            if (input) {
                              input.indeterminate = isSomeSelected();
                            }
                          }}
                          onChange={onSelectAll}
                          disabled={getPendingItems().length === 0}
                          className="form-check-input m-0"
                          style={{
                            width: "20px",
                            height: "20px",
                            cursor:
                              getPendingItems().length === 0
                                ? "not-allowed"
                                : "pointer",
                          }}
                        />
                      </div>
                    </th>
                    <th className="text-uppercase small fw-semibold">Company</th>
                    <th className="text-uppercase small fw-semibold">Salesman</th>
                    <th className="text-uppercase small fw-semibold">Outlet</th>
                    <th className="text-uppercase small fw-semibold">Alamat</th>
                    <th className="text-uppercase small fw-semibold">Tanggal</th>
                    <th className="text-uppercase small fw-semibold">Status</th>
                    <th className="text-uppercase small fw-semibold">Tap In/Out</th>
                    <th className="text-uppercase small fw-semibold text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.id}>
                      <td
                        style={{
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        {item.status === "pending" ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(item.id)}
                              onChange={() => onSelectOne(item.id)}
                              className="form-check-input m-0"
                              style={{
                                width: "20px",
                                height: "20px",
                                cursor: "pointer",
                              }}
                            />
                          </div>
                        ) : (
                          <span
                            style={{
                              display: "inline-block",
                              width: "20px",
                              height: "20px",
                              borderRadius: "4px",
                              backgroundColor: "#e9ecef",
                              border: "2px solid #dee2e6",
                            }}
                          ></span>
                        )}
                      </td>
                      <td>{item.user?.company?.name || "-"}</td>
                      <td>{item.user?.full_name || "-"}</td>
                      <td>{item.customer?.name || "-"}</td>
                      <td className="text-truncate" style={{ maxWidth: 300 }}>
                        {item.customer?.alamat || "-"}
                      </td>
                      <td>
                        {new Date(item.planned_visit_date).toLocaleDateString(
                          "id-ID"
                        )}
                      </td>
                      <td>
                        <StatusBadge status={item.status} />
                      </td>
                      <td>
                        {item.tap_in ? (
                          <>
                            <div className="text-success small">
                              In:{" "}
                              {new Date(item.tap_in.tap_in_time).toLocaleTimeString(
                                "id-ID",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                }
                              )}
                            </div>
                            <div className="text-danger small">
                              Out:{" "}
                              {new Date(item.tap_in.tap_out_time).toLocaleTimeString(
                                "id-ID",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                }
                              )}
                            </div>
                          </>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <ActionButtons item={item} onUpdateStatus={onUpdateStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="text-muted small">
            Showing {(pagination.current_page - 1) * pagination.perPage + 1} to{" "}
            {Math.min(
              pagination.current_page * pagination.perPage,
              pagination.total
            )}{" "}
            of {pagination.total} entries
          </div>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => onPageChange((prev) => Math.max(1, prev - 1))}
                >
                  Previous
                </button>
              </li>
              {[...Array(Math.min(pagination.last_page, 5))].map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <li
                    key={idx}
                    className={`page-item ${currentPage === pageNum ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => onPageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  </li>
                );
              })}
              <li
                className={`page-item ${currentPage === pagination.last_page ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    onPageChange((prev) =>
                      Math.min(pagination.last_page, prev + 1)
                    )
                  }
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default JourneyPlanTableView;