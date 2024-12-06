import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import Url from "Api";
import Toast from "components/Toast";
import React, { useEffect, useState } from "react";

function Edit_Category({
  openDialog,
  closeDialogbox,
  categoryValue,
  callList,
  showToast,
}) {
  const [categoryNames, setCategoryNames] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const [ids, setIds] = useState("");
  const [errors, setErrors] = useState({
    category: false,
    // description: false,
  });

  // validation error

  const validateFields = () => {
    const newErrors = {
      category: !categoryNames,
      // description: !descriptions,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  // update the Category

  useEffect(() => {
    if (categoryValue) {
      setCategoryNames(categoryValue.CategoryName);
      setDescriptions(categoryValue.Description);
      setIds(categoryValue.id);
    }
  }, [categoryValue]);

  const updateButton = async (eve) => {
    if (!validateFields()) {
      return;
    }
    eve.preventDefault();
    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.categoryEdit, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        id: ids,
        categoryName: categoryNames,
        description: descriptions,
      }),
    });
    try {
      const responceData = await response.json();
      console.log(responceData);
      if (responceData.apiStatus.code === "200") {
        callList();
        showToast(responceData.apiStatus.message, "success");
      } else {
        showToast(responceData.apiStatus.message, "error");
        console.log(responceData.apiStatus.message, "error");
      }
    } catch (err) {
      console.log("error from " + err);
    }
  };

  const closeDialog = () => {
    closeDialogbox();
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Dialog open={openDialog} onClose={closeDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Typography>Edit Category</Typography>
            <IconButton
              aria-label="close"
              onClick={closeDialog}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey.main,
                "&:hover": {
                  color: (theme) => theme.palette.tomato.main,
                },
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <Box mb={2} mt={3}>
              <TextField
                label="Category Name"
                // onChange={(e) => setCategoryNames(e.target.value)}
                onChange={(e) => {
                  const value = e.target.value;
                  setCategoryNames(value);
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    category: value.trim() === "",
                  }));
                }}
                fullWidth
                required
                autoFocus
                value={categoryNames}
                error={errors.category}
                helperText={errors.category ? "Category Name is required" : ""}
              />
            </Box>
            <TextField
              label="Description"
              onChange={(e) => setDescriptions(e.target.value)}
              fullWidth
              multiline
              rows={4}
              value={descriptions}
              // error={errors.description}
              // helperText={errors.description ? "Description is required" : ""}
            />
            <Stack direction="row" justifyContent="center" gap="10px" mt={5}>
              <Button
                variant="contained"
                sx={{
                  color: "white",
                  backgroundColor: "grey",
                  "&:hover": { backgroundColor: "darkgrey" },
                }}
                onClick={closeDialog}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={updateButton}
              >
                Update
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      </ThemeProvider>
    </>
  );
}

export default Edit_Category;

const theme = createTheme({
  palette: {
    success: {
      main: "#4caf50",
      contrastText: "#ffffff",
    },
    remove: {
      main: "red",
      contrastText: "#FF6347",
    },
    grey: {
      main: "#9e9e9e",
      contrastText: "#ffffff",
    },

    tomato: {
      main: "#FF6347",
    },
  },
});
