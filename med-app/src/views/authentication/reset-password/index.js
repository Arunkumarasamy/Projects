import {
  Card,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import CoverLayout from "../components/CoverLayout";

// Images
import bgImage from "assets/images/bg-reset-cover.jpeg";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import MDButton from "components/MDButton";
import { useEffect, useState } from "react";
import Toast from "components/Toast";
import MDBox from "components/MDBox";
import Url from "Api";
import { Navigate, useNavigate } from "react-router-dom";

export default function Reset_password() {
  const [password, setPassword] = useState("");
  const [conformPassword, setConformPassword] = useState("");
  const [tokenPass, setTokenPass] = useState("");
  const [errors, setErrors] = useState({
    password: false,
    conform_password: false,
  });

  const navigate = useNavigate();

  // validation pass
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const getPasswordHelperText = () => {
    if (!password) {
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
    const newErrors = {
      password: !password,
      conform_password: !conformPassword,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  // toast message

  const [openToast, setOpenToast] = useState("");
  const [severityToast, setSeverityToast] = useState("success"); // error,warning,info
  const [messageToast, setMessageToast] = useState("");

  const showToast = (msg, severity) => {
    setMessageToast(msg);
    setSeverityToast(severity);
    setOpenToast(true);
  };

  // get the value from url
  useEffect(() => {
    const queryParams = window.location.pathname;
    const myArray = queryParams.split("/");
    console.log(myArray[2]);
    var token = myArray[2];

    if (token) {
      setTokenPass(token);
      validateToken(token);
    }
  }, []);

  // token validate

  const validateToken = async (token) => {
    const response = await fetch(Url.api + Url.tokenValidate + tokenPass, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        // Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        token: token,
      }),
    });
    try {
      const responceData = await response.json();
      console.log(responceData);

      if (responceData.code == "200") {
        showToast(responceData.apiStatus.message, "success");
      } else {
        showToast(responceData.apiStatus.message, "error");
      }
    } catch (error) {
      console.log("Error handled =" + error);
    }
  };

  const saveButton = async (eve) => {
    if (!validateFields()) {
      return;
    }
    const token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.resetPass + tokenPass, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        new_password: password,
        confirm_password: conformPassword,
      }),
    });
    try {
      const responseData = await response.json();
      console.log("responseData-----", responseData);
      if (responseData.apiStatus.code == "200") {
        showToast(responseData.apiStatus.message, "success");
        navigate("/login");
        localStorage.setItem("token", responseData.responseData.token);
      } else {
        showToast(responseData.apiStatus.message, "error");
      }
    } catch (err) {
      console.log("error api not fetch", err);
    }
  };
  const closeToast = () => {
    setOpenToast(false);
  };

  return (
    <CoverLayout coverHeight="50vh" image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          py={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h5" fontWeight="medium" color="white" mt={1}>
            Create Password
          </MDTypography>
        </MDBox>
        <Grid container spacing={2} pt={4} pb={3} px={3}>
          <Grid item xs={12} md={12}>
            <TextField
              name="password"
              label="New Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={password}
              onChange={(e) => {
                const password = e.target.value;
                setPassword(password);
                validatePassword(password);
              }}
              fullWidth
              required
              error={errors.createPassword}
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
          <Grid item xs={12} md={12}>
            <TextField
              name="conform_password"
              type="password"
              label="Conform Password"
              variant="outlined"
              value={conformPassword}
              onChange={(e) => setConformPassword(e.target.value)}
              required
              fullWidth
              error={errors.conform_password}
              helperText={
                errors.conform_password ? "Conform password is required" : ""
              }
            />
          </Grid>
          <MDBox mt={4} mb={1} ml={15}>
            <MDButton
              variant="gradient"
              color="info"
              fullWidth
              onClick={saveButton}
            >
              Save
            </MDButton>
          </MDBox>
        </Grid>
      </Card>
      <Toast
        open={openToast}
        severity={severityToast}
        message={messageToast}
        handleClose={closeToast}
      />
    </CoverLayout>
  );
}
