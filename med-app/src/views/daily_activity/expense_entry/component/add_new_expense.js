import { Close } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  CircularProgress,
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
import axios from "axios";
import Toast from "components/Toast";
import { useEffect, useState } from "react";
import { date } from "yup";

export default function Add_New_Expense({
  openDialogAddNewExpense,
  closeDialogBox,
}) {
  // toast message
  const [openToast, setOpenToast] = useState("");
  const [severityToast, setSeverityToast] = useState("success"); // error,warning,info
  const [messageToast, setMessageToast] = useState("");
  // show toast

  const showToast = (msg, severity) => {
    setMessageToast(msg);
    setSeverityToast(severity);
    setOpenToast(true);
  };
  const closeToast = () => {
    setOpenToast(false);
  };

  // add list
  const [dateChange, setDateChange] = useState(null);
  const [dateError, setDateError] = useState(false);
  const [expense, setExpense] = useState("");
  const [vendorName, setVendorName] = useState(false);
  const [descripition, setDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [billNum, setBillNum] = useState("");
  const [amount, setAmount] = useState("");

  const saveExpense = async (eve) => {
    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.expenseCreate, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        date: dateChange,
        expense: expense,
        vendorName: vendorName,
        description: descripition,
        total_amount: totalAmount,
        expensesDetails: [
          {
            bill_no: billNum,
            amount: amount,
          },
        ],
      }),
    });
    try {
      const responceData = await response.json();
      console.log(responceData);
      if (responceData.apiStatus.code == "200") {
        showToast(responceData.apiStatus.message, "success");
        window.location.reload();
      } else {
        showToast(responceData.apiStatus.message, "error");
        console.log("error");
      }
    } catch (error) {
      console.log("error from conntection" + error);
    }
  };

  // vendor name fetch
  const [openVendor, setOpenVendor] = useState(false);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [vendorLoading, setVendorLoading] = useState(false);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (openVendor) {
      setVendorLoading(true);
      fetch(Url.api + Url.vendorNameDropDown, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json(); // Parse JSON response
        })
        .then((data) => {
          setVendorOptions(data); // Update state with the data
          setVendorLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching vendors:", error);
          setVendorLoading(false);
        });
    }
  }, [openVendor]);

  // date
  const handleDateChange = (date) => {
    if (!date) {
      setDateError(true);
    } else {
      setDateError(false);
      setDateChange(date);
    }
  };

  const closeDialog = () => {
    closeDialogBox();
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog
          open={openDialogAddNewExpense}
          onClose={closeDialog}
          maxWidth="sm"
        >
          <DialogTitle>
            <Typography>Add Expense</Typography>
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
            <Grid container spacing={2}>
              <Grid item xs={12} md={4} mt={2}>
                <DatePicker
                  label="Select Date"
                  value={dateChange}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={dateError}
                      helperText={dateError ? "Date is required" : ""}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4} mt={2}>
                <TextField
                  variant="outlined"
                  label="Expense"
                  fullWidth
                  // margin="normal"
                  onChange={(e) => setExpense(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4} mt={2}>
                <Autocomplete
                  id="vendor"
                  sx={{ width: 175 }}
                  open={openVendor}
                  onOpen={() => setOpenVendor(true)}
                  onClose={() => setOpenVendor(false)}
                  isOptionEqualToValue={(option, value) =>
                    option.title === value.title
                  }
                  getOptionLabel={(option) => option.title} //----------
                  options={vendorOptions}
                  loading={vendorLoading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Vendor Name"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {vendorLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      InputLabelProps={{
                        style: { fontSize: "14px" },
                      }}
                      inputProps={{
                        ...params.inputProps,
                        style: {
                          height: "35px",
                          padding: "0 7px",
                          fontSize: "14px",
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          minHeight: "40px",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4} md={4}>
                <TextField
                  variant="outlined"
                  label="Bill Number"
                  fullWidth
                  onChange={(e) => setBillNum(e.target.value)}
                />
              </Grid>
              <Grid item xs={4} md={4}>
                <TextField
                  variant="outlined"
                  label="Amount"
                  fullWidth
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Grid>
              <Grid item xs={4} md={4}>
                <TextField
                  variant="outlined"
                  label="Total Amount"
                  fullWidth
                  onChange={(e) => setTotalAmount(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <TextField
                  label="Description"
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
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
              <Button variant="contained" color="success" onClick={saveExpense}>
                Save
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
        <Toast
          open={openToast}
          severity={severityToast}
          message={messageToast}
          handleClose={closeToast}
        />
      </LocalizationProvider>
    </ThemeProvider>
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
