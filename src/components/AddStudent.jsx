import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";

export default function MultilineTextFields() {
  const [section, setSection] = React.useState("");
  const [gradeLevel, setGradeLevel] = React.useState("");
  const [studentName, setStudentName] = React.useState("");
  const [LRN, setLRN] = React.useState("");

  const handleSectionChange = (event) => {
    setSection(event.target.value);
  };

  const handleGradeLevelChange = (event) => {
    setGradeLevel(event.target.value);
  };

  const handleStudentNameChange = (event) => {
    setStudentName(event.target.value);
  };

  const handleLRNChange = (event) => {
    setLRN(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission
    // Add your submission logic here
    console.log("Submitted:", { studentName, LRN, section, gradeLevel });
    // Optionally reset the form fields
    setStudentName("");
    setLRN("");
    setSection("");
    setGradeLevel("");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        "& .MuiTextField-root": { m: 0.5, width: "20ch" },
        "& .MuiFormControl-root": { m: 0.5, width: "20ch" },
        width: "100%",
        maxWidth: "600px",
        margin: "auto",
      }}
      noValidate
      autoComplete="off"
    >
      {/* Flex container for Student Name and LRN */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <TextField
          id="outlined-student-name"
          label="Student Name"
          value={studentName}
          onChange={handleStudentNameChange}
          multiline
          maxRows={4}
          variant="outlined"
          size="small"
        />
        <TextField
          id="outlined-lrn"
          label="LRN"
          value={LRN}
          onChange={handleLRNChange}
          multiline
          maxRows={4}
          variant="outlined"
          size="small"
        />
      </Box>

      {/* Flex container for Section and Grade Level */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <FormControl variant="filled" size="small">
          <InputLabel id="section-label">Section</InputLabel>
          <Select
            labelId="section-label"
            id="section-select"
            value={section}
            onChange={handleSectionChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Section A">Section A</MenuItem>
            <MenuItem value="Section B">Section B</MenuItem>
            <MenuItem value="Section C">Section C</MenuItem>
            {/* Add more sections as needed */}
          </Select>
        </FormControl>

        <FormControl variant="filled" size="small">
          <InputLabel id="grade-level-label">Grade Level</InputLabel>
          <Select
            labelId="grade-level-label"
            id="grade-level-select"
            value={gradeLevel}
            onChange={handleGradeLevelChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Grade 1">Grade 1</MenuItem>
            <MenuItem value="Grade 2">Grade 2</MenuItem>
            <MenuItem value="Grade 3">Grade 3</MenuItem>
            {/* Add more grade levels as needed */}
          </Select>
        </FormControl>
      </Box>

      {/* Submit Button */}
      <Button
        variant="contained"
        type="submit"
        sx={{ mt: 2 }}
        color="primary"
        size="small"
      >
        Add Student
      </Button>
    </Box>
  );
}
