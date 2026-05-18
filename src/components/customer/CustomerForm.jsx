// src/components/customer/CustomerForm.jsx
// import { identity } from "@fullcalendar/core/internal";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "../loader/loader";
import Select from "react-select";

const CustomerForm = ({ initialData = null, onCancel, mode = "add" }) => {
  const [formData, setFormData] = useState({
    company_id: "",
    name: "",
    phone_1: "",
    alamat: "",
    kecamatan: "",
    kota: "",
    kode_pos: "",
    latitude: "",
    longitude: "",
    channel: "",
    sub_channel: "",
    pic: "",
    contact_pic: "",
    identity: "",
    identity_type: "KTP",
    npwp: "",
    nama_pajak: "",
    alamat_pajak: "",
    top: "",
    limit: "",
  });

  const [ktpImage, setKtpImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState([]);
  const [fileDisplay, setFileDisplay] = useState("No file chosen");

  const api = import.meta.env.VITE_API_URI;
  const token = localStorage.getItem("token");

  const fetchCompany = async () => {
    try {
      const res = await axios.get(api + `/customers/get/company`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCompany(res.
        data.data);
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        ...initialData,
        identity: initialData.identity
          ? initialData.identity.replace(/\D/g, "")
          : "",
      });
    }
    fetchCompany();
  }, [initialData, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleKtpChange = (e) => {
    const file = e.target.files[0];

      if (e.target.files && e.target.files.length > 0) {
      setFileDisplay(e.target.files[0].name);
    } else {
      setFileDisplay('No file chosen');
    }
    setKtpImage(file);
  };

  const channelOptions = [
    { value: "on_premise", label: "On Premise" },
    { value: "off_premise", label: "Off Premise" },
  ];

  const subChannelOptions = {
    on_premise: [
      "Hotel",
      "Club",
      "KTV",
      "Resto",
      "Lounge",
      "Beach Club",
      "Cafe",
    ],
    off_premise: ["MT", "LKA", "GT", "Bottle Shop"],
  };

  const identityType = [
    { value: "KTP", label: "KTP" },
    { value: "PASSPORT", label: "PASSPORT" },
    { value: "SIM", label: "SIM" },
    { value: "NPPBKC", label: "NPPBKC" },
  ];

  const availableSubChannels = subChannelOptions[formData.channel] || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      if (ktpImage) {
        data.append("ktp", ktpImage);
      }
      const api_url =
        api +
        "/customers/" +
        (mode === "add" ? "store" : "update/" + formData.id);

      const res = await axios.post(api_url, data, {
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        Swal.fire({
          title: "Berhasil!",
          text: "Data berhasil disimpan.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      setLoading(false);
      onCancel();
    } catch (err) {
      console.error("Gagal mengirim data:", err);
      alert("Gagal mengirim data, cek console untuk detail.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <style>{`
        .icon-form {
          border-right: 1px solid #ced4da;
          font-size: 1.3em;
          padding-right: 0.5rem;
          margin-bottom: 1rem;
        }
          .select-form{
            font-size: 1.3em;
            color:rgb(0, 0, 0) !important;
          }
        input::placeholder{
          color: rgb(129, 129, 129) !important;
        }
        textarea::placeholder{
          color: rgb(129, 129, 129) !important;
        }
        .input-file{
          font-size: 1.3em;
          color: rgb(129, 129, 129) !important;
          border: 1px solid #ced4da;
          border-radius: 0.25rem;
          width: 100%;
          padding: 0.350rem 0;
        }
          
        .file-input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            gap: 0;
        }

        input[type="file"] {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
        }

        .file-button {
            display: inline-block;
            padding: 8px 16px;
            background: #f0f0f0;
            border: 1px solid #ccc;
            border-right: none;
            border-radius: 4px 0 0 4px;
            font-size: 14px;
            color: #333;
            cursor: pointer;
            transition: background 0.2s;
            white-space: nowrap;
        }

        .file-button:hover {
            background: #e0e0e0;
        }

        .file-button:active {
            background: #d0d0d0;
        }

        .file-display {
            flex: 1;
            padding: 8px 16px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 0 4px 4px 0;
            font-size: 14px;
            color: #666;
            min-height: 36px;
            display: flex;
            align-items: center;
        }

        .file-display.has-file {
            color: #333;
        }
      `}</style>
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">
          {mode == "add" ? "Create" : "Edit"} Customer
        </h5>
        <button onClick={onCancel} className="btn btn-link text-danger">
          <Icon icon="charm:cross" />
        </button>
      </div>
      <div className="card-body">
        <div className="">
          <div className="">
            <div className="customer-form">
              <form onSubmit={handleSubmit}>
                <div className="row align-items-center gy-3">
                  {/* Company */}
                  <label for="company" className="form-label col-md-4">
                    Company
                  </label>
                  <div className="col-md-8">
                    <Select
                      className="select-form"
                      options={company.map((item) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                      name="company_id"
                      placeholder="Choose Company"
                      onChange={(selectedOption) => {
                        setFormData({
                          ...formData,
                          company_id: selectedOption
                            ? selectedOption.value
                            : null,
                        });
                      }}
                    />
                  </div>
                  {/* Nama Customer */}
                  <label for="name" className="form-label col-md-4">
                    Customer Name
                  </label>
                  <div className="col-md-8 icon-field d-flex align-items-center">
                    <span className="icon mx-3">
                      <Icon className="icon-form" icon="f7:person" />
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      class="form-control"
                      id="name"
                      placeholder="Enter Customer Name"
                    />
                  </div>
                  {/* Nomor Telepon */}
                  <label for="phone_1" className="form-label col-md-4">
                    Phone Number
                  </label>
                  <div className="col-md-8 icon-field">
                    <span className="icon mx-3">
                      <Icon className="icon-form" icon="f7:phone" />
                    </span>
                    <input
                      type="number"
                      name="phone_1"
                      value={formData.phone_1}
                      onChange={handleChange}
                      class="form-control"
                      id="phone_1"
                      placeholder="Enter phone number"
                    />
                  </div>
                  {/* Alamat Customer */}
                  <label for="alamat" className="form-label col-md-4">
                    Customer Address
                  </label>
                  <div className="col-md-8 icon-field">
                    <span className="icon mx-3">
                      <Icon className="icon-form" icon="gg:pin" />
                    </span>
                    <textarea
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleChange}
                      class="form-control"
                      id="alamat"
                      placeholder="Enter Customer Address"
                    />
                  </div>
                  {/* Kecamatan Kota Kode POS */}
                  <label for="kecamatan" className="form-label col-md-4">
                    Kecamatan / Kota / Kode POS
                  </label>
                  <div className="col-md-8 d-flex gap-1">
                    <div className="icon-field">
                      <span className="icon">
                        <Icon className="icon-form" icon="f7:map-pin" />
                      </span>
                      <input
                        name="kecamatan"
                        value={formData.kecamatan}
                        onChange={handleChange}
                        class="form-control"
                        id="kecamatan"
                        placeholder="Kecamatan"
                      />
                    </div>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon className="icon-form" icon="ph-city-light" />
                      </span>
                      <input
                        name="kota"
                        value={formData.kota}
                        onChange={handleChange}
                        class="form-control"
                        id="kota"
                        placeholder="Kota"
                      />
                    </div>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon className="icon-form" icon="mynaui:envelope" />
                      </span>
                      <input
                        name="kode_pos"
                        value={formData.kode_pos}
                        onChange={handleChange}
                        class="form-control"
                        id="kode_pos"
                        placeholder="Kode POS"
                        type="number"
                      />
                    </div>
                  </div>
                  {/* Latitude Longitude */}
                  <label for="latitude" className="form-label col-md-4">
                    Latitude / Longitude
                  </label>
                  <div className="col-md-8 d-flex gap-2">
                    <div className="icon-field w-100">
                      <span className="icon">
                        <Icon className="icon-form" icon="ph:crosshair-light" />
                      </span>
                      <input
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        class="form-control"
                        id="latitude"
                        placeholder="Latitude"
                      />
                    </div>
                    <div className="icon-field w-100">
                      <span className="icon">
                        <Icon className="icon-form" icon="ph:crosshair-light" />
                      </span>
                      <input
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        class="form-control"
                        id="longitude"
                        placeholder="Longitude"
                      />
                    </div>
                  </div>
                  {/* Channel */}
                  <label for="channel" className="form-label col-md-4">
                    Channel
                  </label>
                  <div className="col-md-8">
                    <Select
                      className="select-form"
                      options={channelOptions}
                      name="channel"
                      onChange={(selectedOption) =>
                        setFormData({
                          ...formData,
                          channel: selectedOption.value,
                        })
                      }
                      placeholder="Choose Channel"
                    />
                  </div>
                  {/* Sub Channel */}
                  <label for="sub_channel" className="form-label col-md-4">
                    Sub Channel
                  </label>
                  <div className="col-md-8">
                    <Select
                      className="select-form"
                      options={availableSubChannels.map((sub) => ({
                        value: sub,
                        label: sub,
                      }))}
                      name="sub_channel"
                      // isDisabled={!formData.channel}
                      onChange={(selectedOption) =>
                        setFormData({
                          ...formData,
                          sub_channel: selectedOption.value,
                        })
                      }
                      placeholder="Choose Sub Channel"
                    />
                  </div>
                  {/* Nama PIC */}
                  <label for="pic" className="form-label col-md-4">
                    PIC Name
                  </label>
                  <div className="col-md-8 icon-field">
                    <span className="icon mx-3">
                      <Icon className="icon-form" icon="bi:person-up" />
                    </span>
                    <input
                      type="text"
                      name="pic"
                      value={formData.pic}
                      onChange={handleChange}
                      class="form-control"
                      id="pic"
                      placeholder="Enter PIC name"
                    />
                  </div>
                  {/* Kontak PIC */}
                  <label for="contact_pic" className="form-label col-md-4">
                    PIC Contact
                  </label>
                  <div className="col-md-8 icon-field">
                    <span className="icon mx-3">
                      <Icon className="icon-form" icon="tabler:phone-done" />
                    </span>
                    <input
                      type="number"
                      name="contact_pic"
                      value={formData.contact_pic}
                      onChange={handleChange}
                      class="form-control"
                      id="contact_pic"
                      placeholder="Enter phone number"
                    />
                  </div>
                  {/* Identity */}
                  <label for="identity" className="form-label col-md-4">
                    Identity
                  </label>
                  <div
                    className="col-md-8 d-flex align-items-center gap-2"
                    id="section-ktp"
                  >
                    <Select
                      className="select-form w-200-px"
                      options={identityType}
                      name="identity_type"
                      value={identityType.find(
                        (opt) => opt.value === formData.identity_type
                      )}
                      onChange={(selectedOption) =>
                        setFormData({
                          ...formData,
                          identity_type: selectedOption
                            ? selectedOption.value
                            : "",
                        })
                      }
                      placeholder="Identity"
                    />
                    <input
                      type="text"
                      name="identity"
                      value={formData.identity}
                      id="identity"
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter Identity"
                    />
                  </div>
                  {/* Gambar KTP */}
                  <label for="ktp" className="form-label col-md-4">
                    KTP Image
                  </label>
                  <div className="col-md-8 file-input-wrapper">
                    <input
                      className="input-file"
                      type="file"
                      name="ktp"
                      onChange={handleKtpChange}
                      accept="image/*"
                      id="ktp"
                    />
                    <label for="ktp" class="file-button">
                      Choose File
                    </label>
                    <div class="file-display" id="fileDisplay">
                      {fileDisplay}
                    </div>
                  </div>
                  {/* NPWP */}
                  <label for="npwp" className="form-label col-md-4">
                    NPWP
                  </label>
                  <div className="col-md-8 icon-field">
                    <span className="icon mx-3">
                      <Icon className="icon-form" icon="ion:card-outline" />
                    </span>
                    <input
                      type="number"
                      name="npwp"
                      value={formData.npwp}
                      onChange={handleChange}
                      class="form-control"
                      id="npwp"
                      placeholder="Enter number NPWP"
                    />
                  </div>
                  {/* Nama NPWP */}
                  <label for="nama_pajak" className="form-label col-md-4">
                    Name NPWP
                  </label>
                  <div className="col-md-8 icon-field">
                    <span className="icon mx-3">
                      <Icon
                        className="icon-form"
                        icon="fluent:document-signature-48-regular"
                      />
                    </span>
                    <input
                      type="text"
                      name="nama_pajak"
                      value={formData.nama_pajak}
                      onChange={handleChange}
                      class="form-control"
                      id="nama_pajak"
                      placeholder="Enter name NPWP"
                    />
                  </div>
                  {/* Alamat NPWP */}
                  <label for="alamat_pajak" className="form-label col-md-4">
                    Address NPWP
                  </label>
                  <div className="col-md-8 icon-field">
                    <span className="icon mx-3">
                      <Icon className="icon-form" icon="ion:location-outline" />
                    </span>
                    <input
                      type="text"
                      name="alamat_pajak"
                      value={formData.alamat_pajak}
                      onChange={handleChange}
                      class="form-control"
                      id="alamat_pajak"
                      placeholder="Enter Address NPWP"
                    />
                  </div>
                  <hr />
                  <div className="col-12 mt-3 ">
                    <button
                      type="submit"
                      className="btn btn-primary d-flex align-items-center"
                      disabled={loading}
                    >
                      {loading ? (
                        "Menyimpan..."
                      ) : (
                        <>
                          <Icon
                            className="me-2"
                            icon="tabler:send"
                          />
                          Send
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerForm;
