import { Typography } from "@mui/material";

export const OverAll_List = (overAllData) => {
  const columns = [
    { Header: "Date", accessor: "date", align: "center" },
    { Header: "Payment Method", accessor: "paymethod", align: "center" },
    {
      Header: "Payment Type",
      accessor: "pay_type",
      align: "center",
    },
    { Header: "Total Amount", accessor: "t_amount", align: "center" },
    { Header: "Balance Amount", accessor: "b_amount", align: "center" },
  ];
  const rows = overAllData.map((val, ind) => ({
    date: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.Date}
      </Typography>
    ),
    paymethod: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.PaymentMethod}
      </Typography>
    ),
    pay_type: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.PaymentType}
      </Typography>
    ),
    t_amount: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.TotalAmount}
      </Typography>
    ),
    b_amount: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.BalanceAmount || "N/A"}
      </Typography>
    ),
  }));
  return {
    columns,
    rows,
  };
};
