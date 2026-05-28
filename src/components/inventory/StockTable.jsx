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

  return (
    <>
      <style>{`
        .table-row:hover { cursor: pointer; background: #f8fafc !important; }
        .custom-table th { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; background: #f8fafc; border-bottom: 2px solid #e2e8f0; padding: 10px 12px; white-space: nowrap; }
        .custom-table td { font-size: 13px; color: #334155; padding: 10px 12px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .act-btn { height: ${H}; width: ${H}; border-radius: ${R}; border: ${B}; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #fff; color: #64748b; }
        .act-btn:hover { background: #f1f5f9; }
        .act-btn.green { background: #dcfce7; border-color: #86efac; color: #16a34a; }
        .act-btn.green:hover { background: #bbf7d0; }
        .act-btn.blue { background: #dbeafe; border-color: #93c5fd; color: #2563eb; }
        .act-btn.blue:hover { background: #bfdbfe; }
        .search-input { height: ${H}; border: ${B}; border-radius: ${R}; padding: 0 12px 0 34px; font-size: ${F}; outline: none; width: 190px; color: #334155; background: #fff; }
        .search-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
        .search-wrap { position: relative; display: flex; align-items: center; }
        .search-wrap .s-icon { position: absolute; left: 10px; color: #94a3b8; pointer-events: none; }
        .fdivider { width: 1px; height: 20px; background: #e2e8f0; flex-shrink: 0; }
        
        .status-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .status-unregis { background: #f1f5f9; color: #64748b; }
        .status-oncheck { background: #fef9c3; color: #a16207; }
        .status-registered { background: #dcfce7; color: #16a34a; }
        
        .child-import { position: absolute; top: 40px; right: 0; background: white; border: 1px solid #e2e8f0; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); z-index: 100; min-width: 170px; overflow: hidden; }
        .child-import ul { list-style: none; margin: 0; padding: 6px; }
        .child-import ul li { padding: 8px 12px; font-size: 13px; border-radius: 6px; cursor: pointer; color: #334155; display: flex; align-items: center; gap: 8px; }
        .child-import ul li:hover { background: #f8fafc; }
        .section-import { position: relative; }
      `}</style>
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
        <div className="card h-100" style={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <div className="card-header" style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", borderRadius: "12px 12px 0 0", padding: "14px 18px" }}>
            <div className="d-flex align-items-center gap-2">
              <div style={{ width: 3, height: 18, background: "#3b82f6", borderRadius: 3 }} />
              <h5 className="card-title mb-0" style={{ fontSize: "15px", fontWeight: 600, color: "#1e293b" }}>Stock Inventory</h5>
            </div>
          </div>
          <div className="card-body body-stock" style={{ padding: "14px 18px" }}>
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
                    onChange={(selectedOption) => {
                      setPerPage(Number(selectedOption.value));
                    }}
                    defaultValue={{ value: perPage, label: `${perPage}` }}
                    classNamePrefix="select-stock"
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
                {filter && (
                  <>
                    <div className="section-import">
                      <OverlayTrigger
                        placement="top"
                        overlay={renderTooltip("Data Import")}
                      >
                        <button
                          className="act-btn"
                          onClick={() => setOpenImport(!openImport)}
                        >
                          <Icon icon={"uil:import"} fontSize={18} />
                        </button>
                      </OverlayTrigger>
                      {openImport && (
                        <div className="child-import">
                          <ul>
                            <li onClick={() => handleDownloadFormat()}>
                              <Icon icon={"tabler:file-download"} fontSize={16} /> Download Format
                            </li>
                            <li onClick={() => setOpenModalImport(true)}>
                              <Icon icon={"uil:import"} fontSize={16} /> Upload
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
                          className="act-btn green"
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
                          <Icon icon="mdi:file-export-outline" fontSize={18} />
                        </button>
                      </OverlayTrigger>
                    </div>
                  </>
                )}
                <OverlayTrigger placement="top" overlay={renderTooltip("Filter")}>
                  <button
                    className="act-btn"
                    onClick={() => {
                      filter ? setFilter(false) : setFilter(true);
                    }}
                  >
                    <Icon icon="line-md:filter" fontSize={18} />
                  </button>
                </OverlayTrigger>
                <OverlayTrigger placement="top" overlay={renderTooltip("Create Stock")}>
                  <button
                    onClick={() => {
                      setMode("add");
                      setShowClick(true);
                    }}
                    className="act-btn blue"
                  >
                    <Icon icon="mdi:plus" fontSize={20} />
                  </button>
                </OverlayTrigger>
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
              <table className="table custom-table mb-0">
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
                    <th className="text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((item, index) => (
                      <tr key={item.id} className="table-row">
                        <td style={{ color: "#94a3b8" }}>{indexOfFirstRow + index + 1}</td>
                        <td>{item.master_customer.company?.name}</td>
                        <td style={{ fontWeight: 600, color: "#1e293b" }}>{item.master_customer.name}</td>
                        <td>
                          {item.master_customer.status == "unregis" ? (
                              <span className="status-badge status-unregis">Unregistered</span>
                            ) : item.master_customer.status == "registered" ? (
                              <span className="status-badge status-registered">Registered</span>
                            ) : (
                              <span className="status-badge status-oncheck">On Check</span>
                            )}
                        </td>
                        <td>{item.master_inventory.nama}</td>
                        <td>{item.alokasi_stock ? item.alokasi_stock : "-"}</td>
                        <td>{item.actual_stock ? item.actual_stock : "-"}</td>
                        <td>
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                },
                              )
                            : "-"}
                        </td>
                        <td>
                          <div className="d-flex align-items-center justify-content-center gap-1">
                            <button
                              className="btn btn-warning btn-sm d-flex align-items-center"
                              style={{ borderRadius: 7 }}
                              onClick={() => {
                                setMode("edit");
                                setSelectedStock(item);
                                setShowClick(true);
                                setSelectedAlokasi(item.alokasi_stock);
                              }}
                            >
                              <Icon icon="mdi:pencil" width={15} />
                            </button>
                            <button
                              className="btn btn-danger btn-sm d-flex align-items-center"
                              style={{ borderRadius: 7 }}
                              onClick={() => handleDelete(item.id)}
                            >
                              <Icon
                                icon="material-symbols:delete-outline"
                                width={15}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-5" style={{ color: "#94a3b8", fontSize: 14 }}>
                        <Icon icon="mdi:inbox-outline" fontSize={32} style={{ display: "block", margin: "0 auto 8px" }} />
                        {loadingTable ? "Loading..." : "Data Kosong"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span style={{ fontSize: 13, color: "#64748b" }}>
                Showing {indexOfFirstRow + 1} to {pageTo} of{" "}
                {totalPages * perPage} entries
              </span>

              <nav>
                <ul className="pagination mb-0" style={{ gap: 4 }}>
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      style={{ borderRadius: 8, fontSize: 13 }}
                      onClick={() => setPage(page - 1)}
                    >
                      ‹ Prev
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
                        style={{ borderRadius: 8, fontSize: 13 }}
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
                      style={{ borderRadius: 8, fontSize: 13 }}
                      onClick={() => setPage(page + 1)}
                    >
                      Next ›
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
