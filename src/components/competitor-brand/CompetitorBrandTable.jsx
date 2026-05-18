import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { Icon } from "@iconify/react";
import { Modal, Button } from "react-bootstrap";
import Loader from "../loader/loader";
import Swal from "sweetalert2";

const CompetitorBrandTable = () => {
  const [currentData, setCurrentData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageTo, setPageTo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  // const [mode, setMode] = useState("add");
  // const [showClick, setShowClick] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const api = import.meta.env.VITE_API_URI;
  const apistorage = import.meta.env.VITE_STORAGE_URI;
  const token = localStorage.getItem("token");
  // const [selectedCustomer, setSelectedCustomer] = useState(null);
  // const [selectedCompany, setSelectedCompany] = useState(null);
  // const [selectedStock, setSelectedStock] = useState(null);
  // const [selectedAlokasi, setSelectedAlokasi] = useState(null);
  const [filter, setFilter] = useState(false);
  const [filterSelected, setFilterSelected] = useState({
    selectedCompany: null,
    selectedCustomer: null,
  });

  const fetchCompetitor = async (
    page = 1,
    perPage = 10,
    search = "",
    customerId = "",
    company_id
  ) => {
    try {
      setLoadingTable(true);
      const res = await axios.get(`${api}/competitor-brand/`, {
        params: { page, perPage, search, customerId, company_id },
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
    const companyId = filterSelected.selectedCompany?.value || "";
    fetchCompetitor(page, perPage, search, customerId, companyId);
    // getInventory();

    // if (mode === "edit") fetchData();
  }, [page, perPage, search, filterSelected]);

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

  //Handle Add
  // const handleSubmitAddStock = async (e) => {
  //   setLoading(true);
  //   e.preventDefault();
  //   const payload = {
  //     company_id: selectedCompany?.value,
  //     customer_id: selectedCustomer?.value,
  //     alokasi_stock: selectedAlokasi,
  //   };
  //   try {
  //     const res = await axios.post(`${api}/inventories/stock`, payload, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setShowClick(false);
  //     fetchCompetitor(page, perPage, search);
  //     Swal.fire({
  //       icon: "success",
  //       title: "Success",
  //       text: res.data.message,
  //       showConfirmButton: false,
  //       timer: 1500,
  //     });
  //     setSelectedCustomer(null);
  //     setSelectedCompany(null);
  //   } catch (error) {
  //     setShowClick(false);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Terjadi Kesalahan",
  //       text: error.response?.data?.message || "Ada Yang Salah!",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //handle edit
  // const fetchData = async () => {
  //   try {
  //     const data = selectedStock;

  //     // fetch label dari API relasi
  //     const [custRes, invRes] = await Promise.all([
  //       axios.get(
  //         `${api}/inventories/get-customers/${data.master_customer_id}`,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       ),
  //       axios.get(
  //         `${api}/inventories/get-inventory/${data.master_inventory_id}`,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       ),
  //     ]);

  //     setSelectedCustomer({
  //       value: custRes.data.data.id,
  //       label: custRes.data.data.name,
  //     });
  //     setSelectedCompany({
  //       value: invRes.data.data.id,
  //       label: invRes.data.data.nama,
  //     });

  //     setLoading(false);
  //   } catch (err) {
  //     console.error(err);
  //     setLoading(false);
  //   }
  // };

  // const handleEdit = async () => {
  //   try {
  //     setLoading(true);
  //     const payload = {
  //       inventory_id: selectedCompany?.value,
  //       customer_id: selectedCustomer?.value,
  //       alokasi_stock: selectedAlokasi,
  //     };
  //     const res = await axios.put(
  //       `${api}/inventories/stock/${selectedStock.id}`,
  //       payload,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     setShowClick(false);
  //     fetchCompetitor(page, perPage, search);
  //     Swal.fire({
  //       icon: "success",
  //       title: "Success",
  //       text: res.data.message,
  //       showConfirmButton: false,
  //       timer: 1500,
  //     });
  //     setSelectedCustomer(null);
  //     setSelectedCompany(null);
  //     setMode("add");
  //   } catch (error) {
  //     console.log(error);
  //     setMode("add");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
        fetchCompetitor(page, perPage, search);
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
  const handleDownload = async (company_id = "", customer_id = "") => {
    setLoading(true);
    try {
      const res = await axios({
        url: `${api}/competitor-brand/export`,
        params: {
          company_id,
          customer_id,
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
      const filename = `export-competitor-brand-${today}.xlsx`;
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

  return (
    <>
      {loading && <Loader />}

      <div className="col-lg-12">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="card-title mb-0">Competitor Brand</h5>
          </div>
          <div className="card-body body-comptetitor">
            <div className="d-flex justify-content-between mb-3 header-comptetitor">
              <div>
                <label className="me-2">Show</label>
                <Select
                  options={[
                    { value: 10, label: "10" },
                    { value: 20, label: "20" },
                    { value: 50, label: "50" },
                  ]}
                  onChange={(selectedOption) => {
                    setPerPage(Number(selectedOption.value));
                  }}
                  classNamePrefix="select-competitor"
                  defaultValue={{ value: perPage, label: `${perPage}` }}
                  className="d-inline-block w-auto"
                />
              </div>

              <div className="d-flex align-items-center gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  className="form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {filter && (
                  <div>
                    <button
                      className="btn btn-success button-fiture-inventory d-flex align-items-center justify-content-center"
                      onClick={() => {
                        handleDownload(
                          filterSelected.selectedCompany?.value,
                          filterSelected.selectedCustomer?.value
                        );
                      }}
                    >
                      <Icon icon={"mdi:file-export-outline"} fontSize={24} />
                    </button>
                  </div>
                )}
                <button
                  className="btn btn-secondary d-flex align-items-center justify-content-center"
                  onClick={() => {
                    filter ? setFilter(false) : setFilter(true);
                  }}
                >
                  <Icon icon="line-md:filter" fontSize={24}/>
                </button>
              </div>
            </div>

            {/* filter */}
            {filter && (
              <>
                <div className="d-flex justify-content-between align-items-center my-3 filter-competitor">
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
                      placeholder="Choose Company"
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
                      placeholder="Choose Customer"
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
                    <th>Customer</th>
                    <th>Item</th>
                    <th>Selling price</th>
                    <th>From Date</th>
                    <th>Until Date</th>
                    <th>Promotion</th>
                    <th>Photo</th>
                    <th id="action">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((item, index) => (
                      <tr key={item.id}>
                        <td>{indexOfFirstRow + index + 1}</td>
                        <td>{item.master_customer.name}</td>
                        <td>{item.brand_name ?? "-"}</td>
                        <td>{item.price_sell ?? "-"}</td>
                        <td>{item.date_from ?? "-"}</td>
                        <td>{item.date_to ?? "-"}</td>
                        <td>{item.promotion ?? "-"}</td>
                        <td>
                          {item.photo === null ? (
                            <>Tidak ada foto</>
                          ) : (
                            <a
                              href={`${apistorage}/storage/${item.photo}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Lihat Foto
                            </a>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
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
    </>
  );
};

export default CompetitorBrandTable;
