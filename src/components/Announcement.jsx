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
  Pagination,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import MarkAsReadIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import Swal from "sweetalert2";
import { data } from "autoprefixer";
import { color } from "framer-motion";

const apiUrl = "https://server-production-dd7a.up.railway.app";
// const apiUrl = "http://localhost:5000";

const AnnouncementApp = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [section, setSection] = useState("");
  const [sections, setSections] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default to 5 items per page

  const handleSubmit = async (e) => {
    e.preventDefault();

    const announcementData = {
      title,
      content,
      section,
    };

    try {
      const response = await axios.post(
        `${apiUrl}/api/announcements/${user._id}`,
        announcementData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSnackbarOpen(true);
      setTitle("");
      setContent("");
      setSection("");
      setIsModalOpen(false);
      fetchAnnouncements();
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const fetchSections = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/section/${user._id}`);
      setSections(response.data);
    } catch (error) {
      console.error("Error fetching sections:", error.message);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/announcements`);
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
          const response = await fetch(`${apiUrl}/api/announcements/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Failed to delete announcement");
          }

          Swal.fire(
            "Deleted!",
            "Your announcement has been deleted.",
            "success"
          );
          fetchAnnouncements();
        } catch (error) {
          console.error("Error deleting announcement:", error.message);
          Swal.fire("Error", "Failed to delete the announcement.", "error");
        }
      }
    });
  };

  const handleMarkAsRead = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/api/announcements/read/${id}`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to mark announcement as read");
      }

      fetchAnnouncements();
    } catch (error) {
      console.error("Error marking announcement as read:", error.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/announcements/readAll`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to mark all announcements as read");
      }

      fetchAnnouncements();
    } catch (error) {
      console.error("Error marking all announcements as read:", error.message);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    fetchSections();
  }, []);

  const filteredAnnouncements = announcements.filter((announcement) => {
    if (filter === "unread") return !announcement.read;
    if (filter === "read") return announcement.read;
    return true;
  });

  const sortedAnnouncements = filteredAnnouncements.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Get current announcements for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAnnouncements = sortedAnnouncements.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to the first page
  };
  const truncateContent = (content, maxLength) => {
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + "...";
    }
    return content;
  };
  return (
    <div>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="end"
        alignItems="center"
        mb={2}
      >
        {user.role !== "student" && (
          <Tooltip title="Add Announcement" arrow>
            <IconButton color="primary" onClick={() => setIsModalOpen(true)}>
              <AddIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        )}
        <Button
          variant="outlined"
          sx={{ background: "#207E68", border: "gray", color: "white" }}
          onClick={handleMarkAllAsRead}
        >
          Mark All as Read
        </Button>
        <Button
          variant="outlined"
          onClick={() => setFilter("all")}
          sx={{ marginLeft: 1 }}
        >
          Show All
        </Button>
        <Button
          variant="outlined"
          onClick={() => setFilter("unread")}
          sx={{ marginLeft: 1 }}
        >
          Unread Only
        </Button>
        <Button
          variant="outlined"
          onClick={() => setFilter("read")}
          sx={{ marginLeft: 1 }}
        >
          Read Only
        </Button>
        <FormControl variant="standard" sx={{ marginLeft: 1, minWidth: 120 }}>
          <InputLabel id="sort-order-label">Sort By</InputLabel>
          <Select
            labelId="sort-order-label"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            label="Sort By"
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
          </Select>
        </FormControl>
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
              sx={{
                "& .MuiInputLabel-root": {
                  color: "black", // Label color
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "black", // Default border color
                  },
                  "&:hover fieldset": {
                    borderColor: "black", // Border color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#207E68", // Border color on focus
                  },
                },
              }}
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
              sx={{
                "& .MuiInputLabel-root": {
                  color: "black", // Label color
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "black", // Default border color
                  },
                  "&:hover fieldset": {
                    borderColor: "black", // Border color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#207E68", // Border color on focus
                  },
                },
              }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel
                id="section-select-label"
                sx={{
                  color: "#000", // Default label color
                  "&.Mui-focused": {
                    color: "#000", // Label color when focused
                  },
                }}
              >
                Section
              </InputLabel>
              <Select
                labelId="section-select-label"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#000", // Default border color
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#000", // Border color on hover
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#207E68", // Border color on focus
                  },
                  "& .MuiSelect-select": {
                    color: "#207E68", // Default text color for Select
                  },
                  "&.Mui-focused .MuiSelect-select": {
                    color: "#207E68", // Text color when focused
                  },
                }}
              >
                {sections.map((sectionItem) => (
                  <MenuItem key={sectionItem._id} value={sectionItem._id}>
                    {sectionItem.section_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => setIsModalOpen(false)}
              sx={{ border: "1px solid #207E68", color: "#207E68" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              sx={{ background: "#207E68" }}
            >
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <List>
        {currentAnnouncements.length === 0 ? (
          <Typography variant="h6" align="center">
            No announcements available
          </Typography>
        ) : (
          currentAnnouncements.map((announcement) => (
            <ListItem
              key={announcement._id}
              divider
              sx={{
                bgcolor: announcement.read
                  ? "transparent"
                  : "rgba(32, 126, 104, 0.2)",
                marginBottom: 1,
                borderRadius: 2,
              }}
            >
              <div style={{ display: "flex", alignItems: "start", gap: 2 }}>
                <Avatar sx={{ marginRight: 1 }}>
                  <PersonIcon />
                </Avatar>
                <div>
                  <h2 className="capitalize text-xl font-bold">
                    {announcement.announcer.name} -
                    <span className="font-light text-md">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </span>
                  </h2>
                  <b className="capitalize">{announcement.title}</b>
                  <p>
                    {" "}
                    {truncateContent(announcement.content, 50)}{" "}
                    {/* Truncate to 50 characters */}
                  </p>
                </div>
              </div>
              <ListItemSecondaryAction>
                {announcement.read !== true && (
                  <Tooltip title="Mark as Read" arrow>
                    <IconButton
                      color="primary"
                      onClick={() => handleMarkAsRead(announcement._id)}
                    >
                      <MarkAsReadIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Delete" arrow>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(announcement._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        )}
      </List>
      <div className="flex flex-row justify-end">
        <FormControl variant="standard" sx={{ marginLeft: 2, minWidth: 80 }}>
          <InputLabel id="items-per-page-label"></InputLabel>
          <Select
            labelId="items-per-page-label"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            label="Items per page"
            className="text-center"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
        <Pagination
          count={Math.ceil(sortedAnnouncements.length / itemsPerPage)}
          page={currentPage}
          onChange={handleChangePage}
          color="primary"
          sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
        />
      </div>

      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={3000}
        message="Announcement created successfully!"
      />
    </div>
  );
};

export default AnnouncementApp;
