import { RemoveRedEye } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";

export const Sales_summary_list = (list, openView) => {
  const columns = [
    { Header: "Date", accessor: "date", align: "center" },
    { Header: "Total Sales", accessor: "t_sales" },
    { Header: "Total Expense", accessor: "t_expense" },
    { Header: "Total Return", accessor: "t_return" },
    { Header: "Total Credit", accessor: "t_credit" },
    { Header: "Action", accessor: "action", align: "center" },
  ];
  const rows = list.map((val, ind) => ({
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
    t_sales: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.totalSalesAmount}
      </Typography>
    ),
    t_expense: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.totalExpenseAmount}
      </Typography>
    ),
    t_return: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.totalReturnAmount}
      </Typography>
    ),
    t_credit: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.CreditAmount}
      </Typography>
    ),
    action: (
      <>
        <IconButton onClick={() => openView(val)}>
          <RemoveRedEye sx={{ color: "orange" }} />
        </IconButton>
      </>
    ),
  }));
  return {
    columns,
    rows,
  };
};
