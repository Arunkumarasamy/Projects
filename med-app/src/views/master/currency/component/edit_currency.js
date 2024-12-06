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
export default function Edit_currency({
  showToast,
  selectedValue,
  callList,
  openEditDialog,
  closeDialog,
}) {
  const [id, setId] = useState(null);
  const [countryName, setCountryName] = useState("");
  const [code, setCode] = useState("");
  const [symbol, setSymbol] = useState("");
  const [currencyName, setCurrencyName] = useState("");
  const [errors, setErrors] = useState({
    valCountryName: false,
    valCode: false,
    valCurrencyName: false,
  });
  const [openCountry, setOpenCountry] = useState(false);
  const [countryOption, setCountryOption] = useState([]);
  const [countryLoading, setCountryLoading] = useState(false);

  // country drop down
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (openCountry) {
      setCountryLoading(true);
      fetch(Url.api + Url.countryDD, {
        method: "GET",
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
          const country = data.result.CountryData.map((item) => ({
            title: item.country_name,
            id: item.id,
          }));
          setCountryOption(country); // Update state with the data
          setCountryLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching Country:", error);
          setCountryLoading(false);
        });
    }
  }, [openCountry]);

  const handleCountryChange = (event, value) => {
    if (value) {
      setCountryName(value.title);
      setErrors((prevErrors) => ({ ...prevErrors, valCountryName: false }));
      console.log("Selected country ID:", value.id);
      console.log("country name---", value.title);
    } else {
      // setVendorNameID(null);
      setErrors((prevErrors) => ({ ...prevErrors, valCountryName: true }));
    }
  };

  // bind value
  useEffect(() => {
    if (selectedValue) {
      setId(selectedValue.id);
      setCountryName({ title: selectedValue.country_name });
      setCode(selectedValue.country_code);
      setSymbol(selectedValue.currency_symbol);
      setCurrencyName(selectedValue.currency_name);
    }
  }, [selectedValue]);

  // validation error
  const validateFields = () => {
    const newErrors = {
      valCountryName: !countryName,
      valCode: !code,
      valCurrencyName: !currencyName,
    };
    setErrors({ ...newErrors });
    return !Object.values(newErrors).some((error) => error);
  };

  // update call
  const UpdateCurrency = async () => {
    if (!validateFields()) {
      return;
    }
    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.currencyEdit, {
      method: "PUT",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        id: id,
        countryName: countryName.title,
        currencyName: currencyName,
        currencySymbol: symbol,
        currencyCode: code,
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
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Dialog
          open={openEditDialog}
          onClose={closeDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography>Update Currency</Typography>
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
                <Grid item xs={6}>
                  <Autocomplete
                    id="country"
                    open={openCountry}
                    onOpen={() => setOpenCountry(true)}
                    onClose={() => setOpenCountry(false)}
                    fullWidth
                    isOptionEqualToValue={(option, value) =>
                      option.title === value.title
                    }
                    getOptionLabel={(option) => option.title} //----------
                    options={countryOption}
                    loading={countryLoading}
                    onChange={handleCountryChange}
                    value={countryName || null} //-------countryName
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Country"
                        error={errors.valCountryName}
                        helperText={
                          errors.valCountryName ? "Country is required *" : ""
                        }
                        required
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {countryLoading ? (
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
                            height: "35px",
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
                <Grid item xs={6}>
                  <TextField
                    label="Country Code"
                    variant="outlined"
                    onChange={(e) => {
                      const value = e.target.value;
                      setCode(value);
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        valCode: value.trim() === "",
                      }));
                    }}
                    fullWidth
                    value={code}
                    error={errors.valCode}
                    helperText={
                      errors.valCode ? "Country Code is required *" : ""
                    }
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Symbol"
                    variant="outlined"
                    value={symbol}
                    fullWidth
                    onChange={(e) => setSymbol(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Currency Name"
                    variant="outlined"
                    onChange={(e) => {
                      const value = e.target.value;
                      setCurrencyName(value);
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        valCurrencyName: value.trim() === "",
                      }));
                    }}
                    value={currencyName}
                    fullWidth
                    required
                    error={errors.valCurrencyName}
                    helperText={
                      errors.valCurrencyName ? "CurrencyName is required *" : ""
                    }
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
                onClick={UpdateCurrency}
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
