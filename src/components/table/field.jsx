"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom"; 
import axios from "axios";

import { useEffect, useRef, useState } from "react";
import { preventDefault } from "@fullcalendar/core/internal";
import { useParams } from "react-router-dom"; 
import Swal from "sweetalert2";
import { useFieldContext } from "../../context/FieldContext";

const Field = () => {
  const { setHandleSaveFn, setOnEdit } = useFieldContext();
  const params = useParams();
  const slug = params?.slug;
  const [columns] = useState([
    "Column Name",
    "Data Type",
    "Allow Null",
    "Unique",
    "Default Value",
    "Action",
  ]);

  useEffect(() => {
    fetchField();
  }, []);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    setHandleSaveFn(() => handleSave);
  }, [rows]);

  const fetchField = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URI}/tables/${slug}/rows`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const cols = res.data.data;
      const emptyData = {};
      cols.forEach((col) => {
        emptyData[col.column_id] = "";
      });

      setRows(res.data.data);
    } catch (error) {
    } finally {
    }
  };
  const handleAddRow = () => {
    setOnEdit(true);
    setRows([
      ...rows,
      {
        name: "",
        type: "Text",
        unique: false,
        default: "",
        nullable: true,
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  const updateRow = (index, key, value) => {
    const updated = [...rows];
    updated[index][key] = value;
    setRows(updated);
  };

  const handleSave = async () => {
    const formatted = rows.map((row) => ({
      old: row.column_id,
      new: row.name?.trim().toLowerCase().replace(/\s+/g, "_"),
      type: row.type,
      nullable: row.nullable,
      unique: row.unique,
      default: row.default === "" ? null : row.default,
    }));

    const payload = {
      columns: formatted,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${import.meta.env.VITE_API_URI}/tables/${slug}/update-schema`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data berhasil diperbarui.",
        backdrop: true,
        allowOutsideClick: false,
      }).then(() => {
        fetchField();
      });
    } catch (error) {
      console.error("Gagal:", error);
      alert("Terjadi kesalahan saat menyimpan.");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table basic-border-table  mb-0" data-page-length={10}>
        <thead>
          <tr>
            {columns.map((v, x) => (
              <th key={x} scope="col">
                {v}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((value, index) => (
            <tr key={`row-${index}`}>
              <td
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => {
                  setOnEdit(true);
                  updateRow(index, "name", e.currentTarget.textContent);
                }}
              >
                <b>{value.column_id}</b>
              </td>
              <td>
                <select
                  name=""
                  defaultValue={value.type}
                  id=""
                  className="form-control form-control-sm"
                  onChange={(e) => {
                    setOnEdit(true);
                    updateRow(index, "type", e.currentTarget.value);
                  }}
                >
                  <option value="varchar">Text</option>
                  <option value="int">Number</option>
                  <option value="decimal">Decimal</option>
                  <option value="date">Date</option>
                  <option value="datetime">DateTime</option>
                  <option value="text">Long Text</option>
                  <option value="boolean">Boolean</option>
                  <option value="float">Float</option>
                  <option value="double">Double</option>
                  <option value="time">Time</option>
                  <option value="timestamp">Timestamp</option>
                  <option value="enum">Enum</option>
                  <option value="json">JSON</option>
                </select>
              </td>
              <td>
                <div className="form-switch switch-primary d-flex align-items-center gap-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="switch1"
                    onChange={(e) => {
                      setOnEdit(true);
                      updateRow(index, "nullable", e.currentTarget.checked);
                    }}
                    defaultChecked={value.nullable}
                  />
                </div>
              </td>
              <td>
                <div className="form-switch switch-primary d-flex align-items-center gap-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="switch1"
                    onChange={(e) => {
                      setOnEdit(true);
                      updateRow(index, "unique", e.currentTarget.checked);
                    }}
                    defaultChecked={value.unique}
                  />
                </div>
              </td>
              <td
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => {
                  setOnEdit(true);
                  updateRow(index, "default", e.currentTarget.textContent);
                }}
              >
                {value.default ?? "null"}
              </td>
              <td>
                <div
                  className="btn-group btn-sm"
                  role="group"
                  aria-label="Basic example"
                >
                  <Link
                    href="/table"
                    className=" ms-3  text-danger  d-flex align-items-center gap-2"
                    onClick={(e) => preventDefault(e)}
                  >
                    <Icon
                      icon="material-symbols:delete-outline"
                      className="icon text-lg line-height-1"
                    />
                    Delete
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex gap-2 mt-3">
        <button
          onClick={handleAddRow}
          className={`px-3 py-4 bg-light text-dark  rounded fw-semibold`}
        >
          <span className="d-flex align-items-center gap-10 justify-content-between w-100">
            <span className="d-flex align-items-center gap-10">
              <span className="icon text-xxl line-height-1 d-flex">
                <Icon icon="mdi:plus" className="icon line-height-1" />
              </span>
              <span className="fw-semibold">Add Column</span>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default Field;
