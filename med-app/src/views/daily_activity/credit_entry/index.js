import Footer from "common/Footer";
import DashboardNavbar from "common/Navbars/DashboardNavbar";
import DashboardLayout from "layoutContainers/DashboardLayout";
import Url from "Api";
import Toast from "components/Toast";
import TriangleLoader from "components/Loading/loading";

import { useLocation } from "react-router-dom";
import Breadcrumbs from "common/Breadcrumbs";
import {
  Box,
  Button,
  Dialog,
  Paper,
  Typography,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import DataTable from "components/Tables/DataTable";
import styled from "@emotion/styled";
import { Close, HighlightOff } from "@mui/icons-material";
import { List_credit_entry } from "./components/credit_entry_list";
import Add_New_Credit from "views/credit_customer/components/add_new_credit";
import Add_Credit from "views/credit_customer/components/add_credit";
import View_cus_credits from "views/credit_customer/components/view_customer_credit";

export default function Credit_entry() {
  const route = useLocation().pathname.split("/").slice(1);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [list, setList] = useState([]);
  const [openDialogAddNewCredit, setOpenDialogAddNewCredit] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  const [errorHandling, setErrorHandling] = useState("");
  const [fetchError, setFetchError] = useState(false);
  // Toast state
  const [openToast, setOpenToast] = useState(false);
  const [severityToast, setSeverityToast] = useState("success"); // error, warning, info
  const [messageToast, setMessageToast] = useState("");

  const showToast = (msg, severity) => {
    setMessageToast(msg);
    setSeverityToast(severity);
    setOpenToast(true);
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const creditList = async (e) => {
    // e.preventDefault();
    setLoading(true); // Start loading
    await delay(2500);

    let token = localStorage.getItem("token");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 10 seconds timeout

      const response = await fetch(Url.api + Url.currentCreditList, {
        method: "POST",
        headers: {
          "content-type": "appilication/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          pageIndex: 0,
          dataLength: 10,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responceData = await response.json();
      console.log(responceData);
      if (responceData.apiStatus.code == "200") {
        setList(responceData.result.CreditDetails);
        // setErrorHandling("no data found");
      } else {
        console.log("error");
        // showToast(responceData.apiStatus.message, "error");
      }
    } catch (error) {
      setErrorHandling("Service not found");
      // showToast("Request timed out. Please try again.", "error");
      setFetchError(true);
      console.log("Error handled =" + error);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    creditList();
  }, []);

  useEffect(() => {
    const { columns: newColumns, rows: newRows } = List_credit_entry(
      list,
      openView,
      openAdd
    );
    setColumns(newColumns);
    setRows(newRows);
  }, [list]);

  // call refresh
  const refreshList = () => {
    creditList();
    closeDialog();
  };

  // add new credit customer
  const addCreditCustomer = () => {
    setOpenDialogAddNewCredit(true);
  };

  // add credit
  const openAdd = (id) => {
    setSelectedValue(id);
    setOpenAddDialog(true);
    console.log("selected id from creadit openAdd ----", selectedValue);
  };

  // view credit
  const openView = (id) => {
    setSelectedValue(id);
    setOpenViewDialog(true);
    console.log("selected id from creadit openCredit ----", selectedValue);
  };

  // close Dialog
  const closeDialog = () => {
    setOpenDialogAddNewCredit(false);
    setOpenAddDialog(false);
    setSelectedValue(null);
    setOpenViewDialog(null);
    setFetchError(false);
    setOpenToast(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} />

      <Box sx={{ marginTop: "30px", marginBottom: "400px" }}>
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
              Credit_entry List
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={addCreditCustomer}
              sx={{
                color: "whitesmoke",
                float: "right",
              }}
            >
              Add New Credit Customer
            </Button>
          </div>
          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            entriesPerPage={true}
            showTotalEntries={true}
            showMessage={errorHandling}
            noEndBorder
          />
          <Add_New_Credit
            openDialogAddNewCredit={openDialogAddNewCredit}
            closeDialogbox={closeDialog}
            refreshList={refreshList}
            showToast={showToast}
          />
          <Add_Credit
            addDialog={openAddDialog}
            selectedValue={selectedValue}
            closeDialogbox={closeDialog}
            refreshList={refreshList}
            showToast={showToast}
          />
          <View_cus_credits
            openViewDialog={openViewDialog}
            closeDialog={closeDialog}
            selectedValue={selectedValue}
          />
          <Toast
            open={openToast}
            severity={severityToast}
            message={messageToast}
            handleClose={closeDialog}
          />
          <CustomDialog open={fetchError} onClose={closeDialog}>
            <DialogTitle
              sx={{ textAlign: "center", fontSize: 80, color: "red" }}
            >
              <HighlightOff />

              <IconButton
                aria-label="close"
                onClick={closeDialog}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: "grey",
                  "&:hover": {
                    color: "tomato",
                  },
                }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Typography sx={{ textAlign: "center" }}>
                Unable to fetch data
              </Typography>
            </DialogContent>
            {/* <DialogActions sx={{ textAlign: "center" }}>
                <Button
                  onClick={closeDialog}
                  sx={{
                    backgroundColor: "#f44336",
                    color: "#F5F5F5",
                    "&:hover": {
                      backgroundColor: "#d32f2f",
                      color: "#F5F5F5",
                    },
                  }}
                >
                  Ok
                </Button>
              </DialogActions> */}
          </CustomDialog>
        </Paper>
      </Box>
      <Footer />
      <TriangleLoader open={loading} />
    </DashboardLayout>
  );
}

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: 300, // Set the fixed width (in pixels)
    height: 250, // Set the fixed height (in pixels)
  },
}));
