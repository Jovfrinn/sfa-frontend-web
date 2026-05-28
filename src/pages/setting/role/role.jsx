import Breadcrumb from "../../../components/Breadcrumb";
import MasterLayout from "../../../masterLayout/MasterLayout";
import RoleTable from "../../../components/role/RoleTable";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";

const Role = () => {
  return (
    <>
      <MasterLayout>
        <Breadcrumb title="Setting - Role" />
        
        <RoleTable />
      </MasterLayout>
    </>
  );
};

export default Role;
