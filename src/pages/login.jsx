import React, { useState } from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import axios from "axios";
import { color } from "framer-motion";

const apiUrl = "http://localhost:5000";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${apiUrl}/api/users/login`, {
        email,
        password,
      });

      console.log("Response from login:", response.data);
      localStorage.setItem("token", response.data.token);

      if (response.data.role === "student") {
        window.location.href = "/Table";
      } else {
        window.location.href = "/Dashboard";
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
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
          Login
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
                  color: "#207E68",
                },
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          />
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
            disabled={!email || !password}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginForm;
