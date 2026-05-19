import MasterLayout from "../../masterLayout/MasterLayout";
import { Breadcrumb } from "react-bootstrap";
import AddUserLayer from "../../components/AddUserLayer";
import AssignRoleLayer from "../../components/AssignRoleLayer";
import { useState } from "react";

const UserManagementPage = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUserCreated = () => {
    setActiveTab("list");
    setRefreshKey((k) => k + 1);
  };

  return (
    <MasterLayout>
      <Breadcrumb title="Master - User Management" />
      <div className="card p-0 radius-12 mb-24">
        <div className="card-header border-bottom bg-base py-16 px-24">
          <ul className="nav nav-tabs border-0 gap-2">
            <li className="nav-item">
              <button
                className={`nav-link px-20 py-10 radius-8 ${activeTab === "list" ? "active bg-primary-600 text-white" : "bg-neutral-100"}`}
                onClick={() => setActiveTab("list")}
              >
                Daftar User
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link px-20 py-10 radius-8 ${activeTab === "add" ? "active bg-primary-600 text-white" : "bg-neutral-100"}`}
                onClick={() => setActiveTab("add")}
              >
                + Tambah User
              </button>
            </li>
          </ul>
        </div>
      </div>

      {activeTab === "list" && <AssignRoleLayer key={refreshKey} />}
      {activeTab === "add" && <AddUserLayer onSuccess={handleUserCreated} />}
    </MasterLayout>
  );
};

export default UserManagementPage;
