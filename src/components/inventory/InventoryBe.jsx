import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { Icon } from "@iconify/react/dist/iconify.js";

// import { formatDate } from "react-datepicker/dist/date_utils";

const InventoryBe = ({
  search,
  selectedBrand,
  selectedCategory,
  filterSatuan,
  refreshTrigger,
}) => {
  const API_URL = import.meta.env.VITE_API_URI;
  const token = localStorage.getItem("token");
  const [inventory, setInventory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [selectCategory, setSelectCategory] = useState(null);
  const [selectBrand, setSelectBrand] = useState(null);
  const [satuanList, setSatuanList] = useState([]);
  const [mode, setMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    nama: "",
    category_id: "",
    brand_id: "",
    satuan: "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedBrand, selectedCategory, filterSatuan]);

  useEffect(() => {
    fetchData(
      currentPage,
      perPage,
      selectedBrand,
      selectedCategory,
      filterSatuan,
      search
    );
    if (mode) getSatuan();
  }, [
    currentPage,
    perPage,
    selectedBrand,
    selectedCategory,
    filterSatuan,
    search,
    mode,
  ]);

  useEffect(() => {
    if (refreshTrigger) {
      fetchData(
        currentPage,
        perPage,
        selectedBrand,
        selectedCategory,
        filterSatuan,
        search
      );
    }
  }, [refreshTrigger]);

  const fetchData = async (
    page = 1,
    itemsPerPage = perPage,
    selectedBrand = null,
    selectedCategory = null,
    filterSatuan = "",
    search
  ) => {
    setLoading(true);

    try {
      const response = await axios.get(`${API_URL}/inventories`, {
        params: {
          page: page,
          per_page: itemsPerPage,
          search: search,
          category_id: selectedCategory,
          brand_id: selectedBrand,
          satuan: filterSatuan,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setInventory(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
      setTotal(response.data.total);
      setPerPage(response.data.per_page);
      setFrom(response.data.from);
      setTo(response.data.to);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  const handlePerPageChange = (e) => {
    const newPerPage = Number(e.target.value);
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  //handle edit
  const fetchDataEdit = async (item) => {
    try {
      // fetch label dari API relasi
      const [catRes, brandRes] = await Promise.all([
        axios.get(`${API_URL}/inventories/get-category/${item.category_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/inventories/get-brand/${item.brand_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setSelectCategory({
        value: catRes.data.data.id,
        label: catRes.data.data.nama,
      });

      setSelectBrand({
        value: brandRes.data.data.id,
        label: brandRes.data.data.nama,
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setFormData({
      id: item.id,
      nama: item.nama,
      satuan: item.satuan,
      category_id: item.category_id,
      brand_id: item.brand_id,
    });
    fetchDataEdit(item);
  };

  const closeEditModal = () => {
    setMode(false);
    setFormData({
      nama: "",
      satuan: "",
    });
    setSelectBrand(null);
    setSelectCategory(null);
    // setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    setEditLoading(true);

    try {
      const params = {
        nama: formData.nama,
        satuan: formData.satuan,
        category_id: selectCategory?.value,
        brand_id: selectBrand?.value,
      };

      const response = await axios.put(
        `${API_URL}/inventories/${formData.id}`,
        params,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        title: "Updated!",
        text: response.data.message || "Inventory updated successfully",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });

      closeEditModal();

      fetchData(currentPage, perPage, selectedBrand, selectedCategory, search);
    } catch (error) {
      console.error("Error updating inventory:", error);

      if (error.response) {
        if (error.response.status === 422) {
          setFormErrors(error.response.data.errors || {});
          Swal.fire({
            title: "Validation Error",
            text: "Please check the form for errors",
            icon: "error",
            confirmButtonColor: "#3085d6",
          });
        } else if (error.response.status === 404) {
          Swal.fire({
            title: "Not Found",
            text: "Inventory not found",
            icon: "error",
            confirmButtonColor: "#3085d6",
          });
          closeEditModal();
          fetchData(
            currentPage,
            perPage,
            selectedBrand,
            selectedCategory,
            search
          );
        } else {
          Swal.fire({
            title: "Error",
            text: error.response.data.message || "Failed to update inventory",
            icon: "error",
            confirmButtonColor: "#3085d6",
          });
        }
      } else {
        Swal.fire({
          title: "Connection Error",
          text: "Failed to update inventory. Please check your connection.",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteClick = (item) => {
    Swal.fire({
      title: "Are you sure?",
      html: `<p>You are about to delete:</p>
             <strong>${item.nama}</strong><br>
             <small>Kode: ${item.kode_original_inv}</small>`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${API_URL}/inventories/${item.id}`
          );

          Swal.fire({
            title: "Deleted!",
            text: response.data.message || "Your inventory has been deleted.",
            icon: "success",
            confirmButtonColor: "#3085d6",
          });

          if (inventory.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            fetchData(
              currentPage,
              perPage,
              selectedBrand,
              selectedCategory,
              search
            );
          }
        } catch (error) {
          console.error("Error deleting inventory:", error);

          if (error.response) {
            if (error.response.status === 404) {
              Swal.fire({
                title: "Not Found",
                text: "Inventory not found",
                icon: "error",
                confirmButtonColor: "#3085d6",
              });
              fetchData(
                currentPage,
                perPage,
                selectedBrand,
                selectedCategory,
                search
              );
            } else {
              Swal.fire({
                title: "Error",
                text:
                  error.response.data.message || "Failed to delete inventory",
                icon: "error",
                confirmButtonColor: "#3085d6",
              });
            }
          } else {
            Swal.fire({
              title: "Connection Error",
              text: "Failed to delete inventory. Please check your connection.",
              icon: "error",
              confirmButtonColor: "#3085d6",
            });
          }
        }
      }
    });
  };

  //  Get Category
  const getCategory = async (inputValue) => {
    try {
      const res = await axios.get(`${API_URL}/inventories/get-category`, {
        params: {
          search: inputValue,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data.data.data;
      return data.map((item) => ({
        value: item.id,
        label: item.nama,
      }));
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  //  Get Brand
  const getBrand = async (inputValue) => {
    try {
      const res = await axios.get(`${API_URL}/inventories/get-brand`, {
        params: {
          search: inputValue,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data.data.data;

      return data.map((item) => ({
        value: item.id,
        label: item.nama,
      }));
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  // Get Satuan
  const getSatuan = async () => {
    const response = await axios.get(`${API_URL}/inventories/filters`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setSatuanList(
      response.data.satuan.map((k) => ({
        value: k,
        label: k,
      })) || []
    );
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (lastPage <= maxVisible) {
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(lastPage);
      } else if (currentPage >= lastPage - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = lastPage - 3; i <= lastPage; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(lastPage);
      }
    }

    return pages;
  };

  return (
    <>
      <div className="col-lg-12">
        <div className="card h-100">
          <div className="card-header d-flex justify-content-between mb-3">
            <h5 className="card-title my-10">Table Inventory</h5>
            <div className="d-flex">
              <div className="fs-6 fw-bold d-flex align-items-center pe-1 me-1">
                Show
              </div>
              <select
                value={perPage}
                onChange={handlePerPageChange}
                className="form-select d-inline-block w-auto"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="card-body">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table basic-border-table mb-0">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Item Code</th>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Brand</th>
                        <th>Unit</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {inventory.length > 0 ? (
                        inventory.map((item, index) => (
                          <tr key={item.id}>
                            <td>{from + index}</td>
                            <td>{item.kode_original_inv}</td>
                            <td>{item.nama}</td>
                            <td>{item.category?.nama}</td>
                            <td>{item.brand?.nama}</td>
                            <td>{item.satuan}</td>
                            <td className="d-flex align-items-center">
                              <button
                                className="btn btn-warning btn-sm text-white me-2 d-flex align-items-center"
                                onClick={() => {
                                  setMode(true);
                                  handleEditClick(item);
                                }}
                              >
                                <Icon icon="mdi:pencil" width={18} />
                              </button>
                              <button
                                className="btn btn-danger btn-sm text-white d-flex align-items-center"
                                onClick={() => handleDeleteClick(item)}
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
                          <td colSpan="7" className="text-center">
                            No data found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3 pagination-section">
                  <span>
                    Showing {from || 0} to {to || 0} of {total} entries
                  </span>

                  <nav>
                    <ul className="pagination mb-0">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>

                      {getPageNumbers().map((page, index) => (
                        <li
                          key={index}
                          className={`page-item ${
                            currentPage === page ? "active" : ""
                          } ${page === "..." ? "disabled" : ""}`}
                        >
                          {page === "..." ? (
                            <span className="page-link">...</span>
                          ) : (
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          )}
                        </li>
                      ))}

                      <li
                        className={`page-item ${
                          currentPage === lastPage ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === lastPage}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {mode && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleUpdate}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Inventory</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeEditModal}
                    disabled={editLoading}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Nama Barang <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          formErrors.nama ? "is-invalid" : ""
                        }`}
                        name="nama"
                        value={formData.nama}
                        onChange={handleInputChange}
                        disabled={editLoading}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Satuan <span className="text-danger">*</span>
                      </label>
                      <Select
                        name="satuan"
                        options={satuanList.map((sat) => ({
                          value: sat,
                          label: sat,
                        }))}
                        value={
                          formData
                            ? { value: formData.satuan, label: formData.satuan }
                            : null
                        }
                        onChange={(selected) =>
                          handleInputChange({
                            target: {
                              name: "satuan",
                              value: selected ? selected.value : "",
                            },
                          })
                        }
                        placeholder="Pilih Satuan..."
                        isClearable
                        classNamePrefix="select"
                        className={`react-select-container ${
                          formErrors.satuan ? "is-invalid" : ""
                        }`}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Kategori <span className="text-danger">*</span>
                      </label>
                      <AsyncSelect
                        cacheOptions
                        defaultOptions
                        isClearable
                        className="filter-stock"
                        loadOptions={getCategory}
                        value={selectCategory}
                        onChange={(option) => {
                          setSelectCategory(option);
                        }}
                        placeholder="Pilih Category..."
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Kategori <span className="text-danger">*</span>
                      </label>
                      <AsyncSelect
                        cacheOptions
                        defaultOptions
                        isClearable
                        className="filter-stock"
                        loadOptions={getBrand}
                        value={selectBrand}
                        onChange={(option) => {
                          setSelectBrand(option);
                        }}
                        placeholder="Pilih Brand..."
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeEditModal}
                    disabled={editLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={editLoading}
                  >
                    {editLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Updating...
                      </>
                    ) : (
                      "Update"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InventoryBe;
