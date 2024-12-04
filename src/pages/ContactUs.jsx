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
      name: `${firstName} ${lastName}`, // combining first and last name
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
    <Grid
      container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90%",
        flexDirection: "column",
        background: "white",
        gap: 2,
      }}
    >
      <h1 className="text-4xl text-[#207E68] font-bold">CONTACT US</h1>
      <p className="text-[#717171]">
        Any question or remarks? Just write us a message!
      </p>
      {/* Contact Information Section */}
      <div className="flex flex-row flex-wrap ">
        <Grid
          item
          xs={12}
          lg={4}
          sx={{
            backgroundColor: "#207E68",
            borderTopLeftRadius: "8px",
            borderBottomLeftRadius: "8px",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            maxWidth: "lg",
            height: "50vh",
            padding: "2%",
          }}
        >
          <div>
            <Typography variant="h5" gutterBottom>
              Contact Information
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: "16px" }}>
              Say something to start a live chat!
            </Typography>
          </div>
          <div className="flex flex-col gap-10">
            <Box>
              <Phone /> +1012 3456 789
            </Box>
            <Box>
              <Email /> tnhs@gmail.com
            </Box>
            <Box>
              <LocationOn /> Talamban Cebu City
            </Box>
          </div>
          <Box sx={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <IconButton color="inherit" href="#" aria-label="Twitter">
              <Twitter />
            </IconButton>
            <IconButton color="inherit" href="#" aria-label="Instagram">
              <Instagram />
            </IconButton>
          </Box>
        </Grid>

        {/* Contact Form Section */}
        <Grid
          item
          xs={12}
          lg={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "lg", // Max width for large screen (1024px)
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: 3,
              flexGrow: 1, // Allow the form to grow and fill available space
              height: "40vh",
            }}
          >
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
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
            <div className="flex flex-row justify-end w-full p-2">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: "#207E68",
                }}
              >
                Send Message
              </Button>
            </div>
          </Box>
        </Grid>
      </div>
    </Grid>
  );
};

export default ContactUs;
