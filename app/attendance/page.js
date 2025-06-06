"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Toaster, toast } from "sonner";
import { Html5QrcodeScanner } from "html5-qrcode";

const AttendancePage = () => {
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const barcodeInputRef = useRef(null);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [keepScanning, setKeepScanning] = useState(false);
  const scannerRef = useRef(null);

  const handleBarcodeSubmit = useCallback(async (e, scannedBarcode) => {
    if (e) e.preventDefault();
    const codeToSubmit = scannedBarcode || barcode;

    if (!codeToSubmit) {
      toast.error("Please enter or scan a barcode.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode: codeToSubmit }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Participant marked as attended!");
        setBarcode("");
      } else {
        toast.error(data.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast.error("An error occurred while updating attendance.");
    } finally {
      setLoading(false);
      if (!isScannerActive && barcodeInputRef.current) {
        barcodeInputRef.current.focus();
      }
    }
  }, [barcode, isScannerActive]);

  useEffect(() => {
    if (isScannerActive) {
      const onScanSuccess = (decodedText) => {
        setBarcode(decodedText);
        handleBarcodeSubmit(null, decodedText);
        if (!document.getElementById('keepScanning')?.checked) {
          setIsScannerActive(false);
        }
      };
      const onScanFailure = (error) => { /* console.warn(error) */ };

      const scanner = new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        false // verbose
      );
      
      scanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = scanner;
    } else {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear scanner:", error);
        });
        scannerRef.current = null;
      }
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear scanner:", error);
        });
        scannerRef.current = null;
      }
    };
  }, [isScannerActive, handleBarcodeSubmit]);

  useEffect(() => {
    if (!isScannerActive && barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [isScannerActive]);

  return (
    <div className="attendance-container">
      <Toaster richColors position="top-center" />
      <h1 className="attendance-title">Mark Attendance</h1>

      <div
        id="reader"
        style={{ display: isScannerActive ? "block" : "none" }}
      ></div>

      {!isScannerActive && (
        <button
          onClick={() => setIsScannerActive(true)}
          className="btn-scanner"
        >
          Scan with Camera
        </button>
      )}

      {isScannerActive && (
        <>
          <button
            onClick={() => setIsScannerActive(false)}
            className="btn-scanner"
            style={{ backgroundColor: "#ef4444", marginBottom: "1rem" }}
          >
            Stop Scanner
          </button>
          <div className="keep-scanning-toggle">
            <input
              type="checkbox"
              id="keepScanning"
              checked={keepScanning}
              onChange={(e) => setKeepScanning(e.target.checked)}
            />
            <label htmlFor="keepScanning">Keep Scanning</label>
          </div>
        </>
      )}

      <p className="manual-entry-text">Or enter the barcode manually.</p>

      <form onSubmit={handleBarcodeSubmit} className="attendance-form">
        <div className="form-group">
          <label htmlFor="barcode" className="form-label">
            Barcode
          </label>
          <input
            ref={barcodeInputRef}
            type="text"
            id="barcode"
            name="barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="form-control"
            placeholder="Type barcode here..."
            autoFocus
            disabled={isScannerActive}
          />
        </div>
        <button
          type="submit"
          className="btn-submit"
          disabled={loading || isScannerActive}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AttendancePage;
