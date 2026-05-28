import Breadcrumb from "../../../components/Breadcrumb";
import MasterLayout from "../../../masterLayout/MasterLayout";
import RoleTree from "../../../components/role/RoleTree";

const RoleTreePage = () => {
  return (
    <>
      <MasterLayout>
        <Breadcrumb title='Settings - Role' />
        <RoleTree />
      </MasterLayout>
    </>
  );
};

export default RoleTreePage;
