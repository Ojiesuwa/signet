import { useEffect, useState } from "react";
import "./AddBank.css";
import { toast } from "react-toastify";

export default function AddBank({
  onHide,
  onProcess,
}: {
  onHide: any;
  onProcess: any;
}) {
  const [banks, setBanks] = useState<any[]>([]);
  const [filteredBanks, setFilteredBanks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [accountNumber, setAccountNumber] = useState("");

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await fetch("https://api.paystack.co/bank");
        const data = await res.json();
        if (data.status) {
          setBanks(data.data);
          setFilteredBanks(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch banks", err);
      }
    };
    fetchBanks();
  }, []);

  // Handle search filtering
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredBanks(banks);
    } else {
      const lower = search.toLowerCase();
      setFilteredBanks(
        banks.filter((b) => b.name.toLowerCase().includes(lower))
      );
    }
  }, [search, banks]);

  const handleSelectBank = (bank: any) => {
    setSelectedBank(bank);
    setSearch(bank.name);
  };

  const processAccount = async () => {
    const url = `http://podiumpal.vercel.app/api/paystack-resolve?bankCode=${selectedBank.code}&accountNumber=${accountNumber}`;

    console.log(selectedBank, accountNumber);

    try {
      const res = await fetch(url, { method: "GET" });
      const response = await res.json();
      console.log(response);

      const name = response.data.account_name;
      onProcess(name, accountNumber, selectedBank.name);
      onHide();
    } catch (error) {
      console.error(error);
      // onHide();
      toast.error("Error resolving name");
    }
  };

  const isProceedEnabled = accountNumber.length === 10 && selectedBank !== null;

  return (
    <div className="add__bank">
      <div className="topbar" onClick={onHide}>
        <i className="fa-light fa-arrow-left"></i>
        <p>Add new details</p>
      </div>

      <div className="main__wrapper">
        <div className="input__wrapper">
          <label htmlFor="">Account number</label>
          <input
            type="text"
            maxLength={10}
            value={accountNumber}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setAccountNumber(val);
            }}
            placeholder="Enter 10-digit account number"
          />
        </div>

        <div className="input__wrapper">
          <label htmlFor="">Search Bank</label>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedBank(null);
            }}
            placeholder="Type to search banks..."
          />
        </div>
      </div>

      <div className="banks__wrapper">
        {filteredBanks.map((bank) => (
          <div
            key={bank.id}
            className={`bank__item ${
              selectedBank?.code === bank.code ? "selected" : ""
            }`}
            onClick={() => handleSelectBank(bank)}
          >
            <span className="material-symbols-outlined text-text-light/70 dark:text-text-dark/70">
              account_balance
            </span>
            <p>{bank.name}</p>
          </div>
        ))}
      </div>

      <button
        disabled={!isProceedEnabled}
        className={isProceedEnabled ? "active" : ""}
        onClick={processAccount}
      >
        Proceed
      </button>
    </div>
  );
}
