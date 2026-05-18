// import { useState } from "react";
import { Breadcrumb } from "react-bootstrap";
import MasterLayout from "../../masterLayout/MasterLayout";
import CompetitorBrandTable from "../../components/competitor-brand/CompetitorBrandTable";

const CompetitorBrand = () => {
  
  return (
    <>
      <MasterLayout>
        <Breadcrumb title='Competitor - Brand' />

        <CompetitorBrandTable
         />
      </MasterLayout>
    </>
  );
};

export default CompetitorBrand;
