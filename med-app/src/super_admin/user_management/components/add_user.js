import {
  Close,
  UploadFile,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Autocomplete,
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
import Toast from "components/Toast";
import { useEffect, useRef, useState } from "react";

export default function Add_user({
  openAddUserDialog,
  closeDialogBox,
  setRefresh,
  showToast,
}) {
  const [u_name, setU_name] = useState("");
  const [u_email, setU_email] = useState("");
  const [u_phone, setU_phone] = useState("");
  const [u_password, setU_password] = useState("");
  const [u_img, setU_img] = useState("");
  const [u_address, setU_address] = useState("");
  const [t_id, setT_id] = useState(null);
  const [errors, setErrors] = useState({
    userName: false,
    email: false,
    password: false,
    phone: false,
    address: false,
    tenant: false,
    // user_img: false,
  });

  const [fileName, setFileName] = useState("No image uploaded");

  // validation pass
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const getPasswordHelperText = () => {
    if (!u_password) {
      return "Password is required";
    }
    if (passwordStrength === "Too Short") {
      return "Password must be at least 8 characters";
    }
    if (passwordStrength === "Weak") {
      return "Password should include numbers and special characters";
    }
    return "";
  };

  const getPasswordHelperColor = () => {
    switch (passwordStrength) {
      case "Too Short":
        return "red";
      case "Weak":
        return "orange";
      case "Strong":
        return "green";
      default:
        return "";
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength = password.length >= minLength;

    if (!isValidLength) {
      setPasswordStrength("Too Short");
      return false;
    } else if (!hasNumber || !hasSpecialChar) {
      setPasswordStrength("Weak");
      return false;
    } else if (hasNumber && hasSpecialChar && isValidLength) {
      setPasswordStrength("Strong");
      return true;
    }
    return false;
  };

  // validation error
  const validateFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,12}$/;
    const newErrors = {
      userName: !u_name,
      email: !u_email || !emailRegex.test(u_email),
      password: !u_password || !validatePassword(u_password),
      phone: !u_phone || !phoneRegex.test(u_phone),
      // user_img: !u_img,
      address: !u_address,
      tenant: !t_id,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  // close
  const closeDialog = () => {
    closeDialogBox();
  };

  // save button
  const saveButton = async (eve) => {
    if (!validateFields()) {
      return;
    }
    const token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.userCreate, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        username: u_name,
        email: u_email,
        password: u_password,
        phone: u_phone,
        address: u_address,
        user_image: u_img,
        tenant_id: t_id,
      }),
    });
    try {
      const responceData = await response.json();
      console.log(responceData);
      if (responceData.apiStatus.code == "200") {
        setRefresh();
        showToast(responceData.apiStatus.message, "success");
      } else {
        showToast(responceData.apiStatus.message, "error");
      }
    } catch (error) {
      console.log("Error handled =" + error);
    }
  };

  // tenant name dropdown fetch
  const [openTenant, setOpenTenant] = useState(false);
  const [tenantOptions, setTenantOptions] = useState([]);
  const [tenantLoading, setTenantLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (openTenant) {
      setTenantLoading(true);
      fetch(Url.api + Url.userTenantDropDown, {
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
          const tenants = data.result.TenantData.map((item) => ({
            title: item.tenant_name,
            id: item.id,
          }));

          setTenantOptions(tenants); // Update state with the data
          setTenantLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching vendors:", error);
          setTenantLoading(false);
        });
    }
  }, [openTenant]);

  const handleTenantChange = (event, value) => {
    if (value) {
      setT_id(value.id);
      setErrors((prevErrors) => ({ ...prevErrors, tenant: false }));
      console.log("Selected Tenant ID:", value.id);
    } else {
      setT_id(null);
      setErrors((prevErrors) => ({ ...prevErrors, tenant: true }));
    }
  };

  //  upload file

  const imgTextField2 = useRef(null);

  const uploadFile = async (file) => {
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
      console.log("image upload--api", Url.api + Url.imgUpload);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("File uploaded successfully:", data.message);
      showToast(data.apiStatus.message, "success");
    } catch (error) {
      console.error("Error uploading file:", error);
      showToast("Error uploading file. Please try again.", "error");
    }
  };

  const handleTextFieldClick2 = () => {
    imgTextField2.current.click();
  };

  const userImgChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name); // Set the file name to display in the TextField
      setU_img(file.id);
      uploadFile(file);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dialog open={openAddUserDialog} onClose={closeDialog} maxWidth="sm">
        <DialogTitle>
          <Typography>Add User</Typography>
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
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} mt={2}>
              <TextField
                // sx={{ ml: 5 }}
                name="user_name"
                label="User Name"
                variant="outlined"
                value={u_name}
                onChange={(e) => {
                  const value = e.target.value;
                  setU_name(value);
                  setErrors((prev) => ({
                    ...prev,
                    userName: !value
                      ? "It's a required field. Please fill in the value."
                      : "",
                  }));
                }}
                required
                fullWidth
                error={!!errors.userName}
                helperText={errors.userName}
              />
            </Grid>

            <Grid item xs={12} md={6} mt={2}>
              <TextField
                name="email"
                label="Email"
                variant="outlined"
                value={u_email}
                onChange={(e) => {
                  const value = e.target.value;
                  setU_email(value);
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  setErrors((prev) => ({
                    ...prev,
                    email: !value
                      ? "It's a required field. Please fill in the value."
                      : !emailRegex.test(value)
                      ? "Invalid value. Please enter a valid email."
                      : "",
                  }));
                }}
                required
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            <Grid item xs={6} md={6}>
              <TextField
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={u_password}
                onChange={(e) => {
                  const password = e.target.value;
                  setU_password(password);
                  validatePassword(password);
                }}
                fullWidth
                required
                // error={errors.password}
                helperText={getPasswordHelperText()}
                FormHelperTextProps={{
                  style: { color: getPasswordHelperColor() },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="phone"
                label="Phone Number"
                variant="outlined"
                value={u_phone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value) && value.length <= 10) {
                    setU_phone(value);
                    const phoneRegex = /^[0-9]{10}$/;
                    setErrors((prev) => ({
                      ...prev,
                      phone: !value
                        ? "It's a required field. Please fill in the value."
                        : !phoneRegex.test(value)
                        ? "Invalid value. Please enter a 10-digit number."
                        : "",
                    }));
                  }
                }}
                error={!!errors.phone}
                inputProps={{ maxLength: 12 }}
                helperText={errors.phone}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                id="tenant"
                sx={{ width: 265 }}
                open={openTenant}
                onOpen={() => setOpenTenant(true)}
                onClose={() => setOpenTenant(false)}
                isOptionEqualToValue={(option, value) =>
                  option.title === value.title
                }
                getOptionLabel={(option) => option.title} //----------
                options={tenantOptions}
                loading={tenantLoading}
                onChange={handleTenantChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tenant Name"
                    required
                    error={errors.tenant}
                    helperText={errors.tenant ? "TenantName is required" : ""}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {tenantLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                    InputLabelProps={{
                      style: { fontSize: "17px" },
                    }}
                    inputProps={{
                      ...params.inputProps,
                      style: {
                        height: "35px",
                        padding: "0 7px",
                        fontSize: "14px",
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
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                fullWidth
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                label="User image"
                value={u_img ? u_img.name : ""}
                name="image"
                onClick={handleTextFieldClick2}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <input
                        accept="image/*"
                        ref={imgTextField2}
                        style={{ display: "none" }}
                        id="img-upload-button"
                        type="file"
                        onChange={userImgChange}
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
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "primary.dark",
                          },
                        }}
                      >
                        Select image
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                name="address"
                label="Address"
                value={u_address}
                onChange={(e) => {
                  const value = e.target.value;
                  setU_address(value);
                  setErrors((prev) => ({
                    ...prev,
                    address: !value
                      ? "It's a required field. Please fill in the value."
                      : "",
                  }));
                }}
                error={!!errors.address}
                helperText={errors.address}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
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
