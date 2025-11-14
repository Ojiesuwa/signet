// import React, { useState } from "react";
import type { TransactionType } from "../../pages/Scanning/Scanning";
import "./Status.css";
import banks from "../../banks.json";

export default function Status({
  status,
  onHide,
  amount,
  transaction,
}: {
  status: "good" | "warning" | "critical";
  onHide: any;
  amount: number;
  transaction: TransactionType;
}) {
  function formatNaira(amount: number): string {
    return `₦${amount.toLocaleString("en-NG")}`;
  }

  function formatIso(iso: string): string {
    const date = new Date(iso);

    // --- Time ---
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12; // convert 0 → 12
    const timeStr = `${hours.toString().padStart(2, "0")}:${minutes}${ampm}`;

    // --- Date ---
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    // add ordinal suffix
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";

    const dateStr = `${day}${suffix} ${month} ${year}`;

    return `${timeStr}, ${dateStr}`;
  }

  function getBankName(bankCode: string) {
    return banks.data.find((data) => data.code === bankCode)?.name;
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
      {status !== "critical" ? (
        <>
          {" "}
          <p className="amount">{formatNaira(transaction.amount)}</p>
          <div className="date__wrapper">
            <p>{formatIso(transaction.timestamp)}</p>
          </div>
          <div className="info__wrapper">
            <div className="info__item">
              <label
                htmlFor=""
                style={{
                  color:
                    status === "good"
                      ? "rgba(17, 144, 17, 1)"
                      : status === "warning"
                      ? "rgba(227, 178, 0, 1)"
                      : "rgba(215, 0, 0, 1)",
                }}
              >
                Sent to
              </label>
              <p className="acc__number">{transaction.receiverAccountNumber}</p>
              <p className="rec__name">{transaction.receiverName}</p>
              <p className="bank__name">
                {getBankName(transaction.receiverBankCode)}
              </p>
              <div
                className="your__account"
                style={{
                  color:
                    status === "good"
                      ? "rgba(17, 144, 17, 1)"
                      : status === "warning"
                      ? "rgba(227, 178, 0, 1)"
                      : "rgba(215, 0, 0, 1)",
                }}
              >
                {status === "good"
                  ? "(Money was sent to you)"
                  : "(Money sent to someone else)"}
              </div>
            </div>
            <div className="info__item">
              <label
                htmlFor=""
                style={{
                  color:
                    status === "good"
                      ? "rgba(17, 144, 17, 1)"
                      : status === "warning"
                      ? "rgba(227, 178, 0, 1)"
                      : "rgba(215, 0, 0, 1)",
                }}
              >
                Sent from
              </label>
              <p className="acc__number">{transaction.senderAccountNumber}</p>
              <p className="rec__name">{transaction.senderName}</p>
              <p className="bank__name">
                {getBankName(transaction.senderBankCode)}
              </p>
            </div>
          </div>
          <div className="transaction__reference">
            <p>Ref: {transaction.transactionReference}</p>
          </div>
        </>
      ) : (
        <p className="cr">
          <b>BEWARE</b>
          <br />
          This is an invalid Document
          <br /> Beware of this receipt
        </p>
      )}
    </div>
  );
}
