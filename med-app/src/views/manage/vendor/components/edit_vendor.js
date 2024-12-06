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
import { useEffect, useState } from "react";

export default function Edit_vendor({
  openDialog,
  closeDialogBox,
  selectedValue,
  callList,
  showToast,
}) {
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gstNum, setGstNum] = useState("");
  const [address, setAddress] = useState("");
  // add items
  const [fields, setFields] = useState([
    {
      ContactPersonId: 0,
      ContactPersonName: "",
      ContactPersonMobile: "",
      ContactPersonEmail: "",
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
        valMulName: field.ContactPersonName.trim() === "",
        valMulEmail: !emailRegex.test(field.ContactPersonEmail),
        valMulPhone: !phoneRegex.test(field.ContactPersonMobile),
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
    setFields((prevFields) => [
      ...prevFields,
      {
        ContactPersonId: prevFields.length + 1,
        ContactPersonName: "",
        ContactPersonEmail: "",
        ContactPersonMobile: "",
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

  // close
  const closeDialog = () => {
    closeDialogBox();
  };

  // bind the value
  useEffect(() => {
    if (selectedValue) {
      setId(selectedValue.VendorId); // id----
      setName(selectedValue.VendorName);
      setEmail(selectedValue.VendorEmail);
      setPhone(selectedValue.VendorMobile);
      setGstNum(selectedValue.VendorGST);
      setAddress(selectedValue.VendorAddress);
      setFields(selectedValue.ContactPersons);
    }
  }, [selectedValue]);

  // update call
  const updateButton = async (eve) => {
    if (!validateFields()) {
      return;
    }
    eve.preventDefault();
    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.vendorEdit, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        VendorId: id,
        VendorName: name,
        VendorEmail: email,
        VendorMobile: phone,
        VendorAddress: address,
        VendorGST: gstNum,
        ContactPersons: fields.map((val) => ({
          ContactPersonId: val.ContactPersonId,
          ContactPersonName: val.ContactPersonName,
          ContactPersonEmail: val.ContactPersonEmail,
          ContactPersonMobile: val.ContactPersonMobile,
        })),
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
        open={openDialog}
        onClose={closeDialog}
        // maxWidth="sm"
        sx={{
          width: "800px", // Adjust these values as needed
          height: "550px",
          margin: "auto", // Center horizontally
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>
          <Typography>Edit vendor</Typography>
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
                value={name}
                onChange={(e) => {
                  const value = e.target.value;
                  setName(value);
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    valName: value.trim() === "",
                  }));
                }}
                required
                fullWidth
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
                // required
                fullWidth
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
                // required
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
                  value={field.ContactPersonName}
                  // onChange={(e) => {
                  //   setFields(
                  //     fields.map((f, i) =>
                  //       i === index
                  //         ? { ...f, ContactPersonName: e.target.value }
                  //         : f
                  //     )
                  //   );
                  // }}
                  onChange={(e) => {
                    setFields(
                      fields.map((f, i) =>
                        i === index
                          ? { ...f, ContactPersonName: e.target.value }
                          : f
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
                  value={field.ContactPersonEmail}
                  onChange={(e) => {
                    setFields(
                      fields.map((f, i) =>
                        i === index
                          ? { ...f, ContactPersonEmail: e.target.value }
                          : f
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
                  fullWidth
                  error={errors.fields[index]?.valMulEmail}
                  // helperText={
                  //   errors.fields[index]?.valMulEmail
                  //     ? "Invalid Email Address"
                  //     : ""
                  // }
                />
              </Grid>
              <Grid item xs={3} md={3}>
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  value={field.ContactPersonMobile}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && value.length <= 12) {
                      setFields((prevFields) =>
                        prevFields.map((f, i) =>
                          i === index ? { ...f, ContactPersonMobile: value } : f
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
            <Button variant="contained" color="success" onClick={updateButton}>
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
