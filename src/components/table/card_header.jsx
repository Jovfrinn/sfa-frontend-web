"use client";
import { useParams } from "react-router-dom";

import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useFieldContext } from "../../context/FieldContext";

export const metadata = {
  title: "Table | UNI ERP",
  description: "Table.",
};

const CardHeader = ({ active }) => {
  const params = useParams();
  const slug = params?.slug;
  const { handleSaveFn, onEdit } = useFieldContext();
  const handleSaveClick = (e) => {
    e.preventDefault();
    if (handleSaveFn) handleSaveFn();
  };
  return (
    <div className="d-flex w-100 justify-content-between align-items-center">
      <div className="d-flex gap-2">
        <Link
          onClick={(e) => (!active ? e.preventDefault() : null)}
          to={`/table/${slug}`}
          className={`px-3 py-4 ${
            active === "data"
              ? "bg-primary text-white"
              : "bg-light text-secondary"
          } rounded fw-semibold`}
        >
          <span className="d-flex align-items-center gap-10">
            <Icon
              icon="material-symbols:format-list-bulleted"
              className="icon"
            />
            <span className="fw-semibold">Data</span>
          </span>
        </Link>

        <Link
          to={`/table/${slug}/field`}
          onClick={(e) => (!active ? e.preventDefault() : null)}
          className={`px-3 py-4 ${
            active === "field"
              ? "bg-primary text-white"
              : "bg-light text-secondary"
          } rounded fw-semibold`}
        >
          <span className="d-flex align-items-center gap-10">
            <Icon icon="mdi:format-columns" className="icon" />
            <span className="fw-semibold">Field</span>
          </span>
        </Link>

        <Link
          onClick={(e) => (!active ? e.preventDefault() : null)}
          to={`/table/${slug}/field`}
          className={`px-3 py-4 ${
            active === "import"
              ? "bg-primary text-white"
              : "bg-light text-secondary"
          } rounded fw-semibold`}
        >
          <span className="d-flex align-items-center gap-10">
            <Icon icon="mdi:database-import-outline" className="icon" />
            <span className="fw-semibold">Import</span>
          </span>
        </Link>

        <Link
          onClick={(e) => (!active ? e.preventDefault() : null)}
          to={`/table/${slug}/field`}
          className={`px-3 py-4 ${
            active === "export"
              ? "bg-primary text-white"
              : "bg-light text-secondary"
          } rounded fw-semibold`}
        >
          <span className="d-flex align-items-center gap-10">
            <Icon icon="mdi:database-export-outline" className="icon" />
            <span className="fw-semibold">Export</span>
          </span>
        </Link>
      </div>

      <div>
        <button
          onClick={handleSaveClick}
          disabled={!onEdit}
          className={`px-3 py-4 ${
            onEdit ? "bg-primary text-white" : "bg-light text-secondary"
          } rounded fw-semibold`}
        >
          <span className="d-flex align-items-center gap-10">
            <Icon icon="mdi:content-save" className="icon" />
            <span className="fw-semibold">Save</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default CardHeader;
