import { Close } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Card,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import Url from "Api";
import { useEffect, useState } from "react";
export default function ViewTenant({
  openViewDialog,
  closeDialogbox,
  tenantId,
}) {
  const [viewData, setViewData] = useState(null);

  useEffect(() => {
    const fetchTenant = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }

      try {
        const response = await fetch(Url.api + Url.tenantView + tenantId, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.log("Network response was not ok");
          return;
        }

        const responseData = await response.json();
        console.log("Fetched data:", responseData);

        if (responseData.apiStatus.code === "200") {
          setViewData(responseData.result.TenantDetails);
        } else {
          console.log("Error from response:", responseData);
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };
    console.log(
      "this tenant view Api------",
      Url.api + Url.tenantView + tenantId
    );

    if (openViewDialog && tenantId) {
      fetchTenant();
    }
  }, [openViewDialog, tenantId]);

  const closeDialog = () => {
    closeDialogbox();
  };
  // console.log("img-----", Url.api + Url.showImg + item.user_altered_file_name);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dialog
        open={openViewDialog}
        onClose={closeDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography>Tenant Information</Typography>
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
          {viewData ? (
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: 240 }}>
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        flexBasis: "150px",
                        alignItems: "center",
                        backgroundColor: "#d6e3e7",
                        paddingBottom: "130px",
                      }}
                    >
                      <Avatar
                        sx={{ width: 90, height: 90, ml: 3, mt: 3 }}
                        alt="No Photo"
                        src={
                          Url.api +
                            Url.showImg +
                            viewData.tenant_altered_file_name !==
                          "0"
                            ? Url.api +
                              Url.showImg +
                              viewData.tenant_altered_file_name
                            : "no_photo.jpg"
                        }
                      />
                    </div>
                    <div style={{ marginLeft: "20px" }}>
                      <Typography>
                        Tenant Name
                        <Typography sx={{ color: "#808080" }}>
                          {viewData.tenant_name}
                        </Typography>
                      </Typography>
                      <Typography mt={1}>
                        Email
                        <Typography sx={{ color: "#808080" }}>
                          {viewData.email}
                        </Typography>
                      </Typography>
                      <Typography mt={1}>
                        Phone
                        <Typography sx={{ color: "#808080" }}>
                          {viewData.phone}
                        </Typography>
                      </Typography>
                      <Typography mt={1}>
                        Address
                        <Typography sx={{ color: "#808080" }}>
                          {viewData.address}
                        </Typography>
                      </Typography>
                    </div>
                  </div>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                {/* <Card> */}
                {/* <Typography variant="h6">User Details</Typography> */}

                <Grid container spacing={2}>
                  {viewData.userData.map((item, index) => (
                    <Grid item xs={12} key={index}>
                      <Paper
                        elevation={4}
                        sx={{ m: 2, backgroundColor: "#f1f1f1" }}
                      >
                        {/* <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        > */}
                        <div style={{ padding: "10px 25px" }}>
                          <Avatar
                            sx={{ width: 70, height: 70 }}
                            alt="No Photo"
                            src={
                              Url.api +
                                Url.showImg +
                                item.user_altered_file_name !==
                              "0"
                                ? Url.api +
                                  Url.showImg +
                                  item.user_altered_file_name
                                : "no_photo.jpg"
                            }
                          />
                          <Typography variant="subtitle1" sx={{ ml: 1.7 }}>
                            {item.role_name}
                          </Typography>
                        </div>
                        <div>
                          <div
                            style={{
                              display: "flex",
                              padding: "8px",
                              gap: "50px",
                            }}
                          >
                            <Typography>
                              Name
                              <Typography sx={{ color: "#808080" }}>
                                {item.user_name}
                              </Typography>{" "}
                            </Typography>
                            <Typography>
                              Email
                              <Typography sx={{ color: "#808080" }}>
                                {item.email}
                              </Typography>{" "}
                            </Typography>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              padding: "8px",
                              gap: "50px",
                            }}
                          >
                            <Typography>
                              Phone
                              <Typography sx={{ color: "#808080" }}>
                                {item.phone}
                              </Typography>
                            </Typography>
                            <Typography>
                              Address
                              <Typography sx={{ color: "#808080" }}>
                                {item.address}
                              </Typography>
                            </Typography>
                          </div>
                        </div>
                        {/* </div> */}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                {/* </Card> */}
              </Grid>
            </Grid>
          ) : (
            <Typography>No data available</Typography>
          )}
          <Button
            variant="contained"
            onClick={closeDialog}
            sx={{ color: "whitesmoke", float: "right", marginTop: "30px" }}
          >
            Close
          </Button>
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
