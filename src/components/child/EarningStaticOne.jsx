import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import ReactApexChart from "react-apexcharts";
// import useReactApexChart from "../../hook/useReactApexChart";
import axios from "axios";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import BarChart from "../chart/chart";

const EarningStaticOne = ({ onUpdateData }) => {
  const [CurrentData, setCurrentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const CACHE_EXPIRY_TIME = 300000;

  const months = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" },
  ];

  const now = new Date();
  const currentMonth = months.find((m) => m.value === now.getMonth() + 1);

  const currentYear = now.getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => {
    const year = currentYear - i;
    return { value: year, label: year.toString() };
  });

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState({
    value: currentYear,
    label: currentYear.toString(),
  });
  const [selectedCompany, setSelectedCompany] = useState(null);

  const api = import.meta.env.VITE_API_URI;
  const token = localStorage.getItem("token");

  useEffect(() => {
    let company_id = selectedCompany?.value;
    let month = selectedMonth?.value;
    let year = selectedYear?.value;
    fetchChartData(company_id, month, year);
  }, [selectedCompany, selectedMonth, selectedYear]);

  useEffect(() => {
    onUpdateData(selectedCompany?.value)
  }, [selectedCompany])

  const fetchChartData = async (company_id = null, month = "", year = "") => {
    try {
      setLoading(true);

      const cacheKey = `chart_${company_id || "all"}_${month || "all"}_${
        year || "all"
      }`;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        try {
          const cachedData = JSON.parse(cached);
          const currentTime = Date.now();

          if (currentTime - cachedData.timestamp < CACHE_EXPIRY_TIME) {
            setCurrentData(cachedData.value);
            setLoading(false);
            return;
          } else {
            localStorage.removeItem(cacheKey);
          }
        } catch (e) {
          console.log(e);
          localStorage.removeItem(cacheKey);
        }
      }

      const response = await axios.get(`${api}/dashboard/monthly`, {
        params: { company_id, month, year },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.data;
      setCurrentData(data);

      const dataToCache = {
        value: data,
        timestamp: Date.now(),
      };

      localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
    } catch (err) {
      console.error("Gagal mengambil data chart:", err);
    } finally {
      setLoading(false);
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

  // let { barChartSeriesTwo, barChartOptionsTwo } =
  //   useReactApexChart(CurrentData);
  // // if (loading) return <p>Loading chart...</p>;

  //   const styles = {
  //   control: (base, state) => ({
  //     ...base,
  //     borderColor: state.isFocused ? "dodgerblue" : "#ccc",
  //     boxShadow: state.isFocused ? "0 0 5px dodgerblue" : "none",
  //   }),
  // };

  return (
    <div className="col-xxl-12 row my-5 mx-auto">
      {/* <div className="col-md-6">


      </div> */}
      <div className="card h-100 radius-8 border-0 col-12">
        <div className="card-body p-24">
          <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between header-earning">
            <div>
              <h6 className="mb-2 fw-bold summary-dashboard">Summary Visit</h6>
              <span className="fw-medium text-secondary-light monthly-dasboard">
                Monthly Report
              </span>
            </div>
            <div className="d-flex align-items-center gap-2 select-dashboard">
              <div>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  isClearable
                  loadOptions={getCompany}
                  value={selectedCompany}
                  onChange={(option) => setSelectedCompany(option)}
                  placeholder="Select Company"
                  className="filter-stock select-chart"
                  classNamePrefix="select-chart"
                />
              </div>
              <div>
                <Select
                  options={months}
                  onChange={setSelectedMonth}
                  value={selectedMonth}
                  placeholder="Select Month"
                  className="select-chart"
                  classNamePrefix="select-chart"
                />
              </div>
              <div>
                <Select
                  options={years}
                  onChange={setSelectedYear}
                  value={selectedYear}
                  placeholder="Select Year"
                  className="select-year"
                  classNamePrefix="select-year"
                />
              </div>
            </div>
          </div>
          <div id="barChart">
            {loading == false ? (
              // <ReactApexChart
              //   options={barChartOptionsTwo}
              //   series={barChartSeriesTwo}
              //   type="bar"
              //   height={310}
              // />
              <BarChart monthlyData={CurrentData} />
            ) : (
              <div className="loading-chart">Loading Chart...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningStaticOne;
