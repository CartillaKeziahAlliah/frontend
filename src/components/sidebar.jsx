import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BookIcon from '@mui/icons-material/Book';
import GridViewIcon from '@mui/icons-material/GridView';
import Logout from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ userRole }) => {
    const [active, setIsActive] = useState("Dashboard");
    const [showCourses, setShowCourses] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [open, setOpen] = useState(false); // State for modal
    const [newCourse, setNewCourse] = useState(""); // State for new course input
    const [courses, setCourses] = useState([
        "Mathematics",
        "Science",
        "Filipino",
        "English",
        "General Anatomy",
        "HEKASI",
        "Music",
        "Arts",
        "Physical Education"
    ]);

    const handleCoursesClick = () => {
        setShowCourses(prev => !prev);
        setIsActive("Courses");
    };

    const toggleMenu = () => {
        setIsCollapsed(prev => !prev);
    };

    const handleAddCourse = () => {
        if (newCourse) {
            setCourses(prevCourses => [...prevCourses, newCourse]);
            setNewCourse("");
            setOpen(false);
        }
    };

    return (
        <div className='flex items-center'>
            <div className={`sidebar transition-all duration-300 ease-in-out rounded-2xl m-2 bg-[#207e68] ${isCollapsed ? 'collapsed' : 'expanded'} h-[98vh] flex flex-col items-center justify-between`}>
                <div className={`w-full flex ${isCollapsed ? 'justify-center' : 'justify-end'} px-2 text-white`}>
                    <MenuIcon onClick={toggleMenu} className='cursor-pointer' />
                </div>
                <div className='flex flex-row items-center justify-center w-[80%] p-2 rounded-md border border-white'>
                    <Avatar />
                    {!isCollapsed && <p>Rosales</p>}
                </div>
                <div className={`flex flex-col gap-4 pt-10 p-2 ${isCollapsed ? 'items-center' : ''} w-full text-white text-2xl h-full`}>
                    <div onClick={() => setIsActive("Dashboard")} className={`${active === "Dashboard" ? 'bg-red p-' : ''}`}>
                        <Link to="/Dashboard" className='flex hover:bg-gray-700 flex-row gap-2 items-center'>
                            <GridViewIcon />
                            {!isCollapsed && <p className='capitalize'>dashboard</p>}
                        </Link>
                    </div>
                    <div onClick={handleCoursesClick} className={`flex flex-row hover:bg-gray-700 gap-2 items-center ${active === "Courses" ? 'bg-red' : ''}`}>
                        <BookIcon />
                        {!isCollapsed && <p className='capitalize'>courses</p>}
                    </div>

                    {userRole !== 'student' && (
                        <>
                            <div onClick={() => setIsActive("Admin")} className={`${active === "Admin" ? 'bg-red' : ''}`}>
                                <Link to="/Admin" className='flex flex-row gap-2 hover:bg-gray-700 items-center'>
                                    <AdminPanelSettingsIcon />
                                    {!isCollapsed && <p className='capitalize'>admin</p>}
                                </Link>
                            </div>
                            <div onClick={() => setIsActive("Manage")} className={`${active === "Manage" ? 'bg-red' : ''}`}>
                                <Link to="/Manage" className='flex flex-row gap-2 hover:bg-gray-700 items-center'>
                                    <ManageAccountsIcon />
                                    {!isCollapsed && <p className='capitalize'>manage</p>}
                                </Link>
                            </div>
                        </>
                    )}
                </div>
                <div className='text-white w-full px-4 pb-4'>
                    <Logout fontSize='large' className='hover:bg-gray-700 ' />
                </div>
            </div>

            {/* Right Sidebar */}
            <div className={`right-sidebar transition-all duration-300 ease-in-out ${showCourses ? 'open' : 'closed'} bg-white shadow-2xl border-r border-t border-b border-r-black border-t-black border-b-black w-1/8 h-[95vh] flex flex-col p-4 rounded-tr-lg rounded-br-lg ${showCourses ? 'block' : 'hidden'}`}>
                <p className="text-2xl font-bold">COURSES:</p>
                {courses.map(course => (
                    <div
                        key={course}
                        onClick={() => setIsActive(course)}
                        className={`p-2 hover:bg-gray-300 rounded ${active === course ? 'bg-[#207e68]' : ''}`}>
                        <p className={`${active === course ? 'text-white' : 'text-black'}`}>{course}</p>
                    </div>
                ))}
                <div className="p-2 hover:bg-gray-300 rounded flex items-center justify-between cursor-pointer" onClick={() => setOpen(true)}>
                    <p>Add Course</p>
                    <span className="text-2xl">+</span>
                </div>
            </div>

            {/* Modal for adding a new course */}
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
