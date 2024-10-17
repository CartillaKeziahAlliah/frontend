import {
  Add,
  DeleteForeverRounded,
  DeleteOutline,
  Mail,
  PlusOneOutlined,
  Sort,
} from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import Swal from "sweetalert2";
import userProfile from "../assets/user.webp";
import AnnouncementDialog from "./announcement/AnnouncementDialog";
import EventCalendar from "./AnnouncementCalendar";
import SectionsList from "./teacherSection";
import { useAuth } from "../context/AuthContext";
import AnnouncementApp from "./Announcement";

const Dashboard = () => {
  const [page, setPage] = useState("calendar");
  const { user } = useAuth();

  const SetCurrentPage = (currenpage) => {
    setPage(currenpage);
  };
  const [newAnnouncement, setNewAnnouncement] = useState({
    profile: userProfile,
    personName: "",
    role: "",
    content: "",
  });
  const [Announcements, setAnnouncements] = useState([
    {
      profile: userProfile,
      personName: "John kenneth Rosales",
      role: "President",
      content: "this is the first announcement",
      isRead: false,
    },
    {
      profile: userProfile,
      personName: "Jerlon Abayon",
      role: "Secretary",
      content: "this is the second announcement",
      isRead: false,
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnnouncement((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAnnouncement = () => {
    if (
      newAnnouncement.personName &&
      newAnnouncement.role &&
      newAnnouncement.content
    ) {
      setAnnouncements((prev) => [
        ...prev,
        { ...newAnnouncement, isRead: false },
      ]);
      setNewAnnouncement({
        profile: userProfile,
        personName: "",
        role: "",
        content: "",
      });
      handleDialogClose();
    } else {
      handleDialogClose();
      Swal.fire({
        title: "Oops!",
        text: "Please input the necessary details",
        icon: "warning",
      });
    }
  };

  return (
    <div>
      <div className="content w-full h-[100vh]">
        <div className="flex justify-end px-4 text-[green] py-2">
          <AccountCircleIcon fontSize="large" />
        </div>
        <div className="flex flex-row gap-1 p-2">
          <Button
            onClick={() => SetCurrentPage("calendar")}
            variant={page === "calendar" ? "contained" : "outlined"}
            sx={{
              bgcolor: page === "calendar" ? "green" : "transparent",
              borderColor: page === "calendar" ? "none" : "green",
            }}
          >
            Calendar
          </Button>
          <Button
            onClick={() => SetCurrentPage("Announcement")}
            variant={page === "Announcement" ? "contained" : "outlined"}
            sx={{
              bgcolor: page === "Announcement" ? "green" : "transparent",
              borderColor: page === "Announcement" ? "none" : "green",
            }}
          >
            Announcement
          </Button>
        </div>
        <div className="h-auto">
          {page === "Announcement" && (
            <>
              <div className="flex justify-end items-center p-2">
                <Sort />

                <IconButton onClick={handleDialogOpen} color="primary">
                  <Add />
                </IconButton>
              </div>
              <AnnouncementApp />
            </>
          )}
          {page === "calendar" && (
            <div className="h-full">
              <div className="flex flex-row h-full">
                <EventCalendar />
                <SectionsList teacherId={user._id} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
