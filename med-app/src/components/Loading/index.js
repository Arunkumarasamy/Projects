import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

const ProgressDialog = ({ open }) => (
  <Backdrop open={open} style={{ zIndex: 1300, color: "#fff" }}>
    <CircularProgress color="inherit" />
  </Backdrop>
);
export default ProgressDialog;
