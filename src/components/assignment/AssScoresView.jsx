import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button, // Import Button
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { CloseOutlined } from "@mui/icons-material";

const apiUrl = "http://localhost:5000";

const AssScoresView = ({ assignments, onClose }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/assignment/${assignments._id}/scores`
        );
        console.log(response.data);
        setScores(response.data);
      } catch (error) {
        console.error(error);
        Swal.fire("Error!", "Failed to fetch scores", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [assignments._id]);

  return (
    <Box
      sx={{
        marginTop: 3,
        padding: 2,
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <div className="flex w-full justify-between items-center">
        <Typography variant="h6">Assignment Scores</Typography>
        <Button onClick={onClose} variant="text" sx={{ color: "black" }}>
          <CloseOutlined />
        </Button>
      </div>

      {loading ? ( // Show loading spinner when loading
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Obtained Marks</TableCell>
                <TableCell>Passed</TableCell>
                <TableCell>Exam Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scores && scores.length > 0 ? (
                scores.map((score) => (
                  <TableRow key={score.studentId._id}>
                    <TableCell>{`${score.studentId.name}`}</TableCell>
                    <TableCell>{score.studentId.email}</TableCell>
                    <TableCell>{score.obtainedMarks}</TableCell>
                    <TableCell>{score.passed ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      {new Date(score.examDate).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No scores found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AssScoresView;
