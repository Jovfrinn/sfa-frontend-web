import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Select from "react-select";
import Loader from "../loader/loader";

const CompanyTable = () => {
  const [companies, setCompanies] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [modalMode, setModalMode] = useState("Create");

  const [companySelect, setCompanySelect] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [name, setName] = useState(null);
  const [address, setAddress] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  const handleShow = () => setIsShow(true);
  const handleClose = () => setIsShow(false);

  useEffect(() => {
    getCompany();
  }, []);

  const handleRefresh = () => {
    setCompanies([]);
    getCompany();
  };

  const getCompany = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URI}/company`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setCompanies(res.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCompanySelect();
  }, []);

  const getCompanySelect = async () => {
    try {
      setCompanySelect([]);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URI}/company/select`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCompanySelect(res.data);
    } catch (error) {
      console.error("Error fetching fields:", error);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const formData = {
        parent_id: selectedCompany['value'],
        name: name,
        address: address,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}/company/store`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        title: "Berhasil!",
        text: "Data perusahaan berhasil disimpan.",
        icon: "success",
        confirmButtonText: "OK",
      });

      setName(null);
      setAddress(null);
      setSelectedCompany(null);
      setIsShow(false);
      getCompany();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat menyimpan data!";

      Swal.fire({
        title: "Gagal!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Coba Lagi",
      });
      setIsShow(false);
    }
  };
  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const formData = {
        parent_id: selectedCompany["value"],
        name: name,
        address: address,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}/company/update/${selectedCompanyId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        title: "Berhasil!",
        text: "Data perusahaan berhasil diupdate.",
        icon: "success",
        confirmButtonText: "OK",
      });

      setName(null);
      setAddress(null);
      setSelectedCompany(null);
      setIsShow(false);
      getCompany();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat menyimpan data!";

      Swal.fire({
        title: "Gagal!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Coba Lagi",
      });
      setIsShow(false);
    }
  };
  const handleChangeStatus = async (id) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}/company/change-status/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getCompany();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat menyimpan data!";

      Swal.fire({
        title: "Gagal!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Coba Lagi",
      });
      setIsLoading(false);
      setIsShow(false);
    }
  };

  const handleShowData = async (id) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URI}/company/show/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const companyData = response.data.data;
        const foundCompany =
          companySelect.find(
            (item) => String(item.value) === String(companyData.parent_id)
          ) || null;

        setSelectedCompanyId(id);
        setSelectedCompany(foundCompany);
        setName(response.data.data.name);
        setAddress(response.data.data.address);
        setIsLoading(false);
      }
      setModalMode("Update");
      setIsShow(true);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Apakah anda yakin ?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          const token = localStorage.getItem("token");
          const response = await axios.delete(
            `${import.meta.env.VITE_API_URI}/company/destroy/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.success) {
            Swal.fire({
              title: "Berhasil!",
              text: "Data berhasil dihapus.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });

            getCompany();
          }
        } catch (error) {
          Swal.fire({
            title: "Gagal!",
            text: "Terjadi kesalahan saat menghapus data.",
            icon: "error",
          });
        }
      }
    });
  };
  return (
    <>
      {isLoading && <Loader />}

      <div className="col-lg-12">
        <div className="card mb-3">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0 d-flex align-items-center">
              <Icon icon="mdi:company" className="me-2 menu-icon" />
              Company
            </h5>

            <div>
              <button
                onClick={() => {
                  setModalMode("Create");
                  setSelectedCompany(null);
                  setName(null);
                  setAddress(null);
                  handleShow();
                }}
                className="btn btn-sm  btn-outline-primary me-2"
              >
                <Icon icon="zondicons:add-outline" width="20" height="20" />
              </button>
            </div>
          </div>
        </div>

        {isShow && (
          <div
            className="modal fade show"
            style={{
              display: "block",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="modal-title">{modalMode} Company</h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setSelectedCompanyId(null);
                      handleClose;
                    }}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="row">
                    <div className="col-12">
                      <span className="mb-2">Company Parent</span>
                      <Select
                        options={companySelect}
                        defaultValue={selectedCompany}
                        onChange={(e) => setSelectedCompany(e)}
                      />
                    </div>
                    <div className="col-12 mt-3">
                      <span className="mb-2">Company Name</span>
                      <input
                        type="text"
                        className="form-control fca"
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Eg : PT Teknologi Nusantara"
                        defaultValue={name}
                      />
                    </div>
                    <div className="col-12 mt-3">
                      <span className="mb-2">Company Address</span>
                      <textarea
                        name=""
                        placeholder="Eg : Jl. Teknologi Utama Kav. 3"
                        className="form-control fca"
                        onChange={(e) => setAddress(e.target.value)}
                        id=""
                        defaultValue={address}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleClose}
                  >
                    Tutup
                  </button>
                  <button
                    onClick={() => {
                      if (modalMode == "Create") {
                        handleSave();
                      } else {
                        handleUpdate();
                      }
                    }}
                    type="button"
                    className="btn btn-primary btn-sm"
                  >
                    {modalMode == "Create" ? "Simpan" : "Update"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card h-100">
          <div className="card-header d-flex justify-content-between align-items-center">
            <button
              onClick={() => handleRefresh()}
              className="btn btn-outline-dark"
            >
              <Icon icon="mdi:refresh" width="20" className="menu-icon" />
            </button>

            <div>
              <Link
                to={"/master/company"}
                className="btn btn-sm active  btn-outline-secondary me-2"
              >
                <Icon icon="mdi:view-list" width="20" height="20" />
              </Link>
              <Link
                to={"/master/company/tree"}
                className="btn btn-sm  btn-outline-secondary"
              >
                <Icon icon="mdi:family-tree" width="20" height="20" />
              </Link>
            </div>
          </div>

          <div className="card-body">
            <div className="table-responsive">
              <table className="table basic-border-table mb-0">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Parent</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.length > 0 ? (
                    companies.map((val, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{val.name}</td>
                        <td>{val?.parent?.name ?? "-"}</td>
                        <td>{val.address}</td>
                        <td>
                          <label className="switch">
                            <input
                              className="switch-input"
                              type="checkbox"
                              checked={val?.status === "active"}
                              onChange={(e) => handleChangeStatus(val.id)}
                              aria-label="Toggle setting"
                            />
                            <span
                              className="switch-track"
                              role="switch"
                              aria-checked="false"
                            >
                              <span className="switch-thumb"></span>
                            </span>
                          </label>
                        </td>
                        <td>
                          <div className="d-flex gap-2 align-items-center">
                            <button
                              onClick={() => handleShowData(val.id)}
                              className="btn btn-sm btn-outline-warning"
                            >
                              <Icon icon="mdi:pencil" width={20} />
                            </button>

                            {val.is_deleteable && (
                              <button
                                onClick={() => handleDelete(val.id)}
                                className="btn btn-sm btn-outline-danger"
                              >
                                <Icon icon="mdi:trash" width={20} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>Loading...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default CompanyTable;
