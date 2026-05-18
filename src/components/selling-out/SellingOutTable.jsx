import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { Icon } from "@iconify/react";
import { Modal, Button } from "react-bootstrap";
import Loader from "../loader/loader";
import Swal from "sweetalert2";

const SellingOutTable = ({ type }) => {
  const [currentData, setCurrentData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageTo, setPageTo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("add");
  const [showClick, setShowClick] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const api = import.meta.env.VITE_API_URI;
  const token = localStorage.getItem("token");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedValue, setSelectedValue] = useState([]);
  const [getCategories, setGetCategories] = useState(null);
  const [selectedCompany, setSelectectedCompany] = useState(null);

  const handleChange = (categoryId, value) => {
    setSelectedValue((prevValues) => {
      const existing = prevValues.find((v) => v.category_id === categoryId);

      if (existing) {
        return prevValues.map((v) =>
          v.category_id === categoryId ? { ...v, value } : v
        );
      } else {
        return [...prevValues, { category_id: categoryId, value }];
      }
    });
  };

  const fetchMarket = async (
    page = 1,
    perPage = 10,
    search = "",
    type = "",
    company_id = ""
  ) => {
    try {
      setLoadingTable(true);
      const res = await axios.get(`${api}/selling-out/${type}`, {
        params: {
          page,
          perPage,
          search,
          company_id,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setCurrentData(res.data.data.data);
      setPage(res.data.data.current_page);
      setTotalPages(Math.ceil(res.data.data.total / res.data.data.per_page));
      setTotalPage(res.data.data.total);
      setPerPage(res.data.data.per_page);
      setPageTo(res.data.data.to);
      setLoadingTable(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };


  useEffect(() => {
    const companyId = selectedCompany?.value;
    fetchMarket(page, perPage, search, type, companyId);
    getCategory();

  }, [page, perPage, search, mode, type, selectedCompany]);

  const refresh = () => {
    fetchMarket(page, perPage, search,  type);
  };

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
  const handleSubmitAddStock = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        customer_id: selectedCustomer?.value,
        categoryValue: selectedValue,
        type: type,
      };
      const res = await axios.post(`${api}/selling-out/store`, payload, {
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
  //       axios.get(`${api}/inventories/get-category/${data.category_id}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }),
  //     ]);

  //     setSelectedCustomer({
  //       value: custRes.data.data.id,
  //       label: custRes.data.data.name,
  //     });
  //     setselectedCategory({
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
  //       category_id: selectedCategory?.value,
  //       customer_id: selectedCustomer?.value,
  //       value: selectedValue,
  //       type: type,
  //     };
  //     const res = await axios.put(
  //       `${api}/selling-out/update/${selectedStock.id}`,
  //       payload,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     setShowClick(false);
  //     fetchMarket(page, perPage, search, type);
  //     Swal.fire({
  //       icon: "success",
  //       title: "Success",
  //       text: res.data.message,
  //       showConfirmButton: false,
  //       timer: 1500,
  //     });
  //     setSelectedCustomer(null);
  //     setselectedCategory(null);
  //     setMode("add");
  //   } catch (error) {
  //     console.log(error);
  //     setMode("add");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //handle delete
  const handleDelete = (item) => {
    setLoading(true);
    axios
      .delete(`${api}/selling-out/delete/`, {
        params:{
          code: item.code
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        refresh();
        setShowClick(false);
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

  //  getCategory
  const getCategory = async (inputValue) => {
    try {
      const res = await axios.get(`${api}/inventories/get-category`, {
        params: {
          search: inputValue,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data.data.data;
      setGetCategories(data);
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
  const handleDownload = async ( search= '', type) => {
    setLoading(true);
    try {
      const res = await axios.get(`${api}/selling-out/export-selling-out`, {
        params: { search, type },
        headers: { Authorization: `Bearer ${token}` },
        responseType: "arraybuffer",
      });

      const disposition = res.headers["content-disposition"];
      const suggestedFilename = disposition
        ? disposition.split("filename=")[1]?.replace(/"/g, "")
        : `export-selling-out-${new Date().toISOString().slice(0, 10)}.xlsx`;

      // Buat blob dengan MIME type Excel
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Buat link unduh
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", suggestedFilename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      Swal.fire({
        icon: "success",
        title: "Export Berhasil",
        text: "File berhasil diunduh dan siap dibuka di Excel.",
      });
    } catch (error) {
      console.error("Download error:", error);
      Swal.fire({
        icon: "error",
        title: "Export Gagal",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat mengunduh file.",
      });
    } finally {
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
          setMode("add");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {mode === "edit" ? "Edit Selling Out" : "Add Selling Out"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
                await handleSubmitAddStock(e);
            }}
          >
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Customer
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
            <div className="row">
              {getCategories?.map((item) => (
                <div key={item.id} className="mb-3 col-md-6">
                  <label htmlFor={`category-${item.id}`} className="form-label">
                    {item.nama}
                  </label>
                  <input
                    type="number"
                    id={`category-${item.id}`}
                    className="form-control"
                    value={
                      selectedValue.find((v) => v.category_id === item.id)
                        ?.value || ""
                    }
                    onChange={(e) => handleChange(item.id, e.target.value)}
                    placeholder={`Enter Value`}
                  />
                </div>
              ))}
            </div>

            {/* <div className="mb-3">
              <label htmlFor="value" className="form-label">
                Value
              </label>
              <input
                type="number"
                id="value"
                className="form-control"
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
                placeholder="Masukkan Value"
              />
            </div> */}

            <Button variant="primary" type="submit">
              {mode === "edit" ? "Update Selling Out" : "Add Selling Out"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <div className="col-lg-12">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="card-title mb-0">Selling Out</h5>
          </div>
          <div className="card-body body-selling">
            <div className="d-flex justify-content-between mb-3 header-selling">
              <div>
                <label className="me-2 show">Show</label>
                <Select
                  options={[
                    { value: 10, label: "10" },
                    { value: 20, label: "20" },
                    { value: 50, label: "50" },
                  ]}
                  onChange={(selectedOption) => {
                    setPerPage(Number(selectedOption.value));
                  }}
                  classNamePrefix="select-selling"
                  defaultValue={{ value: perPage, label: `${perPage}` }}
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
                  <div>
                        <button
                      className="btn btn-success button-fiture-inventory d-flex align-items-center justify-content-center export"
                      onClick={() => {
                        handleDownload(
                          search,
                          type
                        );
                      }}
                    >
                      <Icon icon={"mdi:file-export-outline"} fontSize={24} className="icon"/>
                    </button>
                  </div>
                )}
                <button
                  className="btn btn-secondary d-flex align-items-center justify-content-center filter"
                  onClick={() => {
                    filter ? setFilter(false) : setFilter(true);
                  }}
                >
                  <Icon icon="line-md:filter" fontSize={24} className="icon" />
                </button>
                <button
                  onClick={() => {
                    setMode("add");
                    setShowClick(true);
                  }}
                  className="btn btn-outline-primary w-50 d-flex align-items-center justify-content-center create"
                >
                  <Icon icon="zondicons:add-outline" fontSize={24} />
                </button>
              </div>
            </div>

            {/* filter */}
            {filter && (
              <>
                <div className="d-flex justify-content-between align-items-center my-3">
                  <div className="d-flex justify-content-center w-100 me-1">
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      isClearable
                      className="filter-stock"
                      loadOptions={getCompany}
                      value={selectedCompany}
                      onChange={(option) =>
                        setSelectectedCompany(option)
                      }
                      placeholder="Pilih Company"
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
                    {getCategories?.map((item) => (
                      <th key={item.id}>{item.nama}</th>
                    ))}
                    <th id="action">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((item, index) => (
                      <tr key={item.id}>
                        <td>{indexOfFirstRow + index + 1}</td>
                        <td>{item.customer_name ?? "-"}</td>
                        {getCategories?.map((cat, index) => (
                          <td key={index}>
                            {item.total_values?.[index] ?? "-"}
                          </td>
                        ))}
                        <td className="d-flex justify-content-center">
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(item)}
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
                Showing {indexOfFirstRow + 1} to {pageTo} of {totalPage} entries
              </span>

              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => {
                        setLoading(true);
                        setPage(page - 1);
                      }}
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
                        onClick={() => {
                          setLoading(true);
                          pageNumber !== "..." ? setPage(pageNumber) : null;
                        }}
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
                      onClick={() => {
                        setLoading(true);
                        setPage(page + 1);
                      }}
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

export default SellingOutTable;
