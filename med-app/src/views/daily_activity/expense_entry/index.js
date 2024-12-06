import { Box, Button, Paper, Typography } from "@mui/material";
import Breadcrumbs from "common/Breadcrumbs";
import Footer from "common/Footer";
import DashboardNavbar from "common/Navbars/DashboardNavbar";
import DashboardLayout from "layoutContainers/DashboardLayout";
import { useLocation } from "react-router-dom";
import List_Data_Expense from "./component/list_data_expense";
import DataTable from "components/Tables/DataTable";
import Add_New_Expense from "./component/add_new_expense";
import { useState } from "react";
import Edit_Expense from "./component/edit_expense";

export default function Expense_entry() {
  const route = useLocation().pathname.split("/").slice(1);

  const { columns, rows } = List_Data_Expense();
  const [openDialogAddNewExpense, setOpenDialogAddNewExpense] = useState(false);

  const addNewExpense = () => {
    setOpenDialogAddNewExpense(true);
  };
  const closeDialog = () => {
    setOpenDialogAddNewExpense(false);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} />

      <Box sx={{ marginTop: "30px", marginBottom: "350px" }}>
        <Paper elevation={4}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <Typography
              component="h6"
              sx={{
                color: "#344767",
                fontWeight: 600,
                lineHeight: 1.625,

                fontSize: "1rem",
              }}
            >
              Expense Entry List
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={addNewExpense}
              sx={{
                color: "whitesmoke",
                float: "right",
              }}
            >
              Add Expense Entry
            </Button>
          </div>
          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            entriesPerPage={false}
            showTotalEntries={false}
            noEndBorder
          />
          <Add_New_Expense
            openDialogAddNewExpense={openDialogAddNewExpense}
            closeDialogBox={closeDialog}
          />
        </Paper>
      </Box>
      <Footer />
    </DashboardLayout>
  );
}
