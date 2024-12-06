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
  createTheme,
  ThemeProvider,
  CssBaseline,
  styled,
} from "@mui/material";
import Footer from "common/Footer";
import DashboardNavbar from "common/Navbars/DashboardNavbar";
import DataTable from "components/Tables/DataTable";
import DashboardLayout from "layoutContainers/DashboardLayout";
import { useState, useEffect } from "react";
import Add_Units from "./component/add_units";
import Breadcrumbs from "common/Breadcrumbs";
import Url from "Api";
import Edit_Units from "./component/edit_units";
import ProgressDialog from "components/Loading";
import { Close, HighlightOff } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import Toast from "components/Toast";
import { Unit_Data_List } from "./component/unit_data_list";
import TriangleLoader from "components/Loading/loading";

export default function Unit() {
  const route = useLocation().pathname.split("/").slice(1);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [list, setList] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [errorHandling, setErrorHandling] = useState("");
  const [fetchError, setFetchError] = useState(false);
  // Toast state
  const [openToast, setOpenToast] = useState(false);
  const [severityToast, setSeverityToast] = useState("success"); // error, warning, info
  const [messageToast, setMessageToast] = useState("");

  const showToast = (msg, severity) => {
    setMessageToast(msg);
    setSeverityToast(severity);
    setOpenToast(true);
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const unitList = async (e) => {
    // e.preventDefault();
    setLoading(true); // Start loading
    await delay(2500);

    let token = localStorage.getItem("token");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 10 seconds timeout

      const response = await fetch(Url.api + Url.unitList, {
        method: "POST",
        headers: {
          "content-type": "appilication/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          pageIndex: 0,
          dataLength: 10,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responceData = await response.json();
      console.log(responceData);
      if (responceData.apiStatus.code == "200") {
        setList(responceData.result.UnitData);
        // setErrorHandling("no data found");
      } else {
        console.log("error");
        // showToast(responceData.apiStatus.message, "error");
      }
    } catch (error) {
      setErrorHandling("Service not found");
      // showToast("Request timed out. Please try again.", "error");
      setFetchError(true);
      console.log("Error handled =" + error);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    unitList();
  }, []);

  useEffect(() => {
    const { columns: newColumns, rows: newRows } = Unit_Data_List(
      list,
      edit_units_description,
      openDel
    );
    setColumns(newColumns);
    setRows(newRows);
  }, [list]);

  // call refresh
  const refreshList = () => {
    unitList();
    closeDialog();
  };

  // creat
  const create_units_description = () => {
    setOpenDialog(true);
  };
  const edit_units_description = (unit) => {
    setSelectedUnit(unit);
    setEditDialog(true);
  };
  const openDel = (unit) => {
    setOpenDelete(true);
    setSelectedUnit(unit);
  };

  // close
  const closeDialog = () => {
    setOpenDialog(false);
    setEditDialog(false);
    setOpenDelete(false);
    setSelectedUnit(null);
    setOpenToast(false);
    setFetchError(false);
  };

  const deleteUnit = async () => {
    // if (!selectedUnit) return;
    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.unitDelete + selectedUnit.id, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (response.ok) {
      setList((prevList) =>
        prevList.filter((item) => item.id !== selectedUnit.id)
      );
      closeDialog();
    } else {
      console.error("Failed to delete unit");
    }
  };
  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <Breadcrumbs
          icon="home"
          title={route[route.length - 1]}
          route={route}
        />
        <Box sx={{ marginTop: "30px", marginBottom: "30px" }}>
          <Paper elevation={4}>
            <div
              className="unit_page_header"
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
                Unit List
              </Typography>

              <Button
                variant="contained"
                color="primary"
                onClick={create_units_description}
                sx={{
                  color: "whitesmoke",
                  float: "right",
                  // marginRight: "5px",
                }}
              >
                Add Units
              </Button>
            </div>

            <DataTable
              table={{ columns, rows }}
              isSorted={false}
              entriesPerPage={true}
              showTotalEntries={true}
              loading={loading}
              fetchError={fetchError}
              errorHandling={errorHandling}
              // showMessage={errorHandling}
              noEndBorder
            />
            <Add_Units
              openDialog={openDialog}
              closeDialogbox={closeDialog}
              refreshList={refreshList}
              showToast={showToast}
            />
            <Edit_Units
              editDialog={editDialog}
              closeEditDialogbox={closeDialog}
              units={selectedUnit}
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
                  <b>{selectedUnit?.UnitName}?</b>
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
                  onClick={deleteUnit}
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
        </Box>
        <Footer />
        <TriangleLoader open={loading} />
      </DashboardLayout>
    </>
  );
}

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: 300, // Set the fixed width (in pixels)
    height: 250, // Set the fixed height (in pixels)
  },
}));
