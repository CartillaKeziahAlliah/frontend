// Sidebar.jsx

import React, { useState } from "react";
import { Avatar, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BookIcon from "@mui/icons-material/Book";
import GridViewIcon from "@mui/icons-material/GridView";
import Logout from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MenuIcon from "@mui/icons-material/Menu";
import SidebarOption from "./SidebarOption";
import AdminOptions from "./AdminOptions";
import CoursesSidebar from "./CoursesSidebar";
import SectionsSidebar from "./SectionsSidebar";
import { img } from "framer-motion/client";
import {
  AdminPanelSettingsOutlined,
  ClassOutlined,
  Home,
  HomeMiniOutlined,
  HomeOutlined,
  MenuBookOutlined,
} from "@mui/icons-material";

const Sidebar = ({ user, logout }) => {
  const navigate = useNavigate();
  const [active, setIsActive] = useState("Dashboard");
  const [showCourses, setShowCourses] = useState(false);
  const [showSections, setShowSections] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [open, setOpen] = useState(false);

  const [courses, setCourses] = useState([
    "Mathematics",
    "Science",
    "Filipino",
    "English",
    "General Anatomy",
    "HEKASI",
    "Music",
    "Arts",
    "Physical Education",
  ]);

  const handleCoursesClick = () => {
    setShowCourses((prev) => !prev);
    setShowSections(false); // Ensure only one sidebar is open at a time
    setIsActive("Courses");
  };

  const handleSectionsClick = () => {
    setShowSections((prev) => !prev);
    setShowCourses(false); // Ensure only one sidebar is open at a time
    setIsActive("Sections");
  };

  const handleCourseSelect = (course) => {
    setIsActive(course);
    navigate(`/course/${course}`);
  };

  const handleSectionSelect = (section) => {
    setIsActive(section);
    navigate(`/section/${section}`);
  };

  const toggleMenu = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout Failed", error);
    }
  };

  return (
    <div className="flex items-center">
      <div
        className={`sidebar transition-all duration-300 ease-in-out rounded-2xl m-2 bg-[#207e68] ${
          isCollapsed ? "collapsed" : "expanded"
        } h-[98vh] flex flex-col items-center justify-between shadow-lg`}
      >
        <div
          className={`w-full flex p-2 ${
            isCollapsed ? "justify-center" : "justify-end"
          } px-2 text-white`}
        >
          <Tooltip title="Toggle Menu">
            <MenuIcon onClick={toggleMenu} className="cursor-pointer" />
          </Tooltip>
        </div>
        <div className="flex flex-row items-center justify-center w-[90%] gap-1 p-2 rounded-md border border-white">
          {user.avatar ? <img src={user.avatar} /> : <Avatar />}
          <div className="flex flex-col items-center justify-center">
            {!isCollapsed && (
              <Tooltip title="User Name">
                <p className="capitalize text-white">{user.name}</p>
              </Tooltip>
            )}
            {!isCollapsed && (
              <Tooltip title="User Role">
                <p className="capitalize text-white">{user.role}</p>
              </Tooltip>
            )}
          </div>
        </div>

        <div
          className={`flex flex-col gap-5 pt-10 p-2 ${
            isCollapsed ? "items-center" : ""
          } w-full text-white text-lg h-full`}
        >
          <SidebarOption
            title="dashboard"
            to="/Dashboard"
            icon={<HomeOutlined />}
            isCollapsed={isCollapsed}
            active={active}
            setIsActive={setIsActive}
          />
          {user.role === "student" && (
            <div
              onClick={handleCoursesClick}
              className={`flex bg-[#C2E8F8] flex-row hover:bg-gray-800 gap-2 items-center ${
                active === "Courses" ? "bg-[#000] text-white" : "text-black"
              } p-3 rounded-md`}
            >
              <MenuBookOutlined />
              {!isCollapsed && <p className="capitalize">courses</p>}
            </div>
          )}

          {user.role === "teacher" && (
            <div
              onClick={handleSectionsClick}
              className={`flex bg-[#C2E8F8] flex-row hover:bg-gray-800 gap-2 items-center ${
                active === "Sections" ? "bg-[#000] text-white" : "text-black"
              } p-3 rounded-md`}
            >
              <ClassOutlined />
              {!isCollapsed && <p className="capitalize">sections</p>}
            </div>
          )}

          {user.role !== "student" && user.role !== "teacher" && (
            <AdminOptions
              isCollapsed={isCollapsed}
              active={active}
              setIsActive={setIsActive}
            />
          )}
        </div>

        <div className="text-white w-full px-4 pb-4">
          <Tooltip title="Logout">
            <Logout
              onClick={handleLogout}
              sx={{ fontSize: "3rem" }}
              className="hover:bg-gray-800 cursor-pointer rounded-full p-2 text-xl"
            />
          </Tooltip>
        </div>
      </div>

      {showCourses && user.role === "student" && (
        <CoursesSidebar
          courses={courses}
          active={active}
          setIsActive={setIsActive}
          handleCourseSelect={handleCourseSelect}
          setOpen={setOpen}
        />
      )}

      {showSections && user.role === "teacher" && (
        <SectionsSidebar
          teacherId={user._id}
          active={active}
          setIsActive={setIsActive}
          handleSectionSelect={handleSectionSelect}
          setOpen={setOpen}
        />
      )}
    </div>
  );
};

export default Sidebar;
