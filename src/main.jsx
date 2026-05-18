import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import "../public/assets/css/remixicon.css";
import "../public/assets/css/lib/bootstrap.min.css";
import "../public/assets/css/lib/apexcharts.css";
import "../public/assets/css/lib/dataTables.min.css";
import "../public/assets/css/lib/editor-katex.min.css";
import "../public/assets/css/lib/editor.atom-one-dark.min.css";
import "../public/assets/css/lib/editor.quill.snow.css";
import "../public/assets/css/lib/flatpickr.min.css";
import "../public/assets/css/lib/full-calendar.css";
import "../public/assets/css/lib/jquery-jvectormap-2.0.5.css";
import "../public/assets/css/lib/magnific-popup.css";
import "../public/assets/css/lib/slick.css";
import "../public/assets/css/lib/prism.css";
import "../public/assets/css/lib/file-upload.css";
import "../public/assets/css/lib/audioplayer.css";
import "../public/assets/css/lib/animate.min.css";
import "../public/assets/css/style.css";
import "../public/assets/css/extra.css";

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
