import { TextField, Button } from "@mui/material";
import React from "react";

const RegisterForm = () => {
  return (
    <div className="w-full p-2 ">
      <h2 className="text-5xl font-bold text-[#207E68] uppercase mb-6 text-center">
        Register
      </h2>
      <form className="bg-white rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <TextField
            id="fullName"
            label="Full Name"
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
        <div className="mb-4">
          <TextField
            id="email"
            label="Email"
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

        <div className="mb-4">
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
        </div>
        <div className="mb-6">
          <TextField
            id="confirmPassword"
            label="Confirm Password"
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
        </div>
        <div className="flex items-center justify-end">
          <Button variant="contained" sx={{ bgcolor: "#207E68" }}>
            Register
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
