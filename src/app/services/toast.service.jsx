import React from "react";
import ReactDOM from "react-dom/client";
import toast, { Toaster } from "react-hot-toast";
import FontAwesomeIcon from "../shared/fontAwesomeIcon/FontAwesomeIcon";
import { FeatherIcon } from "../shared/featherIcon/FeatherIcon";

class ToastService {
  constructor() {
    const toastContainer = document.createElement("div");
    document.body.appendChild(toastContainer);
    ReactDOM.createRoot(toastContainer).render(
      <Toaster
        position="top-right"
        reverseOrder={true}
        gutter={10}
        toastOptions={{
          duration: 3000,
        }}
      />
    );
  }

  success(message) {
    toast((t) => (
      <div
        style={{
          padding: "15px 15px 15px 12px",
          minHeight: "105px",
          width: "300px",
          borderRadius: "8px",
          backgroundColor: "#BEF9DC",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <FontAwesomeIcon
              primaryColor
              name={"check-circle"}
              size={17}
              style={{
                display: "inline-block",
              }}
            />

            <span
              style={{
                marginLeft: "5px",
                fontWeight: "600",
                fontSize: "18px",
              }}
            >
              Success
            </span>
          </div>
          <div>
            <FeatherIcon
              onClick={() => toast.dismiss(t.id)}
              style={{ cursor: "pointer" }}
              name={"X"}
            />
          </div>
        </div>
        <div style={{ marginTop: "10px", marginLeft: "3px" }}>{message}</div>
      </div>
    ));
  }

  error(message) {
    toast((t) => (
      <div
        style={{
          padding: "15px 15px 15px 12px",
          minHeight: "105px",
          width: "300px",
          borderRadius: "8px",
          backgroundColor: "#FFDCDA",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <FeatherIcon size={19} color={"#D94339"} name={"XCircle"} />
            <span
              style={{
                marginLeft: "10px",
                fontWeight: "600",
                fontSize: "19px",
                lineHeight: "19px",
              }}
            >
              Error
            </span>
          </div>
          <div>
            <FeatherIcon
              onClick={() => toast.dismiss(t.id)}
              style={{ cursor: "pointer" }}
              name={"X"}
            />
          </div>
        </div>
        <div style={{ marginTop: "10px", marginLeft: "3px" }}>{message}</div>
      </div>
    ));
  }

  warning(message) {
    toast((t) => (
      <div
        style={{
          padding: "15px 15px 15px 12px",
          minHeight: "105px",
          width: "300px",
          borderRadius: "8px",
          backgroundColor: "#FFEBCC",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <FeatherIcon size={19} color={"#FFAA2C"} name={"AlertCircle"} />
            <span
              style={{
                marginLeft: "10px",
                fontWeight: "600",
                fontSize: "19px",
                lineHeight: "19px",
              }}
            >
              Warning
            </span>
          </div>
          <div>
            <FeatherIcon
              onClick={() => toast.dismiss(t.id)}
              style={{ cursor: "pointer" }}
              name={"X"}
            />
          </div>
        </div>
        <div style={{ marginTop: "10px", marginLeft: "3px" }}>{message}</div>
      </div>
    ));
  }
}

export default new ToastService();
