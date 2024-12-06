import { Close } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Box,
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

export default function Edit_tanent({
  openEdittenant,
  closeDialogbox,
  tenantData,
  callList,
  showToast,
}) {
  const [t_name, setT_name] = useState("");
  const [t_email, setT_email] = useState("");
  const [t_phone, setT_phone] = useState("");
  const [t_address, setT_address] = useState("");
  const [t_id, setT_id] = useState(null);
  const [t_img, setT_img] = useState("");
  const [t_img_id, setT_img_id] = useState(null);
  const [buttonState, setButtonState] = useState("default"); // Track button state
  const [errors, setErrors] = useState({
    tenantName: false,
    tenantEmail: false,
    password: false,
    tenantPhone: false,
    tenantAddress: false,
  });

  // validation error
  const validateFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,12}$/;
    const newErrors = {
      tenantName: !t_name,
      tenantEmail: !t_email || !emailRegex.test(t_email),
      tenantPhone: !t_phone || !phoneRegex.test(t_phone),
      tenantAddress: !t_address,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  // close------
  const closeDialog = () => {
    closeDialogbox();
  };

  // upload img
  const uploadTenantImg = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    let token = localStorage.getItem("token");
    try {
      const response = await fetch(Url.api + Url.imgUpload, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setT_img_id(data.responseData.Avatar_ID);
        setT_img(Url.api + data.responseData.File_Original_Name);
        setButtonState("success"); // Set button state to success
        showToast(data.apiStatus.message, "success");
      } else {
        showToast(data.apiStatus.message, "error");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setButtonState("error"); // Set button state to error on failure
      showToast("Error uploading file....", "error");
    }
  };

  const changeImg = async (event) => {
    try {
      const [fileHandle] = await window.showOpenFilePicker();
      const file = await fileHandle.getFile();
      if (file) {
        //   setFileName(file.name); // Set the file name to display in the TextField
        setT_img_id(file.tenant_img_id);
        setT_img(Url.api + file.tenant_img_path);

        //   setImgPath(file.Path);
        uploadTenantImg(file);
      }
    } catch {
      console.log("Error selecting file:");
    }
  };

  // tobind the data update
  useEffect(() => {
    if (tenantData) {
      setT_id(tenantData.id);
      setT_name(tenantData.tenant_name);
      setT_email(tenantData.email);
      setT_phone(tenantData.phone);
      setT_address(tenantData.address);
      setT_img(Url.api + tenantData.tenant_img_path);
      setT_img_id(tenantData.tenant_img_id);
    }
  }, [tenantData]);
  console.log("setImgID-----", setT_img_id);

  // update
  const updateButton = async (eve) => {
    if (!validateFields()) {
      return;
    }
    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.tenantEdit, {
      method: "PUT",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        id: t_id,
        tenantname: t_name,
        email: t_email,
        phone: t_phone,
        address: t_address,
        img_id: t_img_id,
      }),
    });
    try {
      const responceData = await response.json();
      if (responceData.apiStatus.code == "200") {
        callList();
        showToast(responceData.apiStatus.message, "success");
      } else {
        showToast(responceData.apiStatus.message, "error");
        console.log("check netwok in payload");
      }
    } catch {
      console.log("fetch error");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dialog open={openEdittenant} onClose={closeDialog} maxWidth="sm">
        <DialogTitle>
          <Typography>Edit Tenant</Typography>

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
              src={t_img}
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
              onClick={changeImg}
            >
              {buttonState === "success" ? "Image Updated" : "Change icon"}
            </Button>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4} mt={2}>
                <TextField
                  // sx={{ ml: 5 }}
                  name="tenant_name"
                  label="Tenant Name"
                  variant="outlined"
                  value={t_name}
                  onChange={(e) => {
                    const value = e.target.value;
                    setT_name(value);
                    setErrors((prev) => ({
                      ...prev,
                      tenantName: !value
                        ? "It's a required field. Please fill in the value."
                        : "",
                    }));
                  }}
                  required
                  fullWidth
                  error={!!errors.tenantName}
                  helperText={errors.tenantName}
                />
              </Grid>

              <Grid item xs={12} md={4} mt={2}>
                <TextField
                  name="email"
                  label="Email"
                  variant="outlined"
                  value={t_email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setT_email(value);
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    setErrors((prev) => ({
                      ...prev,
                      tenantEmail: !value
                        ? "It's a required field. Please fill in the value."
                        : !emailRegex.test(value)
                        ? "Invalid value. Please enter a valid email."
                        : "",
                    }));
                  }}
                  required
                  fullWidth
                  error={!!errors.tenantEmail}
                  helperText={errors.tenantEmail}
                />
              </Grid>
              <Grid item xs={12} md={4} mt={2}>
                <TextField
                  name="phone"
                  label="Phone Number"
                  variant="outlined"
                  value={t_phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && value.length <= 10) {
                      setT_phone(value);
                      const phoneRegex = /^[0-9]{10}$/;
                      setErrors((prev) => ({
                        ...prev,
                        tenantPhone: !value
                          ? "It's a required field. Please fill in the value."
                          : !phoneRegex.test(value)
                          ? "Invalid value. Please enter a 10-digit number."
                          : "",
                      }));
                    }
                  }}
                  error={!!errors.tenantPhone}
                  inputProps={{ maxLength: 12 }}
                  helperText={errors.tenantPhone ? "Phone is required" : ""}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  name="address"
                  label="Address"
                  value={t_address}
                  onChange={(e) => {
                    const value = e.target.value;
                    setT_address(value);
                    setErrors((prev) => ({
                      ...prev,
                      tenantAddress: !value
                        ? "It's a required field. Please fill in the value."
                        : "",
                    }));
                  }}
                  error={!!errors.tenantAddress}
                  helperText={errors.tenantAddress}
                  fullWidth
                  multiline
                  rows={4}
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
