import { Close } from "@mui/icons-material";
import {
  Paper,
  Card,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  ThemeProvider,
  Typography,
  createTheme,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Url from "Api";
import { useEffect, useState } from "react";

export default function View_vendor({
  openViewDialog,
  closeDialog,
  selectedValue,
}) {
  const [viewData, setViewData] = useState(null);

  const fetchVendor = async () => {
    if (!selectedValue) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        Url.api + Url.vendorView + selectedValue.VendorId,
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
        console.log(
          "response data from view page of vendor-----",
          responseData.result
        );
      } else {
        console.log("Error from response:", responseData);
      }
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };
  console.log(
    "this Vendor view Api------",
    Url.api + Url.vendorView + selectedValue
  );

  useEffect(() => {
    if (openViewDialog && selectedValue) {
      fetchVendor();
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
                  {viewData?.VendorName || "N/A"}
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="subtitle2"
                boxSizing={"border-box"}
                sx={{ display: "flex" }}
              >
                Email{" "}
                <Typography variant="caption" display="block" pl={3}>
                  :
                </Typography>
                <Typography variant="caption" display="block" pl={2}>
                  {viewData?.VendorEmail || "N/A"}
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="subtitle2"
                boxSizing={"border-box"}
                sx={{ display: "flex" }}
              >
                Phone
                <Typography variant="caption" display="block" pl={7.5}>
                  :
                </Typography>
                <Typography variant="caption" display="block" pl={2}>
                  {viewData?.VendorMobile || "N/A"}
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="subtitle2"
                boxSizing={"border-box"}
                sx={{ display: "flex" }}
              >
                GST No
                <Typography variant="caption" display="block" pl={1.5}>
                  :
                </Typography>
                <Typography variant="caption" display="block" pl={2}>
                  {viewData?.VendorGST || "N/A"}
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                boxSizing={"border-box"}
                sx={{ display: "flex" }}
              >
                Address
                <Typography variant="caption" display="block" pl={6}>
                  :
                </Typography>
                <Typography variant="caption" display="block" pl={2}>
                  {viewData?.VendorAddress || "N/A"}
                </Typography>
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12}>
              <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
                <Table stickyHeader aria-label="contact persons table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Name</TableCell>
                      <TableCell align="center">Email</TableCell>
                      <TableCell align="center">Phone</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {viewData?.ContactPersons?.map((item, index) => (
                      <TableRow hover key={index}>
                        <TableCell align="center">
                          {item.ContactPersonName}
                        </TableCell>
                        <TableCell align="center">
                          {item.ContactPersonEmail}
                        </TableCell>
                        <TableCell align="center">
                          {item.ContactPersonMobile}
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
