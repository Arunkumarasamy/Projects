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

export default function Credit(){
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
     
    return(

    )
}