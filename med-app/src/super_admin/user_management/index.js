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
import Breadcrumbs from "common/Breadcrumbs";
import DashboardNavbar from "common/Navbars/DashboardNavbar";
import DashboardLayout from "layoutContainers/DashboardLayout";
import DataTable from "components/Tables/DataTable";
import Footer from "common/Footer";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Add_user from "./components/add_user";
import Url from "Api";
import Toast from "components/Toast";
import TriangleLoader from "components/Loading/loading";
import Edit_user from "./components/edit_user";
import { HighlightOff } from "@mui/icons-material";
import { List_user } from "./components/list_user";

export default function User() {
  const route = useLocation().pathname.split("/").slice(1);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [userList, setUserList] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  // Toast state
  const [openToast, setOpenToast] = useState(false);
  const [severityToast, setSeverityToast] = useState("success"); // error, warning, info
  const [messageToast, setMessageToast] = useState("");
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // list
  const user_list = async (e) => {
    setLoading(true);
    await delay(2500);
    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.userList, {
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
        setUserList(responseData.result.UserData);
      } else {
        console.log("error");
      }
    } catch (err) {
      console.log("error from fetch" + err);
    } finally {
      setLoading(false); // End loading
    }
  };
  console.log("this userlist Api-----", Url.api + Url.userList);
  useEffect(() => {
    user_list();
  }, []);

  useEffect(() => {
    const { columns: newColumns, rows: newRows } = List_user(
      userList,
      openEdit,
      openDelete
    );
    setColumns(newColumns);
    setRows(newRows);
  }, [userList]);

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

  // refresh page
  const refreshList = () => {
    user_list();
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
    setOpenToast(false);
    setSelectedValue(null);
  };

  // delete call
  const deleteUser = async (eve) => {
    eve.preventDefault();
    let token = localStorage.getItem("token");
    console.log("this token", token);
    const response = await fetch(
      Url.api + Url.userDelete + selectedValue.user_id,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (response.ok) {
      setUserList((prevList) =>
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
              User List
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
              Add User
            </Button>
          </div>
          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            entriesPerPage={true}
            showTotalEntries={true}
            noEndBorder
          />
          <Add_user
            openAddUserDialog={openAddDialog}
            closeDialogBox={closeDialog}
            setRefresh={refreshList}
            showToast={showToast}
          />
          <Edit_user
            openEditUserDialog={openEditDialog}
            closeDialogBox={closeDialog}
            userUpdateData={selectedValue}
            showToast={showToast}
            callList={refreshList}
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
                <b>"{selectedValue?.user_name}"?</b>
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
                onClick={deleteUser}
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
        </Paper>
        <Footer />
        <TriangleLoader open={loading} />
      </Box>
    </DashboardLayout>
  );
}
