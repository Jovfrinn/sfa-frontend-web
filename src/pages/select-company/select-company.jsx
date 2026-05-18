"use client";

import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import "../../../public/assets/css/select-company.css";

export default function SelectCompany() {
  const navigate = useNavigate();
  const [search, setSearch] = useState(null);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    getCompany();
  }, [search]);

  const getCompany = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URI}/get-company`,
        {
          params: { search },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCompanies(response.data.data);
    } catch (error) {
      console.error("Callback API error:", error);
    }
  };

  const setCompany = async (companyId) => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}/set-company`,
        { company_id: companyId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Callback API error:", error);
    }
  };

  return (
    <>
      <style>{`* {
  box-sizing: border-box !important;
  margin: 0 !important;
  padding: 0 !important;
}
body {
  font-family: "Poppins", sans-serif !important;
  background-color: #f8f9fa !important;
  color: #212529 !important;
  line-height: 1.6 !important;
}
.container {
  max-width: 1280px !important;
  margin: 0 auto !important;
  padding: 40px 20px !important;
}

.main-header {
  text-align: center !important;
  margin-bottom: 40px !important;
}
.main-header h1 {
  font-size: 2.5rem !important;
  font-weight: 600 !important;
  margin-bottom: 8px !important;
}
.main-header .subtitle {
  font-size: 1.1rem !important;
  color: #6c757d !important;
  margin-bottom: 30px !important;
}
.search-form {
  display: flex !important;
  max-width: 600px !important;
  margin: 0 auto !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05) !important;
  border-radius: 50px !important;
}
.search-form input {
  flex-grow: 1 !important;
  padding: 15px 25px !important;
  font-size: 1rem !important;
  border: 1px solid #dee2e6 !important;
  border-right: none !important;
  border-radius: 50px 0 0 50px !important;
  outline: none !important;
}
.search-form input:focus {
  border-color: #86b7fe !important;
}
.search-form button {
  padding: 15px 25px !important;
  font-size: 1.2rem !important;
  background-color: #0d6efd !important;
  color: white !important;
  border: none !important;
  border-radius: 0 50px 50px 0 !important;
  cursor: pointer !important;
  transition: background-color 0.2s ease !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
.search-form button:hover {
  background-color: #0b5ed7 !important;
}

.list-view {
  display: flex !important;
  flex-direction: column !important;
  gap: 10px !important;
  max-width: 800px !important;
  margin: 0 auto !important;
}
.list-item {
  margin-top: 10px !important;
  display: flex !important;
  align-items: center !important;
  background-color: #ffffff !important;
  padding: 15px 20px !important;
  border-radius: 10px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
  transition: box-shadow 0.3s ease, transform 0.3s ease !important;
  width: 100% !important;
}
.list-item:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08) !important;
}
.list-item-logo {
  width: 40px !important;
  height: 40px !important;
  border-radius: 50% !important;
  background-color: #e9ecef !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: #adb5bd !important;
  margin-right: 20px !important;
}
.list-item-details {
  flex-grow: 1 !important;
  min-width: 0 !important;
}
.list-item-title {
  font-size: 1.1rem !important;
  font-weight: 500 !important;
  color: #343a40 !important;
}
.list-item-desc {
  font-size: 0.9rem !important;
  color: #6c757d !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
.list-item-action {
  padding: 8px 20px !important;
  background-color: #0d6efd !important;
  color: #ffffff !important;
  text-align: center !important;
  font-weight: 500 !important;
  border-radius: 8px !important;
  cursor: pointer !important;
  transition: background-color 0.2s ease !important;
  white-space: nowrap !important;
  margin-left: 15px !important;
}
.list-item-action:hover {
  background-color: #0b5ed7 !important;
}

.back-to-home {
  position: absolute !important;
  top: 30px !important;
  left: 30px !important;
  display: flex !important;
  align-items: center !important;
  color: var(--dark-text) !important;
  text-decoration: none !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  transition: color 0.3s ease !important;
}

.back-to-home:hover {
  color: var(--primary-blue) !important;
}

.back-to-home svg {
  margin-right: 8px !important;
  width: 20px !important;
  height: 20px !important;
  fill: currentColor !important;
}

#no-results-message {
  text-align: center !important;
  font-size: 1.2rem !important;
  color: #6c757d !important;
  padding: 40px 0 !important;
}
.hidden {
  display: none !important;
}
.modal-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background-color: rgba(0, 0, 0, 0.6) !important;
  display: none !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 1000 !important;
  opacity: 0 !important;
  transition: opacity 0.3s ease !important;
}
.modal-overlay.active {
  display: flex !important;
  opacity: 1 !important;
}
.modal-content {
  background-color: #ffffff !important;
  padding: 30px !important;
  border-radius: 12px !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3) !important;
  width: 90% !important;
  max-width: 600px !important;
  position: relative !important;
  transform: translateY(-20px) !important;
  transition: transform 0.3s ease !important;
}
.modal-overlay.active .modal-content {
  transform: translateY(0) !important;
}
.modal-content h2 {
  margin-top: 0 !important;
  margin-bottom: 15px !important;
}
.modal-close {
  position: absolute !important;
  top: 15px !important;
  right: 15px !important;
  background: none !important;
  border: none !important;
  font-size: 2rem !important;
  color: #6c757d !important;
  cursor: pointer !important;
  line-height: 1 !important;
}
`}</style>

      <div className="container">
        <header className="main-header">
          <h1>Pilih Perusahaan</h1>
          <p className="subtitle">
            Untuk melanjutkan, silakan pilih perusahaan Anda
          </p>
          <div className="search-form">
            <input
              type="search"
              className="text-start"
              placeholder="Cari perusahaan..."
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" aria-label="Cari">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </button>
          </div>
        </header>

        <main>
          {companies && companies.length > 0 ? (
            companies.map((v, i) => (
              <div className="list-view" key={i}>
                <div className="list-item">
                  <div className="list-item-logo">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-15a.5.5 0 0 1 .5-.5h14.263zM4.5 13.5V8.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0V5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0V3.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM2 11.5V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"
                      />
                    </svg>
                  </div>
                  <div className="list-item-details">
                    <h3 className="list-item-title">{v.name}</h3>
                    <p className="list-item-desc">{v.business_sector}</p>
                  </div>
                  <button
                    onClick={() => setCompany(v.id)}
                    className="list-item-action"
                  >
                    Pilih
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p id="no-results-message">
              Tidak ada perusahaan yang cocok dengan pencarian Anda.
            </p>
          )}
        </main>
      </div>

      <div className="modal-overlay" id="company-modal">
        <div className="modal-content">
          <button className="modal-close" aria-label="Tutup">
            &times;
          </button>
          <h2 id="modal-company-name">Nama Perusahaan</h2>
          <p id="modal-company-details">
            Detail informasi dummy tentang perusahaan akan muncul di sini.
          </p>
        </div>
      </div>
    </>
  );
}
