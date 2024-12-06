import { Clear, DragHandle, OfflinePin, RotateLeft } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";

import Url from "Api";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
export default function Add_settelement({
  refreshList,
  showToast,
  creditAmount,
}) {
  const [digitalList, setDigitalList] = useState([]);
  const [denominationList, setDenominationList] = useState([]);
  const [count, setCount] = useState([]);
  const [digitalMoney, setDigitalMoney] = useState([]);
  const [totalAmount, setTotalAmount] = useState("0.00");
  const [totalDigital, setTotalDigital] = useState("0.00");
  const [totalCash, setTotalCash] = useState("0.00");
  const [openCash, setOpenCash] = useState("0.00");
  const [totalSales, setTotalSales] = useState("0.00");

  const [warningDialog, setWarningDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState(false);

  // date
  const today = dayjs();
  const date = today.format("YYYY-MM-DD");
  console.log("date checking----", date);

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

  useEffect(() => {
    denomination_Data_List();
  }, []);

  useEffect(() => {
    digital_Data_List();
  }, []);

  // denomination count values
  const changeCount = (e, index) => {
    const newValue = e.target.value;
    if (/^\d*\.?\d*$/.test(newValue)) {
      const updatedValues = [...count];
      updatedValues[index] = newValue;
      setCount(updatedValues);
    }
  };

  // digital money
  const changeDigitalMoney = (e, index) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      const updatedValue = [...digitalMoney];
      updatedValue[index] = value;
      setDigitalMoney(updatedValue);
    }
  };

  // calculations
  useEffect(() => {
    // total denomination
    const totalDenomination = denominationList.reduce((total, denom, index) => {
      const denomAmount =
        denom.denomination_value * (parseFloat(count[index]) || 0);
      return total + denomAmount;
    }, 0);

    // total digital money
    const totalDigital = digitalMoney.reduce((total, value) => {
      return total + parseFloat(value || 0);
    }, 0);

    //  total amount
    const totalAmount = totalDenomination + totalDigital;

    // total Sales
    const salesAmount =
      parseFloat(totalAmount) -
      (parseFloat(creditAmount) + parseFloat(openCash));

    // Update state
    setTotalCash(totalDenomination.toFixed(2));
    setTotalDigital(totalDigital.toFixed(2));
    setTotalAmount(totalAmount.toFixed(2));
    setTotalSales(salesAmount.toFixed(2));
  }, [
    count,
    digitalMoney,
    denominationList,
    totalAmount,
    creditAmount,
    openCash,
  ]);

  // openWarning Dialog
  const openDialog = () => {
    setWarningDialog(true);
  };

  // closeDialog
  const closeDialog = () => {
    setWarningDialog(false);
    setErrorDialog(false);
  };

  // reset button
  const resetBtn = () => {
    setCount([]);
    setDigitalMoney([]);
    setTotalAmount("0.00");
    setTotalDigital("0.00");
    setTotalCash("0.00");
    setOpenCash("0.00");
  };

  // save
  const saveSettelment = async () => {
    let token = localStorage.getItem("token");

    // Cash details
    const cashPaymentDetails = denominationList.map((denom, index) => ({
      denomination_value: denom.denomination_value,
      count: parseFloat(count[index]) || 0,
      amount: denom.denomination_value * (parseFloat(count[index]) || 0),
    }));

    // digital details
    const digitalPaymentsDetails = digitalList.map((digital, index) => ({
      digital_payment_name: digital.digital_payment_name,
      amount: parseFloat(digitalMoney[index]) || 0,
    }));

    try {
      const response = await fetch(Url.api + Url.settlementCreate, {
        method: "POST",
        headers: {
          "content-type": "appilication/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          settlementDate: date,
          total_cash_amount: totalCash,
          total_digital_amount: totalDigital,
          total_amount: totalAmount,
          cash_payment: {
            denominations: cashPaymentDetails,
            digital_payments: digitalPaymentsDetails,
          },
        }),
      });
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.apiStatus.code == "200") {
        setWarningDialog(false);
        refreshList();
        resetBtn();
        showToast(responseData.apiStatus.message, "success");
      } else {
        // showToast(responseData.apiStatus.message, "error");
        setErrorDialog(true);
        console.log("error");
      }
    } catch (error) {
      console.log("fetch error" + error);
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container fixed>
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
                              val.denomination_value *
                              (parseFloat(count[ind]) || 0);
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
                                    value={count[ind] || ""}
                                    onChange={(e) => changeCount(e, ind)}
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
                              val.denomination_value *
                              (parseFloat(count[ind]) || 0);
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
                                    value={count[ind] || ""}
                                    onChange={(e) => changeCount(e, ind)}
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
                            value={digitalMoney[ind] || ""}
                            onChange={(e) => changeDigitalMoney(e, ind)}
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

            <Grid item xs={3} sm={3} mt={1}>
              <Card sx={{ height: 100, width: "100%" }}>
                <Typography
                  variant="button"
                  gutterBottom
                  sx={{ display: "block", textAlign: "center", mt: 1 }}
                >
                  Total Amount{" "}
                </Typography>
                <Divider />
                <Typography
                  variant="h6"
                  sx={{
                    display: "block",
                    textAlign: "center",
                    mt: 2,
                    fontWeight: "bold",
                  }}
                >
                  {totalAmount}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={3} sm={3} mt={1}>
              <Card sx={{ height: 100, width: "100%" }}>
                <Typography
                  variant="button"
                  gutterBottom
                  sx={{ display: "block", textAlign: "center", mt: 1 }}
                >
                  Total Credit{" "}
                </Typography>
                <Divider />
                <Typography
                  variant="h6"
                  sx={{
                    display: "block",
                    textAlign: "center",
                    mt: 2,
                    fontWeight: "bold",
                  }}
                >
                  {creditAmount}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={3} sm={3} mt={1}>
              <Card sx={{ height: 100, width: "100%" }}>
                <Typography
                  variant="button"
                  gutterBottom
                  sx={{ display: "block", textAlign: "center", mt: 1 }}
                >
                  Open Cash
                </Typography>
                <Divider />
                <TextField
                  variant="standard"
                  value={openCash}
                  sx={{
                    display: "block",
                    textAlign: "center",
                    mt: 2,
                    fontWeight: "bold",
                    width: "100%",
                    fontSize: "1.25rem",
                    textAlign: "center",
                  }}
                  inputProps={{
                    style: {
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "1.25rem",
                    },
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {
                      setOpenCash(value);
                    } else {
                      setOpenCash("");
                    }
                  }}
                />
              </Card>
            </Grid>
            <Grid item xs={3} sm={3} mt={1}>
              <Card sx={{ height: 100, width: "100%" }}>
                <Typography
                  variant="button"
                  gutterBottom
                  sx={{ display: "block", textAlign: "center", mt: 1 }}
                >
                  Today Sales{" "}
                </Typography>
                <Divider />
                <Typography
                  variant="h6"
                  sx={{
                    display: "block",
                    textAlign: "center",
                    mt: 2,
                    fontWeight: "bold",
                  }}
                >
                  {totalSales}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
        <Stack direction="row" justifyContent="center" gap="10px" mt={5}>
          <Button
            variant="contained"
            sx={{
              color: "white",
              backgroundColor: "grey",
              "&:hover": { backgroundColor: "darkgrey" },
            }}
            // startIcon={<RotateLeft />}
            onClick={resetBtn}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            color="success"
            // endIcon={<OfflinePin />}
            onClick={openDialog}
          >
            Save
          </Button>
        </Stack>
        <Dialog open={warningDialog} onClose={closeDialog}>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogContent>
            Remember, you can only complete the settlement once per day.
          </DialogContent>
          <Stack
            direction="row"
            justifyContent="center"
            gap="10px"
            mt={3}
            mb={2}
          >
            <Button
              variant="contained"
              sx={{
                color: "white",
                backgroundColor: "grey",
                "&:hover": {
                  backgroundColor: "darkgrey",
                },
              }}
              onClick={closeDialog}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={saveSettelment}
            >
              Save
            </Button>
          </Stack>
        </Dialog>
        <Dialog open={errorDialog} onClose={closeDialog}>
          <DialogTitle>Daily Settlement Limit Reached</DialogTitle>
          <DialogContent>
            You have reached the daily settlement limit,please attempt to settle
            again tomorrow.{" "}
          </DialogContent>
          <Stack
            direction="row"
            justifyContent="center"
            gap="10px"
            mt={3}
            mb={2}
          >
            <Button
              variant="contained"
              sx={{
                color: "white",
                backgroundColor: "grey",
                "&:hover": {
                  backgroundColor: "darkgrey",
                },
              }}
              onClick={closeDialog}
            >
              Ok
            </Button>
          </Stack>
        </Dialog>
      </ThemeProvider>
    </>
  );
}

const theme = createTheme({
  palette: {
    success: {
      main: "#4caf50",
      contrastText: "#ffffff",
    },
    remove: {
      main: "red",
      contrastText: "#FF6347",
    },
    grey: {
      main: "#9e9e9e",
      contrastText: "#ffffff",
    },

    tomato: {
      main: "#FF6347",
    },
  },
});

const CustomPaper = styled(Paper)(({ theme }) => ({
  width: 300,
  height: 250,
  elevation: 6,
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
