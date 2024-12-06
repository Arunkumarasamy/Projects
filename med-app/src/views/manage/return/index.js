import styled from "@emotion/styled";
import { Close, HighlightOff } from "@mui/icons-material";
import {
  Paper,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
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
import { OverAll_return_list } from "./components/overall_return_list";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

export default function Return() {
  const route = useLocation().pathname.split("/").slice(1);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [overAllData, setOverAllData] = useState([]);
  const [errorHandling, setErrorHandling] = useState("");
  const [fetchError, setFetchError] = useState(false);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const listApiCall = async () => {
    setLoading(true); // Start loading
    await delay(2500);

    let token = localStorage.getItem("token");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 seconds timeout

      const response = await fetch(Url.api + Url.overAllReturn, {
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
      if (responseData.apiStatus.code == "200") {
        setOverAllData(responseData.result.ReturnData);
      } else {
        console.log("error");
      }
    } catch (error) {
      setErrorHandling("Service not found");
      setFetchError(true);
      console.log("fetch error");
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    listApiCall();
  }, []);

  useEffect(() => {
    const { columns: newColumns, rows: newRows } =
      OverAll_return_list(overAllData);
    setColumns(newColumns);
    setRows(newRows);
  }, [overAllData]);

  // close
  const closeDialog = () => {
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
              Return Details
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
    width: 300,
    height: 250,
  },
}));
