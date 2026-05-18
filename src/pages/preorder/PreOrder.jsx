// import { useState } from "react";
import { Breadcrumb } from "react-bootstrap";
import MasterLayout from "../../masterLayout/MasterLayout";
import { PreOrderTable } from "../../components/preorder/PreOrderTable";

const PreOrder = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="Pre - Order" />
      <PreOrderTable />
    </MasterLayout>
  );
};

export default PreOrder;
