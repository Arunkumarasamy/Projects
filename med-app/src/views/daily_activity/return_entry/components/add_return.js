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
import { useState } from "react";
import dayjs from "dayjs";

export default function Add_return({
  addDialog,
  closeDialog,
  refreshList,
  showToast,
}) {
  const [returnDate, setReturnDate] = useState(dayjs());
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
  const handleDateChange = (newValue) => {
    // Ensure the newValue is a valid Dayjs object
    if (newValue && dayjs(newValue).isValid()) {
      // Set time to midnight to avoid timezone issues
      const adjustedDate = newValue.startOf("day");
      setReturnDate(adjustedDate);
    } else {
      setReturnDate(null);
    }
  };
  // validation error

  const validateFields = () => {
    const newErrors = {
      valReturnDate: !returnDate || !dayjs(returnDate).isValid(),
      valSalesID: salesId.trim() === "" || !/^\d*\.?\d*$/.test(salesId),
      valBillNo: billNo.trim() === "" || !/^\d*\.?\d*$/.test(billNo),
      amount: amount.trim() === "" || !/^\d*\.?\d*$/.test(amount),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const saveReturn = async () => {
    if (!validateFields()) {
      return;
    }
    const formattedDate = returnDate.format("YYYY-MM-DD");

    const token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.returnCreate, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        salesId: salesId,
        billNo: billNo,
        date: formattedDate,
        description: description,
        returnAmount: amount,
      }),
    });
    try {
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.apiStatus.code === "200") {
        setReturnDate(dayjs());
        setSalesID("");
        setAmount("");
        setBillNo("");
        setDescription("");
        refreshList();
        showToast(responseData.apiStatus.message, "success");
      } else {
        showToast(responseData.apiStatus.message, "error");
        console.log("error");
      }
    } catch (error) {
      console.log("fetch error" + error);
      showToast("An error occurred while saving the data.", "error");
    }
  };
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Dialog
            open={addDialog}
            onClose={closeDialog}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              <Typography>Add Return_entry</Typography>
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
                      views={["day", "month", "year"]}
                      value={returnDate}
                      sx={{ height: 40, width: 268 }}
                      onChange={handleDateChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={errors.valReturnDate}
                          helperText={
                            errors.valReturnDate ? "Date is required *" : ""
                          }
                        />
                      )}
                      required
                      // defaultValue={today}
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
                  onClick={saveReturn}
                >
                  Save
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
