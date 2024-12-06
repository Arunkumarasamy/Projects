import styled from "@emotion/styled";
import { Close, HighlightOff } from "@mui/icons-material";
import {
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Card,
} from "@mui/material";
import Url from "Api";
import Footer from "common/Footer";
import DashboardNavbar from "common/Navbars/DashboardNavbar";
import TriangleLoader from "components/Loading/loading";
import DataTable from "components/Tables/DataTable";
import DashboardLayout from "layoutContainers/DashboardLayout";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "common/Breadcrumbs";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { Customer_list } from "./components/customer_list";

export default function Customer_details() {
  const route = useLocation().pathname.split("/").slice(1);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [list, setList] = useState([]);

  const [fetchError, setFetchError] = useState(false);
  const [errorHandling, setErrorHandling] = useState("");
  // Toast state
  const [openToast, setOpenToast] = useState(false);
  const [severityToast, setSeverityToast] = useState("success"); // error, warning, info
  const [messageToast, setMessageToast] = useState("");

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // data list
  const customerList = async () => {
    setLoading(true); // Start loading
    await delay(2500);
    let token = localStorage.getItem("token");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 seconds timeout
      const response = await fetch(Url.api + Url.customerList, {
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

      if (responseData.apiStatus.code == "200") {
        const customer = responseData.result.CustomerData;
        setList(customer);
        console.log("customerDetails Api data -------", customer);
      } else {
        console.log(
          "___API Error customerDetails: " + responseData.apiStatus.message
        );
      }
    } catch (error) {
      setErrorHandling("Service not found");
      setFetchError(true);
      console.log("-----fetch error------");
      setList([]);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    customerList();
    console.log("list ---- pass in api call fun", list);
  }, []);

  useEffect(() => {
    const { columns: newColumns, rows: newRows } = Customer_list(list);
    setColumns(newColumns);
    setRows(newRows);
    console.log("CustomerData List ---in pass to list table ---------", list);
  }, [list]);

  const showToast = (msg, severity) => {
    setMessageToast(msg);
    setSeverityToast(severity);
    setOpenToast(true);
  };

  // close Dialog
  const closeDialog = () => {
    setOpenToast(false);
    setFetchError(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} />
      <Box sx={{ marginTop: "50px" }}>
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
              Customer Details
            </MDTypography>
          </MDBox>
          <MDBox pt={3}>
            <DataTable
              table={{ columns, rows }}
              isSorted={false}
              entriesPerPage={true}
              showTotalEntries={true}
              showMessage={errorHandling}
              noEndBorder
            />
          </MDBox>
        </Card>

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
      </Box>
      <Footer />
      <TriangleLoader open={loading} />
    </DashboardLayout>
  );
}

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: 300, // Set the fixed width (in pixels)
    height: 250, // Set the fixed height (in pixels)
  },
}));
