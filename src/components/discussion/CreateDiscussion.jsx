import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  TextareaAutosize,
  Snackbar,
  Alert,
  Paper,
  Typography,
  Grid,
} from "@mui/material";

const apiUrl = "http://localhost:5000";

const CreateDiscussion = ({ selectedSubject, onclick }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const discussionData = {
      title,
      content,
      subjectId: selectedSubject._id, // Use subjectId from props
    };

    try {
      const response = await axios.post(
        `${apiUrl}/api/discussion`,
        discussionData
      );

      if (response.status === 200) {
        setSnackbarMessage("Discussion created successfully!");
        setSnackbarSeverity("success");
        resetForm();
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        setSnackbarMessage(`Error: ${error.response.data.message}`);
        setSnackbarSeverity("error");
      } else {
        // Network or other error
        setSnackbarMessage(`Error: ${error.message}`);
        setSnackbarSeverity("error");
      }
    }
    setSnackbarOpen(true);
  };

  const resetForm = () => {
    setTitle(""); // Reset title
    setContent(""); // Reset content
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper
      elevation={3}
      className="container"
      style={{ padding: "20px", margin: "20px" }}
    >
      <Typography variant="h4" gutterBottom>
        Create Discussion
      </Typography>
      <Button
        variant="outlined"
        onClick={onclick}
        style={{ marginBottom: "20px" }}
      >
        Close
      </Button>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextareaAutosize
              minRows={4}
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Create Discussion
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CreateDiscussion;
