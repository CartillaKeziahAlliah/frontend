import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  TablePagination,
} from "@mui/material";
import { SearchOutlined, CheckCircle } from "@mui/icons-material";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const apiUrl = "http://localhost:5000";

const DiscussionList = ({ selectedSubject }) => {
  const [discussions, setDiscussions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDiscussions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiUrl}/api/discussion/subject/${selectedSubject._id}`
        );
        setDiscussions(response.data);
      } catch (error) {
        console.error("Error fetching discussions:", error);
        Swal.fire("Error", "Failed to load discussions", "error");
      } finally {
        setLoading(false);
      }
    };

    if (selectedSubject) {
      fetchDiscussions();
    }
  }, [selectedSubject]);

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setPage(0);
  };

  const filteredDiscussions = useMemo(() => {
    return discussions.filter(
      (discussion) =>
        discussion.title.toLowerCase().includes(searchTerm) ||
        discussion.content.toLowerCase().includes(searchTerm)
    );
  }, [discussions, searchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedDiscussions = useMemo(() => {
    return filteredDiscussions.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredDiscussions, page, rowsPerPage]);

  const deleteDiscussion = async (discussionId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      setDiscussions((prev) =>
        prev.filter((discussion) => discussion._id !== discussionId)
      );
      try {
        await axios.delete(`${apiUrl}/api/discussion/${discussionId}`);
        Swal.fire("Deleted Successfully!", "", "success");
      } catch (error) {
        console.error("Failed to delete discussion:", error);
        setDiscussions((prev) => [
          ...prev,
          discussions.find((d) => d._id === discussionId),
        ]);
        Swal.fire("Error", "Failed to delete discussion", "error");
      }
    }
  };

  const markDiscussionAsRead = async (discussionId) => {
    const studentId = user._id;
    try {
      await axios.patch(`${apiUrl}/api/discussion/${discussionId}/read`, {
        studentId,
      });
      setDiscussions((prev) =>
        prev.map((discussion) =>
          discussion._id === discussionId
            ? { ...discussion, isRead: true }
            : discussion
        )
      );
      Swal.fire(
        "Marked as Read",
        "You have marked this discussion as read.",
        "success"
      );
    } catch (error) {
      console.error("Failed to mark discussion as read:", error);
      Swal.fire("Error", "Failed to mark discussion as read", "error");
    }
  };

  const handleDiscussionClick = (discussion) => {
    setSelectedDiscussion(discussion); // Set the selected discussion
  };

  const clearSelectedDiscussion = () => {
    setSelectedDiscussion(null); // Clear selected discussion
  };

  return (
    <div className="discussion-list">
      <Box display="flex" flexDirection="row" gap={1} sx={{ marginTop: 2 }}>
        <div className="border border-gray-500 px-2 rounded-3xl mb-4 w-full flex flex-row items-center">
          <SearchOutlined />
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchTerm}
            onChange={handleSearchTermChange}
            className="w-full p-2 outline-none rounded-3xl"
          />
        </div>
      </Box>

      {loading ? (
        <Typography>Loading discussions...</Typography>
      ) : paginatedDiscussions.length > 0 ? (
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ borderRadius: "10px", overflow: "hidden" }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Title
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Content
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedDiscussions.map((discussion) => (
                <TableRow key={discussion._id} hover>
                  <TableCell>
                    <Typography variant="body1">{discussion.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      {discussion.content}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => deleteDiscussion(discussion._id)}
                      variant="outlined"
                    >
                      Delete
                    </Button>
                    {discussion.isRead ? (
                      <CheckCircle color="success" />
                    ) : (
                      <Button
                        onClick={() => markDiscussionAsRead(discussion._id)}
                        variant="outlined"
                        color="secondary"
                      >
                        Mark as Read
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDiscussionClick(discussion)}
                      variant="outlined"
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No discussions found.</Typography>
      )}

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredDiscussions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Selected Discussion Details */}
      {selectedDiscussion && (
        <Box
          sx={{
            marginTop: 3,
            padding: 2,
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6">Discussion Details</Typography>
          <Typography variant="body1" fontWeight="bold">
            Title:
          </Typography>
          <Typography variant="body2">{selectedDiscussion.title}</Typography>
          <Typography variant="body1" fontWeight="bold">
            Content:
          </Typography>
          <Typography variant="body2">{selectedDiscussion.content}</Typography>

          <Button
            onClick={clearSelectedDiscussion}
            variant="outlined"
            sx={{ marginTop: 2 }}
          >
            Close
          </Button>
        </Box>
      )}
    </div>
  );
};

export default DiscussionList;
