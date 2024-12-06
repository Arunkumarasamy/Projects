import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";

export const List_bill = (list, openEdit, openDel, openView) => {
  var columns = [
    { Header: "S.No", accessor: "sNo", align: "center" },
    { Header: "Date", accessor: "date" },
    { Header: "Vendor Name", accessor: "vendor_name" },
    { Header: "Total Amount", accessor: "total_amount" },
    { Header: "Actions", accessor: "action", align: "center" },
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
    date: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.date}
      </Typography>
    ),
    vendor_name: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.vendorName}
      </Typography>
    ),
    total_amount: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.totalAmount}
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
