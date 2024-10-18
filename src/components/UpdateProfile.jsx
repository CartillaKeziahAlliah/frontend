import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaEdit } from "react-icons/fa";
import {
  Box,
  TextField,
  Button,
  Avatar,
  IconButton,
  CircularProgress,
  Typography,
  Alert,
} from "@mui/material";
const apiUrl = "https://backend-production-55e3.up.railway.app";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: null,
  });
  const { user } = useAuth();
  const { name, email, password, avatar } = formData;
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [preview, setPreview] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false); // Toggle for edit mode

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

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
        `${apiUrl}/api/users/updateprofile`,
        formDataToSubmit,
        config
      );

      setSuccessMessage("Profile updated successfully!");
      setPreview(null);
      setIsEditMode(false); // Exit edit mode on success
      window.location.reload();
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.error || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const triggerEditMode = () => {
    setFormData({
      ...formData,
      name: user.name || "",
      email: user.email || "",
    });
    setIsEditMode(true);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      mt={10}
      p={3}
    >
      {isEditMode ? (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            backgroundColor: "white",
            p: 4,
            borderRadius: 2,
            boxShadow: 2,
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <Typography variant="h4" fontWeight="bold" mb={2}>
            Update Profile
          </Typography>

          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}

          <Box mb={2}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={name}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </Box>

          <Box mb={2}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={email}
              onChange={handleChange}
              required
              type="email"
              variant="outlined"
            />
          </Box>

          <Box mb={2}>
            <TextField
              fullWidth
              label="Password (Optional)"
              name="password"
              value={password}
              onChange={handleChange}
              type="password"
              variant="outlined"
            />
          </Box>

          <Box mb={2}>
            <Button variant="contained" component="label">
              Upload Profile Picture (Optional)
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </Box>

          {preview && (
            <Box textAlign="center" mb={2}>
              <Avatar
                src={preview}
                sx={{ width: 100, height: 100, mx: "auto" }}
              />
            </Box>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Update Profile"}
          </Button>
        </Box>
      ) : (
        <Box textAlign="center">
          <Box position="relative">
            {user?.avatar ? (
              <Avatar
                src={user.avatar}
                sx={{ width: 128, height: 128, mx: "auto" }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 128,
                  height: 128,
                  mx: "auto",
                  backgroundColor: "grey.300",
                }}
              />
            )}
            <IconButton
              onClick={triggerEditMode}
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                bgcolor: "primary.main",
                color: "white",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              <FaEdit />
            </IconButton>
          </Box>
          <Typography variant="h6" mt={2}>
            {user?.name || "Your Name"}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {user?.email || "your.email@example.com"}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default UpdateProfile;
