import {
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BookIcon from "@mui/icons-material/Book";
import GridViewIcon from "@mui/icons-material/GridView";
import Logout from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MenuIcon from "@mui/icons-material/Menu";

const AdminOptions = ({ isCollapsed, active, setIsActive }) => (
  <>
    <SidebarOption
      title="admin"
      to="/Admin"
      icon={<AdminPanelSettingsIcon />}
      isCollapsed={isCollapsed}
      active={active}
      setIsActive={setIsActive}
    />
    <SidebarOption
      title="manage"
      to="/Manage"
      icon={<ManageAccountsIcon />}
      isCollapsed={isCollapsed}
      active={active}
      setIsActive={setIsActive}
    />
  </>
);

const SidebarOption = ({
  title,
  to,
  icon,
  isCollapsed,
  active,
  setIsActive,
}) => (
  <div onClick={() => setIsActive(title)}>
    <Link
      to={to}
      className={`flex hover:bg-gray-700 flex-row gap-2 items-center ${
        active === title ? "bg-[#4a8e8b] text-white" : "text-white"
      } p-2 rounded-md`}
    >
      {icon}
      {!isCollapsed && <p className="capitalize">{title}</p>}
    </Link>
  </div>
);

const Sidebar = ({ user, logout }) => {
  const navigate = useNavigate();
  const [active, setIsActive] = useState("Dashboard");
  const [showCourses, setShowCourses] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const [newCourse, setNewCourse] = useState("");
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
    setIsActive("Courses");
  };

  const handleCourseSelect = (course) => {
    setIsActive(course);
    navigate(`/course/${course}`);
  };

  const toggleMenu = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleAddCourse = () => {
    if (newCourse) {
      setCourses((prevCourses) => [...prevCourses, newCourse]);
      setNewCourse("");
      setOpen(false);
    }
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
        } h-[98vh] flex flex-col items-center justify-between`}
      >
        <div
          className={`w-full flex ${
            isCollapsed ? "justify-center" : "justify-end"
          } px-2 text-white`}
        >
          <MenuIcon onClick={toggleMenu} className="cursor-pointer" />
        </div>
        <div className="flex flex-row items-center justify-center w-[90%] gap-1 p-2 rounded-md border border-white">
          <Avatar />
          {!isCollapsed && <p className="capitalize text-white">{user.name}</p>}
        </div>

        <div
          className={`flex flex-col gap-4 pt-10 p-2 ${
            isCollapsed ? "items-center" : ""
          } w-full text-white text-2xl h-full`}
        >
          <SidebarOption
            title="dashboard"
            to="/Dashboard"
            icon={<GridViewIcon />}
            isCollapsed={isCollapsed}
            active={active}
            setIsActive={setIsActive}
          />
          <div
            onClick={handleCoursesClick}
            className={`flex flex-row hover:bg-gray-700 gap-2 items-center ${
              active === "Courses" ? "bg-[#4a8e8b] text-white" : "text-white"
            } p-2 rounded-md`}
          >
            <BookIcon />
            {!isCollapsed && <p className="capitalize">courses</p>}
          </div>

          {user.role !== "student" && (
            <AdminOptions
              isCollapsed={isCollapsed}
              active={active}
              setIsActive={setIsActive}
            />
          )}
        </div>

        <div className="text-white w-full px-4 pb-4">
          <Logout
            onClick={handleLogout}
            fontSize="large"
            className="hover:bg-gray-700 cursor-pointer"
          />
        </div>
      </div>

      {/* Right Sidebar for Courses */}
      {showCourses && (
        <div className="right-sidebar transition-all duration-300 ease-in-out bg-white shadow-2xl border-r border-t border-b border-r-black border-t-black border-b-black w-1/8 h-[95vh] flex flex-col p-4 rounded-tr-lg rounded-br-lg">
          <p className="text-2xl font-bold">COURSES:</p>
          {courses.map((course) => (
            <div
              key={course}
              onClick={() => handleCourseSelect(course)}
              className={`p-2 hover:bg-gray-300 rounded ${
                active === course ? "bg-[#4a8e8b]" : ""
              }`}
            >
              <p
                className={`${active === course ? "text-white" : "text-black"}`}
              >
                {course}
              </p>
            </div>
          ))}
          <div
            className="p-2 hover:bg-gray-300 rounded flex items-center justify-between cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <p>Add Course</p>
            <span className="text-2xl">+</span>
          </div>
        </div>
      )}

      {/* Modal for Adding New Course */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          <TextField
            label="Course Name"
            variant="outlined"
            fullWidth
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddCourse} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Sidebar;
