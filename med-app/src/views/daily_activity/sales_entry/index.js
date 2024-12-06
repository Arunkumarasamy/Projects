import styled from "@emotion/styled";
import "../Style/daily_activity.css";
import { Close, Delete, Edit, HighlightOff } from "@mui/icons-material";

import {
  Box,
  Card,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  IconButton,
} from "@mui/material";

import Footer from "common/Footer";
import DashboardNavbar from "common/Navbars/DashboardNavbar";
import DashboardLayout from "layoutContainers/DashboardLayout";
import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "components/Tables/DataTable";
import Breadcrumbs from "common/Breadcrumbs";
import { useLocation } from "react-router-dom";
import Toast from "components/Toast";
import Url from "Api";
import TriangleLoader from "components/Loading/loading";
import Add_sales from "./compontents/add_sales";
import { List_sales } from "./compontents/list_sales";
import Edit_sales from "./compontents/edit_sales";
import View_sales from "./compontents/view_sales";

export default function Sales_entry() {
  // breadcrumbs
  const route = useLocation().pathname.split("/").slice(1);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [salesList, setSalesList] = useState([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [errorHandling, setErrorHandling] = useState("");
  const [fetchError, setFetchError] = useState(false);

  // store selected values
  const [selectedSaleDetails, setSelectedSaleDetails] = useState(null);

  // Toast state
  const [openToast, setOpenToast] = useState(false);
  const [severityToast, setSeverityToast] = useState("success"); // error, warning, info
  const [messageToast, setMessageToast] = useState("");

  let curDate = new Date().toDateString();

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // data list
  const sales_List = async () => {
    setLoading(true); // Start loading
    await delay(2500);
    let token = localStorage.getItem("token");

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const response = await fetch(Url.api + Url.currentSaleList, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          pageIndex: 0,
          dataLength: 10,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const responseData = await response.json();
      console.log(responseData);
      if (responseData.apiStatus.code === "200") {
        if (Array.isArray(responseData.result.result)) {
          setSalesList(responseData.result.result);
          console.log("-------", responseData.result.result);
        } else {
          console.log("error");
        }
      } else {
        console.error("API Error:", responseData.apiStatus);
      }
    } catch (error) {
      setErrorHandling("Service not found");
      // showToast("Request timed out. Please try again.", "error");
      setFetchError(true);
      console.log("fetch error");
    } finally {
      setLoading(false); // End loading
    }
  };
  useEffect(() => {
    sales_List();
  }, []);

  useEffect(() => {
    const { columns: newColumns, rows: newRows } = List_sales(
      salesList,
      openEdit,
      openDel,
      openView
    );
    setColumns(newColumns);
    setRows(newRows);
  }, [salesList]);

  // edit
  const openEdit = (id) => {
    console.log("Opening edit for:", id);
    setOpenEditDialog(true);
    setSelectedValue(id);
  };

  // delete
  const openDel = (id) => {
    setOpenDeleteDialog(true);
    setSelectedValue(id);
    // setSelectedSaleDetails(sale);
    console.log("Sales ID for delete:-----", id);
  };

  // view
  const openView = (id) => {
    setSelectedValue(id);
    setOpenViewDialog(true);
    console.log("btn has clicked");
    console.log("Selected ID for viewPage:-----", id);
  };

  const refreshList = () => {
    sales_List();
    closeDialog();
  };

  const showToast = (msg, severity) => {
    setMessageToast(msg);
    setSeverityToast(severity);
    setOpenToast(true);
  };
  // close DialogBox
  const closeDialog = () => {
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setOpenViewDialog(false);
    setSelectedValue(null);
    setOpenToast(false);
    // setSelectedSaleDetails(null);
    setFetchError(false);
  };

  const deleteSales = async () => {
    console.log("Selected value for deletion:", selectedValue);
    if (!selectedValue) {
      console.error("No sales ID selected for deletion");
      return;
    }
    let token = localStorage.getItem("token");
    const response = await fetch(
      Url.api + Url.salesDelete + selectedValue.sales_id,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (response.ok) {
      setSalesList((prevList) =>
        prevList.filter((item) => item.sales_id !== selectedValue.sales_id)
      );
      console.log("delete sales----", salesList);
      refreshList();
    } else {
      console.error("Failed to delete sales");
    }
    console.log(
      "delete api call sales----",
      Url.api + Url.salesDelete + selectedValue
    );
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} />
      <Box sx={{ marginTop: "50px" }}>
        <Grid container spacing={6} sx={{ marginBottom: "10px" }}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Add Sales - {curDate}
                </MDTypography>
              </MDBox>

              <MDBox pt={3}>
                <Add_sales showToast={showToast} refreshList={refreshList} />
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Sales Details
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={true}
                  showTotalEntries={true}
                  noEndBorder
                  showMessage={errorHandling}
                />
                <Edit_sales
                  openEditDialog={openEditDialog}
                  closeDialog={closeDialog}
                  selectedValue={selectedValue}
                  callList={refreshList}
                  showToast={showToast}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        <Dialog open={openDeleteDialog} onClose={closeDialog}>
          <DialogTitle
            sx={{ textAlign: "center", fontSize: 100, color: "red" }}
          >
            <HighlightOff />
          </DialogTitle>
          <DialogContent sx={{ mt: -2, textAlign: "center" }}>
            Are you sure you want to delete ?
            {selectedValue?.sales_items.map((item, index) => (
              <DialogContentText key={index}>
                <b>Category: "{item.category_name}"</b> and{" "}
                <b>Subcategory: "{item.sub_category_name}"</b>
              </DialogContentText>
            ))}
          </DialogContent>
          <DialogActions
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <Button
              onClick={closeDialog}
              sx={{
                backgroundColor: "#9e9e9e",
                color: "#F5F5F5",
                "&:hover": {
                  backgroundColor: "#757575",
                  color: "#F5F5F5",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={deleteSales}
              sx={{
                backgroundColor: "#f44336",
                color: "#F5F5F5",
                "&:hover": {
                  backgroundColor: "#d32f2f",
                  color: "#F5F5F5",
                },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Toast
          open={openToast}
          severity={severityToast}
          message={messageToast}
          handleClose={closeDialog}
        />
        <CustomDialog open={fetchError} onClose={closeDialog}>
          <DialogTitle sx={{ textAlign: "center", fontSize: 80, color: "red" }}>
            <HighlightOff />

            <IconButton
              aria-label="close"
              onClick={closeDialog}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "grey",
                "&:hover": {
                  color: "tomato",
                },
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ textAlign: "center" }}>
              Unable to fetch data
            </Typography>
          </DialogContent>
          {/* <DialogActions sx={{ textAlign: "center" }}>
            <Button
              onClick={closeDialog}
              sx={{
                backgroundColor: "#f44336",
                color: "#F5F5F5",
                "&:hover": {
                  backgroundColor: "#d32f2f",
                  color: "#F5F5F5",
                },
              }}
            >
              Ok
            </Button>
          </DialogActions> */}
        </CustomDialog>

        <View_sales
          openViewDialog={openViewDialog}
          closeDialog={closeDialog}
          selectedValue={selectedValue}
        />
        <Footer />
        <TriangleLoader open={loading} />
      </Box>
    </DashboardLayout>
  );
}

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: 300,
    height: 250,
  },
}));
