// import { useState } from "react";
import { Breadcrumb } from "react-bootstrap";
import MasterLayout from "../../masterLayout/MasterLayout";
import StockTable from "../../components/inventory/StockTable";

const StockInventory = () => {
  
  return (
    <>
      <MasterLayout>
        <Breadcrumb title='Stock - Inventory' />

        <StockTable
         />
      </MasterLayout>
    </>
  );
};

export default StockInventory;
