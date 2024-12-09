import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Divider,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const apiUrl = "https://server-production-dd7a.up.railway.app";
// const apiUrl = "http://localhost:5000"; // Your API URL

const RegisterForm = () => {
  const [step, setStep] = useState(1); // Step 1 or Step 2 state
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [lrn, setLrn] = useState(""); // LRN State
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const navigate = useNavigate();

  const validatePassword = (password) => {
    setPasswordRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handleNextStep = () => {
    if (!name || !idNumber || !lrn) {
      setError(
        "Please enter your name, ID number, and Learning Resource Number."
      );
    } else {
      setError("");
      setStep(2);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const isPasswordValid =
      passwordRequirements.length &&
      passwordRequirements.uppercase &&
      passwordRequirements.lowercase &&
      passwordRequirements.number &&
      passwordRequirements.specialChar;

    if (!isPasswordValid) {
      setError("Password does not meet the requirements");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/users/signup`, {
        name,
        idNumber,
        lrn, // Include LRN here
        username,
        email,
        password,
      });

      Swal.fire({
        icon: "success",
        title: "Signup Successful!",
        text: "Success, wait for a day for your account to be approved",
        confirmButtonText: "OK",
      });

      // Clear fields
      setName("");
      setLrn("");
      setIdNumber("");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setStep(1);
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };
  const handleNumericInput = (e, setInput) => {
    const inputValue = e.target.value;

    // Only allow numbers and ensure the length is limited to 12 characters
    if (/^\d*$/.test(inputValue) && inputValue.length <= 12) {
      setInput(inputValue);
    }
  };

  const isFormValid =
    username &&
    email &&
    password &&
    confirmPassword &&
    passwordRequirements.length &&
    passwordRequirements.uppercase &&
    passwordRequirements.lowercase &&
    passwordRequirements.number &&
    passwordRequirements.specialChar &&
    password === confirmPassword;

  return (
    <Container component="main" sx={{ bgcolor: "white" }} maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          sx={{ color: "#207E68", fontWeight: "bold" }}
        >
          Sign Up
        </Typography>
        {error && (
          <Alert
            severity="error"
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mb: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {step === 1 && (
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="ID Number"
              value={idNumber}
              onChange={(e) => handleNumericInput(e, setIdNumber)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Learning Resource Number(LRN)"
              value={lrn}
              onChange={(e) => handleNumericInput(e, setLrn)}
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, background: "#207e68" }}
              onClick={handleNextStep}
              disabled={!name || !idNumber || !lrn}
            >
              Next
            </Button>
          </Box>
        )}

        {step === 2 && (
          <Box component="form" onSubmit={handleSignup} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {password && confirmPassword && password !== confirmPassword && (
              <Alert severity="error">Passwords do not match</Alert>
            )}
            {password && confirmPassword && password === confirmPassword && (
              <Alert>Passwords match</Alert>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">
                Password Requirements:
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography
                variant="body2"
                color={passwordRequirements.length ? "green" : "red"}
              >
                {passwordRequirements.length
                  ? "✔️ At least 8 characters"
                  : "❌ At least 8 characters"}
              </Typography>
              <Typography
                variant="body2"
                color={passwordRequirements.uppercase ? "green" : "red"}
              >
                {passwordRequirements.uppercase
                  ? "✔️ At least 1 uppercase letter"
                  : "❌ At least 1 uppercase letter"}
              </Typography>
              <Typography
                variant="body2"
                color={passwordRequirements.lowercase ? "green" : "red"}
              >
                {passwordRequirements.lowercase
                  ? "✔️ At least 1 lowercase letter"
                  : "❌ At least 1 lowercase letter"}
              </Typography>
              <Typography
                variant="body2"
                color={passwordRequirements.number ? "green" : "red"}
              >
                {passwordRequirements.number
                  ? "✔️ At least 1 number"
                  : "❌ At least 1 number"}
              </Typography>
              <Typography
                variant="body2"
                color={passwordRequirements.specialChar ? "green" : "red"}
              >
                {passwordRequirements.specialChar
                  ? "✔️ At least 1 special character"
                  : "❌ At least 1 special character"}
              </Typography>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                background: "#207e68",
                "&:hover": { background: "#1b5e50" },
              }}
              disabled={!isFormValid}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default RegisterForm;
