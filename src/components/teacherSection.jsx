import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

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

const apiUrl = "https://backend-production-55e3.up.railway.app";

const SubjectsList = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/api/subject/${user._id}`);
        console.log(response.data);
        setSubjects(response.data);
      } catch (err) {
        setError();
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [user._id]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

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
                      Section:{" "}
                      {subject.section ? subject.section.section_name : "N/A"}{" "}
                    </Typography>
                    <Typography variant="body2">
                      Start:{" "}
                      {subject.section ? subject.section.start_time : "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      End: {subject.section ? subject.section.end_time : "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      Schedule:{" "}
                      {subject.section ? subject.section.schedule : "N/A"}
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
