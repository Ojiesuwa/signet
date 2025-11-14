import { useNavigate } from "react-router-dom";
import "./Scanning.css";
import Status from "../../components/Status/Status";
import { useState, useRef, useEffect } from "react";
// Import the necessary components from zxing-js
import {
  BrowserMultiFormatReader,
  DecodeHintType,
  BarcodeFormat,
} from "@zxing/library";
import { Spiral } from "ldrs/react";
import "ldrs/react/Spiral.css";
import { toast } from "react-toastify";
import { unpackSeal } from "../../controllers/seal";

// Note: I'm keeping the original 'banks' import even though it's unused in this file
// and the 'transaction' state's initial value for context, but focusing on the scanning logic.
// import banks from "../../banks.json"; // (kept for original context)

export interface TransactionType {
  amount: number;
  timestamp: string;
  transactionReference: string;
  senderAccountNumber: string;
  senderBankCode: string;
  senderName: string;
  receiverAccountNumber: string;
  receiverBankCode: string;
  receiverName: string;
}

const SCAN_TIMEOUT_MS = 10000; // 10 seconds timeout constant

export default function Scanning() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState<"good" | "warning" | "critical">(
    "warning"
  );
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false); // State to control the loading spinner
  const [transaction, setTransaction] = useState<TransactionType | null>({
    amount: 2000,
    timestamp: "2025-11-14T00:45:52.123Z",
    transactionReference: "345jj5k609j6ji044gtar",
    senderAccountNumber: "9023426098",
    senderName: "Oluwarotimi Temidire",
    senderBankCode: "999992",
    receiverAccountNumber: "9090533884",
    receiverBankCode: "999992",
    receiverName: "Afam Divine",
  });

  // Camera logic inlined
  const videoRef = useRef<HTMLVideoElement>(null);
  // Ref to hold the scanner instance
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  /**
   * Creates a Promise that rejects after a specified time.
   */
  const createTimeoutPromise = (ms: number): Promise<never> => {
    return new Promise((_, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id);
        reject(new Error("Timeout: Barcode detection exceeded 10 seconds."));
      }, ms);
    });
  };

  /**
   * Scans the current video feed for a PDF417 barcode, with a 10s timeout.
   */
  const scanBarcode = async () => {
    if (!videoRef.current) {
      alert("Error: Video feed is not available.");
      return;
    }

    // Start Loading
    setIsLoading(true);

    try {
      if (!codeReaderRef.current) {
        // Configure the scanner to ONLY look for PDF_417
        const hints = new Map<DecodeHintType, any>();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.PDF_417]);

        // Initialize the reader
        codeReaderRef.current = new BrowserMultiFormatReader(hints, 500); // 500ms timeout
      }

      const stream = videoRef.current.srcObject as MediaStream;
      if (!stream) {
        alert("Camera stream is not active.");
        return;
      }

      const videoTrack = stream.getVideoTracks()[0];
      const deviceId = videoTrack
        ? videoTrack.getSettings().deviceId
        : undefined;

      let decodePromise: Promise<any>;

      if (!deviceId) {
        // Fallback: decode directly from video element
        console.warn(
          "Could not determine deviceId, attempting to decode from video element."
        );
        decodePromise = codeReaderRef.current.decodeFromVideoElement(
          videoRef.current
        );
      } else {
        // Primary: decode once from video device
        decodePromise = codeReaderRef.current.decodeOnceFromVideoDevice(
          deviceId,
          videoRef.current
        );
      }

      // *** 10-Second Timeout Logic using Promise.race ***
      const result = await Promise.race([
        decodePromise,
        createTimeoutPromise(SCAN_TIMEOUT_MS),
      ]);
      // *************************************************

      // If Promise.race resolves, it means decoding succeeded before the timeout
      // const data = unpackSeal(
      //   result.getText(),"jf"
      // );
      alert(`PDF417 Scanned: ${result.getText()}`);
      setIsVisible(true);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("No code detected")) {
          alert(
            "No PDF417 barcode found in the frame. Please align the receipt and try again."
          );
        } else if (err.message.includes("Timeout")) {
          // Specific alert for the timeout error
          toast.error("Coouldn't detect barcode");
        } else {
          console.error("Barcode scanning error:", err);
          alert(`Scanning Error: ${err.message}`);
        }
      } else {
        console.error("Unknown scanning error:", err);
        alert("An unknown error occurred during scanning.");
      }
    } finally {
      // Stop Loading regardless of success or failure
      setIsLoading(false);
      // Ensure the scanner is reset after attempting to scan
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    }
  };

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // back camera
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Camera access denied or failed: " + err);
      }
    };

    startCamera();

    return () => {
      // Stop the video tracks when the component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
      // Clean up the scanner
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, []);

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
          <video ref={videoRef} autoPlay playsInline className="camera__feed" />
        </div>
        <button onClick={scanBarcode} disabled={isLoading}>
          {isLoading ? (
            <>
              <Spiral size="20" speed="0.9" color="white" />
              Scanning...
            </>
          ) : (
            <>Verify Receipt</>
          )}
        </button>
      </div>
      {isVisible && (
        <Status
          status={status}
          onHide={() => setIsVisible(false)}
          amount={amount}
          transaction={transaction as any}
        />
      )}
    </div>
  );
}
