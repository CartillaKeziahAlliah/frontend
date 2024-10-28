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
const apiUrl = "https://server-production-dd7a.up.railway.app";
const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
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
        email,
        password,
      });
      console.log(response.data);
      setEmail("");
      setName("");
      setConfirmPassword("");
      setPassword("");
    } catch (err) {
      setError(err.response.data.error || "Signup failed");
    }
  };

  const isFormValid =
    name &&
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
        )}{" "}
        <Box component="form" onSubmit={handleSignup} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Name"
            value={name}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#60a894",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#207E68",
                },
              },
              "& .MuiInputLabel-root": {
                "&:hover": {
                  color: "#60a894",
                },
                "&.Mui-focused": {
                  color: "#207e68",
                },
              },
            }}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            value={email}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#60a894",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#207E68",
                },
              },
              "& .MuiInputLabel-root": {
                "&:hover": {
                  color: "#60a894",
                },
                "&.Mui-focused": {
                  color: "#207e68",
                },
              },
            }}
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
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#60a894",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#207E68",
                },
              },
              "& .MuiInputLabel-root": {
                "&:hover": {
                  color: "#60a894",
                },
                "&.Mui-focused": {
                  color: "#207e68",
                },
              },
            }}
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
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#60a894",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#207E68",
                },
              },
              "& .MuiInputLabel-root": {
                "&:hover": {
                  color: "#60a894",
                },
                "&.Mui-focused": {
                  color: "#207e68",
                },
              },
            }}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {password && confirmPassword && password !== confirmPassword && (
            <Alert severity="error">Passwords do not match</Alert>
          )}
          {password && confirmPassword && password === confirmPassword && (
            <Alert>Passwords match</Alert>
          )}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Password Requirements:</Typography>
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
      </Box>
    </Container>
  );
};

export default RegisterForm;
