import {
  Close,
  UploadFile,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Box,
  CssBaseline,
  Dialog,
  DialogTitle,
  IconButton,
  InputAdornment,
  Step,
  Button,
  Typography,
  Stepper,
  StepLabel,
  TextField,
  ThemeProvider,
  createTheme,
  Grid,
  Card,
  CardHeader,
  CardContent,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Divider,
  Stack,
} from "@mui/material";
import Url from "Api";
import Toast from "components/Toast";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddTenant({
  openDialogAddTenant,
  closeDialog,
  refreshList,
  showToast,
}) {
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

  //  create
  const [t_name, setT_name] = useState("");
  const [t_email, setT_email] = useState("");
  const [t_phone, setT_phone] = useState("");
  const [t_img, setT_img] = useState("");
  const [t_imgId, setT_imgId] = useState(null);
  const [t_address, setT_address] = useState("");

  // const [fileName, setFileName] = useState("No image uploaded");

  const [u_name, setU_name] = useState("");
  const [u_email, setU_email] = useState("");
  const [u_phone, setU_phone] = useState("");
  const [u_password, setU_password] = useState("");
  const [u_img, setU_img] = useState("");
  const [u_imgId, setU_imgId] = useState(null);
  const [u_address, setU_address] = useState("");

  // error handling
  const [errors, setErrors] = useState({
    tenantName: false,
    tenantEmail: false,
    tenantMobile: false,
    tenantAddress: false,
    tenantImage: false,
    // user manotry
    userName: false,
    userEmail: false,
    password: false,
    userMobile: false,
    userAddress: false,
    userImage: false,
  });

  // validation error
  const validateFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,12}$/;
    const newErrors = {
      tenantName: !t_name,
      tenantEmail: !t_email || !emailRegex.test(t_email),
      tenantMobile: !t_phone || !phoneRegex.test(t_phone),
      tenantImage: !t_img,
      tenantAddress: !t_address,
      userName: !u_name,
      userEmail: !u_email || !emailRegex.test(u_email),
      password: !u_password || !validatePassword(u_password),
      userMobile: !u_phone || !phoneRegex.test(u_phone),
      userAddress: !u_address,
      userImage: !u_img,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  //  upload img tenant
  const imgTextField1 = useRef(null);

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
        setT_imgId(data.responseData.Avatar_ID);
        setT_img(data.responseData.File_Original_Name);
        console.log("File uploaded successfully:", data.apiStatus.message);
        showToast(data.apiStatus.message, "success");
      } else {
        showToast(data.apiStatus.message, "error");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      showToast("Error uploading file....", "error");
    }
  };

  const handleTextFieldClick1 = () => {
    imgTextField1.current.click();
  };

  const tenantImgChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setT_img(file.File_Original_Name); // Set the file name to display in the TextField
      setT_imgId(file.Avatar_ID);
      uploadTenantImg(file);
    }
  };

  //upload img user
  const imgTextField2 = useRef(null);

  const uploadUserImg = async (file) => {
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
        setU_imgId(data.responseData.Avatar_ID);
        setU_img(data.responseData.File_Original_Name);
        console.log("File uploaded successfully:", data.apiStatus.message);
        showToast(data.apiStatus.message, "success");
      } else {
        showToast(data.apiStatus.message, "error");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      showToast("Error uploading file...", "error");
    }
  };

  const handleTextFieldClick2 = () => {
    imgTextField2.current.click();
  };

  const userImgChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setU_img(file.File_Original_Name); // Set the file name to display in the TextField
      setU_imgId(file.Avatar_ID);
      uploadUserImg(file);
    }
  };

  // save tenant

  const saveTanent = async (eve) => {
    if (!validateFields()) {
      return;
    }
    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.tenantCreate, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        tenantname: t_name,
        email: t_email,
        phone: t_phone,
        img_id: t_imgId,
        address: t_address,
        userrecord: {
          username: u_name,
          email: u_email,
          password: u_password,
          phone: u_phone,
          img_id: u_imgId,
          address: u_address,
        },
      }),
    });
    try {
      const responceData = await response.json();
      console.log(responceData);

      if (responceData.apiStatus.code == "200") {
        refreshList();
        setT_name("");
        setT_email("");
        setT_phone("");
        setT_img("");
        setT_imgId("");
        setT_address("");
        setU_name("");
        setU_email("");
        setU_phone("");
        setU_password("");
        setU_img("");
        setU_imgId("");
        setU_address("");
        showToast(responceData.apiStatus.message, "success");
      } else {
        showToast(responceData.apiStatus.message, "error");
        console.log("error");
      }
    } catch (error) {
      console.log("error from conntection" + error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dialog
        open={openDialogAddTenant}
        onClose={closeDialog}
        maxWidth="sm"
        // fullWidth
      >
        <DialogTitle>
          <Typography>Add Tenant</Typography>
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
            <Grid item xs={6} sm={6} md={6} mt={2}>
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
            <Grid item xs={6} sm={6} md={6} mt={2}>
              <TextField
                name="email"
                label="Email"
                placeholder="example@gmail.com"
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
            <Grid item xs={6} sm={6} md={6}>
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
                      tenantMobile: !value
                        ? "It's a required field. Please fill in the value."
                        : !phoneRegex.test(value)
                        ? "Invalid value. Please enter a 10-digit number."
                        : "",
                    }));
                  }
                }}
                error={!!errors.tenantMobile}
                inputProps={{ maxLength: 10 }}
                helperText={errors.tenantMobile}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <TextField
                variant="outlined"
                fullWidth
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                label="Tenant image"
                value={t_img ? t_img : "choose image..."}
                name="image"
                onClick={handleTextFieldClick1}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <input
                        accept="*"
                        style={{ display: "none" }}
                        id="img-upload-file"
                        type="file"
                        ref={imgTextField1}
                        onChange={tenantImgChange}
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
            <Grid item xs={12} sm={12} md={12}>
              <Divider />
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <TextField
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
            <Grid item xs={6} sm={6} md={6}>
              <TextField
                name="user_email"
                label="Email"
                variant="outlined"
                value={u_email}
                onChange={(e) => {
                  const value = e.target.value;
                  setU_email(value);
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  setErrors((prev) => ({
                    ...prev,
                    userEmail: !value
                      ? "It's a required field. Please fill in the value."
                      : !emailRegex.test(value)
                      ? "Invalid value. Please enter a valid email."
                      : "",
                  }));
                }}
                required
                fullWidth
                error={!!errors.userEmail}
                helperText={errors.userEmail}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
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
            <Grid item xs={6} sm={6} md={6}>
              <TextField
                name="user_phone"
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
                      userMobile: !value
                        ? "It's a required field. Please fill in the value."
                        : !phoneRegex.test(value)
                        ? "Invalid value. Please enter a 10-digit number."
                        : "",
                    }));
                  }
                }}
                error={!!errors.userMobile}
                inputProps={{ maxLength: 12 }}
                helperText={errors.userMobile ? "Phone is required" : ""}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
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
                value={u_img ? u_img : "choose image..."}
                name="image"
                onClick={handleTextFieldClick2}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <input
                        accept="image/*"
                        ref={imgTextField2} // Attach the ref to the input
                        style={{ display: "none" }}
                        id="file-upload-button-user"
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
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                name="user_address"
                label="Address"
                value={u_address}
                onChange={(e) => {
                  const value = e.target.value;
                  setU_address(value);
                  setErrors((prev) => ({
                    ...prev,
                    userAddress: !value
                      ? "It's a required field. Please fill in the value."
                      : "",
                  }));
                }}
                error={!!errors.userAddress}
                helperText={errors.userAddress}
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
            <Button variant="contained" color="success" onClick={saveTanent}>
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

// steps
function getSteps() {
  return ["Create tenant", "Create user"];
}
