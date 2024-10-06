import { TextField, Button } from "@mui/material";
import React from "react";

const LoginForm = () => {
  return (
    <div className="w-full max-w-sm">
      <h2 className="text-5xl font-bold text-[#207E68] uppercase mb-6 text-center">
        Login
      </h2>
      <form className="bg-white rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#207E68",
                },
                "&:hover fieldset": {
                  borderColor: "#90ee90",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#207E68",
                },
              },
              "& label": {
                color: "#207E68",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#207E68",
              },
              borderRadius: "10px",
            }}
          />
        </div>
        <div className="mb-6">
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#207E68",
                },
                "&:hover fieldset": {
                  borderColor: "#90ee90",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#207E68",
                },
              },
              "& label": {
                color: "#207E68",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#207E68",
              },
              borderRadius: "10px",
            }}
          />
          <p className="text-right text-blue-500 text-sm hover:underline cursor-pointer">
            Forgot Password?
          </p>
        </div>
        <div className="flex items-center justify-end">
          <Button variant="contained" sx={{ bgcolor: "#207E68" }}>
            Login
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
