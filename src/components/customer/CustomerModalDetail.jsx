import { Icon } from "@iconify/react";
import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import InteractionLogList from "../crm/InteractionLogList";

const CustomerModalDetail = ({
  initialData,
  onCancel,
  refreshData,
  statuses = "unregis",
}) => {
  const [show, setShow] = useState(true);
  const [activeTab, setActiveTab] = useState("detail");
  const [reason, setReason] = useState(false);
  const [approve, setApprove] = useState(false);
  const [reasonMessage, setReasonMessage] = useState({
    message: "",
  });
  const [dataApprove, setDataApprove] = useState({
    limit: null,
    top: null,
  });

  const {
    company_id,
    code_customer,
    name,
    phone_1,
    alamat,
    kecamatan,
    kota,
    kode_pos,
    latitude,
    longitude,
    channel,
    sub_channel,
    pic,
    contact_pic,
    identity,
    npwp,
    nama_pajak,
    alamat_pajak,
    status,
    ktp,
  } = initialData;

  const api = import.meta.env.VITE_API_URI;
  const apistorage = import.meta.env.VITE_STORAGE_URI;
  const token = localStorage.getItem("token");

  const handleReject = () => {
    setReason(true);
  };
  const handleApprove = () => {
    setApprove(true);
  };
  
  const handleApproveManager = async () => {
    try {
      const api_url = `${api}/customers/approve/manager/${initialData.id}`;

      const res = await axios.post(api_url, {}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        Swal.fire({
          title: "Berhasil!",
          text: "Data berhasil disimpan.",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
        });
      }
      onCancel();
      refreshData();
    } catch (err) {
      console.error("Gagal mengirim data:", err);
      alert("Gagal mengirim data, cek console untuk detail.");
    }
  };

  

  const handleSubmitReject = async (e) => {
    e.preventDefault();
    try {
      const data = {
        reason: reasonMessage.message,
        status: statuses,
      };
      const api_url = `${api}/customers/reject/${initialData.id}`;

      const res = await axios.post(api_url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        Swal.fire({
          title: "Berhasil!",
          text: "Data berhasil disimpan.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      // setLoading(false);
      refreshData();
      onCancel();
    } catch (err) {
      console.error("Gagal mengirim data:", err);
      alert("Gagal mengirim data, cek console untuk detail.");
    }
  };

  const handleSubmitApprove = async (e) => {
    e.preventDefault();
    try {
      const api_url = `${api}/customers/approve/${initialData.id}`;

      const res = await axios.post(api_url, dataApprove, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        Swal.fire({
          title: "Berhasil!",
          text: "Data berhasil disimpan.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      // setLoading(false);
      onCancel();
      refreshData();
    } catch (err) {
      console.error("Gagal mengirim data:", err);
      alert("Gagal mengirim data, cek console untuk detail.");
    }
  };

  return (
    <>
      {/* Inline style for grey background */}
      <style>{`
        .bg-grey {
          background-color: #f8f9fa;
          border-radius: 0.25rem;
          border: 1px solid #ced4da;
          padding: 1rem;
          margin-bottom: 1rem;
        }
        .ktp {
          width: 64%;
          height: 208px;
          object-fit: cover;
          border-radius: 0.55rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      `}</style>
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
          onCancel();
        }}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Detail Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Tab Navigation */}
          <ul className="nav nav-tabs mb-3 px-2 pt-1">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "detail" ? "active" : ""}`}
                onClick={() => setActiveTab("detail")}
                type="button"
              >
                Detail
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "interaksi" ? "active" : ""}`}
                onClick={() => setActiveTab("interaksi")}
                type="button"
              >
                Interaksi
              </button>
            </li>
          </ul>

          {/* Tab: Interaksi */}
          {activeTab === "interaksi" && (
            <div className="tab-pane active px-2">
              <InteractionLogList customerId={initialData?.id} />
            </div>
          )}

          {/* Tab: Detail */}
          {activeTab === "detail" && (
          <div className="p-2">
            {/* Informasi Perusahaan */}
            <div className="mb-4">
              <h6 className="text-primary mb-3 pb-2 border-bottom d-flex align-items-center">
                <Icon
                  icon="material-symbols:business-center"
                  className="me-2"
                />
                Informasi Perusahaan
              </h6>
              <div className="row g-3 bg-grey">
                <div className="col-md-6">
                  <div className="mb-2">
                    <small className="text-muted d-block">Company ID</small>
                    <span className="fw-medium">{company_id || "-"}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-2">
                    <small className="text-muted d-block">Code Customer</small>
                    <span className="fw-medium">{code_customer || "-"}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-2">
                    <small className="text-muted d-block">Nama</small>
                    <span className="fw-medium">{name || "-"}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-2">
                    <small className="text-muted d-block">Status</small>
                    <span
                      className={`badge ${
                        status === "registered"
                          ? "bg-success"
                          : status === "on_check_spv"
                          ? "bg-warning"
                          : status === "on_check_manager"
                          ? "bg-primary"
                          : "bg-danger"
                      }`}
                    >
                      {status === "registered"
                        ? "Registered"
                        : status === "on_check_spv"
                        ? "On Check"
                        : status === "on_check_manager"
                        ? "On Check"
                        : ""}
                    </span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-2">
                    <small className="text-muted d-block">Channel</small>
                    <span className="fw-medium">{channel || "-"}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-2">
                    <small className="text-muted d-block">Sub Channel</small>
                    <span className="fw-medium">{sub_channel || "-"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informasi Kontak */}
            <div className="mb-4">
              <h6 className="text-success mb-3 pb-2 border-bottom d-flex align-items-center">
                <Icon icon="material-symbols:call" className="me-2" />
                Informasi Kontak
              </h6>
              <div className="row g-3 bg-grey">
                <div className="col-md-6">
                  <div className="mb-2">
                    <small className="text-muted d-block">Telepon</small>
                    <span className="fw-medium">{phone_1 || "-"}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-2">
                    <small className="text-muted d-block">PIC</small>
                    <span className="fw-medium">{pic || "-"}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-2">
                    <small className="text-muted d-block">Kontak PIC</small>
                    <span className="fw-medium">{contact_pic || "-"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alamat */}
            <div className="mb-4">
              <h6 className="text-danger mb-3 pb-2 border-bottom d-flex align-items-center">
                <Icon icon="material-symbols:location-on" className="me-2" />
                Alamat
              </h6>
              <div className="row g-3 bg-grey">
                <div className="col-12">
                  <div className="mb-2">
                    <small className="text-muted d-block">Alamat</small>
                    <span className="fw-medium">{alamat || "-"}</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-2">
                    <small className="text-muted d-block">Kecamatan</small>
                    <span className="fw-medium">{kecamatan || "-"}</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-2">
                    <small className="text-muted d-block">Kota</small>
                    <span className="fw-medium">{kota || "-"}</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-2">
                    <small className="text-muted d-block">Kode Pos</small>
                    <span className="fw-medium">{kode_pos || "-"}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-2">
                    <small className="text-muted d-block">Latitude</small>
                    <span className="fw-medium">{latitude || "-"}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-2">
                    <small className="text-muted d-block">Longitude</small>
                    <span className="fw-medium">{longitude || "-"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dokumen & Identitas */}
            <div className="mb-4">
              <h6 className="text-info mb-3 pb-2 border-bottom d-flex align-items-center">
                <Icon
                  icon="material-symbols:id-card-outline"
                  className="me-2"
                />
                Dokumen & Identitas
              </h6>
              <div className="row g-3 bg-grey">
                <div className="col-md-6">
                  <div className="mb-2">
                    <small className="text-muted d-block">Identity</small>
                    <span className="fw-medium">{identity || "-"}</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="mb-2">
                    <small className="text-muted d-block">NPWP</small>
                    <span className="fw-medium">{npwp || "-"}</span>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-2">
                    <small className="text-muted d-block">KTP</small>
                    <img
                      src={ktp ? apistorage + "/storage/" + ktp : apistorage + "/storage/uploads/noImage/noImage.png"}
                      alt="KTP"
                      className="img-fluid ktp"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Informasi Pajak */}
            <div className="mb-2">
              <h6 className="text-warning mb-3 pb-2 border-bottom d-flex align-items-center">
                <Icon icon="bi:file-earmark-text" className="me-2" />
                Informasi Pajak
              </h6>
              <div className="row g-3 bg-grey">
                <div className="col-12">
                  <div className="mb-2">
                    <small className="text-muted d-block">Nama Pajak</small>
                    <span className="fw-medium">{nama_pajak || "-"}</span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="mb-2">
                    <small className="text-muted d-block">Alamat Pajak</small>
                    <span className="fw-medium">{alamat_pajak || "-"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TOP and Limit */}
            {(statuses === 'on-check-manager' || statuses === 'registered') && (
              <div className="mb-2">
              <h6 className="mb-3 pb-2 border-bottom d-flex align-items-center">
                <Icon icon="material-symbols:settings" className="me-2" />
                TOP & Limit
              </h6>
              <div className="row g-3 bg-grey">
                <div className="col-md-12">
                  <div className="mb-2">
                    <small className="text-muted d-block">TOP (Days)</small>
                    <span className="fw-medium">
                      {initialData.top || "-"} Days
                    </span>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-2">
                    <small className="text-muted d-block">Limit (Rp)</small>
                    <span className="fw-medium">
                      Rp.{" "}
                      {initialData.limit
                        ? Number(initialData.limit).toLocaleString("id-ID")
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Reject  Reason */}
            {reason && (
              <form className="mb-2" onSubmit={handleSubmitReject}>
                <h6 className="text-danger mb-3 pb-2 border-bottom d-flex align-items-center">
                  <Icon icon="bi-chat" className="me-2" />
                  Reason
                </h6>
                <div className="d-flex align-items-start gap-3 bg-grey">
                  <div className="flex-grow-1">
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Ex: Data masih kurang : NPWP, Alamat"
                      required
                      value={reasonMessage.message}
                      onChange={(e) =>
                        setReasonMessage({
                          ...reasonMessage,
                          message: e.target.value,
                        })
                      }
                      name="message"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="success"
                    style={{ width: "200px", height: "40px" }}
                  >
                    Send
                  </Button>
                </div>
              </form>
            )}

            {/* Approve */}
            {approve && (
              <form className="mb-2" onSubmit={handleSubmitApprove}>
                <h6 className="text-success mb-3 pb-2 border-bottom d-flex align-items-center">
                  <Icon icon="bi-check" className="me-2" />
                  Approve
                </h6>
                <div className="row g-3 bg-grey">
                  <div className="col-md-6">
                    <label className="form-label">TOP (Days)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Ex: 30"
                      required
                      value={dataApprove.top || null}
                      onChange={(e) =>
                        setDataApprove({
                          ...dataApprove,
                          top: e.target.value,
                        })
                      }
                      name="top"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Limit (Rp)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ex: 5.000.000"
                      required
                      value={dataApprove.limit || null}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\./g, "");
                        if (!isNaN(raw) && raw !== "") {
                          const formatted = Number(raw).toLocaleString("id-ID");
                          setDataApprove({
                            ...dataApprove,
                            limit: formatted,
                          });
                        } else {
                          setDataApprove({
                            ...dataApprove,
                            limit: "",
                          });
                        }
                      }}
                      name="limit"
                    />
                  </div>
                  <div className="d-flex justify-content-end mt-3">
                    <Button
                      type="submit"
                      variant="success"
                      style={{ width: "200px", height: "40px" }}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
          )} {/* end tab: detail */}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          {reason ? (
            <div className="d-flex gap-2">
              <Button
                variant="danger"
                onClick={() => {
                  setReason(false);
                  setApprove(false);
                }}
              >
                Cancel
              </Button>
            </div>
          ) : approve ? (
            <div className="d-flex gap-2">
              <Button
                variant="danger"
                onClick={() => {
                  setApprove(false);
                  setReason(false);
                }}
              >
                Cancel
              </Button>
            </div>
          ) : statuses === "unregis" || statuses === "registered" ? (
            <div className="visible"></div>
          ) : (
            <div className="d-flex gap-2">
              <Button
                variant="secondary"
                className="btn btn-danger"
                onClick={() => {
                  handleReject();
                }}
              >
                Reject
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (statuses === "on-check-spv") {
                    handleApprove();
                  } else {
                    handleApproveManager();

                  }
                }}
              >
                Approve
              </Button>
            </div>
          )}
          <div>
            {approve || reason ? (
              <div className="visible"></div>
            ) : (
               <Button
                variant="secondary"
                onClick={() => {
                  setShow(false);
                  onCancel();
                }}
              >
                Tutup
              </Button>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CustomerModalDetail;
