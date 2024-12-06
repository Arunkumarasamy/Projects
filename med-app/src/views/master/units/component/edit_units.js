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
import { useEffect, useState } from "react";

export default function Edit_Units({
  editDialog,
  closeEditDialogbox,
  units,
  callList,
  showToast,
}) {
  const [unit, setUnit] = useState("");
  const [unitName, setUnitName] = useState("");
  const [description, setDescription] = useState("");
  const [id, setId] = useState("");
  const [errors, setErrors] = useState({
    unit: false,
    unitName: false,
    // description: false,
  });

  // validation error
  const validateFields = () => {
    const newErrors = {
      unit: !unit,
      unitName: !unitName,
      // description: !description,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  // unit Edit

  useEffect(() => {
    if (units) {
      setUnitName(units.UnitName); //initial value
      setUnit(units.Unit);
      setDescription(units.Description);
      setId(units.id);
    }
  }, [units]);

  const updateButton = async (eve) => {
    // eve.preventDefault();
    if (!validateFields()) {
      return;
    }
    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.unitEdit, {
      method: "PUT",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        UnitName: unitName,
        unit: unit,
        description: description,
        id: id,
      }),
    });
    try {
      const responceData = await response.json();
      console.log(responceData);
      if (responceData.apiStatus.code == "200") {
        callList();
        showToast(responceData.apiStatus.message, "success");
      } else {
        showToast(responceData.apiStatus.message, "error");
      }
    } catch (error) {
      console.log("Error handled =" + error);
    }
  };

  // close
  const closeDialog = () => {
    closeEditDialogbox();
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Dialog open={editDialog} onClose={closeDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Typography> Edit Units</Typography>
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
                  fullWidth
                  required
                  autoFocus
                  value={unitName}
                  error={errors.unitName}
                  helperText={errors.unitName ? "UnitName is required *" : ""}
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
                  autoFocus
                  required
                  value={unit}
                  error={errors.unit}
                  helperText={errors.unit ? "Unit is required" : ""}
                />
              </Grid>
              <Grid item sm={12}>
                <TextField
                  label="Description"
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  value={description}
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
