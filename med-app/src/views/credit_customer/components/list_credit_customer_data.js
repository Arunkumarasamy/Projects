import { Add, Visibility } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";

export const List_credit = (list, openView, openAdd) => {
  var columns = [
    { Header: "S.no", accessor: "sno", align: "center" },
    { Header: "Name", accessor: "name" },
    { Header: "Phone Number", accessor: "phone" },
    { Header: "Address", accessor: "address" },
    {
      Header: "Outstanding Amount",
      accessor: "out_standing",
    },
    { Header: "Actions", accessor: "action", align: "center" },
  ];

  var rows = list.map((val, ind) => ({
    sno: (
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
        {val.customerName}
      </Typography>
    ),
    phone: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.customerMobile}
      </Typography>
    ),
    address: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.customerAddress}{" "}
      </Typography>
    ),
    out_standing: (
      <Typography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.creditDetails
          .slice(0, 1)
          .map((value, index) => value.balanceAmount)}
      </Typography>
    ),
    action: (
      <>
        <IconButton onClick={() => openAdd(val)}>
          <Add sx={{ color: "blue" }} />
        </IconButton>
        <IconButton onClick={() => openView(val)}>
          <Visibility sx={{ color: "orange" }} />
        </IconButton>
      </>
    ),
  }));
  return {
    columns,
    rows,
  };
};
// onClick={edit_credential_customer}
