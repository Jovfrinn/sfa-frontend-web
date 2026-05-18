import { Icon } from "@iconify/react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useFieldContext } from "../../context/FieldContext";
import Skeleton from "react-loading-skeleton";
import useResizableColumns from "../../hook/useResizableColumns";

const Table = () => {
  const { attachResizer } = useResizableColumns();

  const { slug } = useParams();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const { setHandleSaveFn, setOnEdit } = useFieldContext();

  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [isLoadingField, setIsLoadingField] = useState(true);

  useEffect(() => {
    setHandleSaveFn(() => handleSave);
  }, [rows]);
  useEffect(() => {
    setIsLoadingField(true);
  }, [slug]);

  useEffect(() => {
    fetchField();
    fetchData();
  }, [slug]);

  const handleAddRow = () => {
    setOnEdit(true);
    const emptyData = {};
    columns.forEach((col) => {
      emptyData[col.column_id] = "";
    });

    setRows([
      ...rows,
      {
        id: Date.now(),
        selected: false,
        data: emptyData,
      },
    ]);
  };

  const handleDeleteRows = () => {
    const filtered = rows.filter((row) => !row.selected);
    setRows(filtered);
    setSelectAll(false);
  };

  const handleSelectAll = () => {
    const newSelect = !selectAll;
    setSelectAll(newSelect);
    setRows(rows.map((r) => ({ ...r, selected: newSelect })));
  };

  const handleCheckboxChange = (id) => {
    setRows(
      rows.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r))
    );
  };

  const handleCellChange = (rowId, cellIndex, value) => {
    setOnEdit(true);
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id !== rowId) return row;
        const updatedData = { ...row.data };
        const colKey = Object.keys(updatedData)[cellIndex];
        updatedData[colKey] = value;
        return { ...row, data: updatedData };
      })
    );
  };

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
      setRows([
        {
          id: Date.now(),
          selected: false,
          data: emptyData,
        },
      ]);
      setColumns(cols);
      setIsLoadingField(false);
    } catch (error) {
      console.error("Error fetching fields:", error);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URI}/tables/${slug}/data`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const rawData = res.data.data.data;
      const mappedRows = rawData.map((item) => {
        const { id, created_at, updated_at, ...columns } = item;
        return {
          id,
          selected: false,
          data: columns,
        };
      });

      if (mappedRows.length > 0) {
        setRows(mappedRows);
      }
      setIsLoadingTable(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URI}/tables/${slug}/rows`,
        rows,
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
        fetchData();
      });
    } catch (error) {
      console.error("Gagal:", error);
      alert("Terjadi kesalahan saat menyimpan.");
    }
  };

  const anyRowSelected = rows.some((row) => row.selected);

  return (
    <>
      <div className="overflow-x-auto" style={{ maxHeight: "400px" }}>
        <table
          className="table basic-border-table table-sticky mb-0"
          data-page-length={10}
        >
          <thead>
            <tr>
              <th
                className="w-bp"
                onClick={handleSelectAll}
              >
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="form-check-input"
                />
              </th>
              {!isLoadingField
                ? columns.map((col, i) => <th key={i}>{col.column_id}</th>)
                : Array.from({ length: 5 }).map((_, i) => (
                    <th key={i}>
                      <Skeleton width={100} height={20} />
                    </th>
                  ))}
              <th className="w-bp">
                <Link
                  className="btn btn-outline-dark text-sm btn-sm-add radius-8 d-flex align-items-center"
                  to={`/table/${slug}/structure/add-column`}
                >
                  <Icon
                    icon="mdi:plus"
                    className="icon text-lg line-height-1"
                  />
                </Link>
              </th>
            </tr>
          </thead>
          <tbody>
            {!isLoadingField ? (
              rows.map((row) => (
                <tr key={row.id}>
                  <td
                    onClick={() => handleCheckboxChange(row.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <input
                      type="checkbox"
                      checked={row.selected}
                      onChange={() => handleCheckboxChange(row.id)}
                      className="form-check-input"
                    />
                  </td>
                  {Object.entries(row.data).map((cell, i) => (
                    <td
                      key={i}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleCellChange(row.id, i, e.target.innerText)
                      }
                    >
                      {cell[1]}
                    </td>
                  ))}
                  <td></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={100}>
                  <p>Loading ...</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="row mt-3">
        <div className="col-12 d-flex">
          <button
            className="btn btn-primary text-sm btn-sm radius-8 d-flex align-items-center gap-2 mb-16"
            onClick={handleAddRow}
          >
            <Icon
              icon="fa6-regular:square-plus"
              className="icon text-lg line-height-1"
            />
            Add Row
          </button>
          <button
            disabled={!anyRowSelected}
            className="btn btn-danger text-sm btn-sm ms-4 radius-8 d-flex align-items-center gap-2 mb-16"
            onClick={handleDeleteRows}
          >
            <Icon
              icon="mdi:delete-outline"
              className="icon text-lg line-height-1"
            />
            Delete Row
          </button>
        </div>
      </div>
    </>
  );
};

export default Table;
