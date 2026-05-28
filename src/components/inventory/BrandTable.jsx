import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";
import { Icon } from "@iconify/react";
import { Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import Loader from "../loader/loader";
import Swal from "sweetalert2";

const BrandTable = () => {
  const [currentData, setCurrentData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("add");
  const [showClick, setShowClick] = useState(false);
  const [loading, setLoading] = useState(false);
  const api = import.meta.env.VITE_API_URI;
  const token = localStorage.getItem("token");
  const [selectedBrand, setSelectedBrand] = useState();

  const fetchBrands = async (page = 1, perPage = 10, search = "") => {
    try {
      const res = await axios.get(`${api}/inventories/brand`, {
        params: { page, perPage, search },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentData(res.data.data.data);
      setPage(res.data.data.current_page);
      setTotalPages(Math.ceil(res.data.data.total / res.data.data.per_page));
      setPerPage(res.data.data.per_page);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBrands(page, perPage, search);
  }, [page, perPage, search]);

  // Pagination
  function getPageNumbers(currentPage, totalPages) {
    const range = [];
    const rangeWithDots = [];
    let l;

    // hanya tampilkan 1 angka sebelum dan sesudah halaman aktif
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }

  const indexLastRow = page * perPage;
  const indexOfFirstRow = indexLastRow - perPage;

  //Handle Add
  const handleSubmitAddBrand = (e) => {
    setLoading(true);
    e.preventDefault();
    const name = e.target.name.value;
    const description = e.target.description.value;
    axios
      .post(
        `${api}/inventories/brand`,
        {
          nama: name,
          keterangan: description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setShowClick(false);
        fetchBrands(page, perPage, search);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  //handle edit
  const handleSubmitEditBrand = (e) => {
    setLoading(true);
    e.preventDefault();
    const name = e.target.name.value;
    const description = e.target.description.value;
    axios
      .put(
        `${api}/inventories/brand/${selectedBrand.id}`,
        {
          nama: name,
          keterangan: description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setShowClick(false);
        fetchBrands(page, perPage, search);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  //handle delete
  const handleDeleteBrand = (id) => {
    setLoading(true);
    axios
      .delete(`${api}/inventories/brand/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setShowClick(false);
        fetchBrands(page, perPage, search);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const H = "36px";
  const B = "1px solid #e2e8f0";
  const R = "8px";
  const F = "13px";

  const selectStyles = {
    control: (base) => ({ ...base, minHeight: H, height: H, borderColor: "#e2e8f0", borderRadius: R, fontSize: F, boxShadow: "none", "&:hover": { borderColor: "#a0aec0" } }),
    valueContainer: (base) => ({ ...base, padding: "0 10px" }),
    indicatorsContainer: (base) => ({ ...base, height: H }),
    placeholder: (base) => ({ ...base, color: "#a0aec0", fontSize: F }),
    singleValue: (base) => ({ ...base, fontSize: F }),
  };

  const renderTooltip = (text) => (props) => (
    <Tooltip id="button-tooltip" {...props}>{text}</Tooltip>
  );

  return (
    <>
      <style>{`
        .table-row:hover { cursor: pointer; background: #f8fafc !important; }
        .custom-table th { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; background: #f8fafc; border-bottom: 2px solid #e2e8f0; padding: 10px 12px; white-space: nowrap; }
        .custom-table td { font-size: 13px; color: #334155; padding: 10px 12px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .act-btn { height: ${H}; width: ${H}; border-radius: ${R}; border: ${B}; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #fff; color: #64748b; }
        .act-btn:hover { background: #f1f5f9; }
        .act-btn.blue { background: #dbeafe; border-color: #93c5fd; color: #2563eb; }
        .act-btn.blue:hover { background: #bfdbfe; }
        .search-input { height: ${H}; border: ${B}; border-radius: ${R}; padding: 0 12px 0 34px; font-size: ${F}; outline: none; width: 190px; color: #334155; background: #fff; }
        .search-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
        .search-wrap { position: relative; display: flex; align-items: center; }
        .search-wrap .s-icon { position: absolute; left: 10px; color: #94a3b8; pointer-events: none; }
        .fdivider { width: 1px; height: 20px; background: #e2e8f0; flex-shrink: 0; }
      `}</style>
      {loading && <Loader />}
      <Modal show={showClick} onHide={() => setShowClick(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {mode === "edit" ? "Edit Brand" : "Create Brand"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={
              mode === "edit" ? handleSubmitEditBrand : handleSubmitAddBrand
            }
          >
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Brand Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                defaultValue={
                  mode === "edit" && selectedBrand ? selectedBrand.nama : ""
                }
                placeholder="Enter Brand Name"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="3"
                defaultValue={
                  mode === "edit" && selectedBrand
                    ? selectedBrand.keterangan
                    : ""
                }
                placeholder="Enter description"
                required
              ></textarea>
            </div>
            <Button variant="primary" type="submit">
              {mode === "edit" ? "Update Brand" : "Create Brand"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <div className="col-lg-12">
        <div className="card h-100" style={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <div className="card-header" style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", borderRadius: "12px 12px 0 0", padding: "14px 18px" }}>
            <div className="d-flex align-items-center gap-2">
              <div style={{ width: 3, height: 18, background: "#3b82f6", borderRadius: 3 }} />
              <h5 className="card-title mb-0" style={{ fontSize: "15px", fontWeight: 600, color: "#1e293b" }}>Brand Inventory</h5>
            </div>
          </div>
          <div className="card-body" style={{ padding: "14px 18px" }}>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px 14px" }}>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <div className="d-flex align-items-center me-1">
                  <span className="me-1" style={{ fontSize: "13px", color: "#64748b" }}>Show </span>
                  <Select
                    options={[
                      { value: 10, label: "10" },
                      { value: 20, label: "20" },
                      { value: 50, label: "50" },
                    ]}
                    onChange={(selectedOption) => setPerPage(Number(selectedOption.value))}
                    defaultValue={{ value: perPage, label: `${perPage}` }}
                    classNamePrefix="select"
                    className="d-inline-block w-auto"
                    styles={selectStyles}
                  />
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <div className="search-wrap">
                  <Icon icon="mdi:magnify" className="s-icon" fontSize={16} />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <OverlayTrigger placement="top" overlay={renderTooltip("Create Brand")}>
                  <button
                    onClick={() => { setMode("add"); setShowClick(true); }}
                    className="act-btn blue"
                  >
                    <Icon icon="mdi:plus" fontSize={20} />
                  </button>
                </OverlayTrigger>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table custom-table mb-0">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th className="w-50">Description</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((item, index) => (
                      <tr key={item.id} className="table-row">
                        <td style={{ color: "#94a3b8" }}>{indexOfFirstRow + index + 1}</td>
                        <td style={{ fontWeight: 600, color: "#1e293b" }}>{item.nama}</td>
                        <td>{item.keterangan}</td>
                        <td>
                          <div className="d-flex align-items-center justify-content-center gap-1">
                            <button
                              className="btn btn-warning btn-sm d-flex align-items-center"
                              style={{ borderRadius: 7 }}
                              onClick={() => {
                                setMode("edit");
                                setSelectedBrand(item);
                                setShowClick(true);
                              }}
                            >
                              <Icon icon="mdi:pencil" width={15} />
                            </button>
                            <button
                              className="btn btn-danger btn-sm d-flex align-items-center"
                              style={{ borderRadius: 7 }}
                              onClick={() => handleDeleteBrand(item.id)}
                            >
                              <Icon icon="material-symbols:delete-outline" width={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-5" style={{ color: "#94a3b8", fontSize: 14 }}>
                        <Icon icon="mdi:inbox-outline" fontSize={32} style={{ display: "block", margin: "0 auto 8px" }} />
                        {loading ? "Loading..." : "No data found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span style={{ fontSize: 13, color: "#64748b" }}>
                Showing {indexOfFirstRow + 1} to {Math.min(indexLastRow, totalPages * perPage)} of {totalPages * perPage} entries
              </span>
              <nav>
                <ul className="pagination mb-0" style={{ gap: 4 }}>
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button className="page-link" style={{ borderRadius: 8, fontSize: 13 }} onClick={() => setPage(page - 1)}>
                      ‹ Prev
                    </button>
                  </li>
                  {getPageNumbers(page, totalPages).map((pageNumber, index) => (
                    <li
                      key={index}
                      className={`page-item ${pageNumber === page ? "active" : ""} ${pageNumber === "..." ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        style={{ borderRadius: 8, fontSize: 13 }}
                        onClick={() => pageNumber !== "..." ? setPage(pageNumber) : null}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" style={{ borderRadius: 8, fontSize: 13 }} onClick={() => setPage(page + 1)}>
                      Next ›
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrandTable;
