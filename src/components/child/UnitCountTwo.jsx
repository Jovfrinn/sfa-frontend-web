"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
// import { data } from "isotope-layout";
import { useEffect, useState } from "react";
// import useReactApexChart from "../../hook/useReactApexChart";

const UnitCountTwo = ({ company }) => {
  const api = import.meta.env.VITE_API_URI;
  const token = localStorage.getItem("token");
  const [CurrentData, setCurrentData] = useState([]);

  const fetchData = async (
    company = ''
  ) => {
    try {
      const res = await axios.get(`${api}/dashboard?company_id=${company}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      // console.log(res.data);
      
      setCurrentData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  

  useEffect(() => {
   fetchData();
  }, [])

  useEffect(() => {
   fetchData(company);
  }, [company])

  
  // let { createChart } = useReactApexChart();

  return (
    <div className='col-xxl-12'>
      <div className='row gy-4'>
        <div className='col-xxl-3 col-sm-6'>
          <div className="card-dashboard" style={{ backgroundColor: "#a1caff43"}}>
            <div className="icon-dashboard" style={{ backgroundColor: "#4C99FF"}}>
                  <Icon icon="mdi:user" fontSize={28}/>
            </div>
            <div className="title-card">
            <div className="sub-title">
              Total User
            </div>
              <div className="title">
                {CurrentData.totalUser}
              </div>
            </div>
          </div>
        </div>
        <div className='col-xxl-3 col-sm-6'>
          <div className="card-dashboard" style={{ backgroundColor: "#c4ffcc52"}}>
            <div className="icon-dashboard" style={{ backgroundColor: "#00bf1a"}}>
                  <Icon icon="mingcute:user-add-fill" fontSize={23}/>
            </div>
            <div className="title-card">
            <div className="sub-title">
              Total Customer
            </div>
              <div className="title">
                {CurrentData.totalCustomer}
              </div>
            </div>
          </div>
        </div>
        <div className='col-xxl-3 col-sm-6'>
          <div className="card-dashboard" style={{ backgroundColor: "#fce3a567"}}>
            <div className="icon-dashboard" style={{backgroundColor: "#E9A600"}}>
                  <Icon icon="icon-park-solid:view-list" fontSize={28}/>
            </div>
            <div className="title-card">
            <div className="sub-title">
              Today Visit
            </div>
              <div className="title">
                {CurrentData.todayVisit}
              </div>
               {CurrentData.increaseVisit < 0 ? (
                  <span className='px-1 rounded-2 increase fw-medium text-danger-main text-sm'>
                    {CurrentData.increaseVisit} less than yesterday
                  </span>
                ) : (<span className=' rounded-2 increase fw-medium text-success-main text-sm'>
                    +{CurrentData.increaseVisit} more than yesterday
                  </span>)}
            </div>
          </div>
        </div>
        <div className='col-xxl-3 col-sm-6'>
          <div className="card-dashboard" style={{backgroundColor: "#ffc4f164"}}>
            <div className="icon-dashboard" style={{backgroundColor: "#D100A0"}}>
                  <Icon icon="fluent-mdl2:waitlist-confirm" fontSize={28}/>
            </div>
            <div className="title-card">
            <div className="sub-title">
              Today PO
            </div>
              <div className="title">
                {CurrentData.todayPO}
              </div>
             {CurrentData.increasePO < 0 ? (
                  <span className='px-1 rounded-2 increase fw-medium text-danger-main text-sm'>
                    {CurrentData.increasePO} less than yesterday
                  </span>
                ) : (<span className='px-1 rounded-2 increase fw-medium text-success-main text-sm'>
                    +{CurrentData.increasePO} more than yesterday
                  </span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitCountTwo;
