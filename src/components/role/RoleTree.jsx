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
      {nodeDatum.attributes?.user_count !== undefined && (
        <div style={{ fontSize: "13px", color: "#444", marginTop: "4px" }}>
          User Count: {nodeDatum.attributes.user_count}
        </div>
      )}
    </div>
  </foreignObject>
);

export default function RoleTree() {
  const [translate, setTranslate] = useState({ x: 700, y: 100 });
  const [roleData, setRoleData] = useState(null);

  useEffect(() => {
    getRoleTree();
  }, []);

  const getRoleTree = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URI}/roles`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const roles = res.data.data || [];
      
      let map = {};
      roles.forEach(role => {
        map[role.id] = { 
          name: role.name, 
          attributes: { user_count: role.user_count }, 
          children: [],
          parent_id: role.parent_id
        };
      });
      
      let tree = [];
      roles.forEach(role => {
        if (role.parent_id && map[role.parent_id]) {
           map[role.parent_id].children.push(map[role.id]);
        } else {
           tree.push(map[role.id]);
        }
      });
      
      if (tree.length > 0) {
        if (tree.length === 1) {
          setRoleData(tree[0]);
        } else {
          setRoleData({
            name: "Roles",
            attributes: { user_count: roles.length },
            children: tree
          });
        }
      }
    } catch (error) {
      console.error("Error fetching fields:", error);
    }
  };

  return (
    <div className="col-lg-12">
      <div className="card h-100">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0 d-flex align-items-center">
            <Icon icon="mdi:account-group" className="me-2 menu-icon" />
            Role
          </h5>

          <div>
            <Link
              to={"/setting/role"}
              className="btn btn-sm  btn-outline-secondary me-2"
            >
              <Icon icon="mdi:view-list" width="20" height="20" />
            </Link>
            <Link
              to={"/setting/role/tree"}
              className="btn btn-sm active btn-outline-secondary"
            >
              <Icon icon="mdi:family-tree" width="20" height="20" />
            </Link>
          </div>
        </div>
        <div className="card-body" style={{ height: "600px" }}>
          {roleData ? (
            <Tree
              data={roleData}
              orientation="vertical"
              translate={translate}
              pathFunc="step"
              renderCustomNodeElement={renderNode}
              collapsible={true}
              separation={{ siblings: 2, nonSiblings: 2 }}
              nodeSize={{ x: 180, y: 200 }}
            />
          ) : (
            <div className="text-center mt-5">Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
}
