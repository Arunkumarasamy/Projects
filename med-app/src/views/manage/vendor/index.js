import Breadcrumbs from "common/Breadcrumbs";
import Footer from "common/Footer";
import DashboardNavbar from "common/Navbars/DashboardNavbar";
import DashboardLayout from "layoutContainers/DashboardLayout";
import { useLocation } from "react-router-dom";
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
import DataTable from "components/Tables/DataTable";
import { useState, useEffect } from "react";
import Url from "Api";
import Add_vendor from "./components/add_vendor";
// import List_vendor from "./components/list_vendor";
import View_vendor from "./components/view_vendor";
import ProgressDialog from "components/Loading";
import Edit_vendor from "./components/edit_vendor";
import { Close, HighlightOff } from "@mui/icons-material";
import Toast from "components/Toast";
import { List_vendor } from "./components/list_vendor";
import TriangleLoader from "components/Loading/loading";

export default function Vendor() {
  // this breadcrumbs routes
  const route = useLocation().pathname.split("/").slice(1);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedValue, setSelectedvalue] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [errorHandling, setErrorHandling] = useState("");
  const [fetchError, setFetchError] = useState(false);

  // Toast state
  const [openToast, setOpenToast] = useState(false);
  const [severityToast, setSeverityToast] = useState("success"); // error, warning, info
  const [messageToast, setMessageToast] = useState("");

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Vendor data list
  const vendor_Data_List = async () => {
    setLoading(true); // Start loading
    await delay(2500);

    let token = localStorage.getItem("token");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 seconds timeout
      const response = await fetch(Url.api + Url.vendorList, {
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
        setList(responseData.result.VendorData); //---BE changes
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
    vendor_Data_List();
  }, []);

  useEffect(() => {
    const { columns: newColumns, rows: newRows } = List_vendor(
      list,
      openView,
      openEdit,
      openDel
    );
    setColumns(newColumns);
    setRows(newRows);
  }, [list]);

  const refreshList = () => {
    vendor_Data_List();
    closeDialog();
  };

  // create
  const create_vendor = () => {
    setOpenAddDialog(true);
  };
  // edit
  const openEdit = (vendorId) => {
    setOpenEditDialog(true);
    setSelectedvalue(vendorId);
    console.log("selected value------", setSelectedvalue(vendorId));
  };
  // view
  const openView = (id) => {
    setSelectedvalue(id);
    setOpenViewDialog(true);
  };

  // delete

  const openDel = (vendor) => {
    setOpenDelete(true);
    setSelectedvalue(vendor);
  };

  // close
  const closeDialog = () => {
    setOpenAddDialog(false);
    setOpenViewDialog(false);
    setSelectedvalue(null);
    setOpenDelete(false);
    setOpenToast(false);
    setOpenEditDialog(false);
    setFetchError(false);
  };

  const showToast = (msg, severity) => {
    setMessageToast(msg);
    setSeverityToast(severity);
    setOpenToast(true);
  };

  const deleteVendor = async () => {
    let token = localStorage.getItem("token");
    const response = await fetch(
      Url.api + Url.vendorDelete + selectedValue.VendorId,
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
        prevList.filter((item) => item.VendorId !== selectedValue.VendorId)
      );
      closeDialog();
      // vendor_Data_List();
    } else {
      console.error("Failed to delete subcategory");
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
              Vendor List
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ color: "whitesmoke", float: "right" }}
              onClick={create_vendor}
            >
              Add Vendor
            </Button>
          </div>
          <Add_vendor
            openDialog={openAddDialog}
            closeDialogBox={closeDialog}
            refreshList={refreshList}
            showToast={showToast}
          />
          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            entriesPerPage={true}
            showTotalEntries={true}
            showMessage={errorHandling}
            noEndBorder
          />
          <View_vendor
            openViewDialog={openViewDialog}
            closeDialog={closeDialog}
            selectedValue={selectedValue}
          />
          <Edit_vendor
            openDialog={openEditDialog}
            closeDialogBox={closeDialog}
            selectedValue={selectedValue}
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
                <b>"{selectedValue?.VendorName}"?</b>
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
                onClick={deleteVendor}
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
