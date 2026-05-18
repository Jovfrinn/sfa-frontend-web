import Select from "react-select";
import AsyncSelect from "react-select/async";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Icon } from "@iconify/react";
import Loader from "../loader/loader";
import { Tooltip, OverlayTrigger, Button } from "react-bootstrap";
import ExcelUploadModal from "./ExcelUploadModal";

const FeatureInventory = ({
  search,
  setSearch,
  selectedBrand = null,
  selectedCategory = null,
  filterSatuan,
  setFilterSatuan,
  refresh,
}) => {
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URI;
  const [showModal, setShowModal] = useState(false);
  const [satuanList, setSatuanList] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [openModalImport, setOpenModalImport] = useState(false);
  const [filterSelected, setFilterSelected] = useState({
    selectedCategory: null,
    selectedBrand: null,
  });
  const [formData, setFormData] = useState({
    nama: "",
    category_id: null,
    brand_id: null,
    satuan: "",
  });

  useEffect(() => {
    fetchFilters();
  }, [API_URL]);

  const renderTooltip = (text) => (props) =>
    (
      <Tooltip id="button-tooltip" {...props}>
        {text}
      </Tooltip>
    );

  const fetchFilters = async () => {
    try {
      setLoadingFilters(true);
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
    } catch (err) {
      console.error("Error fetching filters:", err);
      setSatuanList([]);
    } finally {
      setLoadingFilters(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.nama.trim()) {
      errors.push("Nama Barang harus diisi");
    }
    if (!formData.satuan.trim()) {
      errors.push("Satuan harus dipilih");
    }

    if (errors.length > 0) {
      Swal.fire({
        title: "Validasi Gagal",
        html: errors.map((err) => `• ${err}`).join("<br>"),
        icon: "warning",
        confirmButtonColor: "#3085d6",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const data = {
        nama: formData.nama,
        satuan: formData.satuan,
        category_id: formData.category_id?.value,
        brand_id: formData.brand_id?.value,
      };
      const response = await axios.post(`${API_URL}/inventories`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      await Swal.fire({
        title: "Berhasil!",
        text: response.data.message || "Data berhasil ditambahkan!",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });

      setFormData({
        nama: "",
        satuan: "",
        category_id: null,
        brand_id: null,
      });
      setShowModal(false);

      refresh();
    } catch (err) {
      Swal.fire({
        title: "Gagal!",
        text:
          err.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data.",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      kode_original_inv: "",
      nama: "",
      nama_invgrup: "",
      satuan: "",
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

  //export excel
  const handleDownload = async (
    selectedBrand = "",
    selectedCategory = "",
    filterSatuan = ""
  ) => {
    setLoading(true);
    try {
      const res = await axios({
        url: `${API_URL}/inventories/export-inventories`,
        params: {
          selectedCategory,
          selectedBrand,
          filterSatuan,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      const today = new Date().toISOString().slice(0, 10);
      const filename = `export-inventories-${today}.xlsx`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Export Gagal",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat mengunduh file.",
      });
    } finally {
      setLoading(false);
      Swal.fire({
        icon: "success",
        title: "Export Berhasil",
        text: "Stock Berhasil Diexport",
      });
    }
  };

  // Download Format
  const handleDownloadFormat = async () => {
    setLoading(true);
    try {
      const res = await axios({
        url: `${API_URL}/inventories/export-format-inventories`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      const filename = `export-format-inventories.xlsx`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Export Gagal",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat mengunduh file.",
      });
    } finally {
      setLoading(false);
      Swal.fire({
        icon: "success",
        title: "Export Berhasil",
        text: "Stock Berhasil Diexport",
      });
    }
  };

  // Handle Upload Import Format
  const handleUpload = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${API_URL}/inventories/import-inventories`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoading(false);
      refresh();
      setOpenModalImport(false);

      await Swal.fire({
        title: "Berhasil!",
        text: response.data.message || "Data berhasil ditambahkan!",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });

    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Terjadi kesalahan saat mengupload file.";

      await Swal.fire({
        title: "Gagal!",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#d33",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .custom-select-container .select__control {
          min-height: 38px;
          border-color: #dee2e6;
          border-radius: 0.375rem;
        }

        .custom-select-container .select__control:hover {
          border-color: #dee2e6;
        }

        .custom-select-container .select__control--is-focused {
          border-color: #86b7fe;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }

        .custom-select-container .select__placeholder {
          color: #6c757d;
        }

        .custom-select-container .select__single-value {
          color: #212529;
        }

        .custom-select-container .select__indicator-separator {
          background-color: #dee2e6;
        }

        .custom-select-container .select__dropdown-indicator {
          color: #6c757d;
        }

        .custom-select-container .select__menu {
          border-radius: 0.375rem;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        }

        .custom-select-container .select__option {
          cursor: pointer;
        }

        .custom-select-container .select__option--is-focused {
          background-color: #f8f9fa;
        }

        .custom-select-container .select__option--is-selected {
          background-color: #0d6efd;
        }

        .filter-collapse {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
        }

        .filter-collapse.show {
          max-height: 500px;
          overflow: visible;
          transition: max-height 0.3s ease-in;
        }
      `}</style>

      <div className="col-lg-12 mb-10">
        {loading && <Loader />}
        <div className="card h-100 feature-inventory">
          <div className="card-header d-flex justify-content-between align-items-center filter-section gap-2">
            <h5 className="card-title mb-0 title-filter">Filter</h5>
            <div className="d-flex gap-2 align-items-center">
              <div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="form-control search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {showFilters && (
                <>
                  <div className="section-import">
                    <OverlayTrigger
                      placement="top"
                      overlay={renderTooltip("Data Import")}
                    >
                      <button
                        className="btn btn-secondary button-fiture-inventory d-flex align-items-center justify-content-center button-export"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        data-bs-title="Tooltip on top"
                        onClick={() => setOpenImport(!openImport)}
                      >
                        <Icon
                          icon={"uil:import"}
                          className="iconify"
                          fontSize={22}
                        />
                      </button>
                    </OverlayTrigger>
                    {openImport && (
                      <div className="child-import">
                        <ul>
                          <li
                            className="d-flex align-items-center gap-1"
                            onClick={() => handleDownloadFormat()}
                          >
                            <Icon
                              icon={"tabler:file-download"}
                              className="iconify"
                              fontSize={18}
                            />
                            Download Format
                          </li>
                          <li
                            className="d-flex align-items-center gap-1"
                            onClick={() => setOpenModalImport(true)}
                          >
                            <Icon
                              icon={"uil:import"}
                              className="iconify"
                              fontSize={18}
                            />
                            Upload
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                  <OverlayTrigger
                    placement="top"
                    overlay={renderTooltip("Data Export")}
                  >
                    <button
                      className="btn btn-success button-fiture-inventory d-flex align-items-center justify-content-center button-export"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-title="Tooltip on top"
                      onClick={() => {
                        handleDownload(
                          filterSelected.selectedBrand?.value,
                          filterSelected.selectedCategory?.value,
                          filterSatuan
                        );
                      }}
                    >
                      <Icon
                        icon={"mdi:file-export-outline"}
                        className="iconify"
                        fontSize={22}
                      />
                    </button>
                  </OverlayTrigger>
                </>
              )}
              <button
                className="btn btn-outline-secondary d-flex align-items-center gap-2 button-filter"
                onClick={() =>
                  showFilters ? setShowFilters(false) : setShowFilters(true)
                }
                style={{ whiteSpace: "nowrap" }}
              >
                <Icon icon="line-md:filter" fontSize={22} />
              </button>
              <button
                className="btn btn-outline-primary d-flex align-items-center w-30 justify-content-center gap-1 button-create"
                onClick={() => {
                  setShowModal(true);
                }}
                style={{ whiteSpace: "nowrap" }}
              >
                  <Icon icon="zondicons:add-outline" fontSize={22} />
              </button>
            </div>
          </div>

          <ExcelUploadModal
            show={openModalImport}
            onHide={() => setOpenModalImport(false)}
            onUpload={handleUpload}
          />

          <div className={`filter-collapse ${showFilters ? "show" : ""}`}>
            <div className="card-body border-top">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Category</label>
                  <div className="custom-select-container">
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      isClearable
                      className="filter-stock"
                      loadOptions={getCategory}
                      value={filterSelected.selectedCategory}
                      onChange={(option) => {
                        setFilterSelected({
                          ...filterSelected,
                          selectedCategory: option,
                        });
                        selectedCategory(option);
                      }}
                      placeholder="Choose Category"
                    />
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Brand</label>
                  <div className="custom-select-container">
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      isClearable
                      className="filter-stock"
                      loadOptions={getBrand}
                      value={filterSelected.selectedBrand}
                      onChange={(option) => {
                        setFilterSelected({
                          ...filterSelected,
                          selectedBrand: option,
                        });
                        selectedBrand(option);
                      }}
                      placeholder="Choose Brand"
                    />
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Unit</label>
                  <div className="custom-select-container">
                    <Select
                      options={satuanList}
                      isSearchable
                      isClearable
                      placeholder="Choose Unit"
                      value={filterSatuan}
                      onChange={(selected) => setFilterSatuan(selected)}
                      isDisabled={loadingFilters}
                      classNamePrefix="select"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-top modal-lg">
              <div className="modal-content">
                <div className="modal-header text-white">
                  <h5 className="modal-title">Tambah Inventory Baru</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={handleCloseModal}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="nama" className="form-label">
                        Nama Barang <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="nama"
                        name="nama"
                        value={formData.nama}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama barang"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="satuan" className="form-label">
                        Satuan <span className="text-danger">*</span>
                      </label>
                      <div className="custom-select-container">
                        <Select
                          options={satuanList}
                          isSearchable
                          placeholder="Pilih satuan..."
                          value={
                            satuanList.find(
                              (opt) => opt.value === formData.satuan
                            ) || null
                          }
                          onChange={(selected) =>
                            setFormData({
                              ...formData,
                              satuan: selected ? selected.value : "",
                            })
                          }
                          isDisabled={loadingFilters}
                          classNamePrefix="select"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="kategori" className="form-label">
                        Kategori <span className="text-danger">*</span>
                      </label>
                      <div className="custom-select-container">
                        <AsyncSelect
                          cacheOptions
                          defaultOptions
                          isClearable
                          className="filter-stock"
                          loadOptions={getCategory}
                          value={formData.category_id}
                          onChange={(option) => {
                            setFormData({
                              ...formData,
                              category_id: option,
                            });
                          }}
                          placeholder="Pilih Kategori "
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="brand" className="form-label">
                        Brand <span className="text-danger">*</span>
                      </label>
                      <div className="custom-select-container">
                        <AsyncSelect
                          cacheOptions
                          defaultOptions
                          isClearable
                          className="filter-stock"
                          loadOptions={getBrand}
                          value={formData.brand_id}
                          onChange={(option) => {
                            setFormData({
                              ...formData,
                              brand_id: option,
                            });
                          }}
                          placeholder="Pilih Brand "
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Menyimpan...
                      </>
                    ) : (
                      "Simpan Inventory"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal-backdrop fade show"
            onClick={handleCloseModal}
          ></div>
        </>
      )}
    </>
  );
};

export default FeatureInventory;
