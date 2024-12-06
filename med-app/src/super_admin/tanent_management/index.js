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
} from "@mui/material";
import Footer from "common/Footer";
import Breadcrumbs from "common/Breadcrumbs";
import DashboardNavbar from "common/Navbars/DashboardNavbar";
import DataTable from "components/Tables/DataTable";
import DashboardLayout from "layoutContainers/DashboardLayout";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { HighlightOff } from "@mui/icons-material";
import { List_tenant } from "./components/list_tanent";
import Edit_tanent from "./components/edit_tanent";
import View_tenant from "./components/view_tanent";
import Toast from "components/Toast";
import TriangleLoader from "components/Loading/loading";
import Url from "Api";
import AddTenant from "./components/add_tanent";

export default function Tenant() {
  // breadcrumbs
  const route = useLocation().pathname.split("/").slice(1);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [tanentList, setTanentList] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  // Toast state
  const [openToast, setOpenToast] = useState(false);
  const [severityToast, setSeverityToast] = useState("success"); // error, warning, info
  const [messageToast, setMessageToast] = useState("");

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // List data
  const tanent_list = async (e) => {
    setLoading(true); // Start loading
    await delay(2500);
    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.tenantList, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        pageIndex: 0,
        dataLength: 10,
      }),
    });
    try {
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.apiStatus.code == "200") {
        setTanentList(responseData.result.tenantData);
      } else {
        console.log("error");
      }
    } catch (err) {
      console.log("error from fetch" + err);
    } finally {
      setLoading(false); // End loading
    }
  };
  console.log("this tenantList api -----", Url.api + Url.tenantList);
  useEffect(() => {
    tanent_list();
  }, []);

  useEffect(() => {
    const { columns: newColumns, rows: newRows } = List_tenant(
      tanentList,
      openEdit,
      openDelete,
      openView
    );
    setColumns(newColumns);
    setRows(newRows);
  }, [tanentList]);

  // create
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

  // view
  const openView = (id) => {
    setSelectedValue(id);
    setOpenViewDialog(true);
    console.log("tenant view id----", id);
  };

  // refresh page
  const refreshList = () => {
    tanent_list();
    closeDialog();
  };
  // show toast
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
    setOpenViewDialog(false);
    setSelectedValue(null);
  };

  //toast close
  const closeToast = () => {
    setOpenToast(false);
  };

  // delete call
  const deleteTenant = async (eve) => {
    eve.preventDefault();
    let token = localStorage.getItem("token");
    console.log("this token", token);
    const response = await fetch(
      Url.api + Url.tenantDelete + selectedValue.id,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (response.ok) {
      setTanentList((prevList) =>
        prevList.filter((item) => item.id !== selectedValue.id)
      );
      closeDialog();
    } else {
      console.error("Failed to delete user");
      console.log("error", selectedValue);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} />
      <Box sx={{ marginTop: "30px" }}>
        <Paper elevation={4}>
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
              Tenant List
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={openAdd}
              sx={{
                color: "whitesmoke",
                float: "right",
              }}
            >
              Add Tenant
            </Button>
          </div>
          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            entriesPerPage={true}
            showTotalEntries={true}
            noEndBorder
          />
          <AddTenant
            openDialogAddTenant={openAddDialog}
            closeDialog={closeDialog}
            refreshList={refreshList}
            showToast={showToast}
          />

          <Edit_tanent
            openEdittenant={openEditDialog}
            closeDialogbox={closeDialog}
            tenantData={selectedValue}
            showToast={showToast}
            callList={refreshList}
          />

          <View_tenant
            openViewDialog={openViewDialog}
            closeDialogbox={closeDialog}
            tenantId={selectedValue}
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
                <b>"{selectedValue?.tenant_name}"?</b>
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
                onClick={deleteTenant}
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
        </Paper>
        <Footer />
        <TriangleLoader open={loading} />
      </Box>
    </DashboardLayout>
  );
}
