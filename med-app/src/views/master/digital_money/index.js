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
import { List_digital } from "./component/list_digital";
import Add_digital from "./component/add_digital";
import Edit_digital from "./component/edit_digital";
export default function Digital_money() {
  // breadcrumbs
  const route = useLocation().pathname.split("/").slice(1);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [digitalList, setDigitalList] = useState([]);
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
  const digital_Data_List = async () => {
    setLoading(true); // Start loading
    await delay(2500);
    let token = localStorage.getItem("token");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 10 seconds timeout

      const response = await fetch(Url.api + Url.digitalList, {
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
        setDigitalList(responseData.result.DigitalPaymentDetails);
        console.log(
          "-------",
          responseData.result.DigitalPaymentDetails.digital_payment_icon
        );
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
    digital_Data_List();
  }, []);

  useEffect(() => {
    const { columns: newColumns, rows: newRows } = List_digital(
      digitalList,
      openEdit,
      openDelete
    );
    setColumns(newColumns);
    setRows(newRows);
  }, [digitalList]);

  // add
  const openAdd = () => {
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

  // refresh
  const refreshList = () => {
    digital_Data_List();
    closeDialog();
  };

  //show Toast
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
    setFetchError(false);
  };
  //toast close
  const closeToast = () => {
    setOpenToast(false);
  };

  // delete call
  const deleteBtn = async () => {
    let token = localStorage.getItem("token");
    const response = await fetch(
      Url.api + Url.digitalDelete + selectedValue.id,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (response.ok) {
      setDigitalList((prevList) =>
        prevList.filter((item) => item.id !== selectedValue.id)
      );
      closeDialog();
    } else {
      console.error("Failed to delete digaital money Data");
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
              Digital Money List
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ color: "whitesmoke", float: "right" }}
              onClick={openAdd}
            >
              Add Digital Money
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
          <Add_digital
            openAddDialog={openAddDialog}
            closeDialog={closeDialog}
            refreshList={refreshList}
            showToast={showToast}
          />
          <Edit_digital
            reloadListPage={refreshList}
            openEdit={openEditDialog}
            showToast={showToast}
            closeDialog={closeDialog}
            selectedValue={selectedValue}
            showMessage={errorHandling}
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
                <b>"{selectedValue?.digital_payment_name}"?</b>
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
            handleClose={closeToast}
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
