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
} from "@mui/material";
import Breadcrumbs from "common/Breadcrumbs";
import Footer from "common/Footer";
import DashboardNavbar from "common/Navbars/DashboardNavbar";
import DashboardLayout from "layoutContainers/DashboardLayout";
import DataTable from "components/Tables/DataTable";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  Close,
  CurrencyRupee,
  HelpOutline,
  HighlightOff,
  Info,
  OpenInNew,
  Weekend,
} from "@mui/icons-material";
import Toast from "components/Toast";
import Url from "Api";
import TriangleLoader from "components/Loading/loading";
import { List_settelement } from "./components/list_settlement";
import Add_settelement from "./components/add_settelment";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import CountUp from "react-countup";
import ComplexStatisticsCard from "components/Cards/StatisticsCards/ComplexStatisticsCard";

export default function Settelement_entry() {
  const navigate = useNavigate();
  const route = useLocation().pathname.split("/").slice(1);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [list, setList] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openExpenseDialogBox, setOpenExpenseDialogBox] = useState(false);
  const [openReturnDialogBox, setOpenReturnDialogBox] = useState(false);
  const [openCreditDialogBox, setOpenCreditDialogBox] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElC, setAnchorElC] = useState(null);
  const [anchorElR, setAnchorElR] = useState(null);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [errorHandling, setErrorHandling] = useState("");
  const [fetchError, setFetchError] = useState(false);
  const [settlement_getBy_ids, setSettlement_getBy_ids] = useState({});
  // Toast state
  const [openToast, setOpenToast] = useState(false);
  const [severityToast, setSeverityToast] = useState("success"); // error, warning, info
  const [messageToast, setMessageToast] = useState("");

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // data list
  const settlement_Data_List = async () => {
    setLoading(true); // Start loading
    await delay(2500);

    let token = localStorage.getItem("token");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 seconds timeout

      const response = await fetch(Url.api + Url.settlementList, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          pageIndex: 0,
          dataLength: 10,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const responseData = await response.json();
      console.log(responseData);
      if (responseData.apiStatus.code == "200") {
        const settlements = responseData.result.settlement_details;
        setList(Array.isArray(settlements) ? settlements : []);
        console.log("settlement Api data -------", settlements);
      } else {
        console.log(
          "___API Error settlement: " + responseData.apiStatus.message
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

  useEffect(() => {
    settlement_Data_List();
    console.log("list ---- pass in api call fun", list);
  }, []);

  useEffect(() => {
    const { columns: newColumns, rows: newRows } = List_settelement(
      list,
      openEdit,
      openDel
    );
    setColumns(newColumns);
    setRows(newRows);
    console.log("settlement List ---in pass to list table ---------", list);
  }, [list]);

  // get by id
  const settlement_getBy_id = async () => {
    let token = localStorage.getItem("token");
    try {
      const response = await fetch(Url.api + Url.settlementView + 1, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const responseData = await response.json();
      console.log(responseData);
      if (responseData.apiStatus.code == "200") {
        setSettlement_getBy_ids(responseData.result);
        console.log("-------", responseData.result);
      } else {
        console.log("Request timed out. Please try again.");
      }
    } catch (error) {
      console.log("Service not found");
    }
  };
  useEffect(() => {
    settlement_getBy_id();
  }, []);

  // create
  const openAdd = () => {
    setOpenAddDialog(true);
  };

  // edit
  const openEdit = (id) => {
    setOpenEditDialog(true);
    setSelectedValue(id);
  };

  // delete
  const openDel = (id) => {
    setOpenDeleteDialog(true);
    setSelectedValue(id);
  };

  //Expense Dialog
  const openExpenseDialog = (e) => {
    setAnchorEl(e.currentTarget);
    setOpenExpenseDialogBox(true);
  };

  // Return dialog
  const openReturnDialog = (e) => {
    setAnchorElR(e.currentTarget);
    setOpenReturnDialogBox(true);
  };

  // credit Dialog
  const openCreditDialog = (e) => {
    setAnchorElC(e.currentTarget);
    setOpenCreditDialogBox(true);
  };

  const refreshList = () => {
    settlement_Data_List();
    closeDialog();
  };

  const showToast = (msg, severity) => {
    setMessageToast(msg);
    setSeverityToast(severity);
    setOpenToast(true);
  };
  const credit_amount = settlement_getBy_ids.total_credit_amount;
  // date
  let curDate = new Date().toDateString();

  // close DialogBox
  const closeDialog = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setSelectedValue(null);
    setOpenExpenseDialogBox(false);
    setOpenReturnDialogBox(false);
    setOpenCreditDialogBox(false);
    setAnchorEl(null);
    setAnchorElR(null);
    setAnchorElC(null);
    setOpenToast(false);
    setFetchError(false);
  };

  // openSales
  const openSales = () => {
    navigate("/sales_entry");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} />
      <Box sx={{ marginTop: "30px" }}>
        <Grid container spacing={4} sx={{ marginBottom: "10px" }}>
          <Grid item xs={3} sm={3}>
            <MDBox mb={1.5} sx={{ height: 125, width: "100%" }}>
              <ComplexStatisticsCard
                color="success"
                icon="point_of_sale"
                title="Total Sales"
                count={
                  <>
                    <CurrencyRupee sx={{ pt: 0.5, fontWeight: 600 }} />
                    <CountUp
                      start={0}
                      end={settlement_getBy_ids.total_sales_entry || 0}
                      duration={2.5}
                      separator=","
                    />
                  </>
                }
                percentage={{
                  color: "success",
                  amount: (
                    <CountUp start={0} end={100} duration={2.5} suffix="%" />
                  ),
                  label: "this is Total Sales",
                }}
                footer={
                  <IconButton onClick={openSales}>
                    <OpenInNew sx={{ fontSize: "sm" }} />{" "}
                  </IconButton>
                }
              />
            </MDBox>
          </Grid>
          <Grid item xs={3} sm={3}>
            <MDBox mb={1.5} sx={{ height: 125, width: "100%" }}>
              <ComplexStatisticsCard
                color="secondary"
                icon="add_shopping_cart"
                title="Total Expense"
                count={
                  <>
                    <CurrencyRupee sx={{ pt: 0.5, fontWeight: 600 }} />
                    <CountUp
                      start={0}
                      end={settlement_getBy_ids.total_expense || 0}
                      duration={2.5}
                      separator=","
                    />
                  </>
                }
                percentage={{
                  color: "success",
                  amount: (
                    <CountUp start={0} end={55} duration={2.5} suffix="%" />
                  ),
                  label: "this is Total Expense",
                }}
                footer={
                  <IconButton onClick={openExpenseDialog}>
                    <Info sx={{ fontSize: "sm" }} />{" "}
                  </IconButton>
                }
              />
            </MDBox>
          </Grid>
          <Grid item xs={3} sm={3}>
            <MDBox mb={1.5} sx={{ height: 125, width: "100%" }}>
              <ComplexStatisticsCard
                color="info"
                icon="assignment_returned"
                title="Total Return"
                count={
                  <>
                    <CurrencyRupee sx={{ pt: 0.5, fontWeight: 600 }} />
                    <CountUp
                      start={0}
                      end={settlement_getBy_ids.total_return || 0}
                      duration={2.5}
                      separator=","
                    />
                  </>
                }
                percentage={{
                  color: "success",
                  amount: (
                    <CountUp
                      start={0}
                      end={45} // Assuming 45% for the example
                      duration={2.5}
                      suffix="%"
                    />
                  ),
                  label: "this is Total Return",
                }}
                footer={
                  <IconButton onClick={openReturnDialog}>
                    <Info sx={{ fontSize: "sm" }} />{" "}
                  </IconButton>
                }
              />
            </MDBox>
          </Grid>
          <Grid item xs={3} sm={3}>
            <MDBox mb={1.5} sx={{ height: 125, width: "100%" }}>
              <ComplexStatisticsCard
                color="warning"
                icon="account_balance_wallet"
                title="Total Credit"
                count={
                  <>
                    <CurrencyRupee sx={{ pt: 0.5, fontWeight: 600 }} />
                    <CountUp
                      start={0}
                      end={credit_amount || 0}
                      duration={2.5}
                      separator=","
                    />
                  </>
                }
                percentage={{
                  color: "success",
                  amount: (
                    <CountUp start={0} end={5} duration={2.5} suffix="%" />
                  ),
                  label: "this is Total Credit",
                }}
                footer={
                  <IconButton onClick={openCreditDialog}>
                    <Info sx={{ fontSize: "sm" }} />{" "}
                    {/* Replace with your icon */}
                  </IconButton>
                }
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} sm={12} mt={5}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Add Settlement -{curDate}
                </MDTypography>
              </MDBox>

              <MDBox pt={3} pb={5}>
                <Add_settelement
                  closeDialog={closeDialog}
                  refreshList={refreshList}
                  showToast={showToast}
                  creditAmount={credit_amount}
                />
              </MDBox>
            </Card>
          </Grid>
          {/* <Grid item xs={12} sm={12} mt={3}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Settlement Details
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={true}
                  showTotalEntries={true}
                  noEndBorder
                  showMessage={errorHandling}
                />
              </MDBox>
            </Card>
          </Grid> */}
        </Grid>
        <Footer />
        <TriangleLoader open={loading} />
        <Toast
          open={openToast}
          severity={severityToast}
          message={messageToast}
          handleClose={closeDialog}
        />
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
        <Menu
          anchorEl={anchorEl}
          open={openExpenseDialogBox}
          onClose={closeDialog}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          sx={{
            width: 1500, // Set a fixed width
            maxWidth: 1500,
            minWidth: 1500,

            height: 500,
            // overflowY: "auto", // Add scroll if necessary
          }}
        >
          <Box sx={{ p: 1 }}>
            {settlement_getBy_ids?.totalexpenseDetails &&
            settlement_getBy_ids.totalexpenseDetails.length > 0 ? (
              settlement_getBy_ids.totalexpenseDetails.map((val, ind) => (
                <React.Fragment key={ind}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          {val.expensefor}- {val.Amount}{" "}
                        </Typography>
                      }
                      secondary={
                        <>
                          {/* <Typography
                            variant="body2"
                            sx={{ color: "text.secondary", display: "inline" }}
                          ></Typography> */}
                          {val.description}{" "}
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))
            ) : (
              <Typography variant="body2" sx={{ p: 2 }}>
                No expense details available.
              </Typography>
            )}
          </Box>
        </Menu>
        <Menu
          anchorEl={anchorElR}
          open={openReturnDialogBox}
          onClose={closeDialog}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          sx={{
            width: 1500, // Set a fixed width
            maxWidth: 1500,
            minWidth: 1500,
            height: 500,
            // overflowY: "auto", // Add scroll if necessary
          }}
        >
          <Box sx={{ p: 0 }}>
            {settlement_getBy_ids?.totalReturnDetails &&
            settlement_getBy_ids.totalReturnDetails.length > 0 ? (
              settlement_getBy_ids.totalReturnDetails.map((val, ind) => (
                <React.Fragment key={ind}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                    // primary={
                    //   <>
                    //     <Typography
                    //       variant="body2"
                    //       sx={{ color: "text.secondary", display: "inline" }}
                    //     >
                    //       {"BillNo :"} {val.BillNo}
                    //     </Typography>
                    //   </>
                    // }
                    // secondary={
                    //   <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    //     {"Amount :"} {val.ReturnAmount}{" "}
                    //   </Typography>
                    // }
                    />
                  </ListItem>
                  {"BillNo :"} {val.BillNo} ,
                  <CurrencyRupee sx={{ mt: 1 }} />
                  {val.ReturnAmount}
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))
            ) : (
              <Typography variant="body2" sx={{ p: 1 }}>
                No Return details available.
              </Typography>
            )}
          </Box>
        </Menu>
        <Menu
          anchorEl={anchorElC}
          open={openCreditDialogBox}
          onClose={closeDialog}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          sx={{
            width: 1500, // Set a fixed width
            maxWidth: 1500,
            minWidth: 1500,
            height: 500,
            // overflowY: "auto", // Add scroll if necessary
          }}
        >
          <Box sx={{ p: 1 }}>
            {settlement_getBy_ids?.totalCreditDetails &&
            settlement_getBy_ids.totalCreditDetails.length > 0 ? (
              settlement_getBy_ids.totalCreditDetails.map((val, ind) => (
                <React.Fragment key={ind}>
                  <ListItem alignItems="flex-start">
                    <ListItemText

                    // primary={
                    //   <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    //     {val.CustomerName}- {val.CreditAmount}{" "}
                    //   </Typography>
                    // }
                    // secondary={
                    //   <>
                    //     {/* <Typography
                    //       variant="body2"
                    //       sx={{ color: "text.secondary", display: "inline" }}
                    //     ></Typography> */}
                    //     {val.Description}{" "}
                    //   </>
                    // }
                    />
                    {val.CustomerName}- <CurrencyRupee sx={{ mt: 0.5 }} />
                    {val.Balance}{" "}
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))
            ) : (
              <Typography variant="body2" sx={{ p: 1 }}>
                No Credit details available.
              </Typography>
            )}
          </Box>
        </Menu>
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
