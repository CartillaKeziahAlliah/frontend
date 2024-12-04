import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  Alert,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { Add, Delete } from "@mui/icons-material";
import Swal from "sweetalert2";
// const apiUrl = "http://localhost:5000"; // Your API URL
const apiUrl = "https://server-production-dd7a.up.railway.app";
const AdminTable = ({ handleBackToDashboard }) => {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const [error, setError] = useState("");
  const updateRoleToMasterAdmin = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to make this user a Master Admin.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update role!",
    });

    if (result.isConfirmed) {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.put(
          `${apiUrl}/api/users/${userId}/master-admin`
        );

        if (response.status === 200) {
          const updatedAdmins = admins.map((admin) =>
            admin._id === userId ? { ...admin, role: "masterAdmin" } : admin
          );
          setAdmins(updatedAdmins);
          setFilteredAdmins(updatedAdmins);

          Swal.fire({
            icon: "success",
            title: "Role Updated",
            text: "The user is now a Master Admin!",
          });
        }
      } catch (err) {
        setError(err.response ? err.response.data.message : "Server error");
      } finally {
        setLoading(false);
      }
    }
  };

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    const filtered = admins.filter(
      (admin) =>
        admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAdmins(filtered);
  }, [searchTerm, admins]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/manage/admins`);
      setAdmins(response.data.data);
      setFilteredAdmins(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/manage/admins`,
        newAdmin
      );
      if (response.status === 201) {
        const updatedAdmins = [...admins, response.data.data];
        setAdmins(updatedAdmins);
        setFilteredAdmins(updatedAdmins);
        setShowModal(false);
        setNewAdmin({ name: "", email: "", password: "", role: "admin" });
        Swal.fire({
          icon: "success",
          title: "Instructor Added",
          text: `${
            newAdmin.role === "masterAdmin" ? "Master Admin" : "Admin"
          } added successfully!`,
        });
      }
    } catch (error) {
      setError(
        error.response.data.error ||
          `Failed to add ${
            newAdmin.role === "admin" ? "Admin" : "Master Admin"
          }.`
      );
    }
  };

  const handleRemoveAdmin = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action will permanently remove the admin.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#207E68",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove it!",
      });

      if (result.isConfirmed) {
        await axios.delete(`${apiUrl}/api/manage/admins/${id}`);
        const updatedAdmins = admins.filter((admin) => admin._id !== id);
        setAdmins(updatedAdmins);
        setFilteredAdmins(updatedAdmins);

        await Swal.fire({
          icon: "success",
          title: "Removed!",
          text: "The admin has been removed successfully.",
          confirmButtonColor: "#207E68",
        });
      }
    } catch (error) {
      console.error("Error removing admin:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to remove admin. Please try again.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="w-full p-[2%]">
      <div className="flex flex-row justify-between gap-2 mb-4">
        <button
          className="mt-4 p-2 cursor-pointer bg-[#207E68] border border-1 text-[white] rounded-full"
          onClick={handleBackToDashboard}
        >
          Back to Manage
        </button>
        <div className="mt-4 flex-1">
          <input
            type="text"
            placeholder="Search instructors..."
            className="p-2 border w-full border-gray-300 rounded-full focus:outline-[#207E68]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {user.role === "masterAdmin" && (
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 p-1 cursor-pointer  border-4 border-[#207E68] text-[#207E68] rounded-full"
          >
            <Add />
          </button>
        )}
      </div>

      {/* Search Field */}

      <Paper>
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
                  Access
                </TableCell>
                {user.role === "masterAdmin" && <TableCell>Action</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={user === "masterAdmin" ? 4 : 3}>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredAdmins.length > 0 ? (
                filteredAdmins
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((admin) => (
                    <TableRow key={admin._id}>
                      <TableCell>{admin.name}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        {admin.role === "admin" ? "Viewer" : "Master Admin"}
                      </TableCell>
                      {user.role === "masterAdmin" && (
                        <>
                          <TableCell>
                            <Tooltip title="Remove" arrow>
                              <Button
                                variant=""
                                color="secondary"
                                onClick={() => handleRemoveAdmin(admin._id)}
                                sx={{ color: "red" }}
                              >
                                <Delete sx={{ cursor: "pointer" }} />
                              </Button>
                            </Tooltip>
                            {admin.role === "admin" && (
                              <Tooltip>
                                <Button
                                  onClick={() =>
                                    updateRoleToMasterAdmin(admin._id)
                                  }
                                >
                                  Make Admin
                                </Button>
                              </Tooltip>
                            )}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={user.role === "masterAdmin" ? 4 : 3}
                    sx={{ textAlign: "center" }}
                  >
                    No user found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredAdmins.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Modal for Adding Admin */}
      <Dialog open={showModal}>
        <DialogTitle>Add Admin or Master Admin</DialogTitle>
        {error && (
          <Alert
            severity="error"
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mb: 2,
            }}
          >
            {error}
          </Alert>
        )}
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={newAdmin.name}
            onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            type="email"
            value={newAdmin.email}
            onChange={(e) =>
              setNewAdmin({ ...newAdmin, email: e.target.value })
            }
          />
          <TextField
            label="Temporary Password"
            fullWidth
            margin="dense"
            type="password"
            value={newAdmin.password}
            onChange={(e) =>
              setNewAdmin({ ...newAdmin, password: e.target.value })
            }
          />
          <Select
            fullWidth
            value={newAdmin.role}
            onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
            margin="dense"
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="masterAdmin">Master Admin</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddAdmin} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminTable;
