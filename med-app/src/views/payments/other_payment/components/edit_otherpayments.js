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

export default function Edit_other({
  openEditOtherDialog,
  closeDialog,
  otherValue,
  callList,
  showToast,
}) {
  const [otherDate, setOtherDate] = useState(null);
  const [id, setId] = useState("");
  const [expenseFor, setExpenseFor] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({
    otherDate: false,
    expenseFor: false,
    amount: false,
    // description: false,
  });

  // validation error

  const validateFields = () => {
    const newErrors = {
      otherDate: !otherDate || isNaN(new Date(otherDate).getTime()),
      expenseFor: !expenseFor,
      amount: !amount.trim() === "" || !/^\d*\.?\d*$/.test(amount),
      // description: !description,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  // update

  useEffect(() => {
    if (otherValue) {
      setOtherDate(dayjs(otherValue.date));
      setExpenseFor(otherValue.expense);
      setAmount(otherValue.amount);
      setDescription(otherValue.description);
      setId(otherValue.id);
    }
  }, [otherValue]);

  const updateOther = async (eve) => {
    if (!validateFields()) {
      return;
    }
    eve.preventDefault();
    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.expenseOtherEdit, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        id: id,
        date: otherDate.format(),
        expense: expenseFor,
        description: description,
        amount: amount,
      }),
    });
    try {
      const responseData = await response.json();
      console.log("this response Data---", responseData);
      if (responseData.apiStatus.code === "200") {
        callList();
        showToast(responseData.apiStatus.message, "success");
        // window.location.reload();
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
          <Dialog
            open={openEditOtherDialog}
            onClose={closeDialog}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              <Typography>Edit Expensive</Typography>
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
                      value={otherDate}
                      onChange={(newValue) => setOtherDate(dayjs(newValue))}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={errors.otherDate}
                          helperText={
                            errors.otherDate ? "Date is required" : ""
                          }
                        />
                      )}
                      defaultValue={today}
                      views={["day", "month", "year"]}
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
                      required
                      fullWidth
                      value={expenseFor}
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
                      fullWidth
                      required
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
                value={description}
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
                  onClick={updateOther}
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
