import "react-calendar/dist/Calendar.css";
import { Button } from "@mui/material";
import React, { useState } from "react";
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
  return (
    <div>
      <div className="content w-full h-[100vh] p-6">
        <div className="flex flex-row gap-1 p-2">
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
        </div>
        <div className="h-auto">
          {page === "Announcement" && (
            <>
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
