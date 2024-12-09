import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
// const apiUrl = "http://localhost:5000"; // Your API URL
const apiUrl = "https://server-production-dd7a.up.railway.app";
const RequestPage = ({ handleBackToDashboard }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // For search filtering
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newLRN, setNewLRN] = useState("");

  // Fetch users on component mount
  useEffect(() => {
    fetchUsersWithoutLRN();
  }, []);

  // Fetch users without LRN from the backend
  const fetchUsersWithoutLRN = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/users/students/without-lrn`
      );
      const data = response.data.data || [];
      setUsers(data);
      setFilteredUsers(data); // Set filtered users initially
    } catch (error) {
      Swal.fire("Error", "Failed to fetch users", "error");
      console.error("Error fetching users:", error);
    }
  };
  const handleApproveUser = async (userId, userName) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Approve the user ${userName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, approve it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(`${apiUrl}/api/users/approve/${userId}`);
          Swal.fire("Success", "User approved successfully!", "success");
          fetchUsersWithoutLRN(); // Refresh the list of users
        } catch (error) {
          Swal.fire("Error", "Failed to approve user", "error");
          console.error("Error approving user:", error);
        }
      }
    });
  };
  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search input change
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
    setPage(0); // Reset to the first page after filtering
  };

  // Handle LRN dialog actions
  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setNewLRN(user?.LRN || "");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setNewLRN("");
  };

  const handleSaveLRN = async () => {
    if (!newLRN.trim() || newLRN.length !== 12) {
      Swal.fire("Error", "LRN must be exactly 12 characters", "error");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: `Save LRN "${newLRN}" for ${selectedUser.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(`${apiUrl}/api/users/students/add-lrn`, {
            userId: selectedUser._id,
            LRN: newLRN,
          });

          Swal.fire("Success", "LRN updated successfully!", "success");
          fetchUsersWithoutLRN();
          handleCloseDialog();
        } catch (error) {
          Swal.fire("Error", "Failed to update LRN", "error");
          console.error("Error saving LRN:", error);
        }
      }
    });
  };
  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will delete the user permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${apiUrl}/api/manage/user/${userId}`);
        Swal.fire("Deleted!", "The user has been deleted.", "success");
        fetchUsersWithoutLRN();
      } catch (error) {
        Swal.fire("Error", "Failed to delete the user", "error");
        console.error("Error deleting user:", error);
      }
    }
  };
  return (
    <div className="w-full p-[2%]">
      <div className="flex justify-between gap-2 mb-4">
        <button
          type="button"
          className="p-2 mt-4 bg-[#207E68] border border-1 text-white rounded-full"
          onClick={handleBackToDashboard}
        >
          Back to Manage
        </button>
        <div className="mt-4 flex-1">
          <input
            type="text"
            placeholder="Search Students..."
            className="p-2 border w-full border-gray-300 rounded-full focus:outline-[#207E68]"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      {/* Search Field */}

      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: "#207E68" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontSize: "large" }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "white", fontSize: "large" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "white", fontSize: "large" }}>
                LRN
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "white", fontSize: "large" }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell sx={{ textAlign: "center" }} colSpan={3}>
                  No request found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.LRN}</TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 2,
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleApproveUser(user._id, user.name)}
                        sx={{ bgcolor: "#207E68" }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default RequestPage;
