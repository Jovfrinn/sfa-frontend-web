import { useState } from "react";

const InventoryBe = () => {
  const inventoryData = [
    {
      id: 1,
      kode_invoice: "INV001",
      nama_barang: "Coca-Cola 1L",
      kategori: "Minuman",
      satuan: "Botol",
      server: "MIM",
    },
    {
      id: 2,
      kode_invoice: "INV002",
      nama_barang: "Aqua 600ml",
      kategori: "Minuman",
      satuan: "Botol",
      server: "MIM",
    },
    {
      id: 3,
      kode_invoice: "INV003",
      nama_barang: "Indomie Goreng",
      kategori: "Makanan Instan",
      satuan: "Pack",
      server: "MIM",
    },
    {
      id: 4,
      kode_invoice: "INV004",
      nama_barang: "Kopi Kapal Api 65gr",
      kategori: "Minuman",
      satuan: "Pack",
      server: "MIM",
    },
    {
      id: 5,
      kode_invoice: "INV005",
      nama_barang: "Teh Pucuk Harum 350ml",
      kategori: "Minuman",
      satuan: "Botol",
      server: "MIM",
    },
    {
      id: 6,
      kode_invoice: "INV006",
      nama_barang: "Susu Ultra 1L",
      kategori: "Minuman Susu",
      satuan: "Kotak",
      server: "MIM",
    },
    {
      id: 7,
      kode_invoice: "INV007",
      nama_barang: "Mie Sedap Goreng",
      kategori: "Makanan Instan",
      satuan: "Pack",
      server: "MIM",
    },
    {
      id: 8,
      kode_invoice: "INV008",
      nama_barang: "Sabun Lifebuoy 110gr",
      kategori: "Perawatan Tubuh",
      satuan: "Batang",
      server: "MIM",
    },
    {
      id: 9,
      kode_invoice: "INV009",
      nama_barang: "Shampoo Pantene 180ml",
      kategori: "Perawatan Rambut",
      satuan: "Botol",
      server: "MIM",
    },
    {
      id: 10,
      kode_invoice: "INV010",
      nama_barang: "Rinso Detergen 800gr",
      kategori: "Kebutuhan Rumah Tangga",
      satuan: "Pack",
      server: "MIM",
    },
  ];

  const [view, setView] = useState("list"); // list, create, edit, filter, search
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterType, setFilterType] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    kode_invoice: "",
    nama_barang: "",
    kategori: "",
    satuan: "",
    server: "MIM",
  });
  const [data, setData] = useState(inventoryData);

  const kategoriList = [...new Set(inventoryData.map(item => item.kategori))];

  const filteredData = data.filter((item) => {
    const matchesSearch = item.nama_barang.toLowerCase().includes(search.toLowerCase()) ||
      item.kode_invoice.toLowerCase().includes(search.toLowerCase()) ||
      item.kategori.toLowerCase().includes(search.toLowerCase()) ||
      item.satuan.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filterType === "" || item.kategori === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const handleCreate = () => {
    if (!formData.kode_invoice || !formData.nama_barang || !formData.kategori || !formData.satuan) {
      alert("Semua field harus diisi!");
      return;
    }
    const newItem = {
      id: data.length + 1,
      ...formData,
    };
    setData([...data, newItem]);
    setFormData({ kode_invoice: "", nama_barang: "", kategori: "", satuan: "", server: "MIM" });
    setView("list");
    alert("Data berhasil ditambahkan!");
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setView("edit");
  };

  const handleUpdate = () => {
    if (!formData.kode_invoice || !formData.nama_barang || !formData.kategori || !formData.satuan) {
      alert("Semua field harus diisi!");
      return;
    }
    setData(data.map(item => item.id === editingItem.id ? { ...formData, id: item.id } : item));
    setFormData({ kode_invoice: "", nama_barang: "", kategori: "", satuan: "", server: "MIM" });
    setEditingItem(null);
    setView("list");
    alert("Data berhasil diupdate!");
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      setData(data.filter(item => item.id !== id));
      alert("Data berhasil dihapus!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Menu Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-xl font-bold mb-4">Inventory Management</h2>
          <div className="space-y-2">
            <button
              onClick={() => setView("list")}
              className={`w-full text-left px-4 py-2 rounded ${view === "list" ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            >
              FE - View List Inventory
            </button>
            <button
              onClick={() => {
                setView("create");
                setFormData({ kode_invoice: "", nama_barang: "", kategori: "", satuan: "", server: "MIM" });
              }}
              className={`w-full text-left px-4 py-2 rounded ${view === "create" ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            >
              FE - Create Inventory
            </button>
            <button
              onClick={() => setView("edit")}
              className={`w-full text-left px-4 py-2 rounded ${view === "edit" ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            >
              FE - Edit Inventory
            </button>
            <button
              onClick={() => setView("filter")}
              className={`w-full text-left px-4 py-2 rounded ${view === "filter" ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            >
              FE - Filter Inventory by Type / Jenis
            </button>
            <button
              onClick={() => setView("search")}
              className={`w-full text-left px-4 py-2 rounded ${view === "search" ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            >
              FE - Search Inventory
            </button>
            <div className={`w-full text-left px-4 py-2 rounded ${view === "list" ? "bg-gray-100" : "bg-gray-100"}`}>
              FE - Pagination
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* View List */}
          {view === "list" && (
            <>
              <h3 className="text-lg font-semibold mb-4">Master Inventory</h3>
              <div className="flex justify-between mb-4">
                <div className="flex items-center gap-2">
                  <label>Show</label>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border rounded px-2 py-1"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                  <span>entries</span>
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="border rounded px-3 py-1"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2 text-left">No</th>
                      <th className="border p-2 text-left">Kode Invoice</th>
                      <th className="border p-2 text-left">Nama Barang</th>
                      <th className="border p-2 text-left">Kategori</th>
                      <th className="border p-2 text-left">Satuan</th>
                      <th className="border p-2 text-left">Server</th>
                      <th className="border p-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length > 0 ? (
                      currentData.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="border p-2">{indexOfFirstRow + index + 1}</td>
                          <td className="border p-2">{item.kode_invoice}</td>
                          <td className="border p-2">{item.nama_barang}</td>
                          <td className="border p-2">{item.kategori}</td>
                          <td className="border p-2">{item.satuan}</td>
                          <td className="border p-2">{item.server}</td>
                          <td className="border p-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="bg-yellow-500 text-white px-3 py-1 rounded text-sm mr-2 hover:bg-yellow-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="border p-4 text-center">No data found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span>
                  Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, filteredData.length)} of {filteredData.length} entries
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded ${currentPage === page ? "bg-blue-500 text-white" : ""}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Create Form */}
          {view === "create" && (
            <>
              <h3 className="text-lg font-semibold mb-4">Create Inventory</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Kode Invoice</label>
                  <input
                    type="text"
                    value={formData.kode_invoice}
                    onChange={(e) => setFormData({ ...formData, kode_invoice: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Masukkan kode invoice"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Nama Barang</label>
                  <input
                    type="text"
                    value={formData.nama_barang}
                    onChange={(e) => setFormData({ ...formData, nama_barang: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Masukkan nama barang"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Kategori</label>
                  <input
                    type="text"
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Masukkan kategori"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Satuan</label>
                  <input
                    type="text"
                    value={formData.satuan}
                    onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Masukkan satuan"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCreate}
                    className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Edit Form */}
          {view === "edit" && editingItem && (
            <>
              <h3 className="text-lg font-semibold mb-4">Edit Inventory</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Kode Invoice</label>
                  <input
                    type="text"
                    value={formData.kode_invoice}
                    onChange={(e) => setFormData({ ...formData, kode_invoice: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Nama Barang</label>
                  <input
                    type="text"
                    value={formData.nama_barang}
                    onChange={(e) => setFormData({ ...formData, nama_barang: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Kategori</label>
                  <input
                    type="text"
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Satuan</label>
                  <input
                    type="text"
                    value={formData.satuan}
                    onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setView("list");
                      setEditingItem(null);
                    }}
                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Filter */}
          {view === "filter" && (
            <>
              <h3 className="text-lg font-semibold mb-4">Filter Inventory by Type / Jenis</h3>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Pilih Kategori</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Semua Kategori</option>
                  {kategoriList.map((kat) => (
                    <option key={kat} value={kat}>{kat}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setView("list")}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                View Filtered Results
              </button>
            </>
          )}

          {/* Search */}
          {view === "search" && (
            <>
              <h3 className="text-lg font-semibold mb-4">Search Inventory</h3>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Search</label>
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama, kode, kategori, atau satuan..."
                  className="w-full border rounded px-3 py-2"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Ditemukan {filteredData.length} hasil
              </div>
              <button
                onClick={() => setView("list")}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                View Search Results
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryBe;