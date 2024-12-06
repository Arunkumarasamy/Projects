import { Close } from "@mui/icons-material";
import {
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import Url from "Api";
import Toast from "components/Toast";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function Add_Units({
  openDialog,
  closeDialogbox,
  refreshList,
  showToast,
}) {
  // add List
  const [unit, setUnit] = useState("");
  const [unitName, setUnitName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({
    unit: false,
    unitName: false,
    // description: false,
  });

  const validateFields = () => {
    const newErrors = {
      unit: !unit,
      unitName: !unitName,
      // description: !description,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const saveAddUnit = async (eve) => {
    // eve.preventDefault();
    if (!validateFields()) {
      return;
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.unitCreate, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        UnitName: unitName,
        unit: unit,
        description: description,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    try {
      const responceData = await response.json();
      console.log(responceData);
      // console.log("token",)
      // setLoading(false);
      if (responceData.apiStatus.code == "200") {
        setUnitName("");
        setUnit("");
        setDescription("");
        refreshList();
        showToast(responceData.apiStatus.message, "success");
      } else {
        showToast(responceData.apiStatus.message, "error");
      }
    } catch (error) {
      showToast("Request timed out. Please try again.", "error");

      console.log("Error handled =" + error);
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
            <Typography>Add Units</Typography>
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
            <Grid container spacing={2}>
              <Grid item sm={6} xs={6} mb={1} mt={1}>
                <TextField
                  label="Units Name"
                  onChange={(e) => {
                    const value = e.target.value;
                    setUnitName(value);
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      unitName: value.trim() === "",
                    }));
                  }}
                  value={unitName}
                  error={errors.unitName}
                  helperText={errors.unitName ? "UnitName is required *" : ""}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item sm={6} xs={6} mb={1} mt={1}>
                <TextField
                  label="Units"
                  onChange={(e) => {
                    const value = e.target.value;
                    setUnit(value);
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      unit: value.trim() === "",
                    }));
                  }}
                  fullWidth
                  value={unit}
                  error={errors.unit}
                  helperText={errors.unit ? "Unit is required *" : ""}
                  required
                />
              </Grid>
              <Grid item sm={12}>
                <TextField
                  label="Description"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  fullWidth
                  multiline
                  rows={4}
                  // error={errors.description}
                  // helperText={
                  //   errors.description ? "Description is required" : ""
                  // }
                />
              </Grid>
            </Grid>
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
              <Button variant="contained" color="success" onClick={saveAddUnit}>
                Save
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      </ThemeProvider>
    </>
  );
}

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
