import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { BalanceContext } from "../../context/BalanceContext";
import Header from "../Dashboard/Header";
import BalanceCard from "../Dashboard/BalanceCard";
import { useNavigate } from "react-router-dom";
import "./Listrik.css";

const Listrik = () => {
  const { balance, setBalance, fetchBalance } = useContext(BalanceContext);
  const [showBalance, setShowBalance] = useState(false);
  const [amount, setAmount] = useState(10000);
  const [serviceCode] = useState("PLN");
  const [message, setMessage] = useState("");
  const [transactionData, setTransactionData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "User",
    lastName: "",
    profileImage: "/images/Profile_Photo.PNG",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchBalance();

    const savedProfile = JSON.parse(localStorage.getItem("profileData"));
    if (savedProfile) {
      setProfileData(savedProfile);
    }
  }, [fetchBalance]);

  const toggleBalanceVisibility = () => setShowBalance(!showBalance);

  const handlePayment = async () => {
    if (amount > balance) {
      setIsModalOpen(false);
      setIsFailureModalOpen(true);
      setMessage("");
      return;
    }

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("Token tidak ditemukan. Silakan login kembali.");
      return;
    }

    try {
      const response = await axios.post(
        "https://take-home-test-api.nutech-integrasi.com/transaction",
        { service_code: serviceCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === 0) {
        const newBalance = balance - amount;
        setBalance(newBalance);
        setTransactionData(response.data.data);
        localStorage.setItem("balance", newBalance);
        setIsModalOpen(false);
        setIsSuccessModalOpen(true);
      } else {
        setIsErrorModalOpen(true);
        setMessage(
          response.data.message || "Transaksi gagal. Silakan coba lagi."
        );
      }
    } catch (error) {
      console.error("Error processing transaction:", error);
      setIsErrorModalOpen(true);
      setMessage("Transaksi gagal. Silakan coba lagi.");
    }
  };

  return (
    <div className="listrik">
      <Header />

      <div className="welcome-section">
        <div className="profile-info">
          <img
            src={profileData.profileImage || "/images/Profile_Photo.PNG"}
            alt="User Avatar"
            className="profile-avatar"
            onError={(e) => {
              e.target.src = "/images/Profile_Photo.PNG";
            }}
          />
          <div className="welcome-text">
            <p>Selamat datang,</p>
            <p className="profile-name">
              {profileData.firstName} {profileData.lastName}
            </p>
          </div>
        </div>
        <BalanceCard
          balance={balance}
          showBalance={showBalance}
          toggleBalance={toggleBalanceVisibility}
        />
      </div>

      <div className="payment-section">
        <h2>Pembayaran Listrik</h2>
        <input
          type="text"
          value={`Rp ${amount.toLocaleString("id-ID")}`}
          readOnly
          className="payment-input"
        />
        <button onClick={() => setIsModalOpen(true)} className="payment-button">
          Bayar
        </button>
        {message && <p className="message">{message}</p>}
      </div>

      {/* Payment Confirmation Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <img
              src="/images/logoo.png"
              alt="Confirmation Icon"
              className="modal-icon"
            />
            <p>Beli listrik prabayar sebesar</p>
            <h2>Rp{amount.toLocaleString("id-ID")} ?</h2>
            <button onClick={handlePayment} className="modal-confirm-button">
              Ya, Lanjutkan Bayar
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="modal-cancel-button"
            >
              Batalkan
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-icon success-icon" />
            <p>Pembayaran listrik prabayar sebesar</p>
            <h2>Rp{amount.toLocaleString("id-ID")}</h2>
            <p>berhasil!</p>
            <p
              onClick={() => navigate("/dashboard")}
              className="clickable-red-text"
            >
              Kembali ke Beranda
            </p>
          </div>
        </div>
      )}

      {/* Failure Modal */}
      {isFailureModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-icon failure-icon" />
            <p>Pembayaran listrik prabayar sebesar</p>
            <p className="failure-amount">Rp{amount.toLocaleString("id-ID")}</p>
            <p className="modal-failed-message">gagal</p>
            <p
              onClick={() => navigate("/dashboard")}
              className="clickable-red-text"
            >
              Kembali ke Beranda
            </p>
          </div>
        </div>
      )}

      {/* Generic Error Modal */}
      {isErrorModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-icon failure-icon" />
            <p>{message}</p>
            <button
              onClick={() => setIsErrorModalOpen(false)}
              className="modal-back-button"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Listrik;
