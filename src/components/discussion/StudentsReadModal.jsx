// StudentsReadList.js
import React from "react";
import { Box, Typography } from "@mui/material";

const StudentsReadList = ({ studentsReadList, onClose }) => {
  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: 2,
        marginTop: 2,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Students Who Read the Discussion
      </Typography>
      {studentsReadList.length > 0 ? (
        studentsReadList.map((entry, index) => (
          <Box key={index} sx={{ marginBottom: 1 }}>
            <Typography>
              {entry.student.name} (Read on{" "}
              {new Date(entry.dateRead).toLocaleDateString()})
            </Typography>
          </Box>
        ))
      ) : (
        <Typography>No students have read this discussion yet.</Typography>
      )}
      <button onClick={onClose} style={{ marginTop: 10 }}>
        Close
      </button>
    </Box>
  );
};

export default StudentsReadList;
