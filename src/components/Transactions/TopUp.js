import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { BalanceContext } from "../../context/BalanceContext";
import { useNavigate } from "react-router-dom";
import BalanceCard from "../Dashboard/BalanceCard";
import Header from "../Dashboard/Header";
import "./TopUp.css";

const TopUp = () => {
  const { balance, setBalance, fetchBalance } = useContext(BalanceContext);
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(false);
  const [amount, setAmount] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [message, setMessage] = useState("");
  const [profileData, setProfileData] = useState({
    firstName: "User",
    lastName: "",
    profileImage: "/images/profile_photo.PNG",
  });
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    const savedBalance = localStorage.getItem("balance");
    if (savedBalance) {
      setBalance(parseInt(savedBalance));
    } else {
      fetchBalance();
    }

    const savedProfile = JSON.parse(localStorage.getItem("profileData"));
    if (savedProfile) {
      setProfileData(savedProfile);
    }
  }, [fetchBalance, setBalance]);

  const toggleBalanceVisibility = () => setShowBalance(!showBalance);

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value.replace(/\D/g, "")) || "";
    setAmount(value);
    setIsButtonDisabled(!(value >= 10000 && value <= 1000000));
  };

  const handleQuickAmount = (value) => {
    setAmount(value);
    setIsButtonDisabled(false);
  };

  const handleTopUp = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("Token tidak ditemukan. Silakan login kembali.");
      return;
    }

    setMessage("");

    if (amount <= 0) {
      setMessage(
        "Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0"
      );
      return;
    }

    try {
      const response = await axios.post(
        "https://take-home-test-api.nutech-integrasi.com/topup",
        { top_up_amount: amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === 0) {
        const newBalance = response.data.data.balance;
        setBalance(newBalance);
        localStorage.setItem("balance", newBalance); // Persist balance
        setMessage("Top Up Balance berhasil");
        setIsSuccessModalOpen(true); // Open success modal on successful top-up
        setIsConfirmationModalOpen(false); // Close confirmation modal
      } else {
        setMessage(response.data.message || "Top Up gagal");
      }
    } catch (error) {
      console.error("Error during top-up:", error);
      setMessage("Top Up gagal. Silakan coba lagi.");
    }
  };

  return (
    <div className="top-up">
      <Header />
      <div className="welcome-section">
        <div className="profile-info">
          <img
            src={profileData.profileImage || "/images/profile_photo.PNG"} // Fallback image if profileImage is empty
            alt="User Avatar"
            className="profile-avatar"
            onError={(e) => {
              e.target.src = "/images/profile_photo.PNG";
            }} // Fallback in case of broken image link
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

      <div className="top-up-content">
        <h2>Silahkan masukan</h2>
        <h3>Nominal Top Up</h3>
        <div className="top-up-input-container">
          <div className="top-up-field">
            <input
              type="text"
              placeholder="Masukkan nominal Top Up"
              value={amount ? `Rp${amount.toLocaleString("id-ID")}` : ""}
              onChange={handleInputChange}
              className="top-up-input"
            />
            <button
              onClick={() => setIsConfirmationModalOpen(true)}
              className="top-up-button"
              disabled={isButtonDisabled}
            >
              Top Up
            </button>
          </div>
          <div className="quick-amount-buttons">
            {[10000, 20000, 50000, 100000, 250000, 500000].map((value) => (
              <button
                key={value}
                onClick={() => handleQuickAmount(value)}
                className="quick-amount-button"
              >
                Rp{value.toLocaleString("id-ID")}
              </button>
            ))}
          </div>
        </div>
        {message && <p className="message">{message}</p>}
      </div>

      {/* Confirmation Modal */}
      {isConfirmationModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <img
              src="/images/logoo.png"
              alt="Confirmation Icon"
              className="modal-icon"
            />
            <p>Anda yakin untuk topup sebesar</p>
            <h2>Rp{amount.toLocaleString("id-ID")}?</h2>
            <button onClick={handleTopUp} className="modal-confirm-button">
              Ya, Lanjutkan Top Up
            </button>
            <button
              onClick={() => setIsConfirmationModalOpen(false)}
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
            <p>Top up sebesar</p>
            <p className="amount-display">Rp{amount.toLocaleString("id-ID")}</p>
            <p>berhasil!</p>
            <p
              className="modal-back red-text"
              onClick={() => navigate("/dashboard")}
            >
              Kembali ke Beranda
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopUp;
