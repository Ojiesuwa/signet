import { useEffect, useRef } from "react";
import "./CameraFeed.css";

export default function CameraFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        // --- THIS IS THE CHANGE ---
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment", // Request the back camera
          },
        });
        // -------------------------

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return <video ref={videoRef} autoPlay playsInline className="camera__feed" />;
}
