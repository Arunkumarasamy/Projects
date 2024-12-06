import { useState } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "views/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import Toast from "components/Toast";
import Url from "Api";
import {
  Close,
  HighlightOff,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

function Basic({ updateLoginState }) {
  const navigate = useNavigate("");

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorHandling, setErrorHandling] = useState("");
  const [fetchError, setFetchError] = useState(false);
  const [errors, setErrors] = useState({
    userEmail: false,
    userPassword: false,
  });

  // validation error
  const validateFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {
      userEmail: !userName || !emailRegex.test(userName),
      userPassword: !password,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  // validation pass
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // toast message
  const [openToast, setOpenToast] = useState("");
  const [severityToast, setSeverityToast] = useState("success"); // error,warning,info
  const [messageToast, setMessageToast] = useState("");
  // show toast

  const showToast = (msg, severity) => {
    setMessageToast(msg);
    setSeverityToast(severity);
    setOpenToast(true);
  };
  const closeToast = () => {
    setOpenToast(false);
  };
  // delay timing
  const delay = () => {
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  const login = async (e) => {
    if (!validateFields()) {
      return;
    }
    // e.preventDefault();
    // setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(Url.api + Url.userLogin, {
        method: "POST",
        headers: {
          "content-type": "appilication/json",
          // Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          loginType: "admin",
          email_id: userName,
          password: password,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const responceData = await response.json();
      console.log(responceData);
      // console.log("token",)
      // setLoading(false);
      if (responceData.apiStatus.code == "200") {
        showToast(responceData.apiStatus.message, "success");
        delay();
        // localStorage.setItem("token", responceData.responseData.token);
        // MDProgress();
        // delay();
        updateLoginState(responceData.responseData.token);
        localStorage.setItem("user_role", "admin");
        console.log(responceData.apiStatus.message + "this message");
        navigate("/dashboard");

        // console.log(responceData.responseData.token + "this token");
      } else {
        showToast(responceData.apiStatus.message, "error");
      }
    } catch (error) {
      setErrorHandling("Service not found");
      showToast("Service not found. Please try again after sometime.", "error");
      // setFetchError(true);
      console.log("Error handled =" + error);
      // console.log("this login api----", Url.api + Url.userLogin);
    }
  };
  const closeDialog = () => {
    setFetchError(false);
  };

  const [rememberMe, setRememberMe] = useState(false);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDTypography
          variant="h4"
          textAlign="center"
          fontWeight="medium"
          color="info"
          mt={1}
        >
          Login
        </MDTypography>

        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <TextField
                onChange={(e) => {
                  setUserName(e.target.value);
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    userEmail: false,
                  }));
                }}
                label="Email"
                fullWidth
                required
                error={errors.userEmail}
                helperText={errors.userEmail ? "Invalid email address" : ""}
              />
            </MDBox>
            <MDBox mb={2}>
              <TextField
                name="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    userPassword: false,
                  }));
                }}
                label="Password"
                type={showPassword ? "text" : "password"}
                required
                error={errors.userPassword}
                helperText={errors.userPassword ? "password is required" : ""}
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
                fullWidth
              />
            </MDBox>
            <MDBox align="right">
              <MDTypography
                component={Link}
                to="/forgot_password"
                variant="button"
                color="info"
                fontWeight="medium"
                // float="right"

                textGradient
                // sx={{ float: "right" }}
              >
                Forget password?
              </MDTypography>
            </MDBox>
            <MDBox mt={1} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                onClick={login}
              >
                Login
              </MDButton>
            </MDBox>
            {/* <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  // to="/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Register
                </MDTypography>
              </MDTypography>
            </MDBox> */}
            <Toast
              open={openToast}
              severity={severityToast}
              message={messageToast}
              handleClose={closeToast}
            />
          </MDBox>
        </MDBox>

        <CustomDialog open={fetchError} onClose={closeDialog}>
          <DialogTitle sx={{ textAlign: "center", fontSize: 80, color: "red" }}>
            <HighlightOff />

            <IconButton
              aria-label="close"
              onClick={closeDialog}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "grey",
                "&:hover": {
                  color: "tomato",
                },
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ textAlign: "center" }}>
              Unable to fetch data
            </Typography>
          </DialogContent>
          {/* <DialogActions sx={{ textAlign: "center" }}>
                <Button
                  onClick={closeDialog}
                  sx={{
                    backgroundColor: "#f44336",
                    color: "#F5F5F5",
                    "&:hover": {
                      backgroundColor: "#d32f2f",
                      color: "#F5F5F5",
                    },
                  }}
                >
                  Ok
                </Button>
              </DialogActions> */}
        </CustomDialog>
      </Card>
    </BasicLayout>
  );
}

export default Basic;

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: 300, // Set the fixed width (in pixels)
    height: 250, // Set the fixed height (in pixels)
  },
}));
