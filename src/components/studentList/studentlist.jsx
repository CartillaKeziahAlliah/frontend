import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from "@mui/material";

// const apiUrl = "https://server-production-dd7a.up.railway.app";
const apiUrl = "http://localhost:5000";

const StudentsComponent = ({ sectionName }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudentsById = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/section/${sectionName}/students`
      );
      setStudents(response.data.students);
      setLoading(false);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Server Error");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sectionName) {
      fetchStudentsById();
    }
  }, [sectionName]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              style={{
                fontWeight: "bold",
                backgroundColor: "#207E68",
                color: "white",
              }}
            >
              Name
            </TableCell>
            <TableCell
              style={{
                fontWeight: "bold",
                backgroundColor: "#207E68",
                color: "white",
              }}
            >
              Status
            </TableCell>
            <TableCell
              style={{
                fontWeight: "bold",
                backgroundColor: "#207E68",
                color: "white",
              }}
            >
              Passing Rate
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                No students found.
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>
                  {student.status ? student.status : <>N/A</>}
                </TableCell>
                <TableCell>
                  {student.passingPercentage ? (
                    `${student.passingPercentage}%`
                  ) : (
                    <>N/A</>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentsComponent;
