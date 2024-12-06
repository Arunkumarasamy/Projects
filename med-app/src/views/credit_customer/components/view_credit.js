import { Close, CurrencyRupee, Padding } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Grid,
  Paper,
  Card,
  ThemeProvider,
  CssBaseline,
  createTheme,
  IconButton,
} from "@mui/material";

export default function View_Credit({
  viewDialog,
  backButton,
  closeDialogbox,
}) {
  const closeDialog = () => {
    closeDialogbox();
  };
  return (
    // <ThemeProvider theme={theme}>
    //   <CssBaseline />
    <Dialog open={viewDialog} onClose={closeDialog} maxWidth="sm" fullWidth>
      <DialogTitle
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ backgroundColor: "#E6E6FA" }}
      >
        <Avatar
          alt="customer_img"
          src="../assets/images/team-4.jpg"
          sx={{ width: 100, height: 100 }}
          align="center"
        />
        <IconButton
          aria-label="close"
          onClick={closeDialog}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "red",
            // color: (theme) => theme.palette.grey.main,
            // "&:hover": {
            //   color: (theme) => theme.palette.tomato.main,
            // },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: "#E6E6FA" }}>
        <Typography
          component="h5"
          variant="caption"
          color="text"
          fontWeight="medium"
          align="center"
        >
          Alan
        </Typography>

        <Typography
          component="h5"
          variant="caption"
          color="text"
          fontWeight="medium"
          align="center"
          pt={1}
        >
          9089384534
        </Typography>

        <Typography
          component="h5"
          variant="caption"
          color="text"
          fontWeight="medium"
          align="center"
          pt={1}
        >
          Gregory Cartwright 936 ,Kiehn Route West,Tennesse,11230
        </Typography>
        <Grid
          container
          //   space={}
          display={"flex"}
          justifyContent={"space-around"}
          marginTop={3}
          marginLeft={2}
        >
          <Grid item xs={4} md={4} textAlign={"center"}>
            <Card
              sx={{
                width: "150px",
                height: "100px",
                backgroundColor: "steelblue",
                color: "whitesmoke",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography
                component="h2"
                // variant="caption"
                color="white"
                fontWeight="medium"
              >
                Rs: 1000
              </Typography>
              <Typography
                component="h6"
                variant="caption"
                color="whitesmoke"
                fontWeight="medium"
              >
                Net Amount
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={4} md={4} textAlign={"center"}>
            <Card
              sx={{
                width: "150px",
                height: "100px",
                backgroundColor: "green",
                color: "whitesmoke",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography
                component="h6"
                // variant="caption"
                color="white"
                fontWeight="medium"
              >
                Rs: 800
              </Typography>
              <Typography
                component="h6"
                variant="caption"
                color="whitesmoke"
                fontWeight="medium"
              >
                Paid Amount
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={4} md={4} textAlign={"center"}>
            <Card
              sx={{
                width: "150px",
                height: "100px",
                backgroundColor: "orange",
                color: "whitesmoke",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography
                component="h2"
                // variant="caption"
                color="white"
                fontWeight="medium"
              >
                Rs: 200
              </Typography>
              <Typography
                component="h6"
                variant="caption"
                color="whitesmoke"
                fontWeight="medium"
              >
                Balance Amount
              </Typography>
            </Card>
          </Grid>
        </Grid>
        <Button
          variant="contained"
          //   align="center"
          onClick={closeDialog}
          sx={{ color: "whitesmoke", float: "right", marginTop: "30px" }}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
    // {/* </ThemeProvider> */}
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
