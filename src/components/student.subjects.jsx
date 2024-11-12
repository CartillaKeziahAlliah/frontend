import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

const apiUrl = "http://localhost:5000";
// const apiUrl = "https://server-production-dd7a.up.railway.app";
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

        // Use the first section if sections is an array
        const sectionId = Array.isArray(user.sections)
          ? user.sections[0]
          : user.sections;

        const response = await axios.get(
          `${apiUrl}/api/subject/section/${sectionId}`
        );
        setSubjects(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : "Server error.");
      } finally {
        setLoading(false);
      }
    };

    if (user.sections && user.sections.length > 0) {
      fetchSubjects();
    }
  }, [user.sections]);

  if (loading) return <p>Loading subjects...</p>;
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
              <Grid item xs={12} sm={6} md={4} key={subject._id}>
                <Card
                  style={{
                    backgroundColor: cardColor,
                    borderLeft: `8px solid ${getRandomPastelColor()}`,
                  }}
                >
                  <CardContent>
                    <Typography variant="h5">{subject.subject_name}</Typography>
                    <Typography variant="body2">
                      Start: {subject.start_time}
                    </Typography>
                    <Typography variant="body2">
                      End: {subject.end_time}
                    </Typography>
                    <Typography variant="body2">
                      Schedule: {subject.schedule}
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
