import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Url from "Api";

import { useEffect, useState } from "react";

export default function Add_Credit({
  addDialog,
  selectedValue,
  closeDialogbox,
  refreshList,
  showToast,
}) {
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [cusTypePay, setCusTypePay] = useState("");
  const [date, setDate] = useState(dayjs());
  const [payAbleAmount, setPayAbleAmount] = useState("");
  const [amount, setAmount] = useState("");

  const [errors, setErrors] = useState({
    valDate: false,
    valPayAbleAmount: false,
    valAmount: false,
  });

  // validation error
  const validateFields = () => {
    const newErrors = {
      valDate: !date || !dayjs(date).isValid(),
      valPayAbleAmount: !payAbleAmount,
      valAmount: amount.trim() === "" || !/^\d*\.?\d*$/.test(amount),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  // date
  const handleDateChange = (newValue) => {
    // Ensure the newValue is a valid Dayjs object
    if (newValue && dayjs(newValue).isValid()) {
      //  Set time to midnight to avoid timezone issues
      const adjustedDate = newValue.startOf("day");
      setDate(adjustedDate);
    } else {
      setDate(null);
    }
  };

  // bind the value
  useEffect(() => {
    if (selectedValue) {
      setId(selectedValue.customerId);
      setName(selectedValue.customerName);
      setMobile(selectedValue.customerMobile);
      setEmail(selectedValue.customerEmail);
      setAddress(selectedValue.customerAddress);
      setCusTypePay(selectedValue.customerType);
      console.log("selected----", selectedValue);
      console.log("cus Name---", selectedValue.customerName);
    }
  }, [selectedValue]);

  const closeDialog = () => {
    closeDialogbox();
  };

  const saveButton = async (eve) => {
    if (!validateFields()) {
      return;
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

    let token = localStorage.getItem("token");
    const formattedDate = date.format("YYYY-MM-DD");

    const response = await fetch(Url.api + Url.creditCreate, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        customerDetails: {
          customerName: name,
          customerMobile: mobile,
          customerPhone: null,
          customerEmail: email,
          customerAddress: address,
          customerType: cusTypePay,
        },
        CreditDetails: {
          date: formattedDate,
          creditAmount: payAbleAmount === "credit" ? amount : "0.00",
          debitAmount: payAbleAmount === "debit" ? amount : "0.00",
        },
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    try {
      const responceData = await response.json();
      console.log(responceData);
      if (responceData.apiStatus.code == "200") {
        refreshList();
        showToast(responceData.apiStatus.message, "success");
      } else {
        showToast(responceData.apiStatus.message, "error");
      }
    } catch (error) {
      showToast("Request timed out. Please try again.", "error");
      console.log("Error handled =" + error);
    }
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Dialog open={addDialog} onClose={closeDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Typography>Add Credit</Typography>
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
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={6}>
                <DatePicker
                  views={["day", "month", "year"]}
                  // value={date}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={errors.valDate}
                      helperText={errors.valDate ? "Date is required *" : ""}
                    />
                  )}
                  defaultValue={today}
                  required
                />
                {errors.valDate && (
                  <Typography variant="caption" color="error">
                    Date is required *
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  error={errors.valPayAbleAmount}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    Payable Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    label="PayAble Type"
                    required
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      setPayAbleAmount(selectedValue);
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        valPayAbleAmount: !selectedValue,
                      }));
                    }}
                  >
                    <MenuItem value="credit">Credit</MenuItem>
                    <MenuItem value="debit">Debit</MenuItem>
                  </Select>
                  {errors.valPayAbleAmount && (
                    <FormHelperText>PayAble Type is required *</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  label="Amount"
                  name="amount"
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {
                      setAmount(value);
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        valAmount: false,
                      }));
                    } else {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        valAmount: true,
                      }));
                    }
                  }}
                  required
                  error={errors.valAmount}
                  helperText={errors.valAmount ? "Amount is required *" : ""}
                  fullWidth
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
              <Button variant="contained" color="success" onClick={saveButton}>
                Save
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      </ThemeProvider>
    </LocalizationProvider>
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
