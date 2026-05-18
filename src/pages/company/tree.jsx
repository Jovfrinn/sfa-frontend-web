import { Breadcrumb } from "react-bootstrap";
import MasterLayout from "../../masterLayout/MasterLayout";
import TreeChart from "../../components/company/CompanyTree";



const CompanyTree = () => {
  return (
    <>
      <MasterLayout>
        <Breadcrumb title='Settings - Company' />
        <TreeChart />

      </MasterLayout>
    </>
  );
};

export default CompanyTree;
