import Breadcrumb from "../../components/Breadcrumb";
import CardHeader from "../../components/table/card_header";
import CreateNewTable from "../../components/table/create_new";
import SideMenu from "../../components/table/side_menu";
import { FieldProvider } from "../../context/FieldContext";
import MasterLayout from "../../masterLayout/MasterLayout";

export const metadata = {
  title: "Table | UNI ERP",
  description: "Table.",
};

const TablePage = () => {
  return (
    <FieldProvider>
      <MasterLayout>
        <Breadcrumb title="Table" />
        <section className="row gy-4">
          <div className="row gy-4">
            <div className="col-xxl-2">
              <SideMenu dActiveTable={null} />
            </div>
            <div className="col-xxl-10">
              <div className="card h-100 p-0 email-card card basic-data-table">
                <div className="card-header border-bottom bg-base py-16 px-24">
                  <CardHeader active={null} />
                </div>
                <div className="card-body">
                  <CreateNewTable />
                </div>
              </div>
            </div>
          </div>
        </section>
      </MasterLayout>
    </FieldProvider>
  );
};

export default TablePage;
