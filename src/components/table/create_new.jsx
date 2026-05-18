"use client";

import { Link } from "react-router-dom";
import axios from "axios";

import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useFieldContext } from "../../context/FieldContext";

const CreateNewTable = () => {
  const { setHandleSaveFn, setOnEdit } = useFieldContext();

  const [tableName, setTableName] = useState(null);
  const [tableColumn, setTableColumn] = useState(3);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setHandleSaveFn(() => handleSubmit);
  }, [tableName]);

  const handleSubmit = async () => {
    const fieldDefinitions = [];

    for (let i = 1; i <= tableColumn; i++) {
      fieldDefinitions.push({
        name: `Column ${i}`,
        type: "short_text",
        column_id: `column_${i}`,
        nullable: true,
        unique: false,
        default: null,
      });
    }

    const postData = {
      name: tableName,
      content: {
        fieldDefinitions,
      },
    };

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URI}/tables`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Success:", res.data.template);

      Swal.fire({
        title: "Berhasil!",
        text: "Data berhasil ditambahkan.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate(`/table/${res.data.template.content.db_table_name}`);
      });
    } catch (error) {
      console.error("Error sending data:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="row">
      <div className="col-sm-6 mt-3">
        <label>
          <b>Table Name</b>
        </label>
        <input
          type="text"
          className="form-control mt-2"
          placeholder="Ex : master_customer"
          onChange={(e) => {
            setOnEdit(true);
            setTableName(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default CreateNewTable;
