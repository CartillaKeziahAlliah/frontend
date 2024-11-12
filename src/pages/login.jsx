import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
} from "@mui/material";
import axios from "axios";
// const apiUrl = "http://localhost:5000";

const apiUrl = "https://server-production-dd7a.up.railway.app";

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

      // Redirect based on role
      switch (response.data.role) {
        case "student":
          window.location.href = "/Dashboard";
          break;

        default:
          window.location.href = "/Dashboard";
      }
    } catch (err) {
      console.error("Login error:", err);

      // Error handling based on the response status
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError("User doesn't exist");
            break;
          case 401:
            setError("Wrong password");
            break;
          case 403:
            setError("You have not been approved by the school");
            break;
          default:
            setError("Login failed");
        }
      } else {
        setError("Login failed");
      }
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
                  color: "#207E68",
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
