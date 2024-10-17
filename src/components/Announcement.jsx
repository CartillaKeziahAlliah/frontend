import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Ensure this path is correct
import {
  Container,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MarkAsReadIcon from "@mui/icons-material/CheckCircle";

const AnnouncementApp = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [announcementDate, setAnnouncementDate] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { user } = useAuth(); // Assuming user has the announcer ID

  // Function to handle form submission and create a new announcement
  const handleSubmit = async (e) => {
    e.preventDefault();

    const announcementData = {
      title,
      content,
      announcement_date: announcementDate,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/announcements/${user._id}`, // Adjust as needed
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(announcementData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create announcement");
      }

      const result = await response.json();
      console.log("Announcement created:", result);
      setSnackbarOpen(true); // Show snackbar on success

      // Reset form fields after successful submission
      setTitle("");
      setContent("");
      setAnnouncementDate("");

      // Fetch the updated list of announcements
      fetchAnnouncements();
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  // Function to fetch announcements from the backend
  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/announcements`);

      if (!response.ok) {
        throw new Error("Failed to fetch announcements");
      }

      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error.message);
    }
  };

  // Function to delete an announcement by ID
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/announcements/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete announcement");
      }

      console.log("Announcement deleted");
      fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error.message);
    }
  };

  // Function to mark an announcement as read
  const handleMarkAsRead = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/announcements/read/${id}`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark announcement as read");
      }

      const updatedAnnouncement = await response.json();
      console.log("Announcement marked as read:", updatedAnnouncement);
      fetchAnnouncements();
    } catch (error) {
      console.error("Error marking announcement as read:", error.message);
    }
  };

  // Function to mark all announcements as read
  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/announcements/readAll`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark all announcements as read");
      }

      console.log("All announcements marked as read");
      fetchAnnouncements();
    } catch (error) {
      console.error("Error marking all announcements as read:", error.message);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Announcement App
      </Typography>

      <form onSubmit={handleSubmit}>
        <Typography variant="h6">Create Announcement</Typography>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          label="Content"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <TextField
          label="Announcement Date"
          type="date"
          variant="outlined"
          fullWidth
          margin="normal"
          value={announcementDate}
          onChange={(e) => setAnnouncementDate(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: "16px" }}
        >
          Create Announcement
        </Button>
      </form>

      <Button
        variant="outlined"
        color="secondary"
        style={{ marginTop: "16px" }}
        onClick={handleMarkAllAsRead}
      >
        Mark All as Read
      </Button>

      <List>
        <Typography variant="h6" gutterBottom>
          Announcements
        </Typography>
        {announcements.length === 0 ? (
          <Typography>No announcements available</Typography>
        ) : (
          announcements.map((announcement) => (
            <ListItem
              key={announcement._id}
              style={{
                backgroundColor: announcement.read ? "transparent" : "#e3f2fd", // Light blue background for unread
                borderRadius: "4px",
                marginBottom: "8px",
              }}
            >
              <ListItemText
                primary={announcement.title}
                secondary={
                  <>
                    <div>{announcement.content}</div>
                    <div>
                      <strong>Announcement Date:</strong>{" "}
                      {new Date(
                        announcement.announcement_date
                      ).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Announcer:</strong>{" "}
                      {announcement.announcer?.name || "Unknown"}
                    </div>
                  </>
                }
              />
              <ListItemSecondaryAction>
                {!announcement.read && ( // Show icon only if unread
                  <IconButton
                    edge="end"
                    aria-label="mark as read"
                    onClick={() => handleMarkAsRead(announcement._id)}
                  >
                    <MarkAsReadIcon />
                  </IconButton>
                )}
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(announcement._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        )}
      </List>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="Announcement created successfully!"
      />
    </Container>
  );
};

export default AnnouncementApp;
