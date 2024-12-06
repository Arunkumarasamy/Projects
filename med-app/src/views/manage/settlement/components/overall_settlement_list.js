import { Typography } from "@mui/material";

export const OverAll_settlement_list = (overAllData) => {
  var columns = [
    { Header: "Date", accessor: "date", align: "center" },
    { Header: "Total Sales", accessor: "sales", align: "center" },
    { Header: "Total Expense", accessor: "expense", align: "center" },
    { Header: "Total Return", accessor: "returns", align: "center" },
    { Header: "Total Credit", accessor: "credit", align: "center" },
    { Header: "Total Amount", accessor: "amount", align: "center" },
  ];
  const rows = overAllData.map((val, ind) => ({
    date: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.settlement_date}
      </Typography>
    ),
    sales: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.total_sales_entry}
      </Typography>
    ),
    expense: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.total_expenses}
      </Typography>
    ),
    returns: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.total_return}
      </Typography>
    ),
    credit: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.total_credit_amount}
      </Typography>
    ),

    amount: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.total_amount}
      </Typography>
    ),
  }));
  return {
    columns,
    rows,
  };
};
