"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

import { useEffect, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SideMenu = ({ dActiveTable }) => {
  const params = useParams();
  const slug = params?.slug;
  const [tableList, setTableList] = useState([]);

  const [isLoadingTableList, setIsLoadingTableList] = useState(true);

  useEffect(() => {
    fetchTable();
  }, []);

  const fetchTable = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URI}/tables`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setTableList(res.data.tables);
      setIsLoadingTableList(false);
    } catch (error) {
    } finally {
      // setLoading(false);
    }
  };

  const [activeTable, setActiveTable] = useState(slug);

  return (
    <div className="card h-100 p-0 m-70">
      <div className="card-body p-3 ">
        <Link
          to="/table"
          className="btn btn-primary text-sm btn-sm w-100 radius-8 d-flex align-items-center gap-2 mb-16"
          onClick={() => console.log("asd")}
        >
          <Icon
            icon="fa6-regular:square-plus"
            className="icon text-lg line-height-1"
          />
          Create New Table
        </Link>
        <div className="mt-16">
          <div className="overflow-y-auto">
            {!isLoadingTableList ? (
              <ul>
                {tableList.map((v, i) => (
                  <li
                    key={i}
                    className={`item-${
                      slug == v.content.db_table_name
                        ? "active"
                        : "inactive"
                    } mb-4`}
                  >
                    <Link
                      to={`/table/${v.content.db_table_name}`}
                      className="bg-hover-primary-50 px-12 py-8 w-100 radius-8 text-secondary-light"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title={v.content.db_table_name}
                    >
                      <span className="d-flex align-items-center gap-10 justify-content-between w-100">
                        <span className="d-flex align-items-center gap-10">
                          <span className="icon text-xxl line-height-1 d-flex">
                            <Icon
                              icon="uil:database"
                              className="icon line-height-1"
                            />
                          </span>
                          <span className="fw-semibold">
                            {v.content.db_table_name.substring(0, 19)}
                          </span>
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ width: "100%" }}>
                <Skeleton
                  count={5}
                  height={30}
                  width={190}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
