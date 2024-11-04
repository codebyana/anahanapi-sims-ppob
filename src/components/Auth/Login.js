// src/components/Auth/Login.js
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const requestData = {
      email: data.email,
      password: data.password,
    };

    try {
      const response = await axios.post(
        "https://take-home-test-api.nutech-integrasi.com/login",
        requestData
      );
      const token = response?.data?.data?.token; // Safely retrieve the token

      if (token) {
        setMessage("Login berhasil!");
        localStorage.setItem("jwtToken", token); // Store token in localStorage
        console.log("JWT Token:", token);

        // Redirect to the dashboard after successful login
        navigate("/dashboard");
      } else {
        setMessage("Login gagal: Token tidak diterima");
        console.error("Token not found in response");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Login gagal, silakan coba lagi.";
      setMessage(errorMsg);
      console.error("Terjadi kesalahan saat login:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-form">
          <h1 className="logo">
            <img src="/images/logoo.png" alt="Logo" className="logo-image" />
            SIMS PPOB
          </h1>
          <p className="subtitle">Masuk atau buat akun untuk memulai</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              {...formRegister("email", {
                required: "Email wajib diisi",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Format email tidak valid",
                },
              })}
              placeholder="Masukkan email anda"
              className="input-field"
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}

            <input
              {...formRegister("password", {
                required: "Password wajib diisi",
                minLength: { value: 8, message: "Password minimal 8 karakter" },
              })}
              type="password"
              placeholder="Masukkan password anda"
              className="input-field"
            />
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}

            <button type="submit" className="login-button">
              Masuk
            </button>
          </form>
          {message && <p className="message">{message}</p>}
          <p className="register-prompt">
            Belum punya akun?{" "}
            <a href="/registration" className="register-link">
              Registrasi di sini
            </a>
          </p>
          <p className="demo-credentials">
            Username Demo: demo@example.com
            <br />
            Password Demo: password123
          </p>
        </div>
        <div className="login-image">
          <img src="/images/Illustrasi_Login.png" alt="Illustration" />
        </div>
      </div>
    </div>
  );
};

export default Login;
