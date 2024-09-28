import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BookIcon from '@mui/icons-material/Book';
import GridViewIcon from '@mui/icons-material/GridView';
import Logout from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const [active, setIsActive] = useState("Dashboard");
    
    return (
        <div className="sidebar bg-[#207e68] w-1/6 h-[100vh] flex flex-col justify-between">
            <div className='flex flex-row bg-[#5ab19c] p-4 gap-2 text-white'>
                <MenuIcon />
                <p className='role'>STUDENT</p>
            </div>
            <div className='flex flex-col gap-4 pt-10 pl-4 text-white text-2xl h-full'>
                <div onClick={() => setIsActive("Dashboard")} className={`${active === "Dashboard" ? 'bg-red' : ''}`}>
                    <Link to="/Dashboard" className='flex hover:bg-gray-700 flex-row gap-2 items-center'>
                        <GridViewIcon />
                        <p className='capitalize'>
                            dashboard
                        </p>
                    </Link>
                </div>
                <div onClick={() => setIsActive("Courses")} className={`${active === "Courses" ? 'bg-red' : ''}`}>
                    <Link to="/Courses" className='flex flex-row hover:bg-gray-700  gap-2 items-center'>
                        <BookIcon />
                        <p className='capitalize'>
                            courses
                        </p>
                    </Link>
                </div>
                <div onClick={() => setIsActive("Admin")} className={`${active === "Admin" ? 'bg-red' : ''}`}>
                    <Link to="/Admin" className='flex flex-row gap-2 hover:bg-gray-700 items-center'>
                        <AdminPanelSettingsIcon />
                        <p className='capitalize'>
                            admin
                        </p>
                    </Link>
                </div>
                <div onClick={() => setIsActive("Manage")} className={`${active === "Manage" ? 'bg-red' : ''}`}>
                    <Link to="/Manage" className='flex flex-row gap-2 hover:bg-gray-700 items-center'>
                        <ManageAccountsIcon />
                        <p className='capitalize'>
                            manage
                        </p>
                    </Link>
                </div>
            </div>
            <div className='text-white w-full px-4 pb-4'>
                <Logout fontSize='large' className='hover:bg-gray-700 '/>
            </div>
        </div>
    );
}

export default Sidebar;
