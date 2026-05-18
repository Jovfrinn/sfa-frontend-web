import { Breadcrumb } from "react-bootstrap";
import MasterLayout from "../../masterLayout/MasterLayout";
import CompanyTable from "../../components/company/CompanyTable";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";


const Company = () => {



  return (
    <>
      <MasterLayout>
        <Breadcrumb title="Master - Company" />
        
        <CompanyTable />
      </MasterLayout>
    </>
  );
};

export default Company;
