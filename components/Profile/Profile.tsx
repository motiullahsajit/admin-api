"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Profile.module.scss";

export default function Profile() {
  const [user, setUser] = useState({
    photo_url: "",
    name: "",
    email: "",
    username: "",
    phone_number: "",
  });

  const [formData, setFormData] = useState({
    name: user.name,
    phone_number: user.phone_number,
    newPassword: "",
    oldPassword: "",
    new_photo_url: null,
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(`/api/admin?id=${userId}`);
      const userData = response.data;
      setUser({
        photo_url: userData.photo_url,
        name: userData.name,
        email: userData.email,
        username: userData.username,
        phone_number: userData.phone_number,
      });
      setFormData({
        name: userData.name,
        phone_number: userData.phone_number,
        newPassword: "",
        oldPassword: "",
        new_photo_url: null,
      });
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfilePictureChange = async (e: any) => {
    const imageStorageKey = "a9e96cffb01065e5efdb260580e31b2a";
    const image = e.target.files[0];
    const imgData = new FormData();
    const url = `https://api.imgbb.com/1/upload?key=${imageStorageKey}`;
    imgData.append("image", image);

    try {
      const imgUploadResponse = await axios.post(url, imgData);
      const img = imgUploadResponse.data.data.url;
      setFormData({ ...formData, new_photo_url: img });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmitUserInfo = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.put("/api/admin?type=info", {
        username: user.username,
        email: user.email,
        name: formData.name,
        phone_number: formData.phone_number,
        photo_url: formData.new_photo_url
          ? formData.new_photo_url
          : user.photo_url,
      });
      setUser({
        ...user,
        name: formData.name,
        phone_number: formData.phone_number,
        photo_url: formData.new_photo_url
          ? formData.new_photo_url
          : user.photo_url,
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error updating user info:", error);
      alert("An error occurred while updating user info.");
    }
  };

  const handleSubmitPassword = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.put("/api/admin?type=pass", {
        ...formData,
        username: user.username,
        email: user.email,
      });
      setFormData({
        ...formData,
        oldPassword: "",
        newPassword: "",
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error updating password:", error);
      alert("An error occurred while updating password.");
    }
  };

  return (
    <main className={styles.profilePage}>
      <div className={styles.profileInfoContainer}>
        <div className={styles.profileInfo}>
          <div className={styles.profilePictureContainer}>
            {formData.new_photo_url ? (
              <img
                src={formData.new_photo_url}
                alt="Profile Picture"
                className={styles.photo_url}
              />
            ) : (
              <img
                src={user.photo_url}
                alt="Profile Picture"
                className={styles.photo_url}
              />
            )}
          </div>
          <div className={styles.userInfo}>
            <h2 className={styles.userName}>{user.name}</h2>
            <p className={styles.userEmail}>{user.username}</p>
            <p className={styles.userEmail}>{user.phone_number}</p>
            <p className={styles.userEmail}>{user.email}</p>
          </div>
        </div>
      </div>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmitUserInfo} className={styles.profileForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="photo_url">Update Image</label>
            <input
              type="file"
              id="photo_url"
              accept="image/*"
              onChange={handleProfilePictureChange}
            />
          </div>
          <button type="submit" className={styles.btnPrimary}>
            Update
          </button>
        </form>
        <form onSubmit={handleSubmitPassword} className={styles.profileForm}>
          <div className={styles.formGroup}>
            <label htmlFor="oldPassword">Old Password</label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>

          <button type="submit" className={styles.btnPrimary}>
            Change Password
          </button>
        </form>
      </div>
    </main>
  );
}
