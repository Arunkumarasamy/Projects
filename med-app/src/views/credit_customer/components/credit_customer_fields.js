import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";

export default function Credit_Customer_Fields({
  name,
  phone,
  address,
  amount,
  nameChange,
  phoneChange,
  addressChange,
  amountChange,
  closeDialogbox,
  openDialog,
  saveButton,
}) {
  const closeDialog = () => {
    closeDialogbox();
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Dialog open={openDialog} onClose={closeDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Typography>Add Customer</Typography>
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
              <TextField
                label="Name"
                value={name}
                onChange={nameChange}
                fullWidth
                autoFocus
              />
            </Box>
            <Box mb={2} mt={3}>
              <TextField
                label="Phone Number"
                value={phone}
                onChange={phoneChange}
                fullWidth
                autoFocus
              />
            </Box>
            <TextField
              label="Address"
              value={address}
              onChange={addressChange}
              fullWidth
              multiline
              rows={4}
            />
            <Box mb={2} mt={3}>
              <TextField
                label="Amount"
                value={amount}
                onChange={amountChange}
                fullWidth
                autoFocus
              />
            </Box>

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
                Cancle
              </Button>
              <Button variant="contained" color="success" onClick={saveButton}>
                Save
              </Button>
            </Stack>
          </DialogContent>
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
