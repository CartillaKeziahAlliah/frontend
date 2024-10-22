import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const columns = [
  { field: "sectionID", headerName: "ID", flex: 0.2 },
  { field: "sectionName", headerName: "Section Name", flex: 0.7 },
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

const rows = [{ id: 1, sectionName: "Diamond" }];

const paginationModel = { page: 0, pageSize: 2 };

const handleEdit = (id) => {
  console.log(`Edit row with id: ${id}`);
};

const handleDelete = (id) => {
  console.log(`Delete row with id: ${id}`);
};

export default function SectionTable() {
  return (
    <div className="w-full p-4">
      <Typography
        variant="h4"
        component="div"
        sx={{ p: 2, textAlign: "center" }}
      >
        Sections
      </Typography>
      <Paper sx={{ height: "auto", width: "100%" }}>
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
