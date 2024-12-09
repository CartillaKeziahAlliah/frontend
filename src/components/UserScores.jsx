// src/components/UserScores.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TablePagination,
  TextField,
} from "@mui/material";
const apiUrl = "https://server-production-dd7a.up.railway.app";
// const apiUrl = "http://localhost:5000";

const UserScores = ({ userId, subjectId }) => {
  const [userScores, setUserScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    const fetchUserScores = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/users/user-scores/${userId}/${subjectId}`
        );

        const combinedScores = [
          ...response.data.assignments.map((item) => ({
            ...item,
            type: "Assignment",
          })),
          ...response.data.exams.map((item) => ({ ...item, type: "Exam" })),
          ...response.data.quizzes.map((item) => ({ ...item, type: "Quiz" })),
        ];

        setUserScores(combinedScores);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user scores:", error);
        setLoading(false);
      }
    };

    fetchUserScores();
  }, [userId]);

  // Handle sorting
  const handleSort = (key) => {
    const isAsc = sortConfig.key === key && sortConfig.direction === "asc";
    setSortConfig({ key, direction: isAsc ? "desc" : "asc" });

    const sortedData = [...userScores].sort((a, b) => {
      if (a[key] < b[key]) return isAsc ? -1 : 1;
      if (a[key] > b[key]) return isAsc ? 1 : -1;
      return 0;
    });
    setUserScores(sortedData);
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filtered scores based on the search query
  const filteredScores = userScores.filter(
    (item) =>
      item.activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.activity.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;

  return (
    <Paper>
      <div style={{ padding: "16px" }}>
        <TextField
          label="Search Scores"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ marginBottom: "16px" }}
        />
      </div>
      {filteredScores.length === 0 ? (
        <div className="text-center">No scores found.</div>
      ) : (
        <>
          {" "}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === "type"}
                      direction={sortConfig.direction}
                      onClick={() => handleSort("type")}
                    >
                      Type of Activity
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === "activity.subject"}
                      direction={sortConfig.direction}
                      onClick={() => handleSort("activity.subject")}
                    >
                      Subject
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Duration (min)</TableCell>
                  <TableCell>Total Marks</TableCell>
                  <TableCell>Pass Marks</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === "activity.deadline"}
                      direction={sortConfig.direction}
                      onClick={() => handleSort("activity.deadline")}
                    >
                      Deadline/Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Obtained Marks</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === "score.passed"}
                      direction={sortConfig.direction}
                      onClick={() => handleSort("score.passed")}
                    >
                      Passed
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredScores
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.activity.subject}</TableCell>
                      <TableCell>{item.activity.title}</TableCell>
                      <TableCell>{item.activity.description}</TableCell>
                      <TableCell>{item.activity.duration}</TableCell>
                      <TableCell>{item.activity.totalMarks}</TableCell>
                      <TableCell>{item.activity.passMarks}</TableCell>
                      <TableCell>
                        {new Date(
                          item.activity.deadline ||
                            item.score.examDate ||
                            item.score.assignmentDate
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{item.score.obtainedMarks}</TableCell>
                      <TableCell>{item.score.passed ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <TablePagination
        component="div"
        count={filteredScores.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15, 20]}
      />
    </Paper>
  );
};

export default UserScores;
