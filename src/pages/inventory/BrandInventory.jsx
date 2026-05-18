// import { useState } from "react";
import { Breadcrumb } from "react-bootstrap";
import MasterLayout from "../../masterLayout/MasterLayout";
import BrandTable from "../../components/inventory/BrandTable";
// import InventoryTable from "../../components/inventory/InventoryBe";
// import FitureInventory from "../../components/inventory/FitureInventory";

const BrandInventory = () => {
  
  return (
    <>
      <MasterLayout>
        <Breadcrumb title='Brand - Inventory' />

        <BrandTable />
      </MasterLayout>
    </>
  );
};

export default BrandInventory;