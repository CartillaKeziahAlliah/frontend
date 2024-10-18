import React, { useState } from "react";
import axios from "axios";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: null,
  });

  const { name, email, password, avatar } = formData;
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [preview, setPreview] = useState(null); // For profile picture preview

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle profile picture change and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!fileTypes.includes(file.type)) {
        setErrorMessage("Please upload a valid image (JPEG, PNG, JPG).");
        setFormData({ ...formData, avatar: null });
        return;
      }

      setFormData({ ...formData, avatar: file });
      setPreview(URL.createObjectURL(file)); // Set the preview
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Basic form validation
    if (!name || !email) {
      setErrorMessage("Name and email are required.");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const formDataToSubmit = new FormData();
      formDataToSubmit.append("name", name);
      formDataToSubmit.append("email", email);
      if (password) formDataToSubmit.append("password", password);
      if (avatar) formDataToSubmit.append("avatar", avatar);

      const response = await axios.put(
        "http://localhost:5000/api/users/updateprofile",
        formDataToSubmit,
        config
      );

      setSuccessMessage("Profile updated successfully!");
      setPreview(null); // Clear preview on success
    } catch (error) {
      console.error(error); // Log the full error
      setErrorMessage(error.response?.data?.error || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-profile-form">
      <h2>Update Profile</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        {/* Name Input */}
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password">Password (Optional)</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>

        {/* Profile Picture Input */}
        <div>
          <label htmlFor="profilePicture">Profile Picture (Optional)</label>
          <input type="file" name="avatar" onChange={handleFileChange} />
        </div>

        {/* Profile Picture Preview */}
        {preview && (
          <div>
            <img
              src={preview}
              alt="Profile Preview"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
                margin: "10px 0",
              }}
            />
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? (
            <span>
              <span className="spinner"></span> Updating...
            </span>
          ) : (
            "Update Profile"
          )}
        </button>
      </form>

      <style>
        {`
          .spinner {
            border: 3px solid rgba(0, 0, 0, 0.1);
            border-left-color: #09f;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            display: inline-block;
            margin-right: 5px;
            animation: spin 0.6s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .error {
            color: red;
            font-size: 14px;
            margin-bottom: 10px;
          }

          .success {
            color: green;
            font-size: 14px;
            margin-bottom: 10px;
          }
        `}
      </style>
    </div>
  );
};

export default UpdateProfile;
