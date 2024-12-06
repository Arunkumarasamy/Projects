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
export default function Add_other({
  openOtherDialog,
  closeDialog,
  refreshList,
  showToast,
}) {
  const [otherDate, setOtherDate] = useState(dayjs());
  const [expenseFor, setExpenseFor] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({
    otherDate: false,
    expenseFor: false,
    amount: false,
    // description: false,
  });

  const handleDateChange = (newValue) => {
    // Ensure the newValue is a valid Dayjs object
    if (newValue && dayjs(newValue).isValid()) {
      //  Set time to midnight to avoid timezone issues
      const adjustedDate = newValue.startOf("day");
      setOtherDate(adjustedDate);
    } else {
      setOtherDate(null);
    }
  };

  // validation error

  const validateFields = () => {
    const newErrors = {
      otherDate: !otherDate || !dayjs(otherDate).isValid(),
      expenseFor: !expenseFor,
      amount: amount.trim() === "" || !/^\d*\.?\d*$/.test(amount),
      // description: !description,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const saveOther = async (eve) => {
    if (!validateFields()) {
      return;
    }
    const formattedDate = otherDate.format("YYYY-MM-DD");

    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.expenseOtherCreate, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        date: formattedDate,
        expense: expenseFor,
        description: description,
        amount: amount,
      }),
    });
    try {
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.apiStatus.code == "200") {
        setOtherDate(dayjs());
        setExpenseFor("");
        setAmount("");
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
            open={openOtherDialog}
            onClose={closeDialog}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              <Typography>Add Expensive payment</Typography>
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
                  <Grid item xs={4} md={4}>
                    <DatePicker
                      views={["day", "month", "year"]}
                      value={otherDate}
                      onChange={handleDateChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={errors.otherDate}
                          helperText={
                            errors.otherDate ? "Date is required *" : ""
                          }
                        />
                      )}
                      required
                      defaultValue={today}
                    />
                    {errors.otherDate && (
                      <Typography variant="caption" color="error">
                        Date is required *
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={4} md={4}>
                    <TextField
                      label="Expense for"
                      // onChange={(e) => setExpenseFor(e.target.value)}
                      onChange={(e) => {
                        const value = e.target.value;
                        setExpenseFor(value);
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          expenseFor: value.trim() === "",
                        }));
                      }}
                      value={expenseFor}
                      required
                      fullWidth
                      autoFocus
                      error={errors.expenseFor}
                      helperText={
                        errors.expenseFor ? "ExpenseFor is required *" : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={4} md={4}>
                    <TextField
                      label="Amount"
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
                      helperText={errors.amount ? "Amount is required *" : ""}
                    />
                  </Grid>
                </Grid>
              </Box>
              <TextField
                m={1}
                label="Description"
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
                <Button variant="contained" color="success" onClick={saveOther}>
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
