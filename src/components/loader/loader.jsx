import React from "react";
import loadingGif from "../../../public/assets/loader/la.gif";

export default function Loader() {
  return (
    <div className="loader-container">
      <img src={loadingGif} alt="Loading..." width="150" />
      <p>Loading data...</p>
    </div>
  );
}
