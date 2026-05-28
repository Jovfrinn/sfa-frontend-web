import Breadcrumb from "../../../components/Breadcrumb";
import MasterLayout from "../../../masterLayout/MasterLayout";
import UserForm from "../../../components/user/UserForm";
import { useParams } from "react-router-dom";

const EditUserPage = () => {
  const { id } = useParams();
  
  return (
    <>
      <MasterLayout>
        <Breadcrumb title='Settings - Edit User' />
        <UserForm mode="edit" userId={id} />
      </MasterLayout>
    </>
  );
};

export default EditUserPage;
