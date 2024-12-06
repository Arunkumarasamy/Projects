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
} from "@mui/material";
import Url from "Api";
import { useEffect, useState } from "react";

export default function View_sales({
  openViewDialog,
  closeDialog,
  selectedValue,
}) {
  const [viewData, setViewData] = useState(null);
  const [viewPresc, setViewPresc] = useState(false);

  const fetchSales = async () => {
    if (!selectedValue) return;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        Url.api + Url.salesView + selectedValue.sales_id,
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
        const storeValue = responseData.result;
        setViewData(storeValue || null);
        console.log("storeValue----", storeValue);
      } else {
        console.log("Error from sales View:", responseData);
      }
    } catch (error) {
      console.log("Fetch error sales view:-----", error);
    }

    console.log(
      "this sales view Api------",
      Url.api + Url.salesView + selectedValue.sales_id
    );
  };

  useEffect(() => {
    console.log("Dialog open status---------:", openViewDialog);
    console.log("Selected value-----------:", selectedValue);
    if (openViewDialog && selectedValue) {
      fetchSales();
    }
  }, [openViewDialog, selectedValue]);

  const viewPrescription = () => {
    setViewPresc(true);
  };

  // img
  var presFile = Url.api;

  const closePrescBtn = () => {
    setViewPresc(false);
  };

  console.log("Current viewData--------:", viewData);

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
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle2"
                    boxSizing={"border-box"}
                    sx={{ display: "flex" }}
                  >
                    Name
                    <Typography variant="caption" display="block" pl={9}>
                      :
                    </Typography>
                    <Typography variant="caption" display="block" pl={2}>
                      {viewData?.CustomerDetails?.customer_name || "N/A"}
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item sm={6}>
                  <Typography
                    variant="subtitle2"
                    display="block"
                    sx={{ display: "flex" }}
                    ml={3}
                  >
                    Email
                    <Typography variant="caption" display="block" pl={8}>
                      :
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      boxSizing={"border-box"}
                      pl={2}
                      sx={{ whiteSpace: "pre-wrap" }}
                    >
                      {viewData?.CustomerDetails?.customer_email || "N/A"}
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item sm={6}>
                  <Typography
                    variant="subtitle2"
                    display="block"
                    sx={{ display: "flex" }}
                  >
                    Phone
                    <Typography variant="caption" display="block" pl={8.7}>
                      :
                    </Typography>
                    <Typography variant="caption" display="block" pl={2}>
                      {viewData?.CustomerDetails?.customer_mobile || "N/A"}
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item sm={6}>
                  <Typography
                    variant="subtitle2"
                    display="block"
                    sx={{ display: "flex" }}
                    ml={3}
                  >
                    Address
                    <Typography variant="caption" display="block" pl={6}>
                      :
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      pl={2}
                      // sx={{ whiteSpace: "pre-wrap" }}
                    >
                      {viewData?.CustomerDetails?.customer_address || "N/A"}
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item sm={6}>
                  <Typography
                    variant="subtitle2"
                    display="block"
                    sx={{ display: "flex" }}
                  >
                    Hospital Name
                    <Typography variant="caption" display="block" pl={2}>
                      :
                    </Typography>
                    <Typography variant="caption" display="block" pl={2}>
                      {viewData?.SalesDetails?.prescription?.hospital_name ||
                        "N/A"}
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item sm={6}>
                  <Typography
                    variant="subtitle2"
                    display="block"
                    sx={{ display: "flex" }}
                    ml={3}
                  >
                    Doctor Name
                    <Typography variant="caption" display="block" pl={2}>
                      :
                    </Typography>
                    <Typography variant="caption" display="block" pl={2}>
                      {viewData?.SalesDetails?.prescription?.refered_by ||
                        "N/A"}
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item sm={6}>
                  <Typography
                    variant="subtitle2"
                    display="block"
                    sx={{ display: "flex" }}
                  >
                    Prescription
                    <Typography variant="caption" display="block" pl={4.3}>
                      :
                    </Typography>
                    <Typography
                      variant="caption"
                      pl={2}
                      sx={{ cursor: "pointer" }}
                      onClick={viewPrescription}
                    >
                      {/* <Pageview /> */}
                      {viewData?.SalesDetails?.prescription
                        ?.original_file_name || "N/A"}
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item sm={6}>
                  <Typography
                    variant="subtitle2"
                    display="block"
                    sx={{ display: "flex" }}
                    ml={3}
                  >
                    Date
                    <Typography variant="caption" display="block" pl={9}>
                      :
                    </Typography>
                    <Typography variant="caption" display="block" pl={2}>
                      {viewData?.SalesDetails?.sales_details?.sale_date ||
                        "N/A"}
                    </Typography>
                  </Typography>
                </Grid>
              </Grid>
            </Container>
            {/* </Stack> */}
            <Grid container mt={2}>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" colSpan={4}>
                          Items
                        </TableCell>
                        <TableCell align="center">Amount</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="center">Category</TableCell>
                        <TableCell align="center">SubCategory</TableCell>
                        <TableCell align="center">Unit</TableCell>
                        <TableCell align="center">Qty</TableCell>
                        <TableCell align="center">Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {viewData?.SalesDetails?.sales_items?.map(
                        (item, index) => (
                          <TableRow key={index}>
                            <TableCell align="center">
                              {item.category_name}
                            </TableCell>
                            <TableCell align="center">
                              {item.sub_category_name}
                            </TableCell>{" "}
                            <TableCell align="center">
                              {item.unit_price}
                            </TableCell>
                            <TableCell align="center">
                              {item.item_quantity}
                            </TableCell>
                            <TableCell align="center">
                              {item.item_amount}
                            </TableCell>
                          </TableRow>
                        )
                      )}

                      <TableRow>
                        <TableCell rowSpan={3} />
                        <TableCell colSpan={3} align="left" sx={{ pl: 13 }}>
                          Total Amount
                        </TableCell>
                        <TableCell align="center">
                          {viewData?.SalesDetails?.sales_details?.total_amount}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="center" colSpan={2} sx={{ pr: 7 }}>
                          Discount type
                        </TableCell>
                        <TableCell align="center" colSpan={1}>
                          {viewData?.SalesDetails?.sales_details
                            ?.discount_type || "N/A"}{" "}
                          {"( "}
                          {viewData?.SalesDetails?.sales_details
                            ?.discount_value || "N/A"}
                          {" )"}
                        </TableCell>
                        <TableCell align="center" colSpan={1}>
                          {viewData?.SalesDetails?.sales_details
                            ?.discount_amount || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} align="left" sx={{ pl: 13 }}>
                          Payable Amount
                        </TableCell>
                        <TableCell align="center">
                          {
                            viewData?.SalesDetails?.sales_details
                              ?.payable_amount
                          }
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
            <Typography mt={3}>Payment Details</Typography>
            <Grid container spacing={1} m={1}>
              <Grid item sm={6}>
                <Typography
                  variant="subtitle2"
                  display="block"
                  sx={{ display: "flex" }}
                >
                  Payment Type{" "}
                  <Typography variant="caption" display="block" pl={4}>
                    :
                  </Typography>
                  <Typography variant="caption" display="block" pl={2}>
                    {viewData?.SalesDetails?.sales_details?.payment_type ||
                      "N/A"}
                  </Typography>
                </Typography>
              </Grid>
              <Grid item sm={6}>
                <Typography
                  variant="subtitle2"
                  display="block"
                  sx={{ display: "flex" }}
                >
                  Paid Amount
                  <Typography variant="caption" display="block" pl={2}>
                    :
                  </Typography>
                  <Typography variant="caption" display="block" pl={2}>
                    {viewData?.SalesDetails?.sales_details?.paid_amount ||
                      "N/A"}
                  </Typography>
                </Typography>
              </Grid>
              <Grid item sm={6}>
                <Typography
                  variant="subtitle2"
                  display="block"
                  sx={{ display: "flex" }}
                >
                  Balance Amount
                  <Typography variant="caption" display="block" pl={2}>
                    :
                  </Typography>
                  <Typography variant="caption" display="block" pl={2}>
                    {viewData?.SalesDetails?.sales_details?.balance_amount ||
                      "N/A"}
                  </Typography>
                </Typography>
              </Grid>
              <Grid item sm={6}>
                <Typography
                  variant="subtitle2"
                  display="block"
                  sx={{ display: "flex" }}
                >
                  PayMethod
                  <Typography variant="caption" display="block" pl={3}>
                    :
                  </Typography>
                  <Typography variant="caption" display="block" pl={2}>
                    {viewData?.SalesDetails?.sales_details?.payment_method ||
                      "N/A"}
                  </Typography>
                </Typography>
              </Grid>
              <Grid item sm={6}>
                <Typography
                  variant="subtitle2"
                  display="block"
                  sx={{ display: "flex" }}
                >
                  Customer Type
                  <Typography variant="caption" display="block" pl={3}>
                    :
                  </Typography>
                  <Typography variant="caption" display="block" pl={2}>
                    {viewData?.CustomerDetails?.customer_type || "N/A"}
                  </Typography>
                </Typography>
              </Grid>
              <Grid item sm={6}></Grid>
            </Grid>
          </DialogContent>
        </Dialog>
        <Dialog
          open={viewPresc}
          onClose={closePrescBtn}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              height: "500px", // Set the height of the dialog
            },
          }}
          // sx={{ height: "500px" }}
        >
          <DialogTitle>
            <Typography>
              {viewData?.SalesDetails?.prescription?.original_file_name ||
                "N/A"}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={closePrescBtn}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "grey",
                "&:hover": {
                  color: "red",
                },
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Avatar
                alt={
                  viewData?.SalesDetails?.prescription?.original_file_name ||
                  "No Image"
                }
                src={
                  viewData?.SalesDetails?.prescription
                    ? `${presFile}${viewData?.SalesDetails?.prescription?.path}`
                    : ""
                }
                sx={{
                  width: "100%",
                  height: "800px",
                  borderRadius: 2,
                  objectFit: "cover",
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions></DialogActions>
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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(5),
  width: "100%",
  height: "50 %",
}));
