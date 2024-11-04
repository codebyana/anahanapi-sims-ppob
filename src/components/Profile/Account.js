import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Dashboard/Header";
import { FaPencilAlt } from "react-icons/fa";
import "./Account.css";

const Account = () => {
  const [profileData, setProfileData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    profileImage:
      localStorage.getItem("profileImageURL") || "/images/profile_photo.png",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profileData);
  const [successMessage, setSuccessMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        alert("Token tidak ditemukan. Silakan login kembali.");
        return;
      }

      try {
        const response = await axios.get(
          "https://take-home-test-api.nutech-integrasi.com/profile", // Absolute URL
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { email, first_name, last_name, profile_image } = response.data.data;
        const updatedProfile = {
          email,
          firstName: first_name,
          lastName: last_name,
          profileImage: profile_image || "/images/profile_photo.png",
        };
        setProfileData(updatedProfile);
        setFormData(updatedProfile);
        localStorage.setItem("profileData", JSON.stringify(updatedProfile));
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        alert("Gagal memuat profil. Silakan coba lagi.");
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData(profileData);
    setSuccessMessage("");
    setImageFile(null);
    setPreviewImage(null);
  };

  const handleSaveClick = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("Token tidak ditemukan. Silakan login kembali.");
      return;
    }

    const updateData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
    };

    try {
      const response = await axios.put(
        "https://take-home-test-api.nutech-integrasi.com/profile/update", // Absolute URL
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const updatedProfile = {
          ...response.data.data,
          profileImage: response.data.data.profile_image || "/images/profile_photo.png",
        };
        setProfileData(updatedProfile);
        localStorage.setItem("profileData", JSON.stringify(updatedProfile));
        setIsEditing(false);
        setSuccessMessage("Update Profile berhasil");

        // Refresh the page immediately
        window.location.reload();
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      alert("Format Image tidak sesuai. Gunakan file JPEG atau PNG.");
    }
  };

  const handleUploadImage = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("Token tidak ditemukan. Silakan login kembali.");
      return;
    }

    if (!imageFile) {
      alert("Pilih gambar terlebih dahulu");
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await axios.put(
        "https://take-home-test-api.nutech-integrasi.com/profile/image", // Absolute URL
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const updatedProfile = {
          ...profileData,
          profileImage: response.data.data.profile_image,
        };

        setProfileData(updatedProfile);
        localStorage.setItem("profileData", JSON.stringify(updatedProfile));
        sessionStorage.setItem("profileData", JSON.stringify(updatedProfile));
        setSuccessMessage("Update Profile Image berhasil");
        setPreviewImage(null);
      } else {
        alert("Failed to update profile image");
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Gagal mengupload gambar. Silakan coba lagi.");
    }
  };

  return (
    <div className="account">
      <Header />
      <div className="account-content">
        <div className="profile-avatar-container">
          <img
            src={previewImage || profileData.profileImage}
            alt="User Avatar"
            className="profile-avatar"
            onError={(e) => {
              e.target.src = "/images/profile_photo.png";
            }}
          />
          {isEditing && (
            <>
              <input
                id="upload-input"
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleImageChange}
                className="upload-input"
                style={{ display: "none" }}
              />
              <label htmlFor="upload-input" className="edit-avatar-icon">
                <FaPencilAlt />
              </label>
              <button
                type="button"
                className="upload-button"
                onClick={handleUploadImage}
              >
                Upload Image
              </button>
            </>
          )}
        </div>
        <h2>
          {profileData.firstName} {profileData.lastName}
        </h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form className="account-form">
          <label>Email</label>
          <input type="email" name="email" value={profileData.email} readOnly />

          <label>Nama Depan</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            readOnly={!isEditing}
          />

          <label>Nama Belakang</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            readOnly={!isEditing}
          />

          {isEditing ? (
            <>
              <button
                type="button"
                className="save-button"
                onClick={handleSaveClick}
              >
                Simpan
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancelClick}
              >
                Batalkan
              </button>
            </>
          ) : (
            <button
              type="button"
              className="edit-profile-button"
              onClick={handleEditClick}
            >
              Edit Profile
            </button>
          )}

          <button
            type="button"
            className="logout-button"
            onClick={() => (window.location.href = "/login")}
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
};

export default Account;
