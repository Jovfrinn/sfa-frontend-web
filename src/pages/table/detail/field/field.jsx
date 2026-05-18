import Breadcrumb from "../../../../components/Breadcrumb";
import CardHeader from "../../../../components/table/card_header";
import SideMenu from "../../../../components/table/side_menu";
import Field from "../../../../components/table/field";
import MasterLayout from "../../../../masterLayout/MasterLayout";
import { FieldProvider } from "../../../../context/FieldContext";
import { useParams } from "react-router-dom"; 

const FieldPage = () => {
  const { slug } = useParams(); 
  return (
    <FieldProvider>
      <MasterLayout>
        <Breadcrumb title={slug} />
        <div className="row gy-4">
          <div className="col-sm-2">
            <SideMenu />
          </div>
          <div className="col-sm-10">
            <div className="card h-100 p-0 email-card card basic-data-table">
              <div className="card-header border-bottom bg-base py-16 px-24">
                <CardHeader active="field" />
              </div>
              <div className="card-body">
                <Field />
              </div>
            </div>
          </div>
        </div>
      </MasterLayout>
    </FieldProvider>
  );
};

export default FieldPage;
