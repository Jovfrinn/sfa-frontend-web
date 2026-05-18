// import { useState } from "react";
import { Breadcrumb } from "react-bootstrap";
import MasterLayout from "../../masterLayout/MasterLayout";
import KategoriTable from "../../components/inventory/KategoriTable";

const KategoriInventory = () => {
  
  return (
    <>
      <MasterLayout>
        <Breadcrumb title='Kategori - Inventory' />

        <KategoriTable />
      </MasterLayout>
    </>
  );
};

export default KategoriInventory;
