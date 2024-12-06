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
  IconButton,
  styled,
} from "@mui/material";
import DataTable from "components/Tables/DataTable";
import { useState, useEffect } from "react";
import Subcategory_Fields from "./component/add_subcategory";
import View_subcategory from "./component/view_subcategory";
import Toast from "components/Toast";
import ProgressDialog from "components/Loading";
import { Close, HighlightOff } from "@mui/icons-material";
import Edit_subcategory from "./component/edit_subcategory";
import Url from "Api";
import { Subcategory_List } from "./component/subcategory_list";
import TriangleLoader from "components/Loading/loading";

export default function Subcategory() {
  // this breadcrumbs routes
  const route = useLocation().pathname.split("/").slice(1);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [list, setList] = useState([]);
  const [selectSubCategory, setSelectSubCategory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [errorHandling, setErrorHandling] = useState("");
  const [fetchError, setFetchError] = useState(false);

  const [openToast, setOpenToast] = useState(false);
  const [severityToast, setSeverityToast] = useState("success"); // error, warning, info
  const [messageToast, setMessageToast] = useState("");

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const subCategoryList = async (e) => {
    setLoading(true); // Start loading
    await delay(2500);

    let token = localStorage.getItem("token");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 seconds timeout
      const response = await fetch(Url.api + Url.subCategoryList, {
        method: "POST",
        headers: {
          "content-type": "appilication/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          pageIndex: 0,
          dataLength: 100,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const responceData = await response.json();
      console.log(responceData);

      if (responceData.apiStatus.code == "200") {
        setList(responceData.result.SubCategoryData);
      } else {
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
    subCategoryList();
  }, []);

  useEffect(() => {
    const { columns: newColumns, rows: newRows } = Subcategory_List(
      list,
      edit_subCategory,
      openDel,
      view_subCategory
    );
    setColumns(newColumns);
    setRows(newRows);
  }, [list]);

  // reloading page
  const reloading = () => {
    subCategoryList();
    closeDialog();
  };

  // create
  const create_subcategory = () => {
    setOpenDialog(true);
  };
  // edit
  const edit_subCategory = (subcatId) => {
    setOpenEdit(true);
    setSelectSubCategory(subcatId);
    console.log("subcat id-----", setSelectSubCategory(subcatId));
  };

  // view
  const view_subCategory = (id) => {
    setOpenView(true);
    setSelectSubCategory(id);
    console.log("selected view from subcategory------", id);
    console.log("btn has clicked");
  };
  // delete
  const openDel = (subcat) => {
    setOpenDelete(true);
    setSelectSubCategory(subcat);
  };
  // Toast
  const showToast = (msg, severity) => {
    setMessageToast(msg);
    setSeverityToast(severity);
    setOpenToast(true);
  };

  // close
  const closeDialog = () => {
    setOpenDelete(false);
    setSelectSubCategory(null);
    setOpenDialog(false);
    setOpenView(false);
    setOpenEdit(false);
    setOpenToast(false);
    setFetchError(false);
  };

  // delete api call
  const deleteCategory = async () => {
    let token = localStorage.getItem("token");
    const response = await fetch(
      Url.api + Url.subCategoryDelete + selectSubCategory.Id,
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
        prevList.filter((item) => item.Id !== selectSubCategory.Id)
      );
      closeDialog();
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
              Subcategory List
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ color: "whitesmoke", float: "right" }}
              onClick={create_subcategory}
            >
              Add Subcategory
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
          <Subcategory_Fields
            openDialog={openDialog}
            closeDialogbox={closeDialog}
            reloadListPage={reloading}
            showToast={showToast}
          />
          <Edit_subcategory
            openEdit={openEdit}
            closeDialogbox={closeDialog}
            subCategoryData={selectSubCategory}
            reloadListPage={reloading}
            showToast={showToast}
          />
          <View_subcategory
            openViewDialog={openView}
            closeDialog={closeDialog}
            subCategoryID={selectSubCategory}
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
                <b>"{selectSubCategory?.SubCategoryName}"?</b>
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
                onClick={deleteCategory}
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
