import { Close } from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
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
import { useEffect, useRef, useState } from "react";

export default function Edit_digital({
  reloadListPage,
  openEdit,
  showToast,
  closeDialog,
  selectedValue,
}) {
  const [id, setId] = useState(null);
  const [currency_code, setCurrencyId] = useState("");
  const [name, setName] = useState("");
  const [img_id, setImg_id] = useState(null);
  const [image, setImage] = useState(null);
  const [buttonState, setButtonState] = useState("default"); // Track button state
  const fileInputRef = useRef(null);

  const [errors, setErrors] = useState({
    valName: false,
    valValue: false,
    // valImage: false,
  });

  // currency dropdown fetch
  const [openCurrency, setOpenCurrency] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
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
      setSelectedCurrency(value);
      setCurrencyId(value.title);
      setErrors((prevErrors) => ({ ...prevErrors, currency_code: false }));
      console.log("Selected Currency ID:", value.title);
    } else {
      setSelectedCurrency(value);
      setCurrencyId(null);
      setErrors((prevErrors) => ({ ...prevErrors, currency_code: true }));
    }
  };

  //  upload img
  const UploadImg = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    let token = localStorage.getItem("token");
    try {
      // setUploading(true); // Set uploading to true
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
        setImg_id(data.responseData.image_id);
        // setImgPath(data.responseData.Path);
        setImage(Url.api + data.responseData.Path); // Update the image URL
        setButtonState("success"); // Set button state to success
        showToast(data.apiStatus.message, "success");
        console.log("File uploaded successfully:", data.apiStatus.message);
      } else {
        showToast(data.apiStatus.message, "error");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setButtonState("error"); // Set button state to error on failure
    }
  };

  const handleFileChange = async (event) => {
    try {
      const [fileHandle] = await window.showOpenFilePicker();
      const file = await fileHandle.getFile();
      if (file) {
        //   setFileName(file.name); // Set the file name to display in the TextField
        setImg_id(file.icon_id);
        //   setImgPath(file.Path);
        UploadImg(file);
      }
    } catch {
      console.log("Error selecting file:");
    }
  };

  // validataion
  const validationFields = () => {
    const newErrors = {
      currency_id: !currency_code,
      valName: !name,
      //   valImage: !selectedFile,
    };

    setErrors({ ...newErrors });
    return !Object.values(newErrors).some((error) => error);
  };

  // bind value
  useEffect(() => {
    if (selectedValue) {
      const currencyDD = {
        title: selectedValue.currency_code,
        id: selectedValue.id,
      };
      setSelectedCurrency(currencyDD);
      setCurrencyId(selectedValue.currency_code);
      setId(selectedValue.id);
      setName(selectedValue.digital_payment_name);
      // setImage(selectedValue.digital_payment_icon);
      setImage(Url.api + selectedValue.digital_payment_icon);
      setImg_id(selectedValue.icon_id);
      setButtonState("default"); // Reset button state when selecting new data
    }
  }, [selectedValue]);

  // update call
  const updateDigital = async (eve) => {
    if (!validationFields()) {
      return;
    }
    eve.preventDefault();
    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.digitalEdit, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        id: id,
        currencyCode: currency_code,
        digitalPaymentName: name,
        digitalPaymentIcon: image,
        img_id: img_id,
      }),
    });
    try {
      const responceData = await response.json();
      console.log(responceData);
      if (responceData.apiStatus.code === "200") {
        reloadListPage();
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
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Dialog open={openEdit} onClose={closeDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Typography>Edit Denomination</Typography>
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
            <Box
              mb={2}
              mt={1}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Avatar
                src={image}
                style={{ width: 75, height: 75 }}
                sx={{ alignItems: "center", mb: 1 }}
              />
              <Button
                variant="contained"
                size="small"
                sx={{
                  mb: 2,
                  backgroundColor:
                    buttonState === "success" ? "green" : "default",
                  "&:hover": {
                    backgroundColor:
                      buttonState === "success" ? "darkgreen" : "default",
                  },
                }}
                onClick={handleFileChange}
              >
                {buttonState === "success" ? "Image Updated" : "Change icon"}
              </Button>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    id="CurrencyCode"
                    // sx={{ width: 260 }}
                    fullWidth
                    value={selectedCurrency}
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
                        error={errors.currency_code}
                        helperText={
                          errors.currency_code
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
                <Grid item xs={12} mt={1}>
                  <TextField
                    label="Payment Name"
                    variant="outlined"
                    value={name}
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
                  />
                </Grid>
                {/* <Grid item xs={6} mt={1}>
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
                </Grid> */}
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
                onClick={updateDigital}
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
