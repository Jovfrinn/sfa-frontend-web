"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom"; 
import axios from "axios";

import { useEffect, useRef, useState } from "react";
import Table from "./table/table";
import SideMenu from "./table/side_menu";
const loadJQueryAndDataTables = async () => {
  const $ = (await import("jquery")).default;
  await import("datatables.net-dt/js/dataTables.dataTables.js");
  return $;
};

const TableLayer = () => {

  const [activeTable, setActiveTable] = useState(1);

  return (
    <div className="row gy-4">
      <div className="col-sm-3">
        <SideMenu />
      </div>
      <div className="col-sm-9">
        <div className="card h-100 p-0 email-card card basic-data-table">
          <div className="card-header border-bottom bg-base py-16 px-24">
            <div className="d-flex gap-2">
              <button className="px-3 py-4 bg-primary text-white rounded fw-semibold">
                <span className="d-flex align-items-center gap-10 justify-content-between w-100">
                  <span className="d-flex align-items-center gap-10">
                    <span className="icon text-xxl line-height-1 d-flex">
                      <Icon
                        icon="material-symbols:format-list-bulleted"
                        className="icon line-height-1"
                      />
                    </span>
                    <span className="fw-semibold">Data</span>
                  </span>
                </span>
              </button>
              <button className="px-3 py-4 bg-light text-secondary rounded fw-semibold">
                <span className="d-flex align-items-center gap-10 justify-content-between w-100">
                  <span className="d-flex align-items-center gap-10">
                    <span className="icon text-xxl line-height-1 d-flex">
                      <Icon
                        icon="material-symbols:account-tree-outline"
                        className="icon line-height-1"
                      />
                    </span>
                    <span className="fw-semibold">Structure</span>
                  </span>
                </span>
              </button>
              <button className="px-3 py-4 bg-light text-secondary rounded fw-semibold">
                <span className="d-flex align-items-center gap-10 justify-content-between w-100">
                  <span className="d-flex align-items-center gap-10">
                    <span className="icon text-xxl line-height-1 d-flex">
                      <Icon
                        icon="mdi:database-import-outline"
                        className="icon line-height-1"
                      />
                    </span>
                    <span className="fw-semibold">Import</span>
                  </span>
                </span>
              </button>
            </div>
          </div>
          <div className="card-body">
            <Table />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableLayer;
