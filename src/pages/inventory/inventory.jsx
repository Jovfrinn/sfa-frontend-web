import { Breadcrumb } from "react-bootstrap";
import MasterLayout from "../../masterLayout/MasterLayout";
import InventoryTable from "../../components/inventory/InventoryTable";

const Inventory = () => {
  return (
    <>
      <MasterLayout>
        <Breadcrumb title="Master - Inventory" />
        <InventoryTable />
      </MasterLayout>
    </>
  );
};

export default Inventory;
