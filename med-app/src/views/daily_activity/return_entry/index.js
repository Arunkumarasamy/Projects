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
import TriangleLoader from "components/Loading/loading";
import DataTable from "components/Tables/DataTable";
import Toast from "components/Toast";
import DashboardLayout from "layoutContainers/DashboardLayout";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Add_return from "./components/add_return";
import { List_return } from "./components/list_return";
import Url from "Api";
import { Close, HighlightOff } from "@mui/icons-material";
import Edit_return from "./components/edit_return";

export default function Return_entry() {
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [list, setList] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [errorHandling, setErrorHandling] = useState("");
  const [fetchError, setFetchError] = useState(false);

  // Toast state
  const [openToast, setOpenToast] = useState(false);
  const [severityToast, setSeverityToast] = useState("success"); // error, warning, info
  const [messageToast, setMessageToast] = useState("");

  // bread crumbs
  const route = useLocation().pathname.split("/").slice(1);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // list call
  const return_List = async () => {
    setLoading(true); // Start loading
    await delay(2500);

    let token = localStorage.getItem("token");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 seconds timeout

      const response = await fetch(Url.api + Url.currentReturnList, {
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
        setList(responseData.result.ReturnDetails); //---BE changes
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
    return_List();
  }, []);

  useEffect(() => {
    const { columns: newColumns, rows: newRows } = List_return(
      list,
      openEdit,
      openDel
    );
    setColumns(newColumns);
    setRows(newRows);
  }, [list]);

  const refreshList = () => {
    return_List();
    closeDialog();
  };

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
  const openDel = (id) => {
    setOpenDelete(true);
    setSelectedValue(id);
  };

  const showToast = (msg, severity) => {
    setMessageToast(msg);
    setSeverityToast(severity);
    setOpenToast(true);
  };
  const closeDialog = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setOpenDelete(false);
    setOpenToast(false);
    setSelectedValue(null);
    setFetchError(false);
  };

  const deleteReturn = async () => {
    let token = localStorage.getItem("token");
    const response = await fetch(
      Url.api + Url.returnDelete + selectedValue.ReturnId,
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
        prevList.filter((item) => item.ReturnId !== selectedValue.ReturnId)
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
      <Box mt={5}>
        <Paper elevation={3} mb={5}>
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
              Return_entry List
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ color: "whitesmoke", float: "right" }}
              onClick={openAdd}
            >
              Add Return_entry
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
          <Add_return
            addDialog={openAddDialog}
            closeDialog={closeDialog}
            refreshList={refreshList}
            showToast={showToast}
          />
          <Edit_return
            openEdit={openEditDialog}
            closeDialog={closeDialog}
            selectedValue={selectedValue}
            showToast={showToast}
            callList={refreshList}
          />
          <Toast
            open={openToast}
            severity={severityToast}
            message={messageToast}
            handleClose={closeDialog}
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
                <b>"{selectedValue?.SalesId}"?</b>
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
                onClick={deleteReturn}
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
        <TriangleLoader open={loading} />
      </Box>
      <Footer />
    </DashboardLayout>
  );
}

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: 300, // Set the fixed width (in pixels)
    height: 250, // Set the fixed height (in pixels)
  },
}));
