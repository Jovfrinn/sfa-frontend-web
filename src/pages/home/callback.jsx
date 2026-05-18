import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function SSOCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    const callCallbackApi = async (jwt) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URI}/sso/callback`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
            withCredentials: true,
          }
        );

        const comId = response?.data?.data?.user?.company_id ?? null;

        console.log("Callback API success:", comId);
        if (comId) {
          navigate("/dashboard");
        } else {
          navigate("/select-company");
        }
      } catch (error) {
        console.error("Callback API error:", error);
        setErrorMsg("Gagal memproses SSO callback.");
        setLoading(false);
      }
    };

    if (token) {
      localStorage.setItem("token", token);
      callCallbackApi(token);
    } else {
      setErrorMsg("Token SSO tidak ditemukan atau invalid.");
      setLoading(false);
    }
  }, [location.search, navigate]);

  if (!loading) {
    return <p>{errorMsg}</p>;
  }

  return <p>Processing SSO login...</p>;
}
