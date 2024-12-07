import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

// const apiUrl = "http://localhost:5000";
// Default API base URL
const apiUrl = "https://server-production-dd7a.up.railway.app";
const getRandomPastelColor = () => {
  const colors = [
    "#FFCCCB", // Light red
    "#FFEBCC", // Light orange
    "#FFFFCC", // Light yellow
    "#CCFFCC", // Light green
    "#CCFFFF", // Light cyan
    "#CCCCFF", // Light blue
    "#E6CCFF", // Light purple
    "#FFD1DC", // Light pink
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const SubjectsList = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);

        // Check user role and construct URL accordingly

        let apiUrlWithRole = `${apiUrl}/api/subject/student/${user._id}/subjects`;

        const response = await axios.get(apiUrlWithRole);

        // Check if the response data is an array of subjects
        if (Array.isArray(response.data.subjects)) {
          setSubjects(response.data.subjects);
        } else {
          setError("Unexpected response format");
        }
      } catch (err) {
        setError("An error occurred while fetching subjects");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.sections && user.sections.length > 0) {
      fetchSubjects();
    }
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex-1 p-4">
      {subjects.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
          sx={{ boxShadow: "0 2px 2px gray" }}
        >
          <Typography variant="h6">No subjects found for this user</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {subjects.map((subject) => {
            const cardColor = getRandomPastelColor();
            return (
              <Grid item xs={12} sm={6} md={4} key={subject.subjectId}>
                <Card
                  style={{
                    backgroundColor: cardColor,
                    borderLeft: `8px solid ${getRandomPastelColor()}`,
                  }}
                >
                  <CardContent>
                    <Typography variant="h5">{subject.subjectName}</Typography>
                    <Typography variant="body2">
                      Start: {subject.startTime}
                    </Typography>
                    <Typography variant="body2">
                      End: {subject.endTime}
                    </Typography>
                    <Typography variant="body2">
                      Teacher: {subject.teacher.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </div>
  );
};

export default SubjectsList;
