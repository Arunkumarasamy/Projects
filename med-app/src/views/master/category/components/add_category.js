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
import React, { useState } from "react";

function Add_Category({ openDialog, closeDialogbox, refreshList, showToast }) {
  // add Category
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({
    category: false,
    // description: false,
  });

  // validation error

  const validateFields = () => {
    const newErrors = {
      category: categoryName.trim() === "",
      // description: description.trim() === "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const saveCategory = async (eve) => {
    if (!validateFields()) {
      return;
    }
    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.categoryCreate, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        categoryName: categoryName,
        description: description,
      }),
    });
    try {
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.apiStatus.code == "200") {
        setCategoryName("");
        setDescription("");
        refreshList();
        showToast(responseData.apiStatus.message, "success");
      } else {
        showToast(responseData.apiStatus.message, "error");
        console.log("error");
      }
    } catch (error) {
      console.log("fetch error" + error);
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
            <Typography>Add Category</Typography>
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
                value={categoryName}
                // onChange={(e) => setCategoryName(e.target.value)}
                onChange={(e) => {
                  const value = e.target.value;
                  setCategoryName(value);
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    category: value.trim() === "",
                  }));
                }}
                fullWidth
                autoFocus
                error={errors.category}
                helperText={errors.category ? "Category Name is required" : ""}
                required
              />
            </Box>
            <TextField
              label="Description"
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={4}
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
                onClick={saveCategory}
              >
                Save
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      </ThemeProvider>
    </>
  );
}

export default Add_Category;

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
