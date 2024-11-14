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
import Swal from "sweetalert2";
const apiUrl = "https://server-production-dd7a.up.railway.app";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    avatar: null,
  });
  const { user } = useAuth();
  const { name, password, avatar } = formData;
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

    if (!name) {
      setErrorMessage("Name required.");
      setLoading(false);
      return;
    }

    try {
      const confirmation = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to update your profile?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      });

      if (!confirmation.isConfirmed) {
        setLoading(false);
        return; // Exit if the user cancels
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const formDataToSubmit = new FormData();
      formDataToSubmit.append("name", name);
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
    });
    setIsEditMode(true);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
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
            maxWidth: "1000px",
            alignSelf: "center",
          }}
        >
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          <div className="relative mb-10">
            {user.avatar && !preview && (
              <Avatar src={user.avatar} sx={{ width: 128, height: 128 }} />
            )}
            {preview && (
              <Avatar src={preview} sx={{ width: 128, height: 128 }} />
            )}
            <IconButton
              sx={{
                width: 128,
                height: 128,
                position: "absolute",
                top: "50%",
                left: "0",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                },
              }}
            >
              <Button component="label" sx={{ padding: 0, minWidth: "auto" }}>
                <Typography
                  sx={{ color: "#fff" }}
                  variant="h4"
                  component="span"
                >
                  +
                </Typography>
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
            </IconButton>
          </div>

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
              label="Password (Optional)"
              name="password"
              value={password}
              onChange={handleChange}
              type="password"
              variant="outlined"
            />
          </Box>

          <div className="flex gap-2 justify-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ bgcolor: "#207E68" }}
            >
              {loading ? <CircularProgress size={24} /> : "Save"}
            </Button>
            <Button
              sx={{ color: "#207E68", borderColor: "#207E68" }}
              onClick={() => setIsEditMode(false)}
              variant="outlined"
            >
              Back
            </Button>
          </div>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" justifyContent="center">
          <Box fullWidth>
            <div className="flex flex-col justify-center items-center">
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
              <IconButton onClick={triggerEditMode}>
                <FaEdit /> Edit Profile
              </IconButton>
            </div>
            <div className="w-full border border-[#cdcdcd] rounded-md mt-10 px-4 py-4 flex flex-col gap-2">
              <strong className="text-lg text-center font-semibold md:text-2xl uppercase">
                <p> Student General Information</p>
              </strong>
              <div>
                <label htmlFor="name" className="font-bold">
                  Name:
                </label>
                <Typography variant="body1">
                  {user?.name || "Your Name"}
                </Typography>
              </div>
              <div>
                <label htmlFor="name" className="font-bold">
                  Email Address:
                </label>
                <Typography variant="body1">
                  {user?.email || "your.email@example.com"}
                </Typography>
              </div>
              {user.role === "student" && (
                <div>
                  <label htmlFor="LRN" className="font-bold">
                    LRN:
                  </label>
                  <Typography variant="body1">{user?.LRN || "LRN"}</Typography>
                </div>
              )}
            </div>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default UpdateProfile;
