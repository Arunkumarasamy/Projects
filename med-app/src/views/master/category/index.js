import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
  styled,
} from "@mui/material";
import Breadcrumbs from "common/Breadcrumbs";
import Footer from "common/Footer";
import DashboardNavbar from "common/Navbars/DashboardNavbar";
import DataTable from "components/Tables/DataTable";
import DashboardLayout from "layoutContainers/DashboardLayout";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Add_Category from "./components/add_category";
import Url from "Api";
import ProgressDialog from "components/Loading";
import { List_Category } from "./components/list_category";
import Edit_Category from "./components/edit_category";
import { Close, HighlightOff } from "@mui/icons-material";
import Toast from "components/Toast";
import TriangleLoader from "components/Loading/loading";

function Category() {
  const route = useLocation().pathname.split("/").slice(1);
  const [loading, setLoading] = useState(false);

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectCategory, setSelectCategory] = useState(null);
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

  const fetchData = async () => {
    setLoading(true); // Start loading
    await delay(2500);
    let token = localStorage.getItem("token");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(Url.api + Url.categoryList, {
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
      if (responseData.apiStatus.code === "200") {
        setCategoryList(responseData.result.categoryData); //---BE changes
      } else {
        setFetchError(true); // Set fetchError to true in case of an error
        console.log("error");
      }
    } catch (error) {
      setFetchError(true);
      setErrorHandling("Service not found");
      console.log("fetch error");
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const { columns: newColumns, rows: newRows } = List_Category(
      categoryList,
      editCategory,
      openDel
    );
    setColumns(newColumns);
    setRows(newRows);
  }, [categoryList]);

  const refreshList = () => {
    fetchData();
    closeDialog();
  };

  const add_category = () => {
    setOpenAddDialog(true);
  };

  const editCategory = (categoryEdt) => {
    setSelectCategory(categoryEdt);
    setOpenEditDialog(true);
  };

  const openDel = (cate) => {
    setOpenDelete(true);
    setSelectCategory(cate);
  };

  const closeDialog = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setOpenDelete(false);
    setSelectCategory(null);
    setOpenToast(false);
    setFetchError(false);
  };

  const deleteCategory = async () => {
    let token = localStorage.getItem("token");
    const response = await fetch(
      Url.api + Url.categoryDelete + selectCategory.id,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (response.ok) {
      setCategoryList((prevList) =>
        prevList.filter((item) => item.id !== selectCategory.id)
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
      <Box sx={{ marginTop: "30px", marginBottom: "30px" }}>
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
              Category List
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={add_category}
              sx={{
                color: "whitesmoke",
              }}
            >
              Add Category
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
            noEndBorder
          />
          <Add_Category
            openDialog={openAddDialog}
            closeDialogbox={closeDialog}
            refreshList={refreshList}
            showToast={showToast}
          />
          <Edit_Category
            openDialog={openEditDialog}
            closeDialogbox={closeDialog}
            categoryValue={selectCategory}
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
                <b>"{selectCategory?.CategoryName}"?</b>
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
      </Box>
      <Footer />
      <TriangleLoader open={loading} />
    </DashboardLayout>
  );
}

export default Category;

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: 300, // Set the fixed width (in pixels)
    height: 250, // Set the fixed height (in pixels)
  },
}));
