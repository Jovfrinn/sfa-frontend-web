import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { Icon } from "@iconify/react";
import { Modal, Button } from "react-bootstrap";
import Loader from "../loader/loader";
import Swal from "sweetalert2";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export const PreOrderTable = () => {
  const [currentData, setCurrentData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageTo, setPageTo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("add");
  const [showClick, setShowClick] = useState(false);
  const [showCalender, setShowCalender] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const api = import.meta.env.VITE_API_URI;
  const token = localStorage.getItem("token");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedPO, setSelectedPO] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [filter, setFilter] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRangeState, setDateRangeState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);
  const [filterSelected, setFilterSelected] = useState({
    selectedItem: null,
    selectedCustomer: null,
    selectedCompany: null,
    unit: null,
  });

  const dataUnit = [
    { value: "BTL", label: "BTL" },
    { value: "KRTN", label: "KRTN" },
    { value: "KRT", label: "KRT" },
    { value: "DUS", label: "DUS" },
  ];

  const fetchPreOrder = async (
    page = 1,
    perPage = 10,
    search = "",
    customerId = "",
    inventoryId = "",
    company_id = "",
    unit = "",
    startDate = "",
    endDate = ""
  ) => {
    try {
      setLoadingTable(true);
      const res = await axios.get(`${api}/pre-order/`, {
        params: {
          page,
          perPage,
          search,
          customerId,
          inventoryId,
          unit,
          company_id,
          startDate,
          endDate,
        },
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

  const refresh = () => {
    const customerId = filterSelected.selectedCustomer?.value || "";
    const categoryId = filterSelected.selectedCategory?.value || "";
    const companyId = filterSelected.selectedCompany?.value || "";
    const unit = filterSelected.unit?.value || "";
    fetchPreOrder(
      page,
      perPage,
      search,
      customerId,
      categoryId,
      companyId,
      unit
    );
  };

  useEffect(() => {
    const customerId = filterSelected.selectedCustomer?.value || "";
    const inventoryId = filterSelected.selectedItem?.value || "";
    const companyId = filterSelected.selectedCompany?.value || "";
    const unit = filterSelected.unit?.value || "";

    fetchPreOrder(
      page,
      perPage,
      search,
      customerId,
      inventoryId,
      companyId,
      unit,
      startDate,
      endDate
    );
    getInventory();

    if (mode === "edit") fetchData();
  }, [page, perPage, search, filterSelected, mode, startDate, endDate]);

  // Pagination
  function getPageNumbers(currentPage, totalPages) {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    // buat range angka
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

  //Handle Add
  const handleSubmitAddStock = async (e) => {
    setLoading(true);
    e.preventDefault();
    const payload = {
      inventory_id: selectedItem?.value,
      customer_id: selectedCustomer?.value,
      quantity: selectedQuantity,
      unit: selectedUnit?.value,
    };
    try {
      const res = await axios.post(`${api}/pre-order/store`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setShowClick(false);
      refresh();
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
      const data = selectedPO;

      // fetch label dari API relasi
      const [custRes, invRes] = await Promise.all([
        axios.get(
          `${api}/inventories/get-customers/${data.master_customer_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axios.get(
          `${api}/inventories/get-inventory/${data.master_inventory_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
      ]);

      const defaultUnit = dataUnit.find((item) => item.value === data.unit);

      setSelectedUnit(defaultUnit);

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
        quantity: selectedQuantity,
        unit: selectedUnit?.value,
      };
      const res = await axios.put(
        `${api}/pre-order/update/${selectedPO.id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowClick(false);
      fetchPreOrder(page, perPage, search);
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
      .delete(`${api}/pre-order/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setShowClick(false);
        fetchPreOrder(page, perPage, search);
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

  // getCompany
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

  //export excel
  const handleDownload = async (
    inventory_id = "",
    customer_id = "",
    company_id = "",
    startDate = "",
    endDate = ""
  ) => {
    setLoading(true);
    try {
      const res = await axios({
        url: `${api}/pre-order/export-preorder`,
        params: {
          inventory_id,
          customer_id,
          company_id,
          startDate,
          endDate,
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
      const filename = `export-po-${today}.xlsx`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
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
        text: "PO Berhasil Diexport",
      });
    }
  };

  const handleRangeChange = (item) => {
    setDateRangeState([item.selection]);
  };

  const handleCalendarOpen = () => {
    setShowCalender(true);
  };

  const onSubmitDate = () => {
    const dateStringStart = dateRangeState[0].startDate;
    const dateStringEnd = dateRangeState[0].endDate;
    const dateObjectStart = new Date(dateStringStart);
    const dateObjectEnd = new Date(dateStringEnd);

    const formattedDateStart = format(dateObjectStart, "yyyy-MM-dd");
    const formattedDateEnd = format(dateObjectEnd, "yyyy-MM-dd");

    setStartDate(formattedDateStart);
    setEndDate(formattedDateEnd);
  };

  return (
    <>
      <style>{`
        .table-row:hover { cursor: pointer; background: #f8fafc !important; }
        .user-table th { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; background: #f8fafc; border-bottom: 2px solid #e2e8f0; padding: 10px 12px; white-space: nowrap; }
        .user-table td { font-size: 13px; color: #334155; padding: 10px 12px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .act-btn { height: ${H}; width: ${H}; border-radius: ${R}; border: ${B}; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #fff; color: #64748b; }
        .act-btn:hover { background: #f1f5f9; }
        .act-btn.blue { background: #dbeafe; border-color: #93c5fd; color: #2563eb; }
        .act-btn.blue:hover { background: #bfdbfe; }
        .act-btn.green { background: #dcfce7; border-color: #86efac; color: #16a34a; }
        .act-btn.green:hover { background: #bbf7d0; }
        .search-input { height: ${H}; border: ${B}; border-radius: ${R}; padding: 0 12px 0 34px; font-size: ${F}; outline: none; width: 190px; color: #334155; background: #fff; }
        .search-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
        .search-wrap { position: relative; display: flex; align-items: center; }
        .search-wrap .s-icon { position: absolute; left: 10px; color: #94a3b8; pointer-events: none; }
        .fdivider { width: 1px; height: 20px; background: #e2e8f0; flex-shrink: 0; }
      `}</style>
      
      {loading && <Loader />}
      <Modal
        show={showClick}
        onHide={() => {
          setShowClick(false);
          setSelectedQuantity(null);
          setSelectedCustomer(null);
          setSelectedItem(null);
          setMode("add");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{mode === "edit" ? "Edit PO" : "Create PO"}</Modal.Title>
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
                placeholder="Choose Name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="quantity" className="form-label">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                className="form-control"
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(e.target.value)}
                placeholder="Enter Quantity"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="unit" className="form-label">
                Unit
              </label>
              <Select
                options={dataUnit}
                onChange={setSelectedUnit}
                value={selectedUnit}
                placeholder="Choose Unit"
              />
            </div>
            <Button variant="primary" type="submit">
              {mode === "edit" ? "Update PO" : "Create PO"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* modal date */}
      <Modal
        show={showCalender}
        onHide={() => {
          setShowCalender(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Pilih Tanggal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column">
            <DateRange
              onChange={handleRangeChange}
              ranges={dateRangeState}
              months={1}
              direction="vertical"
              editableDateInputs={false}
            />
            <Button
              variant="primary"
              type="submit"
              onClick={() => {
                onSubmitDate();
                setShowCalender(false);
              }}
            >
              Pilih
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <div className="col-lg-12">
        <div className="card h-100" style={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <div className="card-header d-flex justify-content-between align-items-center" style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", borderRadius: "12px 12px 0 0", padding: "14px 18px" }}>
            <div className="d-flex align-items-center gap-2">
              <div style={{ width: 3, height: 18, background: "#3b82f6", borderRadius: 3 }} />
              <h5 className="card-title mb-0" style={{ fontSize: "15px", fontWeight: 600, color: "#1e293b" }}>PO</h5>
            </div>
          </div>
          
          <div className="card-body" style={{ padding: "14px 18px" }}>
            
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px 14px" }}>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <div className="d-flex align-items-center">
                  <span className="me-2" style={{ fontSize: "13px", color: "#64748b" }}>Show</span>
                  <Select
                    options={[
                      { value: 10, label: "10" },
                      { value: 20, label: "20" },
                      { value: 50, label: "50" },
                    ]}
                    onChange={(selectedOption) => {
                      setPerPage(Number(selectedOption.value));
                    }}
                    value={{ value: perPage, label: `${perPage}` }}
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
                
                {filter && (
                  <button
                    className="act-btn green"
                    title="Export"
                    onClick={() => {
                      handleDownload(
                        filterSelected.selectedItem,
                        filterSelected.selectedCustomer,
                        filterSelected.selectedCompany,
                        startDate,
                        endDate
                      );
                    }}
                  >
                    <Icon icon="mdi:file-export-outline" fontSize={18} />
                  </button>
                )}
                
                <button
                  className={`act-btn ${filter ? 'blue' : ''}`}
                  onClick={() => setFilter(!filter)}
                  title="Filter"
                >
                  <Icon icon="line-md:filter" fontSize={18}/>
                </button>

                <div className="fdivider"></div>

                <button
                  onClick={() => {
                    setMode("add");
                    setShowClick(true);
                  }}
                  className="act-btn blue"
                  title="Create PO"
                >
                  <Icon icon="zondicons:add-outline" fontSize={18} />
                </button>
              </div>
            </div>

            {/* filter */}
            {filter && (
              <div className="row g-2 mb-3" style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <div className="col-md-6 col-lg-3">
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    isClearable
                    loadOptions={getCompany}
                    value={filterSelected.selectedCompany}
                    onChange={(option) =>
                      setFilterSelected({
                        ...filterSelected,
                        selectedCompany: option,
                      })
                    }
                    placeholder="Pilih Company"
                    styles={selectStyles}
                  />
                </div>
                <div className="col-md-6 col-lg-3">
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    isClearable
                    loadOptions={getCustomers}
                    value={filterSelected.selectedCustomer}
                    onChange={(option) =>
                      setFilterSelected({
                        ...filterSelected,
                        selectedCustomer: option,
                      })
                    }
                    placeholder="Pilih Customer"
                    styles={selectStyles}
                  />
                </div>
                <div className="col-md-6 col-lg-3">
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    isClearable
                    loadOptions={getInventory}
                    value={filterSelected.selectedItem}
                    onChange={(option) =>
                      setFilterSelected({
                        ...filterSelected,
                        selectedItem: option,
                      })
                    }
                    placeholder="Pilih Barang"
                    styles={selectStyles}
                  />
                </div>

                <div className="col-md-6 col-lg-3" style={{ position: "relative" }}>
                  <button
                    type="button"
                    className="form-control"
                    style={{ height: H, borderColor: "#e2e8f0", borderRadius: R, fontSize: F, textAlign: "left", background: "#fff", color: (!startDate || !endDate) ? "#a0aec0" : "#334155" }}
                    onClick={handleCalendarOpen}
                  >
                    {!startDate || !endDate
                      ? "Pilih tanggal"
                      : `${startDate} - ${endDate}`}
                  </button>
                  {startDate && endDate && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setStartDate(null);
                        setEndDate(null);
                      }}
                      style={{
                        position: "absolute",
                        right: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "18px",
                        color: "#94a3b8",
                        padding: "0 5px",
                      }}
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="table-responsive">
              <table className="table user-table mb-0">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Customer</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Tanggal</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((item, index) => (
                      <tr key={item.id} className="table-row">
                        <td style={{ color: "#94a3b8" }}>{indexOfFirstRow + index + 1}</td>
                        <td style={{ fontWeight: 600, color: "#1e293b" }}>{item.master_customer.name}</td>
                        <td>{item.master_inventory.nama}</td>
                        <td>{item.quantity ? item.quantity : "-"}</td>
                        <td>{item.unit ? item.unit : "-"}</td>
                        <td>
                          {item.created_at
                            ? new Intl.DateTimeFormat("en-CA", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                timeZone: "UTC",
                              })
                                .format(new Date(item.created_at))
                                .replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3")
                            : "-"}
                        </td>
                        <td>
                          <div className="d-flex gap-2 align-items-center justify-content-center">
                            <button
                              className="btn btn-warning btn-sm d-flex align-items-center justify-content-center"
                              style={{ borderRadius: "7px", width: "28px", height: "28px", padding: 0 }}
                              onClick={() => {
                                setMode("edit");
                                setSelectedPO(item);
                                setShowClick(true);
                                setSelectedQuantity(item.quantity);
                                setSelectedUnit(item.quantity);
                              }}
                              title="Edit"
                            >
                              <Icon icon="mdi:pencil" width={16} />
                            </button>
                            <button
                              className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
                              style={{ borderRadius: "7px", width: "28px", height: "28px", padding: 0 }}
                              onClick={() => handleDelete(item.id)}
                              title="Hapus"
                            >
                              <Icon icon="mdi:trash" width={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5" style={{ color: "#94a3b8", fontSize: 14 }}>
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
                    <button className="page-link" style={{ borderRadius: 8, fontSize: 13 }} onClick={() => setPage(page - 1)}>‹ Prev</button>
                  </li>
                  {getPageNumbers(page, totalPages).map((pageNumber, index) => (
                    <li key={index} className={`page-item ${pageNumber === page ? "active" : ""} ${pageNumber === "..." ? "disabled" : ""}`}>
                      <button className="page-link" style={{ borderRadius: 8, fontSize: 13 }} onClick={() => pageNumber !== "..." ? setPage(pageNumber) : null}>
                        {pageNumber}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" style={{ borderRadius: 8, fontSize: 13 }} onClick={() => setPage(page + 1)}>Next ›</button>
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

// export default PreOrderTable;
