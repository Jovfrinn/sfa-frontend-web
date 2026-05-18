import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import { Link } from "react-router-dom";

const renderNode = ({ nodeDatum, toggleNode }) => (
  <foreignObject width={350} height={200} x={-185} y={-50}>
    <div
      style={{
        background: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
        width: "350px",
        padding: "12px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
      onClick={toggleNode}
    >
      <div style={{ fontWeight: "700", fontSize: "16px", color: "#2F80ED" }}>
        {nodeDatum.name}
      </div>
      {nodeDatum.attributes?.position && (
        <div style={{ fontSize: "13px", color: "#444", marginTop: "4px" }}>
          {nodeDatum.attributes.position}
        </div>
      )}
      {nodeDatum.attributes?.address && (
        <div
          style={{
            fontSize: "12px",
            color: "#777",
            marginTop: "6px",
            fontStyle: "italic",
          }}
        >
          {nodeDatum.attributes.address}
        </div>
      )}
    </div>
  </foreignObject>
);

export default function CompanyTree() {
  const [translate, setTranslate] = useState({ x: 700, y: 100 });
  const [companyData, setCompanyData] = useState([]);

  useEffect(() => {
    getCompanyTree();
  }, []);

  const getCompanyTree = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URI}/company/tree`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data.data);
      setCompanyData(res.data.data);
    } catch (error) {
      console.error("Error fetching fields:", error);
    }
  };

  return (
    <div className="col-lg-12">
      <div className="card h-100">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0 d-flex align-items-center">
            <Icon icon="mdi:company" className="me-2 menu-icon" />
            Company
          </h5>

          <div>
            <Link
              to={"/master/company"}
              className="btn btn-sm  btn-outline-secondary me-2"
            >
              <Icon icon="mdi:view-list" width="20" height="20" />
            </Link>
            <Link
              to={"/master/company/tree"}
              className="btn btn-sm active btn-outline-secondary"
            >
              <Icon icon="mdi:family-tree" width="20" height="20" />
            </Link>
          </div>
        </div>
        <div className="card-body">
          {console.log(companyData)}
          {companyData.length != 0 ? (
            <Tree
              data={companyData}
              orientation="vertical"
              translate={translate}
              pathFunc="step"
              renderCustomNodeElement={renderNode}
              collapsible={true}
              separation={{ siblings: 2, nonSiblings: 2 }}
              nodeSize={{ x: 180, y: 200 }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
