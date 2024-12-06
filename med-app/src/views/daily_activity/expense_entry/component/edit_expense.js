import { Close } from "@mui/icons-material";
import {
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
import Toast from "components/Toast";
import { useEffect, useState } from "react";

export default function Edit_Expense({
  openDialogEditExpense,
  closeDialogbox,
  expense,
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

  const [date, setDate] = useState("");
  const [expenses, setExpenses] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [descripition, setDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [billNum, setBillNum] = useState("");
  const [amount, setAmount] = useState("");
  const [id, setId] = useState("");

  // expense update
  useEffect(() => {
    if (expense) {
      setDate(expense.date);
      setExpenses(expense.expense);
      setVendorName(expense.vendorName);
      setDescription(expense.description);
      setTotalAmount(expense.total_amount);
      setBillNum(expense.expensesDetails.map((list) => list.bill_no));
      setAmount(expense.expensesDetails.map((list) => list.amount));
      setId(expense.id);
    }

    // console.log(expense.date, "date");
  }, [expense]);

  // update

  const updateButton = async (eve) => {
    eve.preventDefault();
    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.expenseEdit, {
      method: "PUT",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        id: id,
        date: date,
        expense: expenses,
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
    } catch (err) {
      console.log("error from " + err);
    }
  };

  const closeDialog = () => {
    closeDialogbox();
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog
          open={openDialogEditExpense}
          onClose={closeDialog}
          maxWidth="sm"
        >
          <DialogTitle>
            <Typography>Edit Expense</Typography>
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
              <Grid item xs={4} md={4} mt={2}>
                <DatePicker
                  label="Select Date"
                  // value={date}
                  // onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              <Grid item xs={4} md={4} mt={2}>
                <TextField
                  variant="outlined"
                  label="Expense"
                  fullWidth
                  onChange={(e) => setExpenses(e.target.value)}
                  value={expenses}
                  // margin="normal"
                />
              </Grid>
              <Grid item xs={4} md={4} mt={2}>
                <TextField
                  disabled
                  variant="outlined"
                  label="Vendar Name"
                  fullWidth
                  // value={vendorName}
                  // margin="normal"
                />
              </Grid>
              <Grid item xs={4} md={4}>
                <TextField
                  variant="outlined"
                  disabled
                  label="Bill Number"
                  onChange={(e) => setBillNum(e.target.value)}
                  fullWidth
                  value={billNum}
                />
              </Grid>
              <Grid item xs={4} md={4}>
                <TextField
                  variant="outlined"
                  disabled
                  onChange={(e) => setAmount(e.target.value)}
                  label="Amount"
                  fullWidth
                  value={amount}
                />
              </Grid>
              <Grid item xs={4} md={4}>
                <TextField
                  variant="outlined"
                  disabled
                  label="Total Amount"
                  onChange={(e) => setTotalAmount(e.target.value)}
                  fullWidth
                  value={totalAmount}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <TextField
                  label="Description"
                  //   value={description}
                  //   onChange={descriptionChange}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  value={descripition}
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
              <Button
                variant="contained"
                color="success"
                onClick={updateButton}
              >
                Update
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
