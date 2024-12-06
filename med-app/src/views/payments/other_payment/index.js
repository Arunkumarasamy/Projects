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
  IconButton,
  styled,
} from "@mui/material";
import Breadcrumbs from "common/Breadcrumbs";
import Footer from "common/Footer";
import DashboardNavbar from "common/Navbars/DashboardNavbar";
import DataTable from "components/Tables/DataTable";
import DashboardLayout from "layoutContainers/DashboardLayout";
import { useLocation } from "react-router-dom";
import Add_other from "./components/add_otherpayments";
import { useState, useEffect } from "react";
import { Close, HighlightOff } from "@mui/icons-material";
import Toast from "components/Toast";
import Url from "Api";
import Edit_other from "./components/edit_otherpayments";
import { List_other } from "./components/list_otherpayments";
import TriangleLoader from "components/Loading/loading";

export default function Other_payments() {
  // const { columns, rows } = List_other();
  // breadcrumbs
  const route = useLocation().pathname.split("/").slice(1);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [otherList, setOtherList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedOtherValue, setSelectedOtherValue] = useState(null);
  const [errorHandling, setErrorHandling] = useState("");
  const [fetchError, setFetchError] = useState(false);
  // Toast state
  const [openToast, setOpenToast] = useState(false);
  const [severityToast, setSeverityToast] = useState("success"); // error, warning, info
  const [messageToast, setMessageToast] = useState("");

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  //  data list
  const other_Data_List = async () => {
    setLoading(true); // Start loading
    await delay(2500); // Add a delay of 1000 milliseconds (1 second)

    let token = localStorage.getItem("token");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 10 seconds timeout

      const response = await fetch(Url.api + Url.expenseOtherList, {
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
        setOtherList(responseData.result.expenses);
        console.log("-------", responseData.result.expenses);
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
    other_Data_List();
  }, []);

  useEffect(() => {
    const { columns: newColumns, rows: newRows } = List_other(
      otherList,
      openEdit,
      openDel
    );
    setColumns(newColumns);
    setRows(newRows);
  }, [otherList]);

  const refreshList = () => {
    other_Data_List();
    closeDialog();
  };

  //add other
  const addOthers = () => {
    setOpenDialog(true);
  };

  // edit
  const openEdit = (otherEdit) => {
    setSelectedOtherValue(otherEdit);
    setOpenEditDialog(true);
  };

  const openDel = (otherBill) => {
    setOpenDelete(true);
    setSelectedOtherValue(otherBill);
  };

  const showToast = (msg, severity) => {
    setMessageToast(msg);
    setSeverityToast(severity);
    setOpenToast(true);
  };
  // close DialogBox
  const closeDialog = () => {
    setOpenDialog(false);
    setOpenEditDialog(false);
    setOpenDelete(false);
    setSelectedOtherValue(null);
    setOpenToast(false);
    setFetchError(false);
  };

  const deleteOther = async () => {
    let token = localStorage.getItem("token");
    const response = await fetch(
      Url.api + Url.expenseOtherDelete + selectedOtherValue.id,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (response.ok) {
      setOtherList((prevList) =>
        prevList.filter((item) => item.id !== selectedOtherValue.id)
      );
      closeDialog();
    } else {
      console.error("Failed to delete category");
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
              Expensive Payments List
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ color: "whitesmoke", float: "right" }}
              onClick={addOthers}
            >
              Add Expensive
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
          <Add_other
            openOtherDialog={openDialog}
            closeDialog={closeDialog}
            refreshList={refreshList}
            showToast={showToast}
          />
          <Edit_other
            openEditOtherDialog={openEditDialog}
            closeDialog={closeDialog}
            otherValue={selectedOtherValue}
            callList={refreshList}
            showToast={showToast}
          />

          <Dialog open={openDelete} onClose={closeDialog}>
            <DialogTitle
              sx={{ textAlign: "center", fontSize: 100, color: "red" }}
            >
              <HighlightOff />
            </DialogTitle>
            <DialogContent sx={{ mt: -2, textAlign: "center" }}>
              Are you sure you want to delete
              <DialogContentText>
                <b>"{selectedOtherValue?.expense}"?</b>
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
                onClick={deleteOther}
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
