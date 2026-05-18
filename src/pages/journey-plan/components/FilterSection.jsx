import { Filter } from "lucide-react";
import { Icon } from "@iconify/react";
import Select from "react-select";
import AsyncSelect from "react-select/async";

const FilterSection = ({
  filters,
  showFilter,
  onToggleFilter,
  onFilterChange,
  onApplyFilters,
  loadCompanyOptions,
  loadSalesmanOptions,
}) => {
  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-header bg-white border-bottom">
        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between">
          <h5 className="card-title mb-0">Filter</h5>
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={onToggleFilter}
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
                onChange={(value) => onFilterChange("company_id", value)}
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
                onChange={(value) => onFilterChange("salesman", value)}
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
                  onFilterChange("status", value);
                  onApplyFilters();
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
                onChange={(e) => onFilterChange("start_date", e.target.value)}
                className="form-control"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small">Sampai Tanggal</label>
              <input
                type="date"
                value={filters.end_date}
                min={filters.start_date}
                onChange={(e) => onFilterChange("end_date", e.target.value)}
                className="form-control"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;