import { AddCircle, Close, RemoveCircle } from "@mui/icons-material";
import {
  CssBaseline,
  Dialog,
  ThemeProvider,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
  createTheme,
  Button,
} from "@mui/material";
import Url from "Api";
import Toast from "components/Toast";
import { useState } from "react";

export default function Add_vendor({
  openDialog,
  closeDialogBox,
  refreshList,
  showToast,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gstNum, setGstNum] = useState("");
  const [address, setAddress] = useState("");
  const [mulName, setMulName] = useState("");
  const [mulEmail, setMulEmail] = useState("");
  const [mulPhone, setMulPhone] = useState("");
  // toast message
  const [openToast, setOpenToast] = useState("");
  const [severityToast, setSeverityToast] = useState("success");
  const [messageToast, setMessageToast] = useState("");
  // add items
  const [fields, setFields] = useState([
    {
      id: 1,
      mulName: "",
      mulEmail: "",
      mulPhone: "",
    },
  ]);
  const [errors, setErrors] = useState({
    valName: false,
    valEmail: false,
    valPhone: false,
    fields: [],

    // valMulName: false,
    // valMulEmail: false,
    // valMulPhone: false,
  });

  // validation
  const validateFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,12}$/;
    const newErrors = {
      valName: name.trim() === "",
      valEmail: !emailRegex.test(email),
      valPhone: !phoneRegex.test(phone),
      fields: fields.map((field) => ({
        valMulName: field.mulName.trim() === "",
        valMulEmail: !emailRegex.test(field.mulEmail),
        valMulPhone: !phoneRegex.test(field.mulPhone),
      })),
    };

    setErrors(newErrors);

    const hasFieldErrors = newErrors.fields.some(
      (field) => field.valMulName || field.valMulEmail || field.valMulPhone
    );

    return (
      !newErrors.valName &&
      !newErrors.valEmail &&
      !newErrors.valPhone &&
      !hasFieldErrors
    );
  };

  // add fields
  const additionItems = () => {
    setFields([
      ...fields,
      {
        id: fields.length + 1,
        mulName: "",
        mulEmail: "",
        mulPhone: "",
      },
    ]);
    setErrors((prevErrors) => ({
      ...prevErrors,
      fields: [
        ...prevErrors.fields,
        { valMulName: false, valMulEmail: false, valMulPhone: false },
      ],
    }));
  };

  // remove items
  const removeItems = (ind) => {
    const dataStore = fields.filter((_, index) => index !== ind);
    const dataErrors = errors.fields.filter((_, index) => index !== ind);
    setFields(dataStore);
    setErrors((prevErrors) => ({
      ...prevErrors,
      fields: dataErrors,
    }));
  };
  // const removeItems = (ind) => {
  //   const dataStore = fields.filter((_, index) => index !== ind);
  //   setFields(dataStore);
  // };

  // close
  const closeDialog = () => {
    closeDialogBox();
  };

  const saveButton = async () => {
    if (!validateFields()) {
      return;
    }
    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.vendorCreate, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        VendorName: name,
        VendorEmail: email,
        VendorMobile: phone,
        VendorAddress: address,
        VendorGST: gstNum,
        ContactPersons: fields.map((val) => ({
          ContactPersonName: val.mulName,
          ContactPersonMobile: val.mulPhone,
          ContactPersonEmail: val.mulEmail,
        })),
      }),
    });
    try {
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.apiStatus.code == "200") {
        // window.location.reload();
        setName("");
        setEmail("");
        setPhone("");
        setAddress("");
        setGstNum("");
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dialog open={openDialog} onClose={closeDialog} maxWidth="sm">
        <DialogTitle>
          <Typography>Add vendor</Typography>
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
            <Grid item xs={6} md={6} mt={2}>
              <TextField
                label="Vendor Name"
                variant="outlined"
                required
                fullWidth
                onChange={(e) => {
                  const value = e.target.value;
                  setName(value);
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    valName: value.trim() === "",
                  }));
                }}
                error={errors.valName}
                helperText={errors.valName ? "Vendor Name is required" : ""}
              />
            </Grid>
            <Grid item xs={6} md={6} mt={2}>
              <TextField
                label="Vendor Email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    valEmail: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                      e.target.value
                    ),
                  }));
                }}
                variant="outlined"
                required
                fullWidth
                error={errors.valEmail}
                helperText={errors.valEmail ? "Invalid Email Address" : ""}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <TextField
                label="Phone Number"
                variant="outlined"
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value) && value.length <= 12) {
                    setPhone(value);
                  }
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    valPhone: !/^[0-9]{10,12}$/.test(value),
                  }));
                }}
                inputProps={{ maxLength: 10 }}
                value={phone}
                helperText={errors.valPhone ? "Phone is required" : ""}
                error={errors.valPhone}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <TextField
                label="GST Number"
                variant="outlined"
                value={gstNum}
                onChange={(e) => setGstNum(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                label="Address"
                variant="outlined"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
          {fields.map((field, index) => (
            <Grid container spacing={2} mt={1} key={index}>
              <Grid item xs={4} md={4}>
                <TextField
                  label="Contact Name"
                  variant="outlined"
                  value={field.mulName}
                  // onChange={(e) => {
                  //   setFields(
                  //     fields.map((f, i) =>
                  //       i === index ? { ...f, mulName: e.target.value } : f
                  //     )
                  //   );
                  // }}
                  onChange={(e) => {
                    setFields(
                      fields.map((f, i) =>
                        i === index ? { ...f, mulName: e.target.value } : f
                      )
                    );
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      fields: prevErrors.fields.map((err, i) =>
                        i === index
                          ? { ...err, valMulName: e.target.value.trim() === "" }
                          : err
                      ),
                    }));
                  }}
                  required
                  error={errors.fields[index]?.valMulName}
                  // helperText={
                  //   errors.fields[index]?.valMulName
                  //     ? "Contact Name is required"
                  //     : ""
                  // }
                  fullWidth
                />
              </Grid>
              <Grid item xs={3} md={3}>
                <TextField
                  label="Email"
                  variant="outlined"
                  value={field.mulEmail}
                  // onChange={(e) => {
                  //   setFields(
                  //     fields.map((f, i) =>
                  //       i === index ? { ...f, mulEmail: e.target.value } : f
                  //     )
                  //   );
                  // }}
                  onChange={(e) => {
                    setFields(
                      fields.map((f, i) =>
                        i === index ? { ...f, mulEmail: e.target.value } : f
                      )
                    );
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      fields: prevErrors.fields.map((err, i) =>
                        i === index
                          ? {
                              ...err,
                              valMulEmail: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                e.target.value
                              ),
                            }
                          : err
                      ),
                    }));
                  }}
                  inputProps={{ typeof: "email" }}
                  // required
                  error={errors.fields[index]?.valMulEmail}
                  // helperText={
                  //   errors.fields[index]?.valMulEmail
                  //     ? "Invalid Email Address"
                  //     : ""
                  // }
                  fullWidth
                />
              </Grid>
              <Grid item xs={3} md={3}>
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  value={field.mulPhone}
                  // onChange={(e) => {
                  //   const value = e.target.value;
                  //   if (/^\d*$/.test(value) && value.length <= 12) {
                  //     setFields((prevFields) =>
                  //       prevFields.map((f, i) =>
                  //         i === index ? { ...f, mulPhone: value } : f
                  //       )
                  //     );
                  //   }
                  // }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && value.length <= 12) {
                      setFields((prevFields) =>
                        prevFields.map((f, i) =>
                          i === index ? { ...f, mulPhone: value } : f
                        )
                      );
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        fields: prevErrors.fields.map((err, i) =>
                          i === index
                            ? {
                                ...err,
                                valMulPhone: !/^[0-9]{10,12}$/.test(value),
                              }
                            : err
                        ),
                      }));
                    }
                  }}
                  inputProps={{ maxLength: 10 }}
                  required
                  fullWidth
                  error={errors.fields[index]?.valMulPhone}
                  // helperText={
                  //   errors.fields[index]?.valMulPhone
                  //     ? "Invalid Phone Number"
                  //     : ""
                  // }
                />
              </Grid>
              <Grid item xs={2} md={2} sx={{ display: "flex", float: "right" }}>
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
              cancel
            </Button>
            <Button variant="contained" color="success" onClick={saveButton}>
              Save
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
