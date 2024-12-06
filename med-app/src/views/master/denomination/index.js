import {
  Box,
  Button,
  Paper,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  styled,
  IconButton,
} from "@mui/material";
import Breadcrumbs from "common/Breadcrumbs";
import Footer from "common/Footer";
import DashboardNavbar from "common/Navbars/DashboardNavbar";
import DataTable from "components/Tables/DataTable";
import DashboardLayout from "layoutContainers/DashboardLayout";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Close, HighlightOff } from "@mui/icons-material";
import Toast from "components/Toast";
import Url from "Api";
import TriangleLoader from "components/Loading/loading";
import { List_denomination } from "./component/list_denomination";
import Add_denomination from "./component/add_denomination";
import Edit_denomination from "./component/edit_denomination";
export default function Denomination() {
  // breadcrumbs
  const route = useLocation().pathname.split("/").slice(1);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [denominationList, setDenominationList] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [errorHandling, setErrorHandling] = useState("");
  const [fetchError, setFetchError] = useState(false);

  // Toast state
  const [openToast, setOpenToast] = useState(false);
  const [severityToast, setSeverityToast] = useState("success"); // error, warning, info
  const [messageToast, setMessageToast] = useState("");

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // data list
  const denomination_Data_List = async () => {
    setLoading(true); // Start loading
    await delay(2500);

    let token = localStorage.getItem("token");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 10 seconds timeout

      const response = await fetch(Url.api + Url.denominationList, {
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
        setDenominationList(responseData.result.CurrencyData);
        console.log("-------", responseData.result.CurrencyData);
      } else {
        console.log("error");
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
    denomination_Data_List();
  }, []);

  useEffect(() => {
    const { columns: newColumns, rows: newRows } = List_denomination(
      denominationList,
      openEdit,
      openDelete
    );
    setColumns(newColumns);
    setRows(newRows);
  }, [denominationList]);

  // add
  const addDenomination = () => {
    setOpenAddDialog(true);
  };

  // edit
  const openEdit = (id) => {
    setOpenEditDialog(true);
    setSelectedValue(id);
  };

  // delete
  const openDelete = (id) => {
    setOpenDeleteDialog(true);
    setSelectedValue(id);
  };

  const refreshList = () => {
    denomination_Data_List();
    closeDialog();
  };

  const showToast = (msg, severity) => {
    setMessageToast(msg);
    setSeverityToast(severity);
    setOpenToast(true);
  };
  // close
  const closeDialog = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setSelectedValue(null);
    setOpenToast(false);
    setFetchError(false);
  };

  const deleteBtn = async () => {
    let token = localStorage.getItem("token");
    const response = await fetch(
      Url.api + Url.denominationDelete + selectedValue.id,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (response.ok) {
      setDenominationList((prevList) =>
        prevList.filter((item) => item.id !== selectedValue.id)
      );
      closeDialog();
      // vendor_Data_List();
    } else {
      console.error("Failed to delete denomination Data");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} />
      <Box sx={{ marginTop: "50px" }}>
        <Paper elevation={3} sx={{ mb: 5 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <Typography
              component="h6"
              sx={{
                color: "#344767",
                fontWeight: 600,
                lineHeight: 1.625,

                fontSize: "1rem",
              }}
            >
              Denomination List
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ color: "whitesmoke", float: "right" }}
              onClick={addDenomination}
            >
              Add Denomination
            </Button>
          </div>
          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            entriesPerPage={true}
            showTotalEntries={true}
            showMessage={errorHandling}
            noEndBorder
          />
          <Add_denomination
            closeDialog={closeDialog}
            showToast={showToast}
            openAddDialog={openAddDialog}
            refreshList={refreshList}
          />
          <Edit_denomination
            callList={refreshList}
            selectedValue={selectedValue}
            showToast={showToast}
            openEditDialog={openEditDialog}
            closeDialog={closeDialog}
          />

          <Dialog open={openDeleteDialog} onClose={closeDialog}>
            <DialogTitle
              sx={{ textAlign: "center", fontSize: 100, color: "red" }}
            >
              <HighlightOff />
            </DialogTitle>
            <DialogContent sx={{ mt: -2, textAlign: "center" }}>
              Are you sure you want to delete
              <DialogContentText>
                <b>"{selectedValue?.denomination_value}"?</b>
              </DialogContentText>
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
                onClick={deleteBtn}
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
            <DialogTitle
              sx={{ textAlign: "center", fontSize: 80, color: "red" }}
            >
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
        </Paper>
        <Footer />
        <TriangleLoader open={loading} />
      </Box>
    </DashboardLayout>
  );
}

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: 300, // Set the fixed width (in pixels)
    height: 250, // Set the fixed height (in pixels)
  },
}));
