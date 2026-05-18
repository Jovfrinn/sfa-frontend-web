import { Breadcrumb } from "react-bootstrap";
import MasterLayout from "../../masterLayout/MasterLayout";
import CustomerTable from "../../components/customer/CustomerTable";
import { Outlet } from "react-router-dom";

const SellingOut = () => {
  return (
    <>
      <MasterLayout>
        <Breadcrumb title="Market - Size" />
        <Outlet />
      </MasterLayout>
    </>
  );
};

export default SellingOut;
