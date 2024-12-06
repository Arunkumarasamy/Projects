import { Close, Pageview } from "@mui/icons-material";
import {
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  createTheme,
  ThemeProvider,
  styled,
  Avatar,
  Link,
  colors,
  Box,
  Container,
  DialogActions,
  Divider,
  Card,
} from "@mui/material";
import Url from "Api";
import { useEffect, useState } from "react";

export default function View_cus_credits({
  openViewDialog,
  closeDialog,
  selectedValue,
}) {
  const [viewData, setViewData] = useState(null);
  const [totals, setTotals] = useState({});

  // fetch credit
  const fetchCredit = async () => {
    if (!selectedValue) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        Url.api + Url.creditView + selectedValue.customerId,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = await response.json();
      console.log("View page fetched data:", responseData);

      if (responseData.apiStatus?.code === "200") {
        const storeValue = responseData.result.customerDetails[0];
        setViewData(storeValue || null);
        setTotals({
          totalCreditAmount: responseData.result.totalCreditAmount,
          totalDebitAmount: responseData.result.totalDebitAmount,
          totalBalanceAmount: responseData.result.totalBalanceAmount,
        });
        console.log("storeValue----", storeValue);
      } else {
        console.log("Error from credit View:", responseData);
      }
    } catch (error) {
      console.log("Fetch error credit view:-----", error);
    }
    console.log(
      "this credit view Api------",
      Url.api + Url.creditView + selectedValue.customerId
    );
  };

  useEffect(() => {
    console.log("Dialog open status---------:", openViewDialog);
    console.log("Selected value-----------:", selectedValue);
    if (openViewDialog && selectedValue) {
      fetchCredit();
    }
  }, [openViewDialog, selectedValue]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Dialog
          open={openViewDialog}
          onClose={closeDialog}
          maxWidth="md"
          fullWidth
        >
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
            {/* <Stack >*/}

            <Container maxWidth="sm">
              <Grid container spacing={1}>
                <Grid item xs={4} sm={4} mt={1} p={2}>
                  <Card sx={{ height: 100, width: "100%" }}>
                    <Typography
                      variant="button"
                      gutterBottom
                      sx={{ display: "block", textAlign: "center", mt: 1 }}
                    >
                      Total Credit Amount{" "}
                    </Typography>
                    <Divider />
                    <Typography
                      variant="h6"
                      sx={{
                        display: "block",
                        textAlign: "center",
                        mt: 2,
                        fontWeight: "bold",
                      }}
                    >
                      {totals.totalCreditAmount || "0.00"}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={4} sm={4} mt={1} p={2}>
                  <Card sx={{ height: 100, width: "100%" }}>
                    <Typography
                      variant="button"
                      gutterBottom
                      sx={{ display: "block", textAlign: "center", mt: 1 }}
                    >
                      Total Debit Amount{" "}
                    </Typography>
                    <Divider />
                    <Typography
                      variant="h6"
                      sx={{
                        display: "block",
                        textAlign: "center",
                        mt: 2,
                        fontWeight: "bold",
                      }}
                    >
                      {totals.totalDebitAmount || "0.00"}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={4} sm={4} mt={1} p={2}>
                  <Card sx={{ height: 100, width: "100%" }}>
                    <Typography
                      variant="button"
                      gutterBottom
                      sx={{ display: "block", textAlign: "center", mt: 1 }}
                    >
                      Total Balance Amount
                    </Typography>
                    <Divider />
                    <Typography
                      variant="h6"
                      sx={{
                        display: "block",
                        textAlign: "center",
                        mt: 2,
                        fontWeight: "bold",
                      }}
                    >
                      {totals.totalBalanceAmount || "0.00"}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle2"
                    boxSizing={"border-box"}
                    sx={{ display: "flex", mt: 1, ml: 2 }}
                  >
                    Name
                    <Typography variant="caption" display="block" pl={4.5}>
                      :
                    </Typography>
                    <Typography variant="caption" display="block" pl={2}>
                      {viewData?.customerName || "N/A"}
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item sm={6}>
                  <Typography
                    variant="subtitle2"
                    display="block"
                    sx={{ display: "flex", mt: 2 }}
                    ml={5}
                  >
                    Email
                    <Typography variant="caption" display="block" pl={9}>
                      :
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      boxSizing={"border-box"}
                      pl={2}
                      sx={{ whiteSpace: "pre-wrap" }}
                    >
                      {viewData?.customerEmail || "N/A"}
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item sm={6}>
                  <Typography
                    variant="subtitle2"
                    display="block"
                    sx={{ display: "flex", ml: 2 }}
                  >
                    Phone
                    <Typography variant="caption" display="block" pl={4.2}>
                      :
                    </Typography>
                    <Typography variant="caption" display="block" pl={2}>
                      {viewData?.customerMobile || "N/A"}
                    </Typography>
                  </Typography>
                </Grid>

                <Grid item sm={6}>
                  <Typography
                    variant="subtitle2"
                    display="block"
                    sx={{ display: "flex", ml: 5 }}
                  >
                    Customer type
                    <Typography variant="caption" display="block" pl={2}>
                      :
                    </Typography>
                    <Typography variant="caption" display="block" pl={2}>
                      {viewData?.customerType || "N/A"}
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item sm={6}>
                  <Typography
                    variant="subtitle2"
                    display="block"
                    sx={{ display: "flex", ml: 2 }}
                    ml={3}
                  >
                    Address
                    <Typography variant="caption" display="block" pl={2.7}>
                      :
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      pl={2}
                      // sx={{ whiteSpace: "pre-wrap" }}
                    >
                      {viewData?.customerAddress || "N/A"}
                    </Typography>
                  </Typography>
                </Grid>
                {/* <Grid item sm={6}>
                  <Typography
                    variant="subtitle2"
                    display="block"
                    sx={{ display: "flex" }}
                    ml={3}
                  >
                    Date
                    <Typography variant="caption" display="block" pl={2}>
                      :
                    </Typography>
                    <Typography variant="caption" display="block" pl={2}>
                      {viewData?.SalesDetails?.prescription?.refered_by ||
                        "N/A"}
                    </Typography>
                  </Typography>
                </Grid> */}
                <Grid item xs={12} sm={12}>
                  <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
                    <Table stickyHeader aria-label="contact persons table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">Date</TableCell>
                          <TableCell align="center">Credit</TableCell>
                          <TableCell align="center">Debit</TableCell>
                          <TableCell align="center">Balance</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {viewData?.customerCreditDetails.map((item, index) => (
                          <TableRow hover key={index}>
                            <TableCell align="center">{item.date}</TableCell>
                            <TableCell align="center">
                              {item.creditAmount}
                            </TableCell>
                            <TableCell align="center">
                              {item.debitAmount}
                            </TableCell>
                            <TableCell align="center">
                              {item.balanceAmount}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Container>
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
