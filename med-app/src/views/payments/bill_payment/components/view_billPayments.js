import { Close } from "@mui/icons-material";
import {
  Container,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import Url from "Api";
import { useEffect, useState } from "react";

export default function View_billPayment({
  openViewDialog,
  closeDialog,
  selectedValue,
}) {
  const [viewData, setViewData] = useState(null);

  // view Api call
  const viewApiCall = async () => {
    if (!selectedValue) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        Url.api + Url.expenseBillView + selectedValue.id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = await response.json();
      if (responseData.apiStatus.code === "200") {
        setViewData(responseData.result);
        console.log("View page BillPayments----", responseData.result);
      } else {
        console.log("Error from BillPAyments View:", responseData.result);
      }
    } catch (error) {
      console.log("Fetch Error from BillPAyments View:", error);
    }
    console.log(
      "api call from billPAyment-----",
      Url.api + Url.expenseBillView + selectedValue
    );
  };

  useEffect(() => {
    console.log("Dialog open bill view status---------:", openViewDialog);
    console.log("Selected value bill view -----------:", selectedValue);
    if (openViewDialog && selectedValue) {
      viewApiCall();
    }
  }, [openViewDialog, selectedValue]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dialog open={openViewDialog} onClose={closeDialog}>
        <DialogTitle>
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
            <Grid item xs={6}>
              <Typography
                variant="subtitle2"
                boxSizing={"border-box"}
                sx={{ display: "flex" }}
              >
                Vendor Name
                <Typography variant="caption" display="block" pl={2}>
                  :
                </Typography>
                <Typography variant="caption" display="block" pl={2}>
                  {viewData?.vendorName || "N/A"}
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="subtitle2"
                boxSizing="border-box"
                sx={{ display: "flex" }}
              >
                Total Amount
                <Typography variant="caption" display="block" pl={2}>
                  :
                </Typography>
                <Typography variant="caption" display="block" pl={2}>
                  {viewData?.total_amount || "N/A"}
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="subtitle2"
                boxSizing="border-box"
                sx={{ display: "flex" }}
              >
                Bill Entry Date
                <Typography variant="caption" display="block" pl={1.5}>
                  :
                </Typography>
                <Typography variant="caption" display="block" pl={2}>
                  {viewData?.date || "N/A"}
                </Typography>
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12}>
              <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
                <Table stickyHeader aria-label="contact persons table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Date</TableCell>
                      <TableCell align="center">Bill No</TableCell>
                      <TableCell align="center">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {viewData?.billPaymentDetails?.map((item, index) => (
                      <TableRow hover key={index}>
                        <TableCell align="center">{item.billDate}</TableCell>
                        <TableCell align="center">{item.billNo}</TableCell>
                        <TableCell align="center">
                          {item.billAmount || "0.00"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
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
