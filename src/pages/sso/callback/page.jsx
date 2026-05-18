"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function SSOCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  

  useEffect(() => {
    const token = searchParams.get("token");

    const callCallbackApi = async (jwt) => {
      try {
        const response = await axios.get(
          "https://univerz.ai/api/v1/sso/callback",
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );

        const comId = response?.data?.data?.user?.company_id ?? null;

        console.log(
          "Callback API success:",
          response.data.data.user.company_id
        );
        if (comId) {
          router.push("/dashboard");
        } else {
          router.push("/select-company");
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
  }, [searchParams, router]);

  if (!loading) {
    return <p>{errorMsg}</p>;
  }

  return <p>Processing SSO login...</p>;
}
