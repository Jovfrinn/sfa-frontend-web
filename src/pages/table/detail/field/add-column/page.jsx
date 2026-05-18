import Breadcrumb from "@/components/Breadcrumb";
import CardHeader from "@/components/table/card_header";
import CreateNewTable from "@/components/table/create_new";
import SideMenu from "@/components/table/side_menu";
import Table from "@/components/table/table";
import TableLayer from "@/components/TableLayer";
import MasterLayout from "@/masterLayout/MasterLayout";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom"; 

export const metadata = {
  title: "Table | UNI ERP",
  description: "Table.",
};

const Page = () => {
  return (
    <>
      <MasterLayout>
        <Breadcrumb title="Table" />
        <div className="row gy-4">
          <div className="col-sm-2">
            <SideMenu dActiveTable={null} />
          </div>
          <div className="col-sm-10">
            <div className="card h-100 p-0 email-card card basic-data-table">
              <div className="card-header border-bottom bg-base py-16 px-24">
                <CardHeader active="structure" />
              </div>
              <div className="card-body">
                
              </div>
            </div>
          </div>
        </div>
      </MasterLayout>
    </>
  );
};

export default Page;
