import Breadcrumb from "../../../components/Breadcrumb";
import MasterLayout from "../../../masterLayout/MasterLayout";
import UserForm from "../../../components/user/UserForm";

const CreateUserPage = () => {
  return (
    <>
      <MasterLayout>
        <Breadcrumb title='Settings - Create User' />
        <UserForm mode="create" />
      </MasterLayout>
    </>
  );
};

export default CreateUserPage;
