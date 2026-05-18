import { useState } from "react";
import { Link } from "react-router-dom";

const InventoryTable = () => {
  const inventoryData = [
    {
      id: 1,
      kode_barang: "ALK001",
      nama_barang: "Bintang Pilsener 620ml",
      kategori: "Minuman Alkohol",
      sub_kategori: "Beer",
      deskripsi: "Bir lokal Indonesia botol besar",
      stok: 200,
      satuan: "Botol",
      harga_beli: 18000,
      harga_jual: 25000,
      supplier: "PT Multi Bintang Indonesia",
      lokasi_gudang: "Gudang A",
      rak: "Rak-01",
      status: "Aktif",
      tanggal_masuk: "2025-07-15",
      tanggal_update: "2025-08-20",
    },
    {
      id: 2,
      kode_barang: "ALK002",
      nama_barang: "Heineken 330ml",
      kategori: "Minuman Alkohol",
      sub_kategori: "Beer",
      deskripsi: "Bir impor botol kecil",
      stok: 150,
      satuan: "Botol",
      harga_beli: 25000,
      harga_jual: 35000,
      supplier: "Heineken Asia Pacific",
      lokasi_gudang: "Gudang A",
      rak: "Rak-02",
      status: "Aktif",
      tanggal_masuk: "2025-07-18",
      tanggal_update: "2025-08-21",
    },
    {
      id: 3,
      kode_barang: "ALK003",
      nama_barang: "Red Label 700ml",
      kategori: "Minuman Alkohol",
      sub_kategori: "Whisky",
      deskripsi: "Johnnie Walker Red Label blended whisky",
      stok: 50,
      satuan: "Botol",
      harga_beli: 350000,
      harga_jual: 450000,
      supplier: "PT Diageo Indonesia",
      lokasi_gudang: "Gudang B",
      rak: "Rak-05",
      status: "Aktif",
      tanggal_masuk: "2025-07-10",
      tanggal_update: "2025-08-22",
    },
    {
      id: 4,
      kode_barang: "ALK004",
      nama_barang: "Hennessy VSOP 700ml",
      kategori: "Minuman Alkohol",
      sub_kategori: "Cognac",
      deskripsi: "Cognac premium dari Prancis",
      stok: 30,
      satuan: "Botol",
      harga_beli: 950000,
      harga_jual: 1250000,
      supplier: "Moët Hennessy Indonesia",
      lokasi_gudang: "Gudang B",
      rak: "Rak-07",
      status: "Aktif",
      tanggal_masuk: "2025-07-25",
      tanggal_update: "2025-08-23",
    },
    {
      id: 5,
      kode_barang: "ALK005",
      nama_barang: "Moët & Chandon Brut 750ml",
      kategori: "Minuman Alkohol",
      sub_kategori: "Champagne",
      deskripsi: "Champagne sparkling wine asal Prancis",
      stok: 20,
      satuan: "Botol",
      harga_beli: 1200000,
      harga_jual: 1600000,
      supplier: "Moët Hennessy Indonesia",
      lokasi_gudang: "Gudang C",
      rak: "Rak-10",
      status: "Aktif",
      tanggal_masuk: "2025-08-01",
      tanggal_update: "2025-08-24",
    },
    {
      id: 6,
      kode_barang: "ALK006",
      nama_barang: "Absolut Vodka 750ml",
      kategori: "Minuman Alkohol",
      sub_kategori: "Vodka",
      deskripsi: "Vodka asal Swedia dengan rasa original",
      stok: 80,
      satuan: "Botol",
      harga_beli: 300000,
      harga_jual: 400000,
      supplier: "Pernod Ricard Indonesia",
      lokasi_gudang: "Gudang C",
      rak: "Rak-11",
      status: "Aktif",
      tanggal_masuk: "2025-08-05",
      tanggal_update: "2025-08-24",
    },
    {
      id: 7,
      kode_barang: "ALK007",
      nama_barang: "Smirnoff Vodka 750ml",
      kategori: "Minuman Alkohol",
      sub_kategori: "Vodka",
      deskripsi: "Vodka populer asal Rusia",
      stok: 100,
      satuan: "Botol",
      harga_beli: 250000,
      harga_jual: 350000,
      supplier: "Diageo Indonesia",
      lokasi_gudang: "Gudang B",
      rak: "Rak-12",
      status: "Aktif",
      tanggal_masuk: "2025-08-10",
      tanggal_update: "2025-08-24",
    },
    {
      id: 8,
      kode_barang: "ALK008",
      nama_barang: "Jack Daniel's 700ml",
      kategori: "Minuman Alkohol",
      sub_kategori: "Whisky",
      deskripsi: "Whisky asal Tennessee, Amerika",
      stok: 60,
      satuan: "Botol",
      harga_beli: 500000,
      harga_jual: 650000,
      supplier: "Brown-Forman Indonesia",
      lokasi_gudang: "Gudang D",
      rak: "Rak-15",
      status: "Aktif",
      tanggal_masuk: "2025-08-12",
      tanggal_update: "2025-08-24",
    },
    {
      id: 9,
      kode_barang: "ALK009",
      nama_barang: "Chivas Regal 12yo 700ml",
      kategori: "Minuman Alkohol",
      sub_kategori: "Whisky",
      deskripsi: "Blended scotch whisky dari Skotlandia",
      stok: 40,
      satuan: "Botol",
      harga_beli: 600000,
      harga_jual: 800000,
      supplier: "Pernod Ricard Indonesia",
      lokasi_gudang: "Gudang D",
      rak: "Rak-16",
      status: "Aktif",
      tanggal_masuk: "2025-08-13",
      tanggal_update: "2025-08-24",
    },
    {
      id: 10,
      kode_barang: "ALK010",
      nama_barang: "Martell VSOP 700ml",
      kategori: "Minuman Alkohol",
      sub_kategori: "Cognac",
      deskripsi: "Cognac elegan asal Prancis",
      stok: 25,
      satuan: "Botol",
      harga_beli: 850000,
      harga_jual: 1100000,
      supplier: "Pernod Ricard Indonesia",
      lokasi_gudang: "Gudang E",
      rak: "Rak-18",
      status: "Aktif",
      tanggal_masuk: "2025-08-14",
      tanggal_update: "2025-08-24",
    },
    {
      id: 11,
      kode_barang: "ALK011",
      nama_barang: "Baileys Irish Cream 750ml",
      kategori: "Minuman Alkohol",
      sub_kategori: "Liqueur",
      deskripsi: "Liqueur manis asal Irlandia",
      stok: 35,
      satuan: "Botol",
      harga_beli: 320000,
      harga_jual: 450000,
      supplier: "Diageo Indonesia",
      lokasi_gudang: "Gudang F",
      rak: "Rak-20",
      status: "Aktif",
      tanggal_masuk: "2025-08-15",
      tanggal_update: "2025-08-24",
    },
    {
      id: 12,
      kode_barang: "ALK012",
      nama_barang: "Jose Cuervo Tequila 750ml",
      kategori: "Minuman Alkohol",
      sub_kategori: "Tequila",
      deskripsi: "Tequila klasik asal Meksiko",
      stok: 45,
      satuan: "Botol",
      harga_beli: 400000,
      harga_jual: 550000,
      supplier: "Jose Cuervo International",
      lokasi_gudang: "Gudang F",
      rak: "Rak-21",
      status: "Aktif",
      tanggal_masuk: "2025-08-16",
      tanggal_update: "2025-08-24",
    },
    {
      id: 13,
      kode_barang: "ALK013",
      nama_barang: "Captain Morgan Rum 750ml",
      kategori: "Minuman Alkohol",
      sub_kategori: "Rum",
      deskripsi: "Rum karibia dengan aroma khas",
      stok: 55,
      satuan: "Botol",
      harga_beli: 270000,
      harga_jual: 380000,
      supplier: "Diageo Indonesia",
      lokasi_gudang: "Gudang G",
      rak: "Rak-22",
      status: "Aktif",
      tanggal_masuk: "2025-08-17",
      tanggal_update: "2025-08-24",
    },
    {
      id: 14,
      kode_barang: "ALK014",
      nama_barang: "Bombay Sapphire Gin 750ml",
      kategori: "Minuman Alkohol",
      sub_kategori: "Gin",
      deskripsi: "Gin premium asal Inggris",
      stok: 30,
      satuan: "Botol",
      harga_beli: 450000,
      harga_jual: 600000,
      supplier: "Bacardi Indonesia",
      lokasi_gudang: "Gudang G",
      rak: "Rak-23",
      status: "Aktif",
      tanggal_masuk: "2025-08-18",
      tanggal_update: "2025-08-24",
    },
    {
      id: 15,
      kode_barang: "ALK015",
      nama_barang: "Dom Pérignon Vintage 750ml",
      kategori: "Minuman Alkohol",
      sub_kategori: "Champagne",
      deskripsi: "Champagne legendaris asal Prancis",
      stok: 10,
      satuan: "Botol",
      harga_beli: 3500000,
      harga_jual: 5000000,
      supplier: "Moët Hennessy Indonesia",
      lokasi_gudang: "Gudang H",
      rak: "Rak-30",
      status: "Aktif",
      tanggal_masuk: "2025-08-20",
      tanggal_update: "2025-08-24",
    },
  ];

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredData = inventoryData.filter(
    (item) =>
      item.nama_barang.toLowerCase().includes(search.toLowerCase()) ||
      item.kode_barang.toLowerCase().includes(search.toLowerCase()) ||
      item.kategori.toLowerCase().includes(search.toLowerCase()) ||
      item.sub_kategori.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div className="col-lg-12">
      <div className="card h-100">
        <div className="card-header">
          <h5 className="card-title mb-0">Table Inventory</h5>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <div>
              <label className="me-2">Show</label>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="form-select d-inline-block w-auto"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span className="ms-2">entries</span>
            </div>

            <div>
              <input
                type="text"
                placeholder="Search..."
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table basic-border-table mb-0">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kode Barang</th>
                  <th>Nama Barang</th>
                  <th>Kategori</th>
                  <th>Sub Kategori</th>
                  <th>Deskripsi</th>
                  <th>Stok</th>
                  <th>Satuan</th>
                  <th>Harga Beli</th>
                  <th>Harga Jual</th>
                  <th>Supplier</th>
                  <th>Lokasi Gudang</th>
                  <th>Rak</th>
                  <th>Status</th>
                  <th>Tanggal Masuk</th>
                  <th>Tanggal Update</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={item.id}>
                      <td>{indexOfFirstRow + index + 1}</td>
                      <td>{item.kode_barang}</td>
                      <td>{item.nama_barang}</td>
                      <td>{item.kategori}</td>
                      <td>{item.sub_kategori}</td>
                      <td>{item.deskripsi}</td>
                      <td>{item.stok}</td>
                      <td>{item.satuan}</td>
                      <td>{item.harga_beli.toLocaleString()}</td>
                      <td>{item.harga_jual.toLocaleString()}</td>
                      <td>{item.supplier}</td>
                      <td>{item.lokasi_gudang}</td>
                      <td>{item.rak}</td>
                      <td>{item.status}</td>
                      <td>{item.tanggal_masuk}</td>
                      <td>{item.tanggal_update}</td>
                      <td>
                        <button className="btn btn-outline-warning btn-sm text-warning me-2">
                          Edit
                        </button>
                        <button className="btn btn-outline-danger btn-sm text-danger">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="17" className="text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <span>
              Showing {indexOfFirstRow + 1} to{" "}
              {Math.min(indexOfLastRow, filteredData.length)} of{" "}
              {filteredData.length} entries
            </span>

            <nav>
              <ul className="pagination mb-0">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <li
                      key={page}
                      className={`page-item ${
                        currentPage === page ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </li>
                  )
                )}

                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;
