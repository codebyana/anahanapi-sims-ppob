// src/components/Auth/Register.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import './Register.css';

const Register = () => {
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm();
  const [message, setMessage] = useState('');

  const onSubmit = async (data) => {
    // Prepare the request data according to API requirements
    const requestData = {
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
    };

    try {
      // Use axios with a proxy (configured in package.json) for development or the full URL otherwise
      const response = await axios.post('/https://api-doc-tht.nutech-integrasi.com/registration', requestData);

      // Set success message if registration was successful
      if (response.status === 200) {
        setMessage('Registrasi berhasil!');
      } else {
        setMessage('Registrasi gagal, silakan coba lagi.');
      }
    } catch (error) {
      // Capture and log detailed error response from the API
      console.error('Registration Error:', error.response);
      const errorMsg = error.response?.data?.message || 'Registrasi gagal, silakan coba lagi.';
      setMessage(errorMsg);
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <div className="register-form">
          <h1 className="logo">
            <img src="/images/logoo.png" alt="Logo" className="logo-image" />
            SIMS PPOB
          </h1>
          <p className="subtitle">Lengkapi data untuk membuat akun</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              {...formRegister('email', {
                required: 'Email wajib diisi',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Format email tidak valid' },
              })}
              placeholder="Masukkan email anda"
              className="input-field"
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}

            <input
              {...formRegister('firstName', { required: 'Nama depan wajib diisi' })}
              placeholder="Nama depan"
              className="input-field"
            />
            {errors.firstName && <span className="error-message">{errors.firstName.message}</span>}

            <input
              {...formRegister('lastName', { required: 'Nama belakang wajib diisi' })}
              placeholder="Nama belakang"
              className="input-field"
            />
            {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}

            <input
              {...formRegister('password', {
                required: 'Password wajib diisi',
                minLength: { value: 8, message: 'Password minimal 8 karakter' },
              })}
              type="password"
              placeholder="Buat password"
              className="input-field"
            />
            {errors.password && <span className="error-message">{errors.password.message}</span>}

            <input
              {...formRegister('confirmPassword', {
                required: 'Konfirmasi password wajib diisi',
                validate: value => value === getValues('password') || 'Password tidak cocok',
              })}
              type="password"
              placeholder="Konfirmasi password"
              className="input-field"
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}

            <button type="submit" className="register-button">Registrasi</button>
          </form>
          {message && <p className="message">{message}</p>}
          <p className="login-prompt">
            Sudah punya akun? <Link to="/login" className="login-link">Login di sini</Link>
          </p>
        </div>
        <div className="register-image">
          <img src="/images/Illustrasi_Login.png" alt="Illustration" />
        </div>
      </div>
    </div>
  );
};

export default Register;
