import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";

export const List_vendor = (list, openView, openEdit, openDel) => {
  var columns = [
    { Header: "S.No", accessor: "sNo", align: "center" },
    { Header: "Vendor Name", accessor: "name", align: "left" },
    { Header: "Email", accessor: "email", align: "left" },
    { Header: "Phone Number", accessor: "phone", align: "left" },
    { Header: "GST Number", accessor: "gst", align: "left" },
    { Header: "Address", accessor: "address", align: "left" },
    { Header: "Actions", accessor: "action", align: "left" },
  ];
  var rows = list.map((val, ind) => ({
    sNo: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {ind + 1}
      </Typography>
    ),
    name: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.VendorName}
      </Typography>
    ),
    email: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.VendorEmail}
      </Typography>
    ),
    phone: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.VendorMobile}
      </Typography>
    ),
    gst: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.VendorGST}
      </Typography>
    ),
    address: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.VendorAddress}
      </Typography>
    ),
    action: (
      <>
        <IconButton onClick={() => openView(val)}>
          <RemoveRedEye sx={{ color: "orange" }} />
        </IconButton>
        <IconButton onClick={() => openEdit(val)}>
          <Edit sx={{ color: "blue" }} />
        </IconButton>
        <IconButton onClick={() => openDel(val)}>
          <Delete sx={{ color: "red" }} />
        </IconButton>
      </>
    ),
  }));

  return {
    columns,
    rows,
  };
};
