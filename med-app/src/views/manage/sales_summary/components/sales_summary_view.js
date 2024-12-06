import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Card,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  Avatar,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DataTable from "components/Tables/DataTable";
import Url from "Api";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { OverAll_List } from "views/manage/sales/components/overall_sales_list";
import { Clear, Close, CurrencyRupee, DragHandle } from "@mui/icons-material";

export default function Sales_summary_view({
  openViewDialog,
  closeDialog,
  selectedValue,
}) {
  const [digitalList, setDigitalList] = useState([]);
  const [denominationList, setDenominationList] = useState([]);
  const [count, setCount] = useState([]);
  const [totalDigital, setTotalDigital] = useState("0.00");
  const [totalCash, setTotalCash] = useState("0.00");

  // sales list const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [viewData, setViewData] = useState({});
  const [overAllData, setOverAllData] = useState([]); // this one is sales list
  const [errorHandling, setErrorHandling] = useState("");
  const [fetchError, setFetchError] = useState(false);

  const dateValue = selectedValue.date;
  console.log("Date from viewPage---->", dateValue);

  // api call
  // list denomination
  const denomination_Data_List = async () => {
    let token = localStorage.getItem("token");
    try {
      const response = await fetch(Url.api + Url.denominationList, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          pageIndex: 0,
          dataLength: 10,
        }),
      });

      const responseData = await response.json();
      console.log(responseData);
      if (responseData.apiStatus.code === "200") {
        setDenominationList(responseData.result.CurrencyData);
        setCount(new Array(responseData.result.CurrencyData.length).fill("")); // Initialize count array
        console.log("-------", responseData.result.CurrencyData);
      } else {
        console.log("Request timed out. Please try again.");
      }
    } catch (error) {
      console.log("Service not found");
    }
  };

  // list digital
  const digital_Data_List = async () => {
    let token = localStorage.getItem("token");
    try {
      const response = await fetch(Url.api + Url.digitalList, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          pageIndex: 0,
          dataLength: 10,
        }),
      });
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.apiStatus.code === "200") {
        setDigitalList(responseData.result.DigitalPaymentDetails);
        // setDigitalMoney(new Array(responseData.result.DigitalPaymentDetails.length).fill("")); // Initialize digitalMoney array

        console.log(
          "-------",
          responseData.result.DigitalPaymentDetails.digital_payment_icon
        );
      } else {
        console.log("some error");
      }
    } catch (error) {
      console.log("fetch error");
    }
  };

  // view summary
  const viewCall = async () => {
    let token = localStorage.getItem("token");
    try {
      const response = await fetch(Url.api + Url.salesSummaryView, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          pageIndex: 0,
          dataLength: 10,
          date: dateValue,
        }),
      });
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.apiStatus.code === "200") {
        const financials = responseData.result.Financials;
        setDenominationList(financials.cash_payment.denominations);
        setDigitalList(financials.cash_payment.digital_payments);
        // setTotalCash(financials.totalDenominationAmount); // Total denomination amount
        // setTotalDigital(financials.totalDigitalAmount);
        setViewData({
          totalSalesEntry: financials.totalSalesEntry,
          totalExpense: financials.totalExpense,
          totalReturn: financials.totalReturn,
          totalCreditAmount: financials.totalCreditAmount,
          totalDenominationAmount: financials.totalDenominationAmount,
          totalDigitalAmount: financials.totalDigitalAmount,
          totalAmount: financials.totalAmount,
        });
        console.log(
          "selected value from the sales summary---->",
          responseData.result.Financials
        );
      } else {
        console.error("API Error:", responseData.apiStatus);
      }
    } catch (error) {
      setErrorHandling("Service not found");
      setFetchError(true);
    }
  };

  // list sales
  const sales_list = async () => {
    // setLoading(true); // Start loading
    // await delay(2500);
    let token = localStorage.getItem("token");

    try {
      //   const controller = new AbortController();
      //   const timeoutId = setTimeout(() => controller.abort(), 6000);
      const response = await fetch(Url.api + Url.salesSummarySalesList, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          pageIndex: 0,
          dataLength: 10,
          date: dateValue,
        }),
        // signal: controller.signal,
      });
      //   clearTimeout(timeoutId);

      const responseData = await response.json();
      console.log(responseData);
      if (responseData.apiStatus.code === "200") {
        setOverAllData(responseData.result.SalesData);
        console.log(
          "salesList from the sales summary---->",
          responseData.result.SalesData
        );
      } else {
        console.error("API Error:", responseData.apiStatus);
      }
    } catch (error) {
      setErrorHandling("Service not found");
      // showToast("Request timed out. Please try again.", "error");
      setFetchError(true);
    }
    // finally {
    //   setLoading(false); // End loading
    // }
  };

  useEffect(() => {
    const { columns: newColumns, rows: newRows } = OverAll_List(overAllData);
    setColumns(newColumns);
    setRows(newRows);
  }, [overAllData]);

  useEffect(() => {
    denomination_Data_List();
    digital_Data_List();
    sales_list();
    viewCall();
  }, [selectedValue]);

  return (
    <Dialog open={openViewDialog} onClose={closeDialog} maxWidth="lg" fullWidth>
      <DialogTitle>
        <MDBox>
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
        </MDBox>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={1} sx={{ padding: "10px" }}>
          {/* summary */}
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
                {viewData.totalSalesEntry || "0.00"}
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
                {viewData.totalExpense || "0.00"}
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
                {viewData.totalReturn || "0.00"}
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
                Total Credit
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
                {viewData.totalCreditAmount || "0.00"}
              </Typography>
            </Card>
          </Grid>
          {/* denomination and digital */}
          <Grid item xs={12} sm={12}>
            <Grid container spacing={2} sx={{ padding: "10px" }}>
              <Grid item xs={12} sm={12}>
                <Stack sx={{ display: "flex", flexDirection: "row", gap: 2.5 }}>
                  <Card
                    sx={{
                      height: 350,
                      width: "67%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Grid container spacing={2} sx={{ flexShrink: 0 }}>
                      <Grid item xs={12}>
                        <Typography
                          variant="button"
                          gutterBottom
                          sx={{ display: "block", textAlign: "center", pt: 1 }}
                        >
                          Denomination
                        </Typography>
                        <Divider />
                      </Grid>

                      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                        {/* First column */}
                        <Grid item xs={5} sm={5} sx={{ flexGrow: 1 }}>
                          {denominationList.map((val, ind) => {
                            if (ind % 2 === 0) {
                              const denom_amount =
                                val.denomination_value * val.count;
                              return (
                                <Grid
                                  container
                                  spacing={1}
                                  key={ind}
                                  p={1}
                                  ml={2}
                                >
                                  <Grid item xs={2} sm={2} textAlign={"right"}>
                                    {val.denomination_value}
                                  </Grid>
                                  <Grid item xs={2} sm={2}>
                                    <Clear
                                      fontSize="sm"
                                      sx={{ ml: 2, mt: 0.5 }}
                                    />
                                  </Grid>
                                  <Grid item xs={3} sm={3}>
                                    <TextField
                                      variant="outlined"
                                      gutterBottom
                                      fullWidth
                                      inputProps={{ readOnly: true }}
                                      sx={{
                                        display: "block",
                                        "& .MuiOutlinedInput-root": {
                                          height: "35px",
                                          textAlign: "center",
                                          "& input": {
                                            textAlign: "center",
                                          },
                                        },
                                      }}
                                      value={val.count}
                                      //   onChange={(e) => changeCount(e, ind)}
                                    />
                                  </Grid>
                                  <Grid item xs={2} sm={2}>
                                    <DragHandle
                                      sx={{ mt: 1, textAlign: "end", ml: 2 }}
                                      fontSize="sm"
                                    />
                                  </Grid>
                                  <Grid item xs={2} sm={3}>
                                    <TextField
                                      variant="outlined"
                                      gutterBottom
                                      inputProps={{ readOnly: true }}
                                      fullWidth
                                      sx={{
                                        display: "block",
                                        "& .MuiOutlinedInput-root": {
                                          height: "35px",
                                          width: "80px",
                                          "& input": {
                                            textAlign: "center",
                                          },
                                        },
                                      }}
                                      value={denom_amount || ""}
                                    />
                                  </Grid>
                                </Grid>
                              );
                            }
                            return null;
                          })}
                        </Grid>

                        {/* Vertical Divider */}
                        <Grid item xs={2} sm={2}>
                          <Divider
                            orientation="vertical"
                            sx={{ textAlign: "start", mr: 5 }}
                          />
                        </Grid>

                        {/* Second column */}
                        <Grid item xs={5} sm={5}>
                          {denominationList.map((val, ind) => {
                            if (ind % 2 === 1) {
                              const denom_amount =
                                val.denomination_value * val.count;
                              return (
                                <Grid
                                  container
                                  spacing={1}
                                  key={ind}
                                  p={1}
                                  ml={-5}
                                >
                                  <Grid item xs={2} sm={2} textAlign={"right"}>
                                    {val.denomination_value}
                                  </Grid>
                                  <Grid item xs={2} sm={2}>
                                    <Clear
                                      fontSize="sm"
                                      sx={{ ml: 2, mt: 0.5 }}
                                    />
                                  </Grid>
                                  <Grid item xs={3} sm={3}>
                                    <TextField
                                      variant="outlined"
                                      gutterBottom
                                      inputProps={{ readOnly: true }}
                                      sx={{
                                        display: "block",
                                        "& .MuiOutlinedInput-root": {
                                          height: "35px",
                                          textAlign: "center",
                                          "& input": {
                                            textAlign: "center",
                                          },
                                        },
                                      }}
                                      value={val.count}
                                      //   onChange={(e) => changeCount(e, ind)}
                                    />
                                  </Grid>
                                  <Grid item xs={2} sm={2}>
                                    <DragHandle
                                      sx={{ mt: 1, textAlign: "center", ml: 2 }}
                                      fontSize="sm"
                                    />
                                  </Grid>
                                  <Grid item xs={3} sm={3}>
                                    <TextField
                                      variant="outlined"
                                      gutterBottom
                                      inputProps={{ readOnly: true }}
                                      sx={{
                                        display: "block",
                                        "& .MuiOutlinedInput-root": {
                                          height: "35px",
                                          width: "80px",
                                          "& input": {
                                            textAlign: "center",
                                          },
                                        },
                                      }}
                                      value={denom_amount || ""}
                                    />
                                  </Grid>
                                </Grid>
                              );
                            }
                            return null;
                          })}
                        </Grid>
                        <Grid item xs={6}></Grid>
                        {/* Total Denomination */}
                        <Grid item xs={6} sm={6}>
                          <Paper
                            sx={{
                              width: "100%",
                              height: 50,
                              display: "flex",
                              justifyContent: "space-around",
                            }}
                            elevation={6}
                            // p={10}
                          >
                            <Typography
                              variant="button"
                              gutterBottom
                              sx={{
                                display: "block",
                                textAlign: "center",
                                mt: 1,
                              }}
                            >
                              Total Denomination{" "}
                            </Typography>
                            <Typography
                              variant="button"
                              gutterBottom
                              sx={{
                                display: "block",
                                textAlign: "center",
                                mt: 1,
                              }}
                            >
                              :
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{
                                display: "block",
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              {totalCash}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Card>

                  <Card
                    sx={{
                      height: 350,
                      width: "33%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box sx={{ flexShrink: 0 }}>
                      <Typography
                        variant="button"
                        gutterBottom
                        sx={{ display: "block", textAlign: "center", pt: 1 }}
                      >
                        Digital Money
                      </Typography>
                      <Divider />
                    </Box>
                    <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                      {digitalList.map((val, ind) => (
                        <Grid container spacing={2} key={ind} p={1}>
                          <Grid
                            item
                            xs={3}
                            sm={3}
                            // sx={{
                            //   display: "flex",
                            //   justifyContent: "space-evenly",
                            // }}
                          >
                            <Avatar
                              src={Url.api + val.digital_payment_icon}
                              sx={{ width: 30, height: 30, ml: 2 }}
                            />
                          </Grid>
                          <Grid item xs={4} sm={4}>
                            <Typography
                              variant="overline"
                              gutterBottom
                              sx={{ display: "block", textAlign: "left" }}
                            >
                              {val.digital_payment_name}
                            </Typography>
                          </Grid>

                          <Grid item xs={5} sm={5}>
                            <TextField
                              variant="outlined"
                              gutterBottom
                              inputProps={{ readOnly: true }}
                              sx={{
                                display: "block",
                                textAlign: "left",
                                mr: 2,
                                "& .MuiOutlinedInput-root": {
                                  height: "35px",
                                  "& input": {
                                    textAlign: "center",
                                  },
                                },
                              }}
                              value={val.amount}
                              //   onChange={(e) => changeDigitalMoney(e, ind)}
                            />
                          </Grid>
                        </Grid>
                      ))}
                    </Box>
                    <Paper
                      elevation={6}
                      sx={{
                        width: "100%",
                        height: 40,
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <Typography
                        variant="button"
                        gutterBottom
                        sx={{ display: "block", textAlign: "center", mt: 1 }}
                      >
                        Total Digital{" "}
                      </Typography>
                      <Typography
                        variant="button"
                        gutterBottom
                        sx={{ display: "block", textAlign: "center", mt: 1 }}
                      >
                        :{" "}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          display: "block",
                          textAlign: "center",
                          // mt: 2,
                          fontWeight: "bold",
                        }}
                      >
                        {totalDigital}
                      </Typography>
                    </Paper>
                  </Card>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
          {/* sales table */}
          <Grid item xs={12} sm={12}>
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
                  Sales Details
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={true}
                  showTotalEntries={true}
                  showMessage={errorHandling}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
