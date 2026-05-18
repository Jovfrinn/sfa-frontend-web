import { Breadcrumb } from "react-bootstrap";
import MasterLayout from "../../masterLayout/MasterLayout";
import CustomerTable from "../../components/customer/CustomerTable";
import { Outlet } from "react-router-dom";

const Customer = () => {
  return (
    <>
      <MasterLayout>
        <Breadcrumb title="Master - Customer" />
        <Outlet />
      </MasterLayout>
    </>
  );
};

export default Customer;
