import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";
import { Icon } from "@iconify/react";
import { Modal, Button } from "react-bootstrap";
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

  return (
    <>
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
        <div className="card h-100 body-brand">
          <div className="card-header">
            <h5 className="card-title mb-0">Brand Inventory</h5>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-between mb-3 header-brand">
              <div>
                <label className="me-3 show-brand">Show</label>
                <Select
                  options={[
                    { value: 10, label: "10" },
                    { value: 20, label: "20" },
                    { value: 50, label: "50" },
                  ]}
                  onChange={(selectedOption) => {
                    setPerPage(Number(selectedOption.value));
                  }}
                  defaultValue={{ value: perPage, label: `${perPage}` }}
                  classNamePrefix="select"
                  className="d-inline-block w-auto"
                />
              </div>

              <div className="d-flex align-items-center gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  className="form-control search-brand"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  onClick={() => {
                    setMode("add");
                    setShowClick(true);
                  }}
                className="btn btn-outline-primary w-50 d-flex align-items-center justify-content-center button-brand"
                >
                  <Icon icon="zondicons:add-outline" fontSize={20} />
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table basic-border-table mb-0">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th className="w-50">Description</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((item, index) => (
                      <tr key={item.id}>
                        <td>{indexOfFirstRow + index + 1}</td>
                        <td>{item.nama}</td>
                        <td>{item.keterangan}</td>
                        <td className="d-flex justify-content-center">
                          <button
                            className="btn btn-warning btn-sm me-2 d-flex align-items-center justify-content-center"
                            onClick={() => {
                              setMode("edit");
                              setSelectedBrand(item);
                              setShowClick(true);
                            }}
                          >
                            <Icon icon="mdi:pencil" width={18} />
                          </button>
                          <button
                            className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
                            onClick={() => handleDeleteBrand(item.id)}
                          >
                            <Icon
                              icon="material-symbols:delete-outline"
                              width={18}
                            />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="text-center">
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3 pagination-section">
              <span>
                Showing {indexOfFirstRow + 1} to {indexLastRow} of{" "}
                {totalPages * perPage} entries
              </span>

              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </button>
                  </li>

                  {getPageNumbers(page, totalPages).map((pageNumber, index) => (
                    <li
                      key={index}
                      className={`page-item ${
                        pageNumber === page ? "active" : ""
                      } ${pageNumber === "..." ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() =>
                          pageNumber !== "..." ? setPage(pageNumber) : null
                        }
                      >
                        {pageNumber}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${
                      page === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage(page + 1)}
                    >
                      Next
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
