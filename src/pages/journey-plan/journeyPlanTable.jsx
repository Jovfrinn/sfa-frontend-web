import { useState, useEffect } from "react";
import {
  Calendar,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  RefreshCw,
  Check,
  X,
  Eye,
} from "lucide-react";
import { Icon } from "@iconify/react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Swal from "sweetalert2";
import MasterLayout from "../../masterLayout/MasterLayout";
import axios from "axios";

const JourneyPlanTable = () => {
  const api = import.meta.env.VITE_API_URI;
  const token = localStorage.getItem("token");

  // State management - Data & Loading
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    completed: 0,
  });

  const getMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Fungsi pembantu untuk format YYYY-MM-DD sesuai waktu lokal
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    return {
      start_date: formatDate(start),
      end_date: formatDate(end),
    };
  };

  // State management - Filters
  const [filters, setFilters] = useState(() => ({
    company_id: null,
    salesman: null,
    status: null,
    ...getMonthRange(),
  }));

  console.log("getMonthRange", filters);
  const [showFilter, setShowFilter] = useState(false);

  // State management - Table
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    perPage: 10,
    total: 0,
    last_page: 1,
  });

  // State management - Selection
  const [selectedIds, setSelectedIds] = useState([]);

  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [targetDaily, setTargetDaily] = useState(8);

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "completed", label: "Completed" },
  ];

  const fetchJourneyPlans = async () => {
    try {
      setIsLoading(true);

      const params = {
        page: currentPage,
        user_id: filters.salesman?.value || undefined,
        status: filters.status?.value || undefined,
        company_id: filters.company_id?.value || undefined,
        start_date: filters.start_date || undefined,
        end_date: filters.end_date || undefined,
      };

      Object.keys(params).forEach(
        (key) => params[key] === undefined && delete params[key],
      );

      const response = await axios.get(`${api}/journey-plan`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      setData(response.data.data || []);

      if (response.data.meta) {
        setPagination(response.data.meta);
      }

      setSelectedIds([]);
    } catch (error) {
      console.error("Error fetching journey plans:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: error.response?.data?.message || "Gagal memuat data journey plan",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const params = {
        start_date: filters.start_date || undefined,
        end_date: filters.end_date || undefined,
      };

      Object.keys(params).forEach(
        (key) => params[key] === undefined && delete params[key],
      );

      const response = await axios.get(`${api}/journey-plan/stats`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const loadSalesmanOptions = async (inputValue) => {
    try {
      const response = await axios.get(`${api}/journey-plan/salesmen`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: inputValue },
      });
      console.log("Salesman options response:", response.data);

      return response.data.data || [];
    } catch (error) {
      console.error("Error loading salesman:", error);
      return [];
    }
  };

  const loadCompanyOptions = async (inputValue) => {
    try {
      const response = await axios.get(`${api}/journey-plan/companies`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: inputValue },
      });

      return response.data.data || [];
    } catch (error) {
      console.error("Error loading companies:", error);
      return [];
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const statusText = newStatus === "approved" ? "menyetujui" : "menolak";
      const statusColor = newStatus === "approved" ? "#3085d6" : "#d33";

      const result = await Swal.fire({
        title: "Konfirmasi",
        text: `Apakah Anda yakin ingin ${statusText} journey plan ini?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: statusColor,
        cancelButtonColor: "#6c757d",
        confirmButtonText: `Ya, ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}!`,
        cancelButtonText: "Batal",
      });

      if (!result.isConfirmed) return;

      Swal.fire({
        title: "Memproses...",
        text: "Mohon tunggu sebentar",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await axios.patch(
        `${api}/journey-plan/${id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: `Journey plan berhasil di${statusText}`,
        timer: 2000,
        showConfirmButton: false,
      });

      fetchJourneyPlans();
      fetchStats();
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error.response?.data?.message ||
          "Gagal mengubah status. Silakan coba lagi.",
        confirmButtonColor: "#d33",
      });
    }
  };

  // Bulk update status
  const bulkUpdateStatus = async (newStatus) => {
    if (selectedIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Silakan pilih minimal satu journey plan",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      const statusText = newStatus === "approved" ? "menyetujui" : "menolak";
      const statusColor = newStatus === "approved" ? "#3085d6" : "#d33";

      const result = await Swal.fire({
        title: "Konfirmasi",
        text: `Apakah Anda yakin ingin ${statusText} ${selectedIds.length} journey plan yang dipilih?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: statusColor,
        cancelButtonColor: "#6c757d",
        confirmButtonText: `Ya, ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}!`,
        cancelButtonText: "Batal",
      });

      if (!result.isConfirmed) return;

      Swal.fire({
        title: "Memproses...",
        text: "Mohon tunggu sebentar",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Process all selected items
      const updatePromises = selectedIds.map((id) =>
        axios.patch(
          `${api}/journey-plan/${id}/status`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } },
        ),
      );

      await Promise.all(updatePromises);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: `${selectedIds.length} journey plan berhasil di${statusText}`,
        timer: 2000,
        showConfirmButton: false,
      });

      setSelectedIds([]);
      fetchJourneyPlans();
      fetchStats();
    } catch (error) {
      console.error("Error bulk updating status:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error.response?.data?.message ||
          "Gagal mengubah status. Silakan coba lagi.",
        confirmButtonColor: "#d33",
      });
    }
  };

  // Save target
  const saveTarget = async () => {
    try {
      setShowTargetModal(false);
      Swal.fire({
        icon: "success",
        title: "Target Disimpan!",
        text: "Target perusahaan berhasil disimpan",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error saving target:", error);
    }
  };

  // View detail
  const viewDetail = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  // Export Excel Function
  const handleDownloadExport = async () => {
    try {
      setIsLoading(true);

      // Show loading alert
      Swal.fire({
        title: "Mengunduh...",
        text: "Mohon tunggu, sedang memproses export data",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Prepare params with current filters
      const params = {
        company_id: filters.company_id?.value || undefined,
        user_id: filters.salesman?.value || undefined,
        status: filters.status?.value || undefined,
        start_date: filters.start_date || undefined,
        end_date: filters.end_date || undefined,
      };

      // Remove undefined params
      Object.keys(params).forEach(
        (key) => params[key] === undefined && delete params[key],
      );

      const response = await axios({
        url: `${api}/journey-plan/export`,
        method: "GET",
        params: params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Generate filename with current date
      const today = new Date().toISOString().slice(0, 10);
      const filename = `journey-plan-export-${today}.xlsx`;

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);

      // Success message
      Swal.fire({
        icon: "success",
        title: "Export Berhasil!",
        text: "Data journey plan berhasil diexport",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      Swal.fire({
        icon: "error",
        title: "Export Gagal",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat mengunduh file",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== Selection Functions ====================

  // Get all pending items on current page
  const getPendingItems = () => {
    return data.filter((item) => item.status === "pending");
  };

  // Handle select all checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const pendingIds = getPendingItems().map((item) => item.id);
      setSelectedIds(pendingIds);
    } else {
      setSelectedIds([]);
    }
  };

  // Handle single checkbox
  const handleSelectOne = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((selectedId) => selectedId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Check if all pending items are selected
  const isAllSelected = () => {
    const pendingItems = getPendingItems();
    return (
      pendingItems.length > 0 &&
      pendingItems.every((item) => selectedIds.includes(item.id))
    );
  };

  // Check if some (but not all) pending items are selected
  const isSomeSelected = () => {
    const pendingItems = getPendingItems();
    return (
      selectedIds.length > 0 &&
      !isAllSelected() &&
      pendingItems.some((item) => selectedIds.includes(item.id))
    );
  };

  // ==================== Helper Functions ====================

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      let updated = { ...prev, [key]: value };

      if (key === "start_date" && value > prev.end_date) {
        updated.end_date = value;
      }

      if (key === "end_date" && value < prev.start_date) {
        updated.start_date = value;
      }

      return updated;
    });

    setCurrentPage(1);
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchJourneyPlans();
    fetchStats();
  };

  useEffect(() => {
    fetchJourneyPlans();
    fetchStats();
  }, [currentPage, perPage, filters]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search !== undefined) {
        setCurrentPage(1);
        fetchJourneyPlans();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { color: "bg-warning text-dark", text: "Pending" },
      approved: { color: "bg-primary text-white", text: "Approved" },
      rejected: { color: "bg-danger text-white", text: "Rejected" },
      completed: { color: "bg-success text-white", text: "Completed" },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return <span className={`badge ${config.color}`}>{config.text}</span>;
  };

  // Action buttons component
  const ActionButtons = ({ item }) => {
    if (item.status !== "pending") return "-";
    return (
      <div className="d-flex gap-1 justify-content-center">
        <OverlayTrigger placement="top" overlay={<Tooltip>Approve</Tooltip>}>
          <button
            onClick={() => updateStatus(item.id, "approved")}
            className="btn btn-sm btn-success"
          >
            <Check size={16} />
          </button>
        </OverlayTrigger>

        <OverlayTrigger placement="top" overlay={<Tooltip>Reject</Tooltip>}>
          <button
            onClick={() => updateStatus(item.id, "rejected")}
            className="btn btn-sm btn-danger"
          >
            <X size={16} />
          </button>
        </OverlayTrigger>
      </div>
    );
  };

  const renderTooltip = (text) => (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {text}
    </Tooltip>
  );

  return (
    <MasterLayout>
      <div className="min-vh-100 p-4">
        <div className="container-fluid" style={{ maxWidth: "1400px" }}>
          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm">
                <div
                  className="card-body"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowTargetModal(true)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted small mb-1">Daily Target</p>
                      <h2 className="fw-bold mb-0 fs-1">{targetDaily}</h2>
                      <small className="text-muted">
                        Target kunjungan per hari
                      </small>
                    </div>
                    <Clock className="text-secondary" size={32} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted small mb-1">Pending</p>
                      <h2 className="fw-bold text-warning mb-0">
                        {stats.pending}
                      </h2>
                    </div>
                    <Clock className="text-warning" size={32} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted small mb-1">Approved</p>
                      <h2 className="fw-bold text-info mb-0">
                        {stats.approved}
                      </h2>
                    </div>
                    <CheckCircle className="text-info" size={32} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted small mb-1">Completed</p>
                      <h2 className="fw-bold text-success mb-0">
                        {stats.completed}
                      </h2>
                    </div>
                    <TrendingUp className="text-success" size={32} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Card */}
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-header bg-white border-bottom">
              <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between">
                <h5 className="card-title mb-0">Filter</h5>
                <div className="d-flex align-items-center gap-2">
                  {showFilter && (
                    <OverlayTrigger
                      placement="top"
                      overlay={renderTooltip("Export Data")}
                    >
                      <button
                        className="btn btn-success d-flex align-items-center justify-content-center"
                        onClick={handleDownloadExport}
                        disabled={isLoading}
                      >
                        <Icon icon="mdi:file-export-outline" fontSize={22} />
                      </button>
                    </OverlayTrigger>
                  )}
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className={`btn btn-sm py-15 px-3 ${showFilter ? "btn-primary" : "btn-outline-secondary"}`}
                  >
                    <Filter size={18} />
                  </button>
                  <button className="btn btn-outline-primary btn-sm px-3">
                    <Icon icon="zondicons:add-outline" fontSize={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Form */}
            {showFilter && (
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label small">Company</label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={loadCompanyOptions}
                      value={filters.company_id}
                      onChange={(value) => {
                        handleFilterChange("company_id", value);
                      }}
                      placeholder="Pilih Company"
                      isClearable
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small">Salesman</label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={loadSalesmanOptions}
                      value={filters.salesman}
                      onChange={(value) => {
                        handleFilterChange("salesman", value);
                      }}
                      placeholder="Pilih Salesman"
                      isClearable
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small">Status</label>
                    <Select
                      options={statusOptions}
                      value={filters.status}
                      onChange={(value) => {
                        handleFilterChange("status", value);
                        fetchJourneyPlans();
                        fetchStats();
                      }}
                      placeholder="Pilih Status"
                      isClearable
                    />
                  </div>
                </div>

                <div className="row g-3 mt-0">
                  <div className="col-md-6">
                    <label className="form-label small">Dari Tanggal</label>
                    <input
                      type="date"
                      value={filters.start_date}
                      onChange={(e) =>
                        handleFilterChange("start_date", e.target.value)
                      }
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small">Sampai Tanggal</label>
                    <input
                      type="date"
                      value={filters.end_date}
                      min={filters.start_date}
                      onChange={(e) =>
                        handleFilterChange("end_date", e.target.value)
                      }
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Table Card */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom">
              <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between">
                <h5 className="card-title mb-0">Journey Plan</h5>

                <div className="d-flex align-items-center gap-2">
                  <div className="d-flex align-items-center navbar-search">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{ width: "250px" }}
                    />
                    <Icon icon="ion:search-outline" className="icon" />
                  </div>
                  <Select
                    options={[
                      { value: 10, label: "10" },
                      { value: 20, label: "20" },
                      { value: 50, label: "50" },
                    ]}
                    onChange={(opt) => setPerPage(Number(opt.value))}
                    defaultValue={{ value: perPage, label: `${perPage}` }}
                    styles={{
                      container: (base) => ({ ...base, width: "80px" }),
                    }}
                  />
                  <span className="small">Show</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="card-body">
              <div className="table-responsive">
                {isLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-3">Loading data...</p>
                  </div>
                ) : data.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted">Tidak ada data journey plan</p>
                  </div>
                ) : (
                  <>
                    <table className="table basic-border-table align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th
                            style={{
                              width: "60px",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isAllSelected()}
                                ref={(input) => {
                                  if (input) {
                                    input.indeterminate = isSomeSelected();
                                  }
                                }}
                                onChange={handleSelectAll}
                                disabled={getPendingItems().length === 0}
                                className="form-check-input m-0"
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  cursor:
                                    getPendingItems().length === 0
                                      ? "not-allowed"
                                      : "pointer",
                                }}
                              />
                            </div>
                          </th>
                          <th className="text-uppercase small fw-semibold">
                            Company
                          </th>
                          <th className="text-uppercase small fw-semibold">
                            Salesman
                          </th>
                          <th className="text-uppercase small fw-semibold">
                            Outlet
                          </th>
                          <th className="text-uppercase small fw-semibold">
                            Alamat
                          </th>
                          <th className="text-uppercase small fw-semibold">
                            Tanggal
                          </th>
                          <th className="text-uppercase small fw-semibold">
                            Status
                          </th>
                          <th className="text-uppercase small fw-semibold">
                            Tap In/Out
                          </th>
                          <th className="text-uppercase small fw-semibold text-center">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((item) => (
                          <tr key={item.id}>
                            <td
                              style={{
                                textAlign: "center",
                                verticalAlign: "middle",
                              }}
                            >
                              {item.status === "pending" ? (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedIds.includes(item.id)}
                                    onChange={() => handleSelectOne(item.id)}
                                    className="form-check-input m-0"
                                    style={{
                                      width: "20px",
                                      height: "20px",
                                      cursor: "pointer",
                                    }}
                                  />
                                </div>
                              ) : (
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "4px",
                                    backgroundColor: "#e9ecef",
                                    border: "2px solid #dee2e6",
                                  }}
                                ></span>
                              )}
                            </td>
                            <td>{item.user?.company?.name || "-"}</td>
                            <td>{item.user?.full_name || "-"}</td>
                            <td>{item.customer?.name || "-"}</td>
                            <td
                              className="text-truncate"
                              style={{ maxWidth: 300 }}
                            >
                              {item.customer?.alamat || "-"}
                            </td>
                            <td>
                              {new Date(
                                item.planned_visit_date,
                              ).toLocaleDateString("id-ID")}
                            </td>
                            <td>
                              <StatusBadge status={item.status} />
                            </td>
                            <td>
                              {item.tap_in ? (
                                <>
                                  <div className="text-success small">
                                    In:{" "}
                                    {new Date(
                                      item.tap_in.tap_in_time,
                                    ).toLocaleTimeString("id-ID", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    })}
                                  </div>
                                  <div className="text-danger small">
                                    Out:{" "}
                                    {new Date(
                                      item.tap_in.tap_out_time,
                                    ).toLocaleTimeString("id-ID", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    })}
                                  </div>
                                </>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>
                              <ActionButtons item={item} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>

              {/* Pagination */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-muted small">
                  Showing{" "}
                  {(pagination.current_page - 1) * pagination.perPage + 1} to{" "}
                  {Math.min(
                    pagination.current_page * pagination.perPage,
                    pagination.total,
                  )}{" "}
                  of {pagination.total} entries
                </div>
                <nav>
                  <ul className="pagination pagination-sm mb-0">
                    <li
                      className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                      >
                        Previous
                      </button>
                    </li>
                    {[...Array(Math.min(pagination.last_page, 5))].map(
                      (_, idx) => {
                        const pageNum = idx + 1;
                        return (
                          <li
                            key={idx}
                            className={`page-item ${currentPage === pageNum ? "active" : ""}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </button>
                          </li>
                        );
                      },
                    )}
                    <li
                      className={`page-item ${currentPage === pagination.last_page ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(pagination.last_page, prev + 1),
                          )
                        }
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

            {/* Bulk Action Buttons */}
            {selectedIds.length > 0 && (
              <div
                className="card-body border-bottom"
                style={{ backgroundColor: "#f8f9fa", padding: "12px 20px" }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <span className="text-muted" style={{ fontSize: "14px" }}>
                    <strong>{selectedIds.length}</strong> item dipilih
                  </span>
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => bulkUpdateStatus("approved")}
                      className="btn btn-success btn-sm"
                      style={{ minWidth: "100px", fontSize: "13px" }}
                    >
                      <Check size={16} className="me-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => bulkUpdateStatus("rejected")}
                      className="btn btn-danger btn-sm"
                      style={{ minWidth: "100px", fontSize: "13px" }}
                    >
                      <X size={16} className="me-1" />
                      Reject
                    </button>
                    <button
                      onClick={() => setSelectedIds([])}
                      className="btn btn-outline-secondary btn-sm"
                      style={{ fontSize: "13px" }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Detail Modal */}
          {showDetailModal && selectedItem && (
            <>
              <div className="modal show d-block" tabIndex="-1">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Detail Journey Plan</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowDetailModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="small text-muted">Company</label>
                          <p className="fw-semibold">
                            {selectedItem.user?.company?.name || "-"}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <label className="small text-muted">Salesman</label>
                          <p className="fw-semibold">
                            {selectedItem.user?.full_name || "-"}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <label className="small text-muted">Outlet</label>
                          <p className="fw-semibold">
                            {selectedItem.customer?.name || "-"}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <label className="small text-muted">
                            Tanggal Rencana
                          </label>
                          <p className="fw-semibold">
                            {new Date(
                              selectedItem.planned_visit_date,
                            ).toLocaleDateString("id-ID")}
                          </p>
                        </div>
                        <div className="col-12">
                          <label className="small text-muted">Alamat</label>
                          <p className="fw-semibold">
                            {selectedItem.customer?.alamat || "-"}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <label className="small text-muted">Status</label>
                          <div>
                            <StatusBadge status={selectedItem.status} />
                          </div>
                        </div>
                        {selectedItem.tap_in && (
                          <>
                            <div className="col-md-6">
                              <label className="small text-muted">Tap In</label>
                              <p className="fw-semibold text-success">
                                {new Date(
                                  selectedItem.tap_in.tap_in_time,
                                ).toLocaleString("id-ID")}
                              </p>
                            </div>
                            <div className="col-md-6">
                              <label className="small text-muted">
                                Tap Out
                              </label>
                              <p className="fw-semibold text-danger">
                                {new Date(
                                  selectedItem.tap_in.tap_out_time,
                                ).toLocaleString("id-ID")}
                              </p>
                            </div>
                            {selectedItem.tap_in.description && (
                              <div className="col-12">
                                <label className="small text-muted">
                                  Keterangan
                                </label>
                                <p className="fw-semibold">
                                  {selectedItem.tap_in.description}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowDetailModal(false)}
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-backdrop show"></div>
            </>
          )}

          {/* Target Modal */}
          {showTargetModal && (
            <>
              <div className="modal show d-block" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Set Target Company</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowTargetModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label">Target Harian</label>
                        <input
                          type="number"
                          value={targetDaily}
                          onChange={(e) =>
                            setTargetDaily(parseInt(e.target.value) || 0)
                          }
                          className="form-control"
                          min="1"
                          placeholder="Masukkan target harian"
                        />
                        <small className="text-muted">
                          Target kunjungan per hari
                        </small>
                      </div>
                      <div className="alert alert-info mb-0">
                        <small>
                          <strong>Info:</strong> Target akan diterapkan untuk
                          semua salesman.
                        </small>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowTargetModal(false)}
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={saveTarget}
                      >
                        Simpan Target
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-backdrop show"></div>
            </>
          )}
        </div>
      </div>
    </MasterLayout>
  );
};

export default JourneyPlanTable;
