import React, { useState } from "react";
import { Avatar, Tooltip } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import Logout from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CoursesSidebar from "./CoursesSidebar";
import SectionsSidebar from "./SectionsSidebar";
import {
  AdminPanelSettingsOutlined,
  ClassOutlined,
  HomeOutlined,
  ManageAccountsOutlined,
  MenuBookOutlined,
  Person2Outlined,
} from "@mui/icons-material";

const Sidebar = ({ user, logout }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState("Dashboard");
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
  const handleAccountClick = () => {
    setShowCourses(false);
    setShowSections(false);
    setActive("Account");
  };
  const handleCoursesClick = () => {
    setShowCourses((prev) => !prev);
    setShowSections(false);
    setActive("Courses");
  };
  const handleAdminClick = () => {
    setShowCourses(false);
    setShowSections(false);
    setActive("Admin");
  };
  const handleManageClick = () => {
    setShowCourses(false);
    setShowSections(false);
    setActive("Manage");
  };
  const handleDashboardClick = () => {
    setShowCourses(false);
    setShowSections(false);
    setActive("Dashboard");
  };
  const handleSectionsClick = () => {
    setShowSections((prev) => !prev);
    setShowCourses(false);
    setActive("Sections");
  };

  const handleCourseSelect = (course) => {
    setActive(course);
    navigate(`/course/${course}`);
  };

  const handleSectionSelect = (section) => {
    setActive(section);
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
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <Avatar sx={{ width: 40, height: 40 }} />
          )}
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
          <Link
            onClick={handleDashboardClick}
            to="/Dashboard"
            className={`flex flex-row hover:bg-gray-800 gap-2 items-center ${
              active === "Dashboard"
                ? "bg-[#000] text-white"
                : "text-black bg-[#C2E8F8]"
            } p-3 rounded-md`}
          >
            <HomeOutlined />
            {!isCollapsed && <p className="capitalize">Dashboard</p>}
          </Link>
          {user.role === "student" && (
            <div
              onClick={handleCoursesClick}
              className={`flex flex-row hover:bg-gray-800 gap-2 items-center ${
                active === "Courses"
                  ? "bg-[#000] text-white"
                  : "text-black bg-[#C2E8F8]"
              } p-3 rounded-md`}
            >
              <MenuBookOutlined />
              {!isCollapsed && <p className="capitalize">Courses</p>}
            </div>
          )}

          {user.role === "teacher" && (
            <div
              onClick={handleSectionsClick}
              className={`flex flex-row hover:bg-gray-800 gap-2 items-center ${
                active === "Sections"
                  ? "bg-[#000] text-white"
                  : "text-black bg-[#C2E8F8]"
              } p-3 rounded-md`}
            >
              <ClassOutlined />
              {!isCollapsed && <p className="capitalize">Sections</p>}
            </div>
          )}

          {user.role !== "student" && user.role !== "teacher" && (
            <>
              <Link
                onClick={handleAdminClick}
                className={`flex flex-row hover:bg-gray-800 gap-2 items-center ${
                  active === "Admin"
                    ? "bg-[#000] text-white"
                    : "text-black bg-[#C2E8F8]"
                } p-3 rounded-md`}
              >
                <AdminPanelSettingsOutlined />
                {!isCollapsed && <p className="capitalize">Admin</p>}
              </Link>

              <Link
                onClick={handleManageClick}
                className={`flex flex-row hover:bg-gray-800 gap-2 items-center ${
                  active === "Manage"
                    ? "bg-[#000] text-white"
                    : "text-black bg-[#C2E8F8]"
                } p-3 rounded-md`}
              >
                <ManageAccountsOutlined />
                {!isCollapsed && <p className="capitalize">Manage</p>}
              </Link>
            </>
          )}
          <Link
            onClick={handleAccountClick}
            to="/updateprofile"
            className={`flex flex-row hover:bg-gray-800 gap-2 items-center ${
              active === "Account"
                ? "bg-[#000] text-white"
                : "text-black bg-[#C2E8F8]"
            } p-3 rounded-md`}
          >
            <Person2Outlined />
            {!isCollapsed && <p className="capitalize">My Account</p>}
          </Link>
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
          setActive={setActive}
          handleCourseSelect={handleCourseSelect}
          setOpen={setOpen}
        />
      )}

      {showSections && user.role === "teacher" && (
        <SectionsSidebar
          teacherId={user._id}
          active={active}
          setActive={setActive}
          handleSectionSelect={handleSectionSelect}
          setOpen={setOpen}
        />
      )}
    </div>
  );
};

export default Sidebar;
