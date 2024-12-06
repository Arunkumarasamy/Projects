import { Card, TextField } from "@mui/material";
import BasicLayout from "../components/BasicLayout";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import Toast from "components/Toast";
import Url from "Api";

// img
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { useState } from "react";

export default function Forgot_pass() {
  const [userEmail, setUserEmail] = useState("");
  const [errors, setErrors] = useState({
    userEmail: false,
  });

  // validation error
  const validateFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {
      userEmail: !userEmail || !emailRegex.test(userEmail),
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
  const closeToast = () => {
    setOpenToast(false);
  };

  const forgot_pass = async (eve) => {
    if (!validateFields()) {
      return;
    }
    const token = localStorage.getItem("token");
    // const response = await fetch(Url.api + Url.forgotPass, {
    const response = await fetch(Url.api + Url.forgotPass, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        email_id: userEmail,
        url: "http://localhost:3000/reset_password",
      }),
    });
    try {
      const responseData = await response.json();
      console.log("responseData-----", responseData);
      if (responseData.apiStatus.code == "200") {
        showToast(responseData.apiStatus.message, "success");
        localStorage.setItem("token", responseData.responseData.token);
      } else {
        showToast(responseData.apiStatus.message, "error");
      }
    } catch (err) {
      console.log("error api not fetch", err);
    }
  };

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
          Forgot password
        </MDTypography>
        <MDBox pt={4} pb={3} px={3}>
          <TextField
            // type="email"
            onChange={(e) => {
              setUserEmail(e.target.value);
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
          <MDBox mt={3} mb={1} width={50} height={10} ml={14}>
            <MDButton
              variant="gradient"
              color="info"
              size="small"
              fullWidth
              onClick={forgot_pass}
            >
              Send
            </MDButton>
          </MDBox>
        </MDBox>
        <Toast
          open={openToast}
          severity={severityToast}
          message={messageToast}
          handleClose={closeToast}
        />
      </Card>
    </BasicLayout>
  );
}
