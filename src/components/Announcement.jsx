import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Avatar,
  Tooltip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

import DeleteIcon from "@mui/icons-material/Delete";
import MarkAsReadIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

import Swal from "sweetalert2";

const AnnouncementApp = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [section, setSection] = useState("");
  const [sections, setSections] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const announcementData = {
      title,
      content,
      section,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/announcements/${user._id}`,
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
      setSnackbarOpen(true);

      setTitle("");
      setContent("");
      setSection("");
      setIsModalOpen(false);

      fetchAnnouncements();
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/section/${user._id}`
      );
      console.log("Sections", response.data);
      setSections(response.data);
    } catch (error) {
      console.error("Error fetching sections:", error.message);
    }
  };

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

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
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

          Swal.fire(
            "Deleted!",
            "Your announcement has been deleted.",
            "success"
          );
          fetchAnnouncements(); // Refresh the list after deletion
        } catch (error) {
          console.error("Error deleting announcement:", error.message);
          Swal.fire("Error", "Failed to delete the announcement.", "error");
        }
      }
    });
  };

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
    fetchSections();
  }, []);

  return (
    <Container>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="end"
        alignItems="center"
      >
        {user.role !== "student" && (
          <IconButton color="primary" onClick={() => setIsModalOpen(true)}>
            <AddIcon fontSize="large" />
          </IconButton>
        )}
        <Button
          variant="outlined"
          sx={{ background: "gray", border: "gray", color: "white" }}
          className="hover:bg-black"
          onClick={handleMarkAllAsRead}
        >
          Mark All as Read
        </Button>
      </Box>
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Make an Announcement</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
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

            <FormControl fullWidth margin="normal">
              <InputLabel id="section-select-label">Section</InputLabel>
              <Select
                labelId="section-select-label"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                required
              >
                {sections.map((section) => (
                  <MenuItem key={section._id} value={section._id}>
                    {section.section_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <List>
        {announcements.length === 0 ? (
          <Typography>No announcements available</Typography>
        ) : (
          announcements.map((announcement) => (
            <ListItem
              key={announcement._id}
              style={{
                backgroundColor: announcement.read ? "transparent" : "#e3f2fd",
                borderRadius: "4px",
                marginBottom: "8px",
                borderBottom: "1px solid black",
                boxShadow: "0 1px 1px gray",
              }}
            >
              <div>
                {announcement.announcer?.avatar ? (
                  <img
                    src={announcement.announcer.avatar}
                    alt={announcement.announcer.name}
                    style={{ width: 40, height: 40, borderRadius: "50%" }}
                    className="mx-4"
                  />
                ) : (
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                )}
              </div>
              <div className="flex flex-col w-full">
                <div className="flex flex-row justify-between w-full">
                  <Typography variant="h5" className="mx-4 capitalize">
                    {announcement.announcer?.name || "Unknown"}
                  </Typography>
                </div>

                <div>
                  <strong>Section:</strong>{" "}
                  {announcement.section?.section_name || "Unknown"}
                </div>
                <div className="font-bold">{announcement.title}</div>
                <div>{announcement.content}</div>
              </div>

              <div className="flex flex-col justify-end">
                <Typography variant="p" className="mx-4">
                  {new Date(announcement.createdAt).toLocaleDateString()}{" "}
                </Typography>
                <div className="flex flex-row justify-end">
                  <Tooltip title="Mark as Read">
                    {!announcement.read && (
                      <IconButton
                        edge="end"
                        color="primary"
                        onClick={() => handleMarkAsRead(announcement._id)}
                      >
                        <MarkAsReadIcon />
                      </IconButton>
                    )}
                  </Tooltip>
                  {user.role !== "student" && (
                    <Tooltip title="Delete Announcement">
                      <IconButton
                        edge="end"
                        sx={{ color: "red" }}
                        onClick={() => handleDelete(announcement._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              </div>
            </ListItem>
          ))
        )}
      </List>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Announcement created successfully"
      />
    </Container>
  );
};

export default AnnouncementApp;
