import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Button,
  Typography,
  TablePagination,
  Skeleton,
  MenuItem,
  IconButton,
  Menu,
} from "@mui/material";
import {
  SearchOutlined,
  CheckCircle,
  CloseOutlined,
  DragIndicator,
  DescriptionOutlined,
  MoreVert,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import StudentsReadList from "./StudentsReadModal"; // Import the new students read list component

const apiUrl = "https://server-production-dd7a.up.railway.app";

const DiscussionList = ({ selectedSubject }) => {
  const [discussions, setDiscussions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const { user } = useAuth();
  const [studentsReadList, setStudentsReadList] = useState([]);
  const [showStudentsReadList, setShowStudentsReadList] = useState(false); // State to toggle student read list visibility
  const [viewRead, setViewRead] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeDiscussionId, setActiveDiscussionId] = useState(null);
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
        Swal.fire("Oops", "You don't have any discussions", "error");
      } finally {
        setLoading(false);
      }
    };

    if (selectedSubject) {
      fetchDiscussions();
    }
  }, [selectedSubject]);
  const handleMenuOpen = (event, discussionId) => {
    setAnchorEl(event.currentTarget);
    setActiveDiscussionId(discussionId);
  };
  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setPage(0);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveDiscussionId(null);
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
      // Update the discussions state immediately
      setDiscussions((prev) =>
        prev.map((discussion) =>
          discussion._id === discussionId
            ? {
                ...discussion,
                studentsRead: [
                  ...discussion.studentsRead,
                  { studentId, dateRead: new Date() },
                ],
              }
            : discussion
        )
      );

      // If the selected discussion is the one marked as read, update it too
      if (selectedDiscussion?._id === discussionId) {
        setSelectedDiscussion((prev) => ({
          ...prev,
          studentsRead: [
            ...prev.studentsRead,
            { studentId, dateRead: new Date() },
          ],
        }));
      }

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

  const isDiscussionReadByUser = (discussion) => {
    return discussion.studentsRead.some(
      (student) => student.studentId === user._id
    );
  };

  const handleDiscussionClick = (discussion) => {
    setSelectedDiscussion(discussion); // Set the selected discussion
  };

  const clearSelectedDiscussion = () => {
    setSelectedDiscussion(null); // Clear selected discussion
    setAnchorEl(null);
  };

  const fetchStudentsReadList = async (discussionId) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/discussion/${discussionId}/students-read`
      );
      setStudentsReadList(response.data);
      setShowStudentsReadList(true); // Show the students read list after fetching data
    } catch (error) {
      console.error("Error fetching students read list:", error);
      Swal.fire("Error", "Failed to fetch students read list", "error");
    }
  };
  const CloseReadList = () => {
    setShowStudentsReadList(false);
    setAnchorEl(null);
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

      {!selectedDiscussion && !showStudentsReadList && (
        <>
          {loading ? (
            <Typography>
              <Skeleton />
            </Typography>
          ) : paginatedDiscussions.length > 0 ? (
            paginatedDiscussions.map((discussion) => (
              <Paper
                key={discussion._id}
                elevation={3}
                sx={{
                  marginBottom: 2,
                  padding: 2,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  className="capitalize"
                  gap={1}
                >
                  <DragIndicator />
                  <DescriptionOutlined
                    sx={{ color: "rgba(67, 141, 97, 0.8)" }}
                  />
                  <Typography variant="body1">{discussion.title}</Typography>
                </Box>

                <Box align="right">
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, discussion._id)}
                  >
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={
                      Boolean(anchorEl) && activeDiscussionId === discussion._id
                    }
                    onClose={handleMenuClose}
                  >
                    {isDiscussionReadByUser(discussion) ? (
                      <MenuItem
                        sx={{
                          color: "black",
                          cursor: "default",
                        }}
                      >
                        <CheckCircle color="success" sx={{ marginRight: 1 }} />
                        Read
                      </MenuItem>
                    ) : (
                      <MenuItem
                        onClick={() => {
                          handleDiscussionClick(discussion);
                        }}
                      >
                        Read Discussion
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={() => fetchStudentsReadList(discussion._id)}
                    >
                      View Students
                    </MenuItem>
                    {user.role !== "student" && (
                      <MenuItem
                        onClick={() => {
                          deleteDiscussion(discussion._id);
                        }}
                      >
                        Delete
                      </MenuItem>
                    )}
                  </Menu>
                </Box>
              </Paper>
            ))
          ) : (
            <Typography>No discussions found.</Typography>
          )}
        </>
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
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <Typography variant="h4">Discussion</Typography>

              <div className="flex flex-row items-center">
                {user.role === "student" && (
                  <>
                    {isDiscussionReadByUser(selectedDiscussion) ? (
                      <Typography color="success.main">
                        You have read this discussion
                      </Typography>
                    ) : (
                      <Button
                        onClick={() => {
                          markDiscussionAsRead(selectedDiscussion._id);
                        }}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </>
                )}
                <Button onClick={clearSelectedDiscussion}>
                  <CloseOutlined sx={{ color: "#000" }} />
                </Button>
              </div>
            </div>
            <Typography variant="h5" className="capitalize">
              {selectedDiscussion.title}
            </Typography>
          </div>
          <Typography variant="body1" fontWeight="bold">
            Content:
          </Typography>
          <Typography variant="body2">{selectedDiscussion.content}</Typography>
        </Box>
      )}

      {/* Display the Students Read List */}
      {showStudentsReadList && (
        <StudentsReadList
          studentsReadList={studentsReadList}
          onClose={CloseReadList} // Close the student list
        />
      )}
    </div>
  );
};

export default DiscussionList;
