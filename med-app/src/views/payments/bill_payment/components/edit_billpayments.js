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

export default function Edit_bill({
  openDialogEdit,
  closeDialog,
  selectedValue,
  callList,
  showToast,
}) {
  const [id, setId] = useState("");
  const [billDate, setBillDate] = useState(null);
  const [totalAmount, setTotalAmount] = useState("");
  const [mulId, setMulId] = useState(null);
  const [mulBillDate, setMulBillDate] = useState("");
  const [mulBillNum, setMulBillNum] = useState("");
  const [mulBillAmount, setMulBillAmount] = useState("");
  const [showBillPaymentEditDialog, setBillPaymentEditDialog] = useState(false);
  // vendor drop down
  const [vendorName, setVendorName] = useState("");
  const [openVendor, setOpenVendor] = useState(false);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [vendorLoading, setVendorLoading] = useState(false);
  // add items
  const [fields, setFields] = useState([
    {
      id: 0,
      billNo: "",
      billDate: "",
      billAmount: "",
    },
  ]);
  // error validation
  const [errors, setErrors] = useState({
    date: false,
    vendorName: false,
    mulDate: false,
    mulBillNum: false,
    mulBillAmount: false,
  });

  // validation error

  const validateFields = () => {
    const newErrors = {
      date: !billDate || isNaN(new Date(billDate).getTime()),
      vendorName: !vendorName,
    };
    const fieldErrors = fields.map((field) => ({
      mulBillDate: !field.billDate,
      mulBillNum: !field.billNo,
      mulBillAmount: !field.billAmount,
    }));
    const hasFieldErrors = fieldErrors.some(
      (field) => field.mulBillDate || field.mulBillNum || field.mulBillAmount
    );
    setErrors({ ...newErrors, fields: fieldErrors });
    return !Object.values(newErrors).some((error) => error) && !hasFieldErrors;
  };

  console.log("-----------------dialogopen----");

  const handleVendorChange = (event, value) => {
    if (value) {
      setVendorName({ title: value.title });
      setErrors((prevErrors) => ({ ...prevErrors, vendorName: false }));
      console.log("Selected vendor ID:", value.id);
      console.log("vendor name---", value.title);
    } else {
      setVendorName(null);
      setErrors((prevErrors) => ({ ...prevErrors, vendorName: true }));
    }
  };

  // add item
  const additionItems = () => {
    setFields((prevFields) => [
      ...prevFields,
      {
        id: prevFields.length + 1,

        billNo: "",
        billDate: "",
        billAmount: "",
      },
    ]);
  };

  useEffect(() => {
    // console.log("fields------", fields);
    const totalAmt = fields.reduce(
      (sum, field) => sum + (parseFloat(field.billAmount) || 0),
      0
    );
    setTotalAmount(totalAmt.toFixed(2));
  }, [fields]);

  // remove items

  const removeItems = (ind) => {
    const dataStore = fields.filter((_, index) => index !== ind);
    setFields(dataStore);
  };

  // bind the value
  useEffect(() => {
    if (selectedValue) {
      console.log("selected value-------", selectedValue.BillPaymentDetails);

      setId(selectedValue.id);
      setBillDate(dayjs(selectedValue.date) || dayjs());
      setVendorName({ title: selectedValue.vendorName });
      setTotalAmount(selectedValue.totalAmount);
      setFields(selectedValue.BillPaymentDetails);
      setBillPaymentEditDialog(true);
    }
  }, [selectedValue]);

  // update call
  const updateBill = async (eve) => {
    if (!validateFields()) {
      return;
    }
    eve.preventDefault();
    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.expenseBillEdit, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        id: id,
        date: billDate.format(),
        vendorName: vendorName.title,
        billPaymentDetails: fields.map((val) => ({
          id: val.id,
          billNo: val.billNo,
          billDate: val.billDate,
          billAmount: val.billAmount,
        })),
      }),
    });

    try {
      const responceData = await response.json();
      console.log(responceData);
      console.log("---id", fields.id);
      if (responceData.apiStatus.code === "200") {
        callList();
        showToast(responceData.apiStatus.message, "success");
        // window.location.reload();
      } else {
        showToast(responceData.apiStatus.message, "error");
        console.log(responceData.apiStatus.message, "error");
      }
    } catch (err) {
      console.log("error from " + err);
    }
  };

  // vendor drop down
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
            title: item.vendor_name, // ---------be name
            id: item.id,
          }));
          setVendorOptions(vendors); // Update state with the data
          console.log("vendorloading ---------------False");
          setVendorLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching vendors:", error);
          setVendorLoading(false);
        });
    }
  }, [openVendor]);
  console.log(
    "showBillPaymentEditDialog value--------",
    showBillPaymentEditDialog
  );
  console.log("openDialog-------- no:", openDialogEdit);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {openDialogEdit && showBillPaymentEditDialog ? (
            <Dialog
              open={openDialogEdit}
              onClose={closeDialog}
              // maxWidth="sm"
              fullWidth
              sx={{
                width: "800px", // Adjust these values as needed
                height: "600px",
                margin: "auto", // Center horizontally
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DialogTitle>
                <Typography>Edit Billpayment</Typography>
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
                      onChange={(newValue) => setBillDate(dayjs(newValue))}
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
                      value={vendorName || null}
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
                        value={dayjs(field.billDate)}
                        required
                        onChange={(newValue) =>
                          setFields((prevFields) =>
                            prevFields.map((f, i) =>
                              i === index
                                ? { ...f, billDate: dayjs(newValue) }
                                : f
                            )
                          )
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={errors.mulBillDate}
                            helperText={
                              errors.mulBillDate ? "Date is required *" : ""
                            }
                          />
                        )}
                        defaultValue={today}
                        views={["day", "month", "year"]}
                      />
                    </Grid>
                    <Grid item xs={3} md={3}>
                      <TextField
                        label="Bill Number"
                        variant="outlined"
                        required
                        fullWidth
                        autoFocus
                        value={field.billNo}
                        // onChange={(e) =>
                        //   setFields(
                        //     fields.map((f, i) =>
                        //       i === index ? { ...f, billNo: e.target.value } : f
                        //     )
                        //   )
                        // }
                        onChange={(e) => {
                          const value = e.target.value;
                          const updatedFields = fields.map((f, i) =>
                            i === index ? { ...f, billNo: value } : f
                          );

                          const newErrors = fields.map((f, i) =>
                            i === index
                              ? { ...f.errors, billNo: value.trim() === "" }
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
                        value={field.billAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*\.?\d*$/.test(value)) {
                            const updatedFields = fields.map((f, i) => {
                              if (i === index) {
                                const updatedField = {
                                  ...f,
                                  billAmount: value,
                                };

                                return updatedField;
                              }
                              return f;
                            });

                            const newErrors = fields.map((f, i) =>
                              i === index
                                ? {
                                    ...f.errors,
                                    billAmount: value.trim() === "",
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

                <Stack
                  direction="row"
                  justifyContent="center"
                  gap="10px"
                  mt={5}
                >
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
                    onClick={updateBill}
                  >
                    Update
                  </Button>
                </Stack>
              </DialogContent>
            </Dialog>
          ) : (
            ""
          )}
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
