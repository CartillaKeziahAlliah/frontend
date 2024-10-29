import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { CheckCircle } from "@mui/icons-material";

const apiUrl = "https://server-production-dd7a.up.railway.app";

const Discussion = ({ subjectId, userId }) => {
  const [discussions, setDiscussions] = useState([]);
  const [currentDiscussionIndex, setCurrentDiscussionIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch discussions when the component mounts
  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/discussion/subject/${subjectId}`
        );
        setDiscussions(response.data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching discussions:", error);
        Swal.fire("Error", "Failed to fetch discussions", "error");
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
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage("");
    setError(null);
  };

  return (
    <div>
      <h2>Discussions for {subjectId}</h2>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {currentDiscussionIndex === null ? (
            <Grid container spacing={2}>
              {discussions.map((discussion, index) => (
                <Grid item xs={12} sm={6} md={4} key={discussion._id}>
                  <Card
                    variant="outlined"
                    className="hover:shadow-lg transition-shadow duration-300"
                  >
                    <CardContent>
                      <Typography variant="h6">{discussion.title}</Typography>
                      <Button
                        variant="contained"
                        onClick={() => {
                          handleViewDiscussion(index);
                        }}
                        aria-label={`View discussion titled ${discussion.title}`}
                        sx={{
                          backgroundColor: "#207E68",
                          "&:hover": {
                            backgroundColor: "#1a5b4f",
                          },
                          color: "#fff",
                          mt: 2,
                        }}
                      >
                        View Discussion
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
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
