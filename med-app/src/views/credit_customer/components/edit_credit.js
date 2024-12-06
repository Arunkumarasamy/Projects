import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
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

export default function Edit_Credit({
  editCreditDialog,
  updateButton,
  closeEditDialogbox,
}) {
  const closeDialog = () => {
    closeEditDialogbox();
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Dialog
          open={editCreditDialog}
          onClose={closeDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography>Edit Credit Customer</Typography>
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
              <Grid item xs={12} md={6} mt={2}>
                <TextField
                  variant="outlined"
                  label="Name"
                  fullWidth
                  // margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6} mt={2}>
                <TextField
                  label="Mobile Number"
                  variant="outlined"
                  fullWidth
                  // margin="normal"
                />
              </Grid>
              <Grid item xs={8} md={8}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  // margin="normal"
                />
              </Grid>
              <Grid item xs={4} md={4}>
                <DatePicker
                  label="Select Date"
                  // value={formValues.date}
                  // onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  label="Address"
                  variant="outlined"
                  fullWidth
                  // margin="normal"
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
                    // value={percentage}
                    // onChange={percent}
                    label="Customer Type"
                  >
                    <MenuItem value={"normal_pay"}>Normal Pay</MenuItem>
                    <MenuItem value={"monthly_pay"}>Monthly Pay</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4} md={4}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="demo-simple-select-standard-label">
                    Payable Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    //   value={addCreditValues.selectValue}
                    //   onChange={changeAddCreditValue}
                    label="Customer Type"
                  >
                    <MenuItem value="credit">Credit</MenuItem>
                    <MenuItem value="debit">Debit</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4} md={4}>
                <TextField
                  label="Amount"
                  name="amount"
                  // value={addCreditValues.amount}
                  // onChange={changeAddCreditValue}
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
