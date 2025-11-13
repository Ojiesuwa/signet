import { useEffect, useState } from "react";
import AddBank from "../../components/AddBank/AddBank";
import "./Setup.css";
import { liveListen, storeData } from "../../controllers/db";

export default function Setup() {
  const [isVisible, setIsVisible] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const handleProcessAddAccount = async (
    name: string,
    accountNumber: string,
    bankName: string
  ) => {
    console.log(name, accountNumber, bankName);
    storeData({ name, accountNumber, bankName });
  };

  useEffect(() => {
    liveListen((data) => setAccounts(data));
  }, []);
  return (
    <div className="setup fade-right-fast">
      <div className="heading">
        <img src="/signet_logo.png" alt="" />
        <button onClick={() => setIsVisible(true)}>
          Add <i className="fa-light fa-plus"></i>
        </button>
      </div>
      <div className="main">
        {accounts.map((data, index) => (
          <div className="saved__item" key={index}>
            <div className="left">
              <span className="material-symbols-outlined text-text-light/70 dark:text-text-dark/70">
                account_balance
              </span>
            </div>
            <div className="right">
              <p className="bank__name">{data.bankName}</p>
              <div className="account__name__wrapper">
                <i className="fa-light fa-user"></i>
                <p>{data.name}</p>
              </div>
              <div className="account__name__wrapper">
                <i className="fa-light fa-credit-card"></i>
                <p>•••• {data.accountNumber.slice(-4)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isVisible && (
        <AddBank
          onProcess={handleProcessAddAccount}
          onHide={() => setIsVisible(false)}
        />
      )}
    </div>
  );
}
