import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";
import { Icon } from "@iconify/react";
import { Modal, Button } from "react-bootstrap";
import Loader from "../loader/loader";
import Swal from "sweetalert2";

const KategoriTable = () => {
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
  const [selectedCategory, setSelectedCategory] = useState();
  const [description, setDescription] = useState();

  const fetchKategori = async (page = 1, perPage = 10, search = "") => {
    try {
      const res = await axios.get(`${api}/inventories/category`, {
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
    fetchKategori(page, perPage, search);
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
  const handleSubmitAddCategory = (e) => {
    setLoading(true);
    e.preventDefault();
    const name = e.target.name.value;
    const description = e.target.description.value;
    axios
      .post(
        `${api}/inventories/category`,
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
        fetchKategori(page, perPage, search);
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
  const handleSubmitEditCategory = (e) => {
    setLoading(true);
    e.preventDefault();
    const name = e.target.name.value;
    const description = e.target.description.value;
    axios
      .put(
        `${api}/inventories/category/${selectedCategory.id}`,
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
        fetchKategori(page, perPage, search);
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
  const handleDelete = (id) => {
    setLoading(true);
    axios
      .delete(`${api}/inventories/category/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setShowClick(false);
        fetchKategori(page, perPage, search);
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
            {mode === "edit" ? "Edit Category" : "Create Category"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={
              mode === "edit"
                ? handleSubmitEditCategory
                : handleSubmitAddCategory
            }
          >
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Category Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                defaultValue={
                  mode === "edit" && selectedCategory
                    ? selectedCategory.nama
                    : ""
                }
                placeholder="Enter category name"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                // type="text"
                className="form-control"
                id="description"
                name="description"
                value={description
                }
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex : Category 1 > Category 2"
              ></textarea>
              <p className="text-danger">Description Optional</p>

            </div>
            <Button variant="primary" type="submit">
              {mode === "edit" ? "Update Kategori" : "Create Category"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <div className="col-lg-12">
        <div className="card h-100 body-category">
          <div className="card-header">
            <h5 className="card-title mb-0">Category Inventory</h5>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-between mb-3 header-category">
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
                  className="form-control category-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  onClick={() => {
                    setMode("add");
                    setShowClick(true);
                  }}
                  className="btn btn-outline-primary w-50 d-flex align-items-center justify-content-center category-button"
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
                    <th>Description</th>
                    <th id="action">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((item, index) => (
                      <tr key={item.id}>
                        <td>{indexOfFirstRow + index + 1}</td>
                        <td>{item.nama}</td>
                        <td>{item.keterangan ?? '-'}</td>
                        <td className="d-flex align-items-center">
                          <button
                            className="btn btn-warning btn-sm me-2 d-flex align-items-center"
                            onClick={() => {
                              setMode("edit");
                              setSelectedCategory(item);
                              setDescription(item.keterangan)
                              setShowClick(true);
                            }}
                          >
                            <Icon icon="mdi:pencil" width={18} />
                          </button>
                          <button
                            className="btn btn-danger btn-sm d-flex align-items-center"
                            onClick={() => handleDelete(item.id)}
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

export default KategoriTable;
