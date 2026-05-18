import { Breadcrumb } from "react-bootstrap";
import { useEffect, useState } from "react";
import MasterLayout from "../../../masterLayout/MasterLayout";
import VisitTable from "../../../components/report/VisitTable";


const Visit = () => {



  return (
    <>
      <MasterLayout>
        <Breadcrumb title="Master - Company" />
        <VisitTable />
      </MasterLayout>
    </>
  );
};

export default Visit;
