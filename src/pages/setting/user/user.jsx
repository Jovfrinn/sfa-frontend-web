import Breadcrumb from "../../../components/Breadcrumb";
import MasterLayout from "../../../masterLayout/MasterLayout";
import UserTable from "../../../components/user/UserTable";

const UserPage = () => {
  return (
    <>
      <MasterLayout>
        <Breadcrumb title='Settings - User' />
        <UserTable />
      </MasterLayout>
    </>
  );
};

export default UserPage;
