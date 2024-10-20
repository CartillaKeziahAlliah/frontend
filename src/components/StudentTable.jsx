import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const columns = [
  { field: "id", headerName: "ID", flex: 0.1 },
  { field: "studentName", headerName: "Student Name", flex: 1 },
  { field: "studentLRN", headerName: "LRN", flex: 0.5 },
  { field: "studentSection", headerName: "Section", flex: 0.5 },
  { field: "gradeLevel", headerName: "Grade", flex: 0.3 },
  {
    field: "actions",
    headerName: "Actions",
    flex: 1,
    renderCell: (params) => (
      <Box display="flex" justifyContent="space-between">
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleEdit(params.id)}
          sx={{ mr: 1, minWidth: 70 }}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => handleDelete(params.id)}
          sx={{ minWidth: 70 }}
        >
          Delete
        </Button>
      </Box>
    ),
  },
];

const rows = [
  {
    id: 1,
    studentName: "Snow",
    studentLRN: 1234556,
    studentSection: "Diamond",
    gradeLevel: 10,
  },
  {
    id: 1,
    studentName: "Snow",
    studentLRN: 1234556,
    studentSection: "Diamond",
    gradeLevel: 10,
  },
  {
    id: 1,
    studentName: "Snow",
    studentLRN: 1234556,
    studentSection: "Diamond",
    gradeLevel: 10,
  },
  {
    id: 1,
    studentName: "Snow",
    studentLRN: 1234556,
    studentSection: "Diamond",
    gradeLevel: 10,
  },
];

const paginationModel = { page: 0, pageSize: 2 };

const handleEdit = (id) => {
  console.log(`Edit row with id: ${id}`);
};

const handleDelete = (id) => {
  console.log(`Delete row with id: ${id}`);
};

export default function StudentTable() {
  return (
    <div className="w-full p-4">
      <Typography
        variant="h4"
        component="div"
        sx={{ p: 2, textAlign: "center" }}
      >
        Students
      </Typography>
      <Paper sx={{ height: "400px", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[1, 2]}
          checkboxSelection
          autoHeight
          sx={{
            border: 0,
            "@media (max-width: 600px)": {
              ".MuiDataGrid-columnHeader": { fontSize: "0.8rem" },
              ".MuiDataGrid-cell": { fontSize: "0.8rem" },
            },
          }}
        />
      </Paper>
    </div>
  );
}
