import { useNavigate } from "react-router-dom";
import CameraFeed from "../../components/CameraFeed/CameraFeed";
import "./Scanning.css";
import Status from "../../components/Status/Status";
import { useState } from "react";

export default function Scanning() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState<"good" | "warning" | "critical">(
    "critical"
  );
  const [amount, setAmount] = useState<number>(0);
  return (
    <div className="scanning fade-up">
      <div className="header">
        <div className="setup__btn" onClick={() => navigate("/setup")}>
          <i className="fa-solid fa-user"></i>
          Setup
        </div>
      </div>
      <div className="main">
        <div className="camera__view">
          <CameraFeed />
        </div>
        <button onClick={() => setIsVisible(true)}>Verify Receipt</button>
      </div>
      {isVisible && (
        <Status
          status={status}
          onHide={() => setIsVisible(false)}
          amount={amount}
        />
      )}
    </div>
  );
}
