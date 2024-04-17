import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { LoadingProvider } from "./context/LoadingContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { Tooltip } from "react-tooltip";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LoadingProvider>
          <App />
          <Tooltip id="tooltip" />
        </LoadingProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
