import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

export default function ExcelUploadModal({ show, onHide, onUpload }) {
  const [file, setFile] = useState(null);

  const handleSubmit = () => {
    if (!file) {
      alert("Pilih file Excel terlebih dahulu!");
      return;
    }

    const ext = file.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls"].includes(ext)) {
      alert("File harus .xlsx atau .xls");
      return;
    }

    onUpload(file);
    setFile(null);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload Inventory</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
          className="form-control"
        />
        <p className="text-danger">Only .xlsx or .xls format</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Batal
        </Button>

        <Button variant="primary" onClick={handleSubmit}>
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
