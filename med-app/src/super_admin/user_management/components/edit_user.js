import { Close, UploadFile } from "@mui/icons-material";
import {
  Avatar,
  Button,
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
import Toast from "components/Toast";
import { useEffect, useState } from "react";
export default function Edit_user({
  openEditUserDialog,
  closeDialogBox,
  userUpdateData,
  showToast,
  callList,
}) {
  // ---
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userImg, setUserImg] = useState("");
  const [userImgId, setUserImgId] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userRollId, setUserRollId] = useState("");
  const [userTenantName, setUserTenantName] = useState("");
  const [id, setId] = useState("");
  const [tenantNameId, setTenantNameId] = useState("");
  const [errors, setErrors] = useState({
    userName: false,
    userEmail: false,
    userPhone: false,
  });
  // validation error
  const validateFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,12}$/;
    const newErrors = {
      userName: !userName,
      userEmail: !userEmail || !emailRegex.test(userEmail),
      userPhone: !userPhone || !phoneRegex.test(userPhone),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  // update

  useEffect(() => {
    if (userUpdateData) {
      setUserName(userUpdateData.user_name);
      setUserEmail(userUpdateData.user_email);
      setUserPhone(userUpdateData.user_phone);
      setUserImg(userUpdateData.user_altered_file_name);
      setUserImgId(userUpdateData.user_img_id);
      setUserAddress(userUpdateData.user_address);
      setUserRollId(userUpdateData.role_id);
      setUserTenantName(userUpdateData.TenantData?.tenantname); // get tenantname
      setTenantNameId(userUpdateData.TenantData?.tenant_id); // get tenantId
      setId(userUpdateData.user_id);
      // console.log("userUpdataData-----", userUpdateData);
    }
  }, [userUpdateData]);

  const updateButton = async (eve) => {
    if (!validateFields()) {
      return;
    }
    let token = localStorage.getItem("token");
    try {
      const response = await fetch(Url.api + Url.userEdit, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          user_id: id,
          username: userName,
          email: userEmail,
          phone: userPhone,
          address: userAddress,
          role_id: userRollId,
          img_id: userImgId,
          tenant_id: tenantNameId,
        }),
      });
      const responceData = await response.json();
      console.log("res data", responceData);
      if (responceData.apiStatus.code === "200") {
        callList();
        showToast(responceData.apiStatus.message, "success");
      } else {
        showToast(responceData.apiStatus.message, "error");
        console.log(responceData.apiStatus.message, "error");
      }
    } catch (err) {
      console.log("error from fetch" + err);
    }
  };

  //   console.log(Ids, "this id");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dialog open={openEditUserDialog} onClose={closeDialogBox} maxWidth="sm">
        <DialogTitle
          display="flex"
          flexDirection={"column"}
          justifyContent="center"
          alignItems="center"
        >
          <Typography
            sx={{
              position: "absolute",
              left: 8,
              top: 12,
            }}
          >
            Edit user
          </Typography>
          <Avatar
            alt="No Photo"
            src={userImg}
            sx={{ width: 90, height: 90 }}
            align="center"
          />
          <Button variant="outlined" size="small" sx={{ mt: 1 }}>
            change picture
          </Button>
          {/* <Button
            variant="contained"
            color="success"
            size="small"
            sx={{ mt: 1 }}
          >
            updated picture
          </Button> */}
          <IconButton
            aria-label="close"
            onClick={closeDialogBox}
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
                value={userName}
                onChange={(e) => {
                  const value = e.target.value;
                  setUserName(value);
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
                value={userEmail}
                onChange={(e) => {
                  const value = e.target.value;
                  setUserEmail(value);
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

            <Grid item xs={12} md={6}>
              <TextField
                name="phone"
                label="Phone Number"
                variant="outlined"
                value={userPhone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value) && value.length <= 10) {
                    setUserPhone(value);
                    const phoneRegex = /^[0-9]{10}$/;
                    setErrors((prev) => ({
                      ...prev,
                      userPhone: !value
                        ? "It's a required field. Please fill in the value."
                        : !phoneRegex.test(value)
                        ? "Invalid value. Please enter a 10-digit number."
                        : "",
                    }));
                  }
                }}
                required
                fullWidth
                error={!!errors.userPhone}
                helperText={errors.userPhone}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                disabled
                name="tenantName"
                label="Tenant Name"
                variant="outlined"
                value={userTenantName}
                // onChange={(e) => setUserPhone(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                name="address"
                label="Address"
                value={userAddress}
                onChange={(e) => {
                  const value = e.target.value;
                  setUserAddress(value);
                  setErrors((prev) => ({
                    ...prev,
                    userAddress: !value
                      ? "It's a required field. Please fill in the value."
                      : "",
                  }));
                }}
                fullWidth
                multiline
                rows={4}
                error={!!errors.userAddress}
                helperText={errors.userAddress}
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
              onClick={closeDialogBox}
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
