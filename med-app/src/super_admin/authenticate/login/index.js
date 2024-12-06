import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Basic_layout from "../component/basic_layout";
import { Card, IconButton, InputAdornment } from "@mui/material";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import Toast from "components/Toast";

import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { useUser } from "userContext";
import Url from "Api";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function Login_super_admin() {
  const navigate = useNavigate("");

  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errors, setErrors] = useState({
    userEmail: false,
    userPassword: false,
  });

  // validation pass
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // validation error
  const validateFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {
      userEmail: !userName || !emailRegex.test(userName),
      userPassword: !userPassword,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
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

  const { user, changeRole } = useUser();

  const login = async (e) => {
    if (!validateFields()) {
      return;
    }
    const response = await fetch(Url.api + Url.login, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        // Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        loginType: "Super_admin",
        email_id: userName,
        password: userPassword,
      }),
    });
    try {
      const responceData = await response.json();
      console.log(responceData);
      // console.log("token",)
      // setLoading(false);
      if (responceData.apiStatus.code == "200") {
        showToast(responceData.apiStatus.message, "success");

        localStorage.setItem("token", responceData.responseData.token);
        localStorage.setItem("user_role", "super_admin");
        navigate("/super_admin");
        // changeRole("super_admin");

        console.log(responceData.apiStatus.message + "this message");
        // console.log(responceData.responseData.token + "this token");
      } else {
        showToast(responceData.apiStatus.message, "error");
      }
    } catch (error) {
      console.log("Error handled =" + error);
    }
  };

  const [rememberMe, setRememberMe] = useState(false);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  // changes-------------

  const handleRoleChange = (event) => {
    changeRole(event.target.value);
  };

  return (
    <Basic_layout image={bgImage}>
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
              <MDInput
                type="email"
                onChange={(e) => setUserName(e.target.value)}
                label="Email"
                required
                error={errors.userEmail}
                helperText={errors.userEmail ? "Email is required" : ""}
                fullWidth
              />
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                onChange={(e) => setUserPassword(e.target.value)}
                fullWidth
                required
                error={errors.userPass}
                helperText={errors.userPass ? "password is required" : ""}
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
            <Toast
              open={openToast}
              severity={severityToast}
              message={messageToast}
              handleClose={closeToast}
            />
          </MDBox>
        </MDBox>
      </Card>
    </Basic_layout>
  );
}
