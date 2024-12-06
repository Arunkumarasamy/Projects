import { IconButton, Typography } from "@mui/material";
import React from "react";

export const List_settelement = (list) => {
  const columns = [
    { Header: "Date", accessor: "date", align: "center" },
    { Header: "Total Sales", accessor: "sales", align: "center" },
    { Header: "Total Expense", accessor: "expense", align: "center" },
    { Header: "Total Return", accessor: "returns", align: "center" },
    { Header: "Total Credit", accessor: "credit", align: "center" },
  ];
  const rows = Array.isArray(list)
    ? list.map((val, ind) => ({
        date: (
          <Typography
            component="h5"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {val.settlementDate}
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
            {val.total_expense}
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
        // action: (
        //   <>
        //     <IconButton onClick={() => openEdit(val)}>
        //       <Edit sx={{ color: "blue" }} />
        //     </IconButton>
        //     <IconButton onClick={() => openDel(val)}>
        //       <Delete sx={{ color: "red" }} />
        //     </IconButton>
        //   </>
        // ),
      }))
    : [];

  return {
    columns,
    rows,
  };
};
