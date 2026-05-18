"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import { useFieldContext } from "@/context/fieldcontext";

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
    const [rows, setRows] = useState([]);

    useEffect(() => {
        fetchField();
    }, []);

    useEffect(() => {
        // Tetap set handleSave untuk perubahan selain delete (add/edit)
        setHandleSaveFn(() => handleSave);
    }, [rows]);

    const fetchField = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `${import.meta.env.VITE_API_URI}/tables/${slug}/rows`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setRows(res.data.data);
        } catch (error) {
            console.error("Failed to fetch fields:", error);
            Swal.fire("Error", "Gagal memuat struktur kolom.", "error");
        }
    };

    const handleAddRow = () => {
        setOnEdit(true);
        setRows([
            ...rows,
            {
                column_id: "", // ID kosong menandakan ini kolom baru
                name: "",
                type: "varchar",
                unique: false,
                default: null,
                nullable: true,
            },
        ]);
    };
    
    const handleDeleteRow = (index, columnData) => {
        const columnId = columnData.column_id;

        // Jika kolom belum disimpan (tidak punya column_id), hapus dari state lokal
        if (!columnId) {
            const updatedRows = [...rows];
            updatedRows.splice(index, 1);
            setRows(updatedRows);
            return;
        }

        Swal.fire({
            title: "Anda yakin?",
            text: `Kolom "${columnId}" akan dihapus permanen. Aksi ini tidak bisa dibatalkan.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem("token");
                    
                    // [PERBAIKAN] Menggunakan sintaks axios.post yang benar
                    await axios.post(
                        `${import.meta.env.VITE_API_URI}/tables/${slug}/columns/${columnId}`,
                        {}, // Parameter ke-2: body (bisa kosong)
                        {   // Parameter ke-3: config (termasuk headers)
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    Swal.fire("Terhapus!", "Kolom telah berhasil dihapus.", "success");
                    
                    // Muat ulang data kolom untuk sinkronisasi penuh dengan server
                    fetchField(); 
                } catch (error) {
                    console.error("Gagal menghapus kolom:", error);
                    Swal.fire(
                        "Gagal!",
                        error.response?.data?.message || "Terjadi kesalahan saat menghapus kolom.",
                        "error"
                    );
                }
            }
        });
    };

    const updateRow = (index, key, value) => {
        setOnEdit(true);
        const updated = [...rows];
        updated[index][key] = value;
        setRows(updated);
    };

    const handleSave = async () => {
        const formatted = rows.map((row) => ({
            old: row.column_id || null,
            new: (row.name || row.column_id)?.trim().toLowerCase().replace(/\s+/g, "_"),
            type: row.type,
            nullable: row.nullable,
            unique: row.unique,
            default: row.default === "" ? null : row.default,
        }));

        const payload = { columns: formatted };

        try {
            const token = localStorage.getItem("token");
            await axios.put(
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
                text: "Perubahan skema tabel berhasil disimpan.",
                backdrop: true,
                allowOutsideClick: false,
            }).then(() => {
                window.location.reload();
            });
        } catch (error) {
            console.error("Gagal menyimpan skema:", error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal!',
                text: error.response?.data?.message || 'Terjadi kesalahan saat menyimpan.'
            });
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="table basic-border-table mb-0" data-page-length={10}>
                <thead>
                    <tr>
                        {columns.map((v, x) => (
                            <th key={x} scope="col">{v}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((value, index) => (
                        <tr key={`row-${index}-${value.column_id}`}>
                            <td>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    defaultValue={value.column_id}
                                    placeholder="nama_kolom_baru"
                                    onInput={(e) => updateRow(index, "name", e.currentTarget.value)}
                                    readOnly={!!value.column_id} // Hanya bisa diedit jika kolom baru
                                    style={{ backgroundColor: !!value.column_id ? '#f8f9fa' : 'white' }}
                                />
                            </td>
                            <td>
                                <select
                                    defaultValue={value.type}
                                    className="form-control form-control-sm"
                                    onChange={(e) => updateRow(index, "type", e.currentTarget.value)}
                                >
                                    <option value="varchar">Text</option>
                                    <option value="int">Number</option>
                                    <option value="text">Long Text</option>
                                    <option value="decimal">Decimal</option>
                                    <option value="date">Date</option>
                                    <option value="datetime">DateTime</option>
                                    <option value="boolean">Boolean (True/False)</option>
                                </select>
                            </td>
                            <td>
                                <div className="form-switch switch-primary d-flex align-items-center justify-content-center">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        onChange={(e) => updateRow(index, "nullable", e.currentTarget.checked)}
                                        defaultChecked={value.nullable}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="form-switch switch-primary d-flex align-items-center justify-content-center">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        onChange={(e) => updateRow(index, "unique", e.currentTarget.checked)}
                                        defaultChecked={value.unique}
                                    />
                                </div>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    defaultValue={value.default ?? ""}
                                    placeholder="null"
                                    onInput={(e) => updateRow(index, "default", e.currentTarget.value)}
                                />
                            </td>
                            <td>
                                <button
                                    type="button"
                                    className="ms-3 text-danger d-flex align-items-center gap-2"
                                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                                    onClick={() => handleDeleteRow(index, value)}
                                >
                                    <Icon
                                        icon="material-symbols:delete-outline"
                                        className="icon text-lg line-height-1"
                                    />
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="d-flex gap-2 mt-3">
                <button
                    onClick={handleAddRow}
                    className={`btn btn-light d-flex align-items-center gap-2`}
                >
                    <Icon icon="mdi:plus" className="icon line-height-1" />
                    <span className="fw-semibold">Add Column</span>
                </button>
            </div>
        </div>
    );
};

export default Field;