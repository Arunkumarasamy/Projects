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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Url from "Api";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function Add_bill({
  openBillDialog,
  closeDialog,
  refreshList,
  showToast,
}) {
  const [billDate, setBillDate] = useState(dayjs());
  const [totalAmount, setTotalAmount] = useState("");

  // add items
  const [fields, setFields] = useState([
    {
      id: 1,
      mulBillNum: "",
      mulBillDate: null,
      mulBillAmount: "",
    },
  ]);
  const [vendorNameId, setVendorNameID] = useState(null);
  const [vendorName, setVendorName] = useState("");
  const [errors, setErrors] = useState({
    date: false,
    vendorName: false,
    mulBillDate: false,
    mulBillNum: false,
    mulBillAmount: false,
  });

  // date
  const handleDateChange = (newValue) => {
    // Ensure the newValue is a valid Dayjs object
    if (newValue && dayjs(newValue).isValid()) {
      // Set time to midnight to avoid timezone issues
      const adjustedDate = newValue.startOf("day");
      setBillDate(adjustedDate);
    } else {
      setBillDate(null);
    }
  };

  // validation error

  const validateFields = () => {
    const newErrors = {
      date: !billDate || !dayjs(billDate).isValid(),
      vendorName: !vendorName,
    };
    const fieldErrors = fields.map((field) => ({
      mulBillDate: !field.mulBillDate,
      mulBillNum: !field.mulBillNum,
      mulBillAmount: !field.mulBillAmount,
    }));
    const hasFieldErrors = fieldErrors.some(
      (field) => field.mulBillDate || field.mulBillNum || field.mulBillAmount
    );
    setErrors({ ...newErrors, fields: fieldErrors });
    return !Object.values(newErrors).some((error) => error) && !hasFieldErrors;
  };

  // vendor drop down
  const [openVendor, setOpenVendor] = useState(false);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [vendorLoading, setVendorLoading] = useState(false);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (openVendor) {
      setVendorLoading(true);
      fetch(Url.api + Url.vendorNameDropDown, {
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
          const vendors = data.result.VendorData.map((item) => ({
            title: item.vendor_name,
            id: item.id,
          }));
          setVendorOptions(vendors); // Update state with the data
          setVendorLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching vendors:", error);
          setVendorLoading(false);
        });
    }
  }, [openVendor]);

  const handleVendorChange = (event, value) => {
    if (value) {
      setVendorName(value.title);
      setErrors((prevErrors) => ({ ...prevErrors, vendorName: false }));
      console.log("Selected vendor ID:", value.id);
      console.log("vendor name---", value.title);
    } else {
      setVendorNameID(null);
      setErrors((prevErrors) => ({ ...prevErrors, vendorName: true }));
    }
  };

  const additionItems = () => {
    setFields([
      ...fields,
      {
        id: fields.length + 1,
        mulBillNum: "",
        mulBillDate: null,
        mulBillAmount: "",
      },
    ]);
  };

  // calculation for Total amount

  useEffect(() => {
    const totalAmt = fields.reduce(
      (sum, field) => sum + (parseFloat(field.mulBillAmount) || 0),
      0
    );
    setTotalAmount(totalAmt.toFixed(2));
  }, [fields]);

  // remove items
  const removeItems = (ind) => {
    const dataStore = fields.filter((_, index) => index !== ind);
    setFields(dataStore);
  };

  // save
  const saveBill = async () => {
    if (!validateFields()) {
      return;
    }
    const formattedDate = billDate.format("YYYY-MM-DD");

    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.expenseBillCreate, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        date: formattedDate,
        vendorName: vendorName,
        billPaymentDetails: fields.map((val) => ({
          billNo: val.mulBillNum,
          billDate: val.mulBillDate
            ? dayjs(val.mulBillDate).format("YYYY-MM-DD")
            : null,
          billAmount: val.mulBillAmount,
        })),
      }),
    });
    try {
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.apiStatus.code == "200") {
        // window.location.reload();
        setBillDate(dayjs());
        setVendorName("");
        setTotalAmount("");
        setFields([1]);
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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Dialog
            open={openBillDialog}
            onClose={closeDialog}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              <Typography>Add Billpayment</Typography>
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
              <Grid
                container
                spacing={2}
                sx={{
                  padding: "10px",
                }}
              >
                <Grid item xs={4} md={4}>
                  <DatePicker
                    value={billDate}
                    // onChange={(newValue) => setBillDate(newValue)}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={errors.date}
                        helperText={errors.date ? "Date is required *" : ""}
                      />
                    )}
                    required
                    defaultValue={today}
                    views={["day", "month", "year"]}
                  />
                  {errors.date && (
                    <Typography variant="caption" color="error">
                      Date is required *
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={4} md={4}>
                  <Autocomplete
                    id="vendor"
                    open={openVendor}
                    onOpen={() => setOpenVendor(true)}
                    onClose={() => setOpenVendor(false)}
                    fullWidth
                    isOptionEqualToValue={(option, value) =>
                      option.title === value.title
                    }
                    getOptionLabel={(option) => option.title} //----------
                    options={vendorOptions}
                    loading={vendorLoading}
                    onChange={handleVendorChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Vendor Name"
                        error={errors.vendorName}
                        helperText={
                          errors.vendorName ? "vendorName is required *" : ""
                        }
                        required
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {vendorLoading ? (
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
                <Grid item xs={4} md={4}>
                  <TextField
                    label="TotalAmount"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    inputProps={{ readOnly: true }}
                    fullWidth
                    autoFocus
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              {fields.map((field, index) => (
                <Grid
                  container
                  spacing={2}
                  sx={{
                    padding: "10px",
                  }}
                  key={index}
                >
                  <Grid item xs={4} md={4}>
                    <DatePicker
                      value={field.mulBillDate}
                      required
                      onChange={(newValue) =>
                        setFields((prevFields) =>
                          prevFields.map((f, i) =>
                            i === index ? { ...f, mulBillDate: newValue } : f
                          )
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          // error={errors.mulBillDate}
                          error={
                            errors.fields &&
                            errors.fields[index] &&
                            errors.fields[index].mulBillDate
                          }
                          helperText={
                            errors.fields &&
                            errors.fields[index] &&
                            errors.fields[index].mulBillDate
                              ? "Date is required *"
                              : ""
                          }
                        />
                      )}
                      defaultValue={today}
                      views={["day", "month", "year"]}
                    />
                    {/* <DatePicker
                      value={field.mulBillDate}
                      required
                      onChange={(newValue) => {
                        setFields((prevFields) =>
                          prevFields.map((f, i) =>
                            i === index ? { ...f, mulBillDate: newValue } : f
                          )
                        );
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          fields: prevErrors.fields.map((err, i) =>
                            i === index
                              ? {
                                  ...err,
                                  mulBillDate:
                                    !newValue ||
                                    isNaN(new Date(newValue).getTime()),
                                }
                              : err
                          ),
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={
                            errors.fields &&
                            errors.fields[index] &&
                            errors.fields[index].mulBillDate
                          }
                          helperText={
                            errors.fields &&
                            errors.fields[index] &&
                            errors.fields[index].mulBillDate
                              ? "Date is required *"
                              : ""
                          }
                        />
                      )}
                      defaultValue={today}
                      views={["day", "month", "year"]}
                    /> */}
                  </Grid>
                  <Grid item xs={3} md={3}>
                    <TextField
                      label="Bill Number"
                      variant="outlined"
                      required
                      fullWidth
                      autoFocus
                      value={field.mulBillNum}
                      onChange={(e) => {
                        const value = e.target.value;
                        const updatedFields = fields.map((f, i) =>
                          i === index ? { ...f, mulBillNum: value } : f
                        );

                        const newErrors = fields.map((f, i) =>
                          i === index
                            ? { ...f.errors, mulBillNum: value.trim() === "" }
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
                        errors.fields[index].mulBillNum
                      }
                      // helperText={
                      //   errors.mulBillNum ? "Bill Number is required *" : ""
                      // }
                    />
                  </Grid>
                  <Grid item xs={3} md={3}>
                    <TextField
                      label="Amount"
                      fullWidth
                      autoFocus
                      variant="outlined"
                      required
                      value={field.mulBillAmount}
                      // onChange={(e) => {
                      //   const value = e.target.value;
                      //   if (/^\d*\.?\d*$/.test(value)) {
                      //     setFields((prevFields) =>
                      //       prevFields.map((f, i) =>
                      //         i === index ? { ...f, mulBillAmount: value } : f
                      //       )
                      //     );
                      //   }
                      // }}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value)) {
                          const updatedFields = fields.map((f, i) => {
                            if (i === index) {
                              const updatedField = {
                                ...f,
                                mulBillAmount: value,
                              };

                              return updatedField;
                            }
                            return f;
                          });

                          const newErrors = fields.map((f, i) =>
                            i === index
                              ? {
                                  ...f.errors,
                                  mulBillAmount: value.trim() === "",
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
                        errors.fields[index].mulBillAmount
                      }
                      // helperText={
                      //   errors.fields &&
                      //   errors.fields[index] &&
                      //   errors.fields[index].unitPrice
                      //     ? "required *"
                      //     : ""
                      // }
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
                <Button variant="contained" color="success" onClick={saveBill}>
                  Save
                </Button>
              </Stack>
            </DialogContent>
          </Dialog>
        </ThemeProvider>
      </LocalizationProvider>
    </>
  );
}

const today = dayjs();

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
