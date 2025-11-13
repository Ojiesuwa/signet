// import React, { useState } from "react";
import "./Status.css";

export default function Status({
  status,
  onHide,
  amount,
}: {
  status: "good" | "warning" | "critical";
  onHide: any;
  amount: number;
}) {
  function formatNaira(amount: number): string {
    return `₦${amount.toLocaleString("en-NG")}`;
  }
  return (
    <div
      className="status fade-fast"
      style={{
        background:
          status === "good"
            ? "rgb(232, 255, 232)"
            : status === "warning"
            ? "rgba(255, 249, 215, 1)"
            : "rgb(255, 221, 221)",
      }}
    >
      <div className="topbar" onClick={onHide}>
        <i className="fa-light fa-arrow-left"></i>
      </div>
      <div
        className="icon__wrapper"
        style={{
          backgroundColor:
            status === "good"
              ? "rgb(4, 223, 4)"
              : status === "warning"
              ? "rgba(227, 178, 0, 1)"
              : "rgba(215, 0, 0, 1)",
        }}
      >
        {status === "good" ? (
          <i className="fa-solid fa-check"></i>
        ) : status === "warning" ? (
          <i className="fa-solid fa-exclamation"></i>
        ) : (
          <i className="fa-solid fa-exclamation"></i>
        )}

        {/* <i className="fa-solid fa-check"></i> */}
      </div>
      <p className="amount">{formatNaira(amount)}</p>
      <div className="info__wrapper">
        <div className="info__item">
          <i
            className={
              "fa-light " +
              (status === "critical" ? "fa-circle-xmark" : "fa-circle-check")
            }
            style={{
              color:
                status === "good"
                  ? "rgba(15, 162, 15, 1)"
                  : status === "warning"
                  ? "rgba(173, 138, 14, 1)"
                  : "rgba(153, 13, 13, 1)",
            }}
          ></i>
          {status === "critical" ? (
            <p className="bold" style={{ color: "rgba(153, 13, 13, 1)" }}>
              Document has been tampered with
            </p>
          ) : (
            <p>Document is valid and authentic</p>
          )}
        </div>
        <div className="info__item">
          <i
            className={
              "fa-light " +
              (status === "warning" ? "fa-circle-xmark" : "fa-circle-check")
            }
            style={{
              color:
                status === "good"
                  ? "rgba(15, 162, 15, 1)"
                  : status === "warning"
                  ? "rgba(173, 138, 14, 1)"
                  : "rgba(153, 13, 13, 1)",
            }}
          ></i>
          {status === "warning" ? (
            <p className="bold" style={{ color: "rgba(200, 167, 5, 1)" }}>
              Transfer wasn't done to you
            </p>
          ) : (
            <p>Transfer was done to your account</p>
          )}
        </div>
      </div>
    </div>
  );
}
