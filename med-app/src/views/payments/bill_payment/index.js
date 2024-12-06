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
import Add_bill from "./components/add_billpayments";
import { useState, useEffect } from "react";
import Edit_bill from "./components/edit_billpayments";
import Url from "Api";
import { Close, HighlightOff } from "@mui/icons-material";
import Toast from "components/Toast";
import { List_bill } from "./components/list_billpayments";
import TriangleLoader from "components/Loading/loading";
import View_billPayment from "./components/view_billPayments";

function Bill_payments() {
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [list, setList] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [errorHandling, setErrorHandling] = useState("");
  const [fetchError, setFetchError] = useState(false);
  // Toast state
  const [openToast, setOpenToast] = useState(false);
  const [severityToast, setSeverityToast] = useState("success"); // error, warning, info
  const [messageToast, setMessageToast] = useState("");

  // breadcrumbs
  const route = useLocation().pathname.split("/").slice(1);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // category data list
  const bill_Data_List = async () => {
    setLoading(true); // Start loading
    // Add a delay of 1000 milliseconds (1 second)
    await delay(2500);

    let token = localStorage.getItem("token");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 10 seconds timeout

      const response = await fetch(Url.api + Url.expenseBillList, {
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
        setList(responseData.result.expenses); //---BE changes
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
    bill_Data_List();
  }, []);

  useEffect(() => {
    const { columns: newColumns, rows: newRows } = List_bill(
      list,
      openEdit,
      openDel,
      openView
    );
    setColumns(newColumns);
    setRows(newRows);
  }, [list]);

  const refreshList = () => {
    bill_Data_List();
    closeDialog();
  };

  // create
  const create_bill = () => {
    setOpenAddDialog(true);
  };

  // edit
  const openEdit = (billId) => {
    setSelectedValue(billId);
    setOpenEditDialog(true);
    // console.log("selected value------", selectedValue);
    // console.log("---------billId", billId);
  };

  //view
  const openView = (id) => {
    setSelectedValue(id);
    setOpenViewDialog(true);
    console.log("selected value Bill viwe------", selectedValue);
    console.log("Selected ID for Bill viewPage:-----", id);
  };

  // delete
  const openDel = (billNo) => {
    setOpenDelete(true);
    setSelectedValue(billNo);
  };

  // close
  const closeDialog = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setOpenDelete(false);
    setOpenToast(false);
    setOpenViewDialog(false);
    setSelectedValue(null);
    setFetchError(false);
  };

  const showToast = (msg, severity) => {
    setMessageToast(msg);
    setSeverityToast(severity);
    setOpenToast(true);
  };

  const deleteBill = async () => {
    let token = localStorage.getItem("token");
    const response = await fetch(
      Url.api + Url.expenseBillDelete + selectedValue.id,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (response.ok) {
      setList((prevList) =>
        prevList.filter((item) => item.id !== selectedValue.id)
      );
      closeDialog();
    } else {
      console.error("Failed to delete Billpayment");
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
              Bill Payments List
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ color: "whitesmoke", float: "right" }}
              onClick={create_bill}
            >
              Add Billpayment
            </Button>
          </div>

          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            entriesPerPage={true}
            showTotalEntries={true}
            noEndBorder
            showMessage={errorHandling}
          />

          <Add_bill
            openBillDialog={openAddDialog}
            closeDialog={closeDialog}
            refreshList={refreshList}
            showToast={showToast}
          />

          <Edit_bill
            openDialogEdit={openEditDialog}
            closeDialog={closeDialog}
            selectedValue={selectedValue}
            callList={refreshList}
            showToast={showToast}
          />
          <View_billPayment
            openViewDialog={openViewDialog}
            closeDialog={closeDialog}
            selectedValue={selectedValue}
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
                <b>"{selectedValue?.vendorName}"?</b>
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
                onClick={deleteBill}
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
export default Bill_payments;

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: 300, // Set the fixed width (in pixels)
    height: 250, // Set the fixed height (in pixels)
  },
}));
