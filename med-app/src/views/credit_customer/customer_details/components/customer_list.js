import { Typography } from "@mui/material";

export const Customer_list = (list) => {
  var columns = [
    { Header: "S.No", accessor: "sNo", align: "center" },
    { Header: "Customer Name", accessor: "name" },
    { Header: "Email", accessor: "email" },
    { Header: "Phone Number", accessor: "phone" },
    { Header: "Customer type", accessor: "cus_type" },
    { Header: "Address", accessor: "address" },
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
        {val.CustomerName}
      </Typography>
    ),
    email: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.CustomerEmail}
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
    cus_type: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.CustomerType}
      </Typography>
    ),
    address: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.CustomerAddress}
      </Typography>
    ),
  }));
  return {
    rows,
    columns,
  };
};
