import React from "react";
import { Button } from "@mui/material";
import Swal from "sweetalert2";
import AnnouncementCard from "./AnnouncementCard";
import axios from "axios"; // Import axios

const AnnouncementsList = ({
  announcements,
  setAnnouncements,
  handleDeleteAll,
}) => {
  const handleDelete = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "If yes, you will not be able to recover this information!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, I am sure!",
      cancelButtonText: "Please cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setAnnouncements((prev) =>
          prev.filter((_, announcementIndex) => announcementIndex !== index)
        );
        Swal.fire("Deleted", "Announcement has been deleted.", "success");
      }
    });
  };

  const handleMarkAsRead = async (id) => {
    try {
      const response = await axios.put(`/api/announcements/read/${id}`); // Update the endpoint as needed
      setAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement._id === id
            ? { ...announcement, read: true }
            : announcement
        )
      );
      Swal.fire("Marked as read", response.data.message, "success");
    } catch (error) {
      console.error("Error marking announcement as read:", error);
      Swal.fire("Error", "Could not mark announcement as read", "error");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await axios.put("/api/announcements/read"); // Add a route for marking all as read
      setAnnouncements(
        (prev) => prev.map((announcement) => ({ ...announcement, read: true })) // Update all to read
      );
      Swal.fire("All marked as read", response.data.message, "success");
    } catch (error) {
      console.error("Error marking all announcements as read:", error);
      Swal.fire("Error", "Could not mark all announcements as read", "error");
    }
  };

  return (
    <div>
      {announcements.length === 0 ? (
        <p className="text-center">No announcements</p>
      ) : (
        <div className="flex flex-col gap-2">
          {announcements.map((announcement, index) => (
            <AnnouncementCard
              key={index}
              announcement={announcement}
              index={index}
              onDelete={handleDelete}
              onMarkAsRead={() => handleMarkAsRead(announcement._id)} // Call the mark as read function
            />
          ))}
        </div>
      )}
      <div className="flex flex-row gap-2 p-2 justify-end">
        <Button
          onClick={handleDeleteAll}
          variant="contained"
          sx={{ bgcolor: "green" }}
        >
          Delete All
        </Button>
        <Button
          variant="contained"
          onClick={handleMarkAllAsRead} // Call the mark all as read function
          sx={{ bgcolor: "green" }}
        >
          Mark all as read
        </Button>
      </div>
    </div>
  );
};

export default AnnouncementsList;
