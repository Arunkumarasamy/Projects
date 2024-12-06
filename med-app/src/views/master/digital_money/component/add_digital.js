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
  InputAdornment,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";

import Url from "Api";
import { useEffect, useRef, useState } from "react";
export default function Add_digital({
  openAddDialog,
  closeDialog,
  refreshList,
  showToast,
}) {
  const [currency_id, setCurrencyId] = useState(null);
  const [name, setName] = useState("");
  const [imgPath, setImgPath] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const fileInputRef = useRef(null);

  const [errors, setErrors] = useState({
    valName: false,
    valValue: false,
    valImage: false,
  });
  // currency dropdown fetch
  const [openCurrency, setOpenCurrency] = useState(false);
  const [currencyOption, setCurrencyOption] = useState([]);
  const [currencyLoading, setCurrencyLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (openCurrency) {
      setCurrencyLoading(true);
      fetch(Url.api + Url.currencyList, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json(); // Parse JSON response
        })
        .then((data) => {
          const currency = data.result.CurrencyData.map((item) => ({
            title: item.currency_code,
            id: item.id,
          }));

          setCurrencyOption(currency); // Update state with the data

          setCurrencyLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching vendors:", error);
          setCurrencyLoading(false);
        });
    }
  }, [openCurrency]);

  const handleCurrencyChange = (event, value) => {
    if (value) {
      setCurrencyId(value.title);
      setErrors((prevErrors) => ({ ...prevErrors, currency_id: false }));
      console.log("Selected Currency ID:", value.title);
    } else {
      setCurrencyId(null);
      setErrors((prevErrors) => ({ ...prevErrors, currency_id: true }));
    }
  };

  //  upload img
  const UploadImg = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    let token = localStorage.getItem("token");
    try {
      const response = await fetch(Url.api + Url.digitalMoneyImg, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      console.log("upload api----", Url.api + Url.imgUpload);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (response.ok) {
        setSelectedFile(data.responseData.image_id);
        setImgPath(data.responseData.Path);
        console.log();
        console.log("File uploaded successfully:", data.apiStatus.message);
        showToast(data.apiStatus.message, "success");
      } else {
        showToast(data.apiStatus.message, "error");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name); // Set the file name to display in the TextField
      setSelectedFile(file.icon_id);
      setImgPath(file.Path);
      UploadImg(file);
    }
  };
  const handleTextFieldClick = () => {
    fileInputRef.current.click();
  };

  // validataion
  const validationFields = () => {
    const newErrors = {
      currency_id: !currency_id,
      valName: !name,
      valImage: !selectedFile,
    };

    setErrors({ ...newErrors });
    return !Object.values(newErrors).some((error) => error);
  };

  //save api call
  const saveDigital = async () => {
    if (!validationFields()) {
      return;
    }
    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.digitalCreate, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        currencyCode: currency_id,
        digitalPaymentName: name,
        digitalPaymentIcon: fileName,
        img_id: selectedFile,
      }),
    });
    try {
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.apiStatus.code == "200") {
        setFileName("");
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

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Dialog
          open={openAddDialog}
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
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    id="CurrencyCode"
                    // sx={{ width: 260 }}
                    fullWidth
                    open={openCurrency}
                    onOpen={() => setOpenCurrency(true)}
                    onClose={() => setOpenCurrency(false)}
                    isOptionEqualToValue={(option, value) =>
                      option.title === value.title
                    }
                    getOptionLabel={(option) => option.title} //----------
                    options={currencyOption}
                    loading={currencyLoading}
                    onChange={handleCurrencyChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="CurrencyCode"
                        required
                        error={errors.currency_id}
                        helperText={
                          errors.currency_id
                            ? "Currency Code is required *"
                            : ""
                        }
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {currencyLoading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                        InputLabelProps={{
                          style: { fontSize: "16px" },
                        }}
                        inputProps={{
                          ...params.inputProps,
                          style: {
                            height: "38px",
                            padding: "0 7px",
                            fontSize: "15px",
                          },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            minHeight: "40px",
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6} mt={1}>
                  <TextField
                    label="Payment Name"
                    variant="outlined"
                    onChange={(e) => {
                      const value = e.target.value;
                      setName(value);
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        valName: value.trim() === "",
                      }));
                    }}
                    fullWidth
                    required
                    error={errors.valName}
                    helperText={
                      errors.valName ? "Payment Name is required *" : ""
                    }
                  />{" "}
                </Grid>
                <Grid item xs={6} mt={1}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    label="Uploade image"
                    value={fileName}
                    name="file"
                    onClick={handleTextFieldClick}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <input
                            accept="*"
                            style={{ display: "none" }}
                            id="raised-button-file"
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                          />
                          <Typography
                            // variant="caption"
                            variant="body1"
                            backgroundColor="primary.main"
                            color="white"
                            padding="7px 5px"
                            borderRadius="4px"
                            fontWeight="medium"
                            component="span"
                            // onClick={handleTextFieldClick}
                            sx={{
                              cursor: "pointer",
                              "&:hover": {
                                backgroundColor: "primary.dark",
                              },
                            }}
                          >
                            Choose File
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                    required
                    error={errors.valImage}
                    helperText={errors.valImage ? "Image is required *" : ""}
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
              <Button variant="contained" color="success" onClick={saveDigital}>
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
