import { Close } from "@mui/icons-material";
import {
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
import Url from "Api";
import dayjs from "dayjs";
import { useState } from "react";

export default function Add_New_Credit({
  openDialogAddNewCredit,
  closeDialogbox,
  refreshList,
  showToast,
}) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState(dayjs());
  const [cusTypePay, setCusTypePay] = useState("");
  const [payAbleAmount, setPayAbleAmount] = useState("");
  const [amount, setAmount] = useState("");

  const [errors, setErrors] = useState({
    valName: false,
    valMobile: false,
    valEmail: false,
    valDate: false,
    valPayAbleAmount: false,
    valAmount: false,
  });

  // validation error
  const validateFields = () => {
    const newErrors = {
      valDate: !date || !dayjs(date).isValid(),
      valName: !name.trim(),
      valMobile: !/^[0-9]{10,12}$/.test(mobile),
      valEmail: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      valPayAbleAmount: !payAbleAmount,
      valAmount: !amount || !/^\d*\.?\d*$/.test(amount),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

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

  const saveBtn = async (eve) => {
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
        setMobile("");
        setAmount("");
        showToast(responceData.apiStatus.message, "success");
      } else {
        setMobile("");
        setAmount("");
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
        <Dialog
          open={openDialogAddNewCredit}
          onClose={closeDialogbox}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography>Add New Credit Customer</Typography>
            <IconButton
              aria-label="close"
              onClick={closeDialogbox}
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
              <Grid item xs={12} md={6} mt={2}>
                <TextField
                  variant="outlined"
                  label="Name"
                  fullWidth
                  onChange={(e) => {
                    const value = e.target.value;
                    setName(value);
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      valName: value.trim() === "",
                    }));
                  }}
                  required
                  error={errors.valName}
                  helperText={errors.valName ? "Name is required" : ""}
                />
              </Grid>
              <Grid item xs={12} md={6} mt={2}>
                <TextField
                  label="Mobile Number"
                  variant="outlined"
                  value={mobile}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && value.length <= 12) {
                      setMobile(value);
                    }
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      valMobile: !/^[0-9]{10,12}$/.test(value),
                    }));
                  }}
                  inputProps={{ maxLength: 10 }}
                  helperText={errors.valMobile ? "Mobile is required" : ""}
                  error={errors.valMobile}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={8} md={8}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      valEmail: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                        e.target.value
                      ),
                    }));
                  }}
                  error={errors.valEmail}
                  helperText={errors.valEmail ? "Invalid Email Address" : ""}
                />
              </Grid>
              <Grid item xs={4} md={4}>
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
              <Grid item xs={12} md={12}>
                <TextField
                  label="Address"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Grid>
              <Grid item xs={4} md={4}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="demo-simple-select-standard-label">
                    Customer Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    label="Customer Type"
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      setCusTypePay(selectedValue);
                    }}
                  >
                    <MenuItem value={"normal_pay"}>Normal Pay</MenuItem>
                    <MenuItem value={"monthly_pay"}>Monthly Pay</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4} md={4}>
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
              <Grid item xs={4} md={4}>
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
                  fullWidth
                  error={errors.valAmount}
                  helperText={errors.valAmount ? "Amount is required *" : ""}
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
                onClick={closeDialogbox}
              >
                Cancel
              </Button>
              <Button variant="contained" color="success" onClick={saveBtn}>
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
