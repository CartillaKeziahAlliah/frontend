import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Snackbar,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  MenuItem,
  Menu,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { CheckCircle, MoreHoriz } from "@mui/icons-material";

const apiUrl = "https://server-production-dd7a.up.railway.app";

const Discussion = ({ subjectId, userId }) => {
  const [discussions, setDiscussions] = useState([]);
  const [currentDiscussionIndex, setCurrentDiscussionIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  // Fetch discussions when the component mounts
  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/discussion/subject/${subjectId}`
        );
        const sortedDiscussion = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setDiscussions(sortedDiscussion);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching discussions:", error);
        setLoading(false); // Set loading to false if an error occurs
      }
    };

    fetchDiscussions();
  }, [subjectId]);

  const isDiscussionReadByUser = (discussion) => {
    return discussion.studentsRead.some(
      (student) => student.studentId === userId
    );
  };

  const handleViewDiscussion = async (index) => {
    setCurrentDiscussionIndex(index);
  };

  const markDiscussionAsRead = async (discussionId) => {
    try {
      await axios.patch(`${apiUrl}/api/discussion/${discussionId}/read`, {
        studentId: userId,
      });
      setSuccessMessage("Discussion marked as read");
    } catch (error) {
      setError("Error marking discussion as read. Please try again.");
      console.error("Error marking discussion as read:", error);
    }
  };

  const handleBack = () => {
    setCurrentDiscussionIndex(null);
    setAnchorEl(false);
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage("");
    setError(null);
  };
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {currentDiscussionIndex === null ? (
            <TableContainer component={Card}>
              <Table>
                <TableHead bgColor="#cdcdcd">
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Number of Read</TableCell>

                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {discussions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Typography variant="h6" color="textSecondary">
                          No Records
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {discussions.map((discussion, index) => (
                        <TableRow key={discussion._id}>
                          <TableCell>
                            <Typography className="capitalize">
                              {discussion.title}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {discussion.studentsRead.length}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton onClick={handleMenuOpen}>
                              <MoreHoriz />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleMenuClose}
                            >
                              <MenuItem
                                onClick={() => handleViewDiscussion(index)}
                              >
                                View Discussion
                              </MenuItem>
                            </Menu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div>
              <div className="flex flex-row">
                <Typography variant="h4" textTransform="capitalize">
                  {discussions[currentDiscussionIndex].title}
                </Typography>
                {isDiscussionReadByUser(
                  discussions[currentDiscussionIndex]
                ) && (
                  <>
                    <div className="flex justify-center items-center text-[green] flex-row flex-wrap">
                      <CheckCircle />
                      <p className="text-center text-2xl ">Read</p>
                    </div>
                  </>
                )}
              </div>
              <Typography variant="body1" paragraph>
                {discussions[currentDiscussionIndex].content ||
                  "No content available."}
              </Typography>
              {isDiscussionReadByUser(
                discussions[currentDiscussionIndex]
              ) ? null : (
                <Button
                  variant="contained"
                  onClick={() =>
                    markDiscussionAsRead(
                      discussions[currentDiscussionIndex]._id
                    )
                  } // Updated fix
                >
                  Mark as Read
                </Button>
              )}

              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{
                  color: "#207E68",
                  borderColor: "#207E68",
                  marginLeft: "4px",

                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                    borderColor: "#1a5b4f",
                  },
                }}
              >
                Back to Discussions
              </Button>
            </div>
          )}
        </>
      )}
      <Snackbar
        open={!!successMessage || !!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage || error}
      />
    </div>
  );
};

export default Discussion;
