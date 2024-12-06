import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import React from "react";

export const List_other = (otherList, openEdit, openDel) => {
  var columns = [
    { Header: "S.No", accessor: "sNo", align: "center" },
    { Header: "Date", accessor: "date", align: "center" },
    { Header: "ExpenseFor", accessor: "name" },
    { Header: "Amount", accessor: "amount" },
    { Header: "Description", accessor: "description" },
    { Header: "Actions", accessor: "action", align: "center" },
  ];

  var rows = otherList.map((val, ind) => ({
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
    name: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.expense}
      </Typography>
    ),
    amount: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.amount}
      </Typography>
    ),
    description: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.description}
      </Typography>
    ),
    action: (
      <>
        <IconButton onClick={() => openEdit(val)}>
          <Edit sx={{ color: "blue" }} />
        </IconButton>
        <IconButton onClick={() => openDel(val)}>
          <Delete sx={{ color: "red" }} />
        </IconButton>
      </>
    ),
  }));
  return { columns, rows };
};
