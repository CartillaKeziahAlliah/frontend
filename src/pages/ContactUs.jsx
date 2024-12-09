import React, { useState } from "react";
import emailjs from "emailjs-com";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
} from "@mui/material";
import {
  Email,
  Phone,
  LocationOn,
  Instagram,
  Twitter,
} from "@mui/icons-material";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { firstName, lastName, email, message, subject } = formData;
    const templateParams = {
      name: `${firstName} ${lastName}`,
      email: email,
      message: message,
      subject: subject,
    };

    emailjs
      .send(
        "service_h4md0l8",
        "template_1ukae76",
        templateParams,
        "Iv39vf9caKj-SPQe6"
      )
      .then(() => {
        alert("Message sent successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "General Inquiry",
          message: "",
        });
      })
      .catch(() => alert("Failed to send the message. Try again."));
  };

  return (
    <div className="flex flex-col bg-white md:h-[90%] h-full justify-center px-10 gap-10">
      {/* Heading Section */}
      <Typography
        variant="h3"
        sx={{
          color: "#207E68",
          textAlign: "center",
          fontWeight: 700,
          fontSize: { xs: "0", sm: "2rem", md: "3rem" }, // Hide for `xs` screen sizes
        }}
        className="w-full"
      >
        CONTACT US
      </Typography>
      <Typography
        variant="body1"
        className="w-full"
        sx={{
          textAlign: "center",
          color: "#717171",
          fontSize: { xs: "0", sm: "0.875rem", md: "1.125rem" },
        }}
      >
        Any question or remarks? Just write us a message!
      </Typography>

      {/* Contact Info & Form Section */}
      <Grid container spacing={3} sx={{ width: "100%" }}>
        {/* Left Panel (Contact Info Section) */}
        <Grid
          item
          xs={12} // Stack vertically on mobile
          md={4} // Side-by-side on medium and larger screens
          sx={{
            backgroundColor: "#207E68",
            color: "white",
            padding: "16px",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "auto",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Contact Information
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Say something to start a live chat!
          </Typography>
          <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Phone sx={{ mr: 1 }} /> +1012 3456 789
          </Box>
          <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Email sx={{ mr: 1 }} /> tnhs@gmail.com
          </Box>
          <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <LocationOn sx={{ mr: 1 }} /> Talamban Cebu City
          </Box>
          <Box sx={{ marginTop: "8px", display: "flex", gap: "8px" }}>
            <IconButton color="inherit" href="#" aria-label="Twitter">
              <Twitter />
            </IconButton>
            <IconButton color="inherit" href="#" aria-label="Instagram">
              <Instagram />
            </IconButton>
          </Box>
        </Grid>

        {/* Right Panel (Contact Form Section) */}
        <Grid
          item
          xs={12} // Stack vertically on mobile
          md={8} // Side-by-side on medium and larger screens
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "8px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: 3,
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              padding: "16px",
              minHeight: "300px",
            }}
          >
            {/* Form Fields */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="standard"
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="standard"
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="standard"
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Select Subject</Typography>
                <RadioGroup
                  row
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="General Inquiry"
                    control={<Radio />}
                    label="General Inquiry"
                  />
                  <FormControlLabel
                    value="Support"
                    control={<Radio />}
                    label="Support"
                  />
                  <FormControlLabel
                    value="Feedback"
                    control={<Radio />}
                    label="Feedback"
                  />
                </RadioGroup>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#207E68",
                marginTop: "auto",
              }}
            >
              Send Message
            </Button>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default ContactUs;
