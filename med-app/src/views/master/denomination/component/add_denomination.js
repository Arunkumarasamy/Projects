import { AddCircle, Close, RemoveCircle } from "@mui/icons-material";
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
export default function Add_denomination({
  closeDialog,
  showToast,
  openAddDialog,
  refreshList,
}) {
  const [currency_id, setCurrencyId] = useState(null);
  // add items
  const [fields, setFields] = useState([
    {
      id: 1,
      denomination_name: "",
      denomination_value: "",
      denomination_type: "",
    },
  ]);
  const [errors, setErrors] = useState({
    valName: false,
    valValue: false,
    valType: false,
  });

  const additionItems = () => {
    setFields([
      ...fields,
      {
        id: fields.length + 1,
        denomination_name: "",
        denomination_value: "",
        denomination_type: "",
      },
    ]);
  };

  // remove items
  const removeItems = (ind) => {
    const dataStore = fields.filter((_, index) => index !== ind);
    setFields(dataStore);
  };
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

  // valiadtion
  const validationFields = () => {
    const newErrors = {
      currency_id: !currency_id,
    };
    const fieldsError = fields.map((val) => ({
      valName: !val.denomination_name,
      valValue: !val.denomination_value,
      valType: !val.denomination_type,
    }));
    const hasFieldErrors = fieldsError.some(
      (field) => field.valName || field.valValue || field.valType
    );
    setErrors({ ...newErrors, fields: fieldsError });
    return !Object.values(newErrors).some((error) => error) && !hasFieldErrors;
  };

  const saveDenomination = async () => {
    if (!validationFields()) {
      return;
    }

    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.denominationCreate, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        currencycode: currency_id,
        denominations: fields.map((val) => ({
          value: val.denomination_value,
          name: val.denomination_name,
          type: val.denomination_type,
        })),
      }),
    });
    try {
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.apiStatus.code == "200") {
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
              <Grid container spacing={1}>
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
              </Grid>
              {fields.map((field, index) => (
                <Grid container spacing={2} mt={1} key={index}>
                  <Grid item xs={3}>
                    <Autocomplete
                      disablePortal
                      options={type}
                      value={field.denomination_type}
                      onChange={(event, newValue) => {
                        const updatedFields = fields.map((f, i) =>
                          i === index
                            ? { ...f, denomination_type: newValue?.label || "" }
                            : f
                        );

                        const newErrors = fields.map((f, i) =>
                          i === index
                            ? { ...f.errors, valType: newValue?.label === "" }
                            : f.errors
                        );

                        setFields(updatedFields);
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          fields: newErrors,
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Type"
                          error={
                            errors.fields &&
                            errors.fields[index] &&
                            errors.fields[index].valType
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Value"
                      variant="outlined"
                      required
                      fullWidth
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value)) {
                          const updatedFields = fields.map((f, i) => {
                            if (i === index) {
                              const updatedField = {
                                ...f,
                                denomination_value: value,
                              };

                              return updatedField;
                            }
                            return f;
                          });

                          const newErrors = fields.map((f, i) =>
                            i === index
                              ? {
                                  ...f.errors,
                                  valValue: value.trim() === "",
                                }
                              : f.errors
                          );

                          setFields(updatedFields);
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            fields: newErrors,
                          }));
                        }
                      }}
                      error={
                        errors.fields &&
                        errors.fields[index] &&
                        errors.fields[index].valValue
                      }
                    />{" "}
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Name"
                      variant="outlined"
                      fullWidth
                      //   value={field.denomination_name}
                      onChange={(e) => {
                        const value = e.target.value;
                        const updatedFields = fields.map((f, i) =>
                          i === index ? { ...f, denomination_name: value } : f
                        );

                        const newErrors = fields.map((f, i) =>
                          i === index
                            ? { ...f.errors, valName: value.trim() === "" }
                            : f.errors
                        );

                        setFields(updatedFields);
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          fields: newErrors,
                        }));
                      }}
                      error={
                        errors.fields &&
                        errors.fields[index] &&
                        errors.fields[index].valName
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    md={2}
                    sx={{ display: "flex", float: "right" }}
                  >
                    {index === fields.length - 1 ? (
                      <>
                        <IconButton
                          onClick={additionItems}
                          sx={{ fontSize: "27px", color: "green" }}
                        >
                          <AddCircle />
                        </IconButton>
                        {fields.length > 1 && (
                          <IconButton
                            onClick={() => removeItems(index)}
                            sx={{ fontSize: "27px", color: "red" }}
                          >
                            <RemoveCircle />
                          </IconButton>
                        )}
                      </>
                    ) : (
                      <IconButton
                        onClick={() => removeItems(index)}
                        sx={{ fontSize: "27px", color: "red" }}
                      >
                        <RemoveCircle />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              ))}
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
                onClick={saveDenomination}
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

const type = [{ label: "Coin" }, { label: "Note" }];
