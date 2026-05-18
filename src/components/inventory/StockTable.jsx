import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { Icon } from "@iconify/react";
import { Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import Loader from "../loader/loader";
import Swal from "sweetalert2";
import ExportModalStock from "./ExportModalStock";

const StockTable = () => {
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const today = new Date();
  const toDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const fromDate = new Date(today.getFullYear(), today.getMonth(), 1);

  const api = import.meta.env.VITE_API_URI;
  const [currentData, setCurrentData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageTo, setPageTo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("add");
  const [showClick, setShowClick] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const token = localStorage.getItem("token");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedAlokasi, setSelectedAlokasi] = useState(null);
  const [filter, setFilter] = useState(false);
  const [from, setFrom] = useState(formatDate(fromDate));
  const [to, setTo] = useState(formatDate(toDate));
  const [filterSelected, setFilterSelected] = useState({
    selectedItem: null,
    selectedCustomer: null,
    selectedCompany: null,
    selectedStatus: null,
  });
  const [openImport, setOpenImport] = useState(false);
  const [openModalImport, setOpenModalImport] = useState(false);


  const fetchStock = async (
    page = 1,
    perPage = 10,
    search = "",
    customerId = "",
    inventoryId = "",
    from = "",
    to = "",
    companyId = "",
    status = "",
  ) => {
    try {
  // console.log(companyId);

      setLoadingTable(true);
      const res = await axios.get(`${api}/inventories/stock`, {
        params: { page, perPage, search, customerId, inventoryId, from, to, companyId, status },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentData(res.data.data.data);
      setPage(res.data.data.current_page);
      setTotalPages(Math.ceil(res.data.data.total / res.data.data.per_page));
      setPerPage(res.data.data.per_page);
      setPageTo(res.data.data.to);
      setLoadingTable(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const customerId = filterSelected.selectedCustomer?.value || "";
    const inventoryId = filterSelected.selectedItem?.value || "";
    const companyId = filterSelected.selectedCompany?.value || "";
    const status = filterSelected.selectedStatus?.value || "";
    fetchStock(page, perPage, search, customerId, inventoryId, from, to, companyId, status);
    getInventory();

    if (mode === "edit") fetchData();
  }, [page, perPage, search, filterSelected, mode, from, to]);

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
  const handleSubmitAddStock = async (e) => {
    setLoading(true);
    e.preventDefault();
    const payload = {
      inventory_id: selectedItem?.value,
      customer_id: selectedCustomer?.value,
      alokasi_stock: selectedAlokasi,
    };
    try {
      const res = await axios.post(`${api}/inventories/stock`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setShowClick(false);
      fetchStock(page, perPage, search, from, to);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data.message,
        showConfirmButton: false,
        timer: 1500,
      });
      setSelectedCustomer(null);
      setSelectedItem(null);
    } catch (error) {
      setShowClick(false);
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: error.response?.data?.message || "Ada Yang Salah!",
      });
    } finally {
      setLoading(false);
    }
  };

  //handle edit
  const fetchData = async () => {
    try {
      const data = selectedStock;

      // fetch label dari API relasi
      const [custRes, invRes] = await Promise.all([
        axios.get(
          `${api}/inventories/get-customers/${data.master_customer_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
        axios.get(
          `${api}/inventories/get-inventory/${data.master_inventory_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
      ]);

      setSelectedCustomer({
        value: custRes.data.data.id,
        label: custRes.data.data.name,
      });
      setSelectedItem({
        value: invRes.data.data.id,
        label: invRes.data.data.nama,
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      setLoading(true);
      const payload = {
        inventory_id: selectedItem?.value,
        customer_id: selectedCustomer?.value,
        alokasi_stock: selectedAlokasi,
      };
      const res = await axios.put(
        `${api}/inventories/stock/${selectedStock.id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setShowClick(false);
      fetchStock(page, perPage, search, from, to);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data.message,
        showConfirmButton: false,
        timer: 1500,
      });
      setSelectedCustomer(null);
      setSelectedItem(null);
      setMode("add");
    } catch (error) {
      console.log(error);
      setMode("add");
    } finally {
      setLoading(false);
    }
  };

  //handle delete
  const handleDelete = (id) => {
    setLoading(true);
    axios
      .delete(`${api}/inventories/stock/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setShowClick(false);
        fetchStock(page, perPage, search, from, to);
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

  //  getInventory
  const getInventory = async (inputValue) => {
    try {
      const res = await axios.get(`${api}/inventories/get-inventory`, {
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

  const renderTooltip = (text) => (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {text}
    </Tooltip>
  );

  //  getCustomers
  const getCustomers = async (inputValue) => {
    try {
      const res = await axios.get(`${api}/inventories/get-customers`, {
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
        label: item.name,
      }));
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const getCompany = async (inputValue) => {
      try {
        const res = await axios.get(api + `/pre-order/get/company`, {
          params: {
            search: inputValue,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
         const data = res.data.data;
         
        return data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

  //export excel
  const handleDownload = async (
    inventory_id = "",
    customer_id = "",
    company_id = "",
    from = "",
    to = "",
    status = "",
  ) => {
    setLoading(true);
    try {
      const res = await axios({
        url: `${api}/inventories/export-stock`,
        params: {
          inventory_id,
          customer_id,
          company_id,
          from,
          to,
          status,
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
      const filename = `export-stock-${today}.xlsx`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove(); // clean up the DOM
      window.URL.revokeObjectURL(url); // free memory
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
        url: `${api}/inventories/export-format-stock`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      const filename = `export-format-stock.xlsx`;
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
        `${api}/inventories/import-format-stock`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setLoading(false);
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
      {loading && <Loader />}
      <Modal
        show={showClick}
        onHide={() => {
          setShowClick(false);
          setSelectedAlokasi(null);
          setSelectedCustomer(null);
          setSelectedItem(null);
          setMode("add");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {mode === "edit" ? "Edit Stock" : "Create Stock"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (mode === "edit") {
                await handleEdit();
              } else {
                await handleSubmitAddStock(e);
              }
            }}
          >
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Item Name
              </label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={getInventory}
                onChange={setSelectedItem}
                value={selectedItem}
                placeholder="Choose Item"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Customer Name
              </label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={getCustomers}
                onChange={setSelectedCustomer}
                value={selectedCustomer}
                placeholder="Choose Customer"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="alokasi" className="form-label">
                Stock Allocation
              </label>
              <input
                type="number"
                id="alokasi"
                className="form-control"
                value={selectedAlokasi}
                onChange={(e) => setSelectedAlokasi(e.target.value)}
                placeholder="Enter Stock Allocation"
              />
            </div>
            <Button variant="primary" type="submit">
              {mode === "edit" ? "Update Stock" : "Create Stock"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <div className="col-lg-12">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="card-title mb-0">Stock Inventory</h5>
          </div>
          <div className="card-body body-stock">
            <div className="d-flex justify-content-between mb-3 header-stock">
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
                  classNamePrefix="select-stock"
                  className="d-inline-block w-auto"
                />
              </div>

              <div className="d-flex align-items-center gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  className="form-control search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {filter && (
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
                            icon={"uil:export"}
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
                                icon={"uil:export"}
                                className="iconify"
                                fontSize={18}
                              />
                              Upload
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                    <div>
                      <OverlayTrigger
                        placement="top"
                        overlay={renderTooltip("Data Export")}
                      >
                        <button
                          className="btn btn-success button-fiture-inventory d-flex align-items-center justify-content-center export"
                          onClick={() => {
                            handleDownload(
                              filterSelected.selectedItem?.value,
                              filterSelected.selectedCustomer?.value,
                              filterSelected.selectedCompany?.value,
                              from,
                              to,
                              filterSelected.selectedStatus?.value,
                            );
                          }}
                        >
                          <Icon
                            icon={"tabler:file-download"}
                            fontSize={24}
                          />
                        </button>
                      </OverlayTrigger>
                    </div>
                  </>
                )}
                <button
                  className="btn btn-secondary d-flex align-items-center justify-content-center filter"
                  onClick={() => {
                    filter ? setFilter(false) : setFilter(true);
                  }}
                >
                  <Icon icon="line-md:filter" fontSize={24} />
                </button>
                <button
                  onClick={() => {
                    setMode("add");
                    setShowClick(true);
                  }}
                  className="btn btn-outline-primary w-50 d-flex align-items-center justify-content-center button"
                >
                  <Icon icon="zondicons:add-outline" fontSize={22} />
                </button>
              </div>
            </div>

            {/* filter */}
            {filter && (
              <>
                <div className="d-flex justify-content-between align-items-center filter-section my-3">
                  <div className="d-flex justify-content-center w-100 me-1">
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      isClearable
                      className="filter-stock"
                      loadOptions={getCompany}
                      value={filterSelected.selectedCompany}
                      onChange={(option) =>
                        setFilterSelected({
                          ...filterSelected,
                          selectedCompany: option,
                        })
                      }
                      placeholder="Pilih Company"
                    />
                  </div>
                  <div className="d-flex justify-content-center w-100 me-1">
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      isClearable
                      className="filter-stock"
                      loadOptions={getInventory}
                      value={filterSelected.selectedItem}
                      onChange={(option) =>
                        setFilterSelected({
                          ...filterSelected,
                          selectedItem: option,
                        })
                      }
                      placeholder="Pilih Barang"
                    />
                  </div>
                  <div className="d-flex justify-content-center w-100 ms-1">
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      isClearable
                      className="filter-stock"
                      loadOptions={getCustomers}
                      value={filterSelected.selectedCustomer}
                      onChange={(option) =>
                        setFilterSelected({
                          ...filterSelected,
                          selectedCustomer: option,
                        })
                      }
                      placeholder="Pilih Customer"
                    />
                  </div>
                  <div className="d-flex justify-content-center w-100 ms-1">
                    <Select
                      isClearable
                      className="filter-stock"
                      options={[
                        { value: "unregis", label: "Unregistered" },
                        { value: "registered", label: "Registered" },
                        { value: "oncheck", label: "On Check" },
                      ]}
                      value={filterSelected.selectedStatus}
                      onChange={(option) =>
                        setFilterSelected({
                          ...filterSelected,
                          selectedStatus: option,
                        })
                      }
                      placeholder="Pilih Status"
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center filter-section my-3">
                  <div className="d-flex justify-content-center w-100 ms-1 flex-column">
                    <label htmlFor="date-from-input" className="form-label">
                      From
                    </label>
                    <input
                      type="date"
                      value={from}
                      max={to}
                      onChange={(e) => setFrom(e.target.value)}
                      id="date-from-input"
                      className="form-control"
                    />
                  </div>
                  <div className="d-flex justify-content-center w-100 ms-1 flex-column">
                    <label htmlFor="date-from-input" className="form-label">
                      To
                    </label>
                    <input
                      type="date"
                      value={to}
                      min={from}
                      onChange={(e) => setTo(e.target.value)}
                      id="date-from-input"
                      className="form-control"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="table-responsive">
              <table className="table basic-border-table mb-0">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Company</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Item</th>
                    <th>Stock Allocation</th>
                    <th>Actual Stock</th>
                    <th>Date</th>
                    <th id="action">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((item, index) => (
                      <tr key={item.id}>
                        <td>{indexOfFirstRow + index + 1}</td>
                        <td>{item.master_customer.company?.name}</td>
                        <td>{item.master_customer.name}</td>
                        {item.master_customer.status == "unregis" ? (
                            <td>
                              <span className="badge rounded-pill text-bg-secondary">
                                Unregistered
                              </span>
                            </td>
                          ) : item.master_customer.status == "registered" ? (
                            <td>
                              <span className="badge rounded-pill text-bg-success">
                                Registered
                              </span>
                            </td>
                          ) : (
                            <td>
                              <span className="badge rounded-pill text-bg-warning">
                                On Check
                              </span>
                            </td>
                          )}
                        <td>{item.master_inventory.nama}</td>
                        <td>{item.alokasi_stock ? item.alokasi_stock : "-"}</td>
                        <td>{item.actual_stock ? item.actual_stock : "-"}</td>
                        <td>
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                  // weekday: "long",
                                  day: "numeric",
                                  month: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "-"}
                        </td>
                        <td className="d-flex align-items-center">
                          <button
                            className="btn btn-warning btn-sm me-2 d-flex align-items-center"
                            onClick={() => {
                              setMode("edit");
                              setSelectedStock(item);
                              setShowClick(true);
                              setSelectedAlokasi(item.alokasi_stock);
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
                        {loadingTable ? "Loading..." : "Data Kosong"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3 pagination-section">
              <span>
                Showing {indexOfFirstRow + 1} to {pageTo} of{" "}
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
      <ExportModalStock
        show={openModalImport}
        onHide={() => setOpenModalImport(false)}
        onUpload={handleUpload}
      />
    </>
  );
};

export default StockTable;
