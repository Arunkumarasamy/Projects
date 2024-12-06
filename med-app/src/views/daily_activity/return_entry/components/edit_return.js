import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Url from "Api";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
export default function Edit_return({
  openEdit,
  closeDialog,
  selectedValue,
  showToast,
  callList,
}) {
  const [id, setId] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [salesId, setSalesID] = useState("");
  const [amount, setAmount] = useState("");
  const [billNo, setBillNo] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({
    valReturnDate: false,
    valSalesID: false,
    valBillNo: false,
    amount: false,
  });

  // validation error
  const validateFields = () => {
    const newErrors = {
      valReturnDate: !returnDate || isNaN(new Date(returnDate).getTime()),
      valSalesID: salesId.trim() === "" || !/^\d*\.?\d*$/.test(salesId),
      valBillNo: billNo.trim() === "" || !/^\d*\.?\d*$/.test(billNo),
      amount: amount.trim() === "" || !/^\d*\.?\d*$/.test(amount),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  //   bind value

  useEffect(() => {
    if (selectedValue) {
      setId(selectedValue.ReturnId);
      setReturnDate(dayjs(selectedValue.ReturnDate));
      setSalesID(selectedValue.ReturnSalesId);
      setAmount(selectedValue.ReturnAmount);
      setBillNo(selectedValue.ReturnBillNo);
      setDescription(selectedValue.Description);
    }
  }, [selectedValue]);

  // update call
  const updateReturn = async () => {
    if (!validateFields()) {
      return;
    }

    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.returnEdit, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        id: id,
        salesId: salesId,
        billNo: billNo,
        date: returnDate.format(),
        description: description,
        returnAmount: amount,
      }),
    });
    try {
      const responseData = await response.json();
      console.log("this response Data---", responseData);
      if (responseData.apiStatus.code === "200") {
        callList();
        showToast(responseData.apiStatus.message, "success");
      } else {
        showToast(responseData.apiStatus.message, "error");
      }
    } catch (err) {
      console.log("fetch error------", err);
    }
  };
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Dialog open={openEdit} onClose={closeDialog} maxWidth="sm" fullWidth>
            <DialogTitle>
              <Typography>Edit Return_entry</Typography>
              <IconButton
                aria-label="close"
                onClick={closeDialog}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey.main,
                  "&:hover": {
                    color: (theme) => theme.palette.tomato.main,
                  },
                }}
              >
                <Close />
              </IconButton>
            </DialogTitle>

            <DialogContent>
              <Box mb={2} mt={3}>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={6}>
                    <DatePicker
                      value={returnDate}
                      sx={{ height: 40, width: 268 }}
                      onChange={(newValue) => setReturnDate(dayjs(newValue))}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={errors.valReturnDate}
                          helperText={
                            errors.valReturnDate ? "Date is required *" : ""
                          }
                        />
                      )}
                      defaultValue={today}
                      views={["day", "month", "year"]}
                      required
                    />
                    {/* {errors.valReturnDate && (
                      <Typography variant="caption" color="error">
                        Date is required *
                      </Typography>
                    )} */}
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <TextField
                      label="Sales Id"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value)) {
                          setSalesID(value);
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            valSalesID: false,
                          }));
                        } else {
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            valSalesID: true,
                          }));
                        }
                      }}
                      value={salesId}
                      required
                      fullWidth
                      autoFocus
                      error={errors.valSalesID}
                      helperText={
                        errors.valSalesID ? "SalesId is required *" : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <TextField
                      label="Bill Number"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value)) {
                          setBillNo(value);
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            valBillNo: false,
                          }));
                        } else {
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            valBillNo: true,
                          }));
                        }
                      }}
                      value={billNo}
                      required
                      fullWidth
                      autoFocus
                      error={errors.valBillNo}
                      helperText={
                        errors.valBillNo ? "Bill Number is required *" : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <TextField
                      label="Return Amount"
                      value={amount}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value)) {
                          setAmount(value);
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            amount: false,
                          }));
                        } else {
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            amount: true,
                          }));
                        }
                      }}
                      required
                      fullWidth
                      autoFocus
                      variant="outlined"
                      error={errors.amount}
                      helperText={
                        errors.amount ? "ReturnAmount is required *" : ""
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
              <TextField
                m={1}
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={4}
                // error={errors.description}
                // helperText={errors.description ? "Description is required" : ""}
              />
              <Stack direction="row" justifyContent="center" gap="10px" mt={5}>
                <Button
                  variant="contained"
                  sx={{
                    color: "white",
                    backgroundColor: "grey",
                    "&:hover": { backgroundColor: "darkgrey" },
                  }}
                  onClick={closeDialog}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={updateReturn}
                >
                  Update
                </Button>
              </Stack>
            </DialogContent>
          </Dialog>
        </ThemeProvider>
      </LocalizationProvider>
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

const today = dayjs();
