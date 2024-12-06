import { Close } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  //   Paper,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import Url from "Api";

export default function View_subcategory({
  openViewDialog,
  closeDialog,
  subCategoryID,
}) {
  const [viewData, setViewData] = useState({});

  const fetchSubcategory = async () => {
    if (!subCategoryID) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        Url.api + Url.subCategoryView + subCategoryID.Id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = await response.json();
      if (responseData.apiStatus?.code === "200") {
        setViewData(responseData?.result?.SubCategoryData[0] || {});
        console.log(
          "viewPage for subCategory-------",
          responseData.result.SubCategoryData
        );
      } else {
        console.log("Error from response in subCategory:", responseData);
      }
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };
  console.log(
    "this subcategory view Api------",
    Url.api + Url.subCategoryView + subCategoryID
  );

  useEffect(() => {
    if (openViewDialog && subCategoryID) {
      fetchSubcategory();
    }
  }, [openViewDialog, subCategoryID]);
  console.log("Current viewData--------:", viewData);

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
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography
                variant="subtitle2"
                boxSizing={"border-box"}
                sx={{ display: "flex" }}
              >
                Category Name
                <Typography variant="caption" display="block" pl={3}>
                  :
                </Typography>
                <Typography variant="caption" display="block" pl={2}>
                  {viewData?.CategoryName || "N/A"}
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
                Subcategory Name
                <Typography variant="caption" display="block" pl={3}>
                  :
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  boxSizing={"border-box"}
                  pl={2}
                  sx={{ whiteSpace: "pre-wrap" }}
                >
                  {viewData.SubCategoryName || "N/A"}
                </Typography>
              </Typography>
            </Grid>
            <Grid item sm={12}>
              <Typography
                variant="subtitle2"
                display="block"
                sx={{ display: "flex" }}
              >
                Description
                <Typography variant="caption" display="block" pl={6}>
                  :
                </Typography>
                <Typography variant="caption" display="block" pl={2}>
                  {viewData.description || "N/A"}
                </Typography>
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 400 }} aria-label="spanning table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" colSpan={3}>
                        Details
                      </TableCell>
                      <TableCell align="center">Price</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center">Item Name</TableCell>
                      <TableCell align="center">Unit</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="center">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {viewData?.itemdata?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">{item.itemName}</TableCell>
                        <TableCell align="center">{item.unitPrice}</TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="center">{item.amount}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell rowSpan={3} />
                      <TableCell colSpan={2}>Total</TableCell>
                      <TableCell align="center">
                        {viewData.actualAmount}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={2}>Sales Amount</TableCell>
                      <TableCell align="center">
                        {viewData.salesAmount}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>{" "}
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
