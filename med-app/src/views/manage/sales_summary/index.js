import {
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  styled,
  Divider,
  Grid,
  Card,
  Menu,
  MenuItem,
  ListItemText,
  ListItem,
  TextField,
} from "@mui/material";
import Breadcrumbs from "common/Breadcrumbs";
import Footer from "common/Footer";
import DashboardNavbar from "common/Navbars/DashboardNavbar";
import DashboardLayout from "layoutContainers/DashboardLayout";
import DataTable from "components/Tables/DataTable";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Close, CurrencyRupee, HighlightOff } from "@mui/icons-material";
import Toast from "components/Toast";
import Url from "Api";
import TriangleLoader from "components/Loading/loading";
import { Sales_summary_list } from "./components/sales_summary_list";
import Sales_summary_view from "./components/sales_summary_view";

export default function Sales_summary() {
  const route = useLocation().pathname.split("/").slice(1);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [list, setList] = useState([]);
  const [summaryList, setSummaryList] = useState({});

  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [fetchError, setFetchError] = useState(false);
  const [errorHandling, setErrorHandling] = useState("");
  // Toast state
  const [openToast, setOpenToast] = useState(false);
  const [severityToast, setSeverityToast] = useState("success"); // error, warning, info
  const [messageToast, setMessageToast] = useState("");

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // data list
  const fetchList = async (fromDate, toDate) => {
    setLoading(true); // Start loading
    await delay(2500);

    let token = localStorage.getItem("token");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 seconds timeout

      const response = await fetch(Url.api + Url.salesSummary, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          pageIndex: 0,
          dataLength: 10,
          fromDate: fromDate || "0", // Default to "0" if no date selected
          toDate: toDate || "0",
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const responseData = await response.json();
      console.log(responseData);
      if (responseData.apiStatus.code == "200") {
        const salesSummary = responseData.result.salesData;
        setList(Array.isArray(salesSummary) ? salesSummary : []);
        setSummaryList({
          totalSalesAmount: responseData.result.totalSalesAmount,
          totalExpenseAmount: responseData.result.totalExpenseAmount,
          totalReturnAmount: responseData.result.totalReturnAmount,
          totalCreditAmount: responseData.result.totalCreditAmount,
        });
        console.log("salesSummary Api data -------", salesSummary);
      } else {
        console.log(
          "___API Error salesSummary: " + responseData.apiStatus.message
        );
        setList([]);
      }
    } catch (error) {
      setErrorHandling("Service not found");
      setFetchError(true);
      console.log("-----fetch error------");
      setList([]);
    } finally {
      setLoading(false); // End loading
    }
  };

  // date filter
  const handleDateFilter = () => {
    const fromDate = startDate ? startDate.format("YYYY-MM-DD") : null;
    const toDate = endDate ? endDate.format("YYYY-MM-DD") : null;
    fetchList(fromDate, toDate);
  };

  useEffect(() => {
    fetchList();
    console.log("list ---- pass in api call fun", list);
  }, []);

  useEffect(() => {
    const { columns: newColumns, rows: newRows } = Sales_summary_list(
      list,
      openView
    );
    setColumns(newColumns);
    setRows(newRows);
    console.log("Sales Summary List ---in pass to list table ---------", list);
  }, [list]);

  const showToast = (msg, severity) => {
    setMessageToast(msg);
    setSeverityToast(severity);
    setOpenToast(true);
  };

  const openView = (date) => {
    setOpenViewDialog(true);
    setSelectedValue(date);
    console.log("selected value pass from saleSummary date----->", date.date);
  };

  // close Dialog
  const closeDialog = () => {
    setSelectedValue(null);
    setOpenViewDialog(false);
    setOpenToast(false);
    setFetchError(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Breadcrumbs
        icon="home"
        title={route[route.length - 1]}
        route={route}
        date={true}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        handleDateFilter={handleDateFilter}
      />
      <Box sx={{ marginTop: "30px" }}>
        <Grid container spacing={1} sx={{ padding: "10px" }}>
          <Grid item xs={3} sm={3} mt={1} p={1}>
            <Card sx={{ height: 100, width: "100%" }}>
              <Typography
                variant="button"
                gutterBottom
                sx={{ display: "block", textAlign: "center", mt: 1 }}
              >
                Total Sales{" "}
              </Typography>
              <Divider />
              <Typography
                variant="h6"
                sx={{
                  display: "block",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                <CurrencyRupee sx={{ fontSize: 20, fontWeight: 800 }} />
                {summaryList.totalSalesAmount || "0.00"}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={3} sm={3} mt={1} p={1}>
            <Card sx={{ height: 100, width: "100%" }}>
              <Typography
                variant="button"
                gutterBottom
                sx={{ display: "block", textAlign: "center", mt: 1 }}
              >
                Total Expense{" "}
              </Typography>
              <Divider />
              <Typography
                variant="h6"
                sx={{
                  display: "block",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                <CurrencyRupee sx={{ fontSize: 2, fontWeight: 800 }} />
                {summaryList.totalExpenseAmount || "0.00"}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={3} sm={3} mt={1} p={1}>
            <Card sx={{ height: 100, width: "100%" }}>
              <Typography
                variant="button"
                gutterBottom
                sx={{ display: "block", textAlign: "center", mt: 1 }}
              >
                Total Return
              </Typography>
              <Divider />
              <Typography
                variant="h6"
                sx={{
                  display: "block",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                <CurrencyRupee sx={{ fontSize: 2, fontWeight: 800 }} />
                {summaryList.totalReturnAmount || "0.00"}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={3} sm={3} mt={1} p={1}>
            <Card sx={{ height: 100, width: "100%" }}>
              <Typography
                variant="button"
                gutterBottom
                sx={{ display: "block", textAlign: "center", mt: 1 }}
              >
                Total Credit Amount
              </Typography>
              <Divider />
              <Typography
                variant="h6"
                sx={{
                  display: "block",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                <CurrencyRupee sx={{ fontSize: 2, fontWeight: 800 }} />
                {summaryList.totalCreditAmount || "0.00"}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12}>
            <DataTable
              table={{ columns, rows }}
              isSorted={false}
              entriesPerPage={true}
              showTotalEntries={true}
              noEndBorder
              showMessage={errorHandling}
              canSearch={false}
            />
          </Grid>
        </Grid>
        <Footer />
        <TriangleLoader open={loading} />
        <Toast
          open={openToast}
          severity={severityToast}
          message={messageToast}
          handleClose={closeDialog}
        />
        {selectedValue && (
          <Sales_summary_view
            openViewDialog={openViewDialog}
            closeDialog={closeDialog}
            selectedValue={selectedValue}
          />
        )}
        <CustomDialog open={fetchError} onClose={closeDialog}>
          <DialogTitle sx={{ textAlign: "center", fontSize: 80, color: "red" }}>
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
      </Box>
    </DashboardLayout>
  );
}

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: 300,
    height: 250,
  },
}));
