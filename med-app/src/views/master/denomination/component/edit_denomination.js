import { Close } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
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
import { useEffect, useState } from "react";

export default function Edit_denomination({
  callList,
  selectedValue,
  showToast,
  openEditDialog,
  closeDialog,
}) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [selectType, setSelectType] = useState(null);
  const [id, setId] = useState(null);
  const [errors, setErrors] = useState({
    valName: false,
    valValue: false,
    valType: false,
  });
  //validation
  const validateFields = () => {
    const newErrors = {
      valName: !name,
      valValue: !value.trim() === "" || !/^\d*\.?\d*$/.test(value),
      valType: !selectType,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  // bind value
  useEffect(() => {
    if (selectedValue) {
      setId(selectedValue.id);
      setName(selectedValue.denomination_name);
      setValue(selectedValue.denomination_value);
      setSelectType(
        type.find((t) => t.label === selectedValue.denomination_type) || null
      );
    }
  }, [selectedValue]);

  // update call
  const upDateDenomination = async () => {
    if (!validateFields()) {
      return;
    }
    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.denominationEdit, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        id: id,
        denominationName: name,
        denominationValue: value,
        denominationType: selectType?.label,
      }),
    });

    try {
      const responceData = await response.json();
      console.log(responceData);
      console.log("---id");
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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dialog
        open={openEditDialog}
        onClose={closeDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography>Add Denomination</Typography>
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
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Autocomplete
                  disablePortal
                  options={type}
                  value={selectType}
                  onChange={(event, newValue) => {
                    setSelectType(newValue);
                    // Update validation state on change
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      valType: !newValue,
                    }));
                  }}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Type"
                      error={errors.valType}
                      helperText={errors.valType ? "Please select a type" : ""}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Value"
                  variant="outlined"
                  required
                  fullWidth
                  value={value}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {
                      setValue(value);
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        valValue: false,
                      }));
                    } else {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        valValue: true,
                      }));
                    }
                  }}
                  error={errors.valValue}
                  helperText={errors.valValue ? "Value is require" : ""}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={name}
                  required
                  onChange={(e) => {
                    const value = e.target.value;
                    setName(value);
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      valName: value.trim() === "",
                    }));
                  }}
                  error={errors.valName}
                  helperText={errors.valName ? "Name is require *" : ""}
                />
              </Grid>
            </Grid>
          </Box>

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
              onClick={upDateDenomination}
            >
              Update
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
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

const type = [{ label: "Coin" }, { label: "Note" }];
