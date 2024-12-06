import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import React from "react";

export const List_return = (list, openEdit, openDel) => {
  var columns = [
    { Header: "S.No", accessor: "sNo", align: "center" },
    // { Header: "Date", accessor: "date", align: "center" },
    { Header: "Sales ID", accessor: "salesID" },
    { Header: "Bill Number", accessor: "billNo" },
    { Header: "Return Amount", accessor: "amount" },
    { Header: "Description", accessor: "description" },
    { Header: "Actions", accessor: "action", align: "center" },
  ];
  const rows = list.map((val, ind) => ({
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
    // date: (
    //   <Typography
    //     component="h5"
    //     variant="caption"
    //     color="text"
    //     fontWeight="medium"
    //   >
    //     {val.Date}
    //   </Typography>
    // ),
    salesID: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.ReturnSalesId}
      </Typography>
    ),
    billNo: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.ReturnBillNo}
      </Typography>
    ),
    amount: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.ReturnAmount}
      </Typography>
    ),
    description: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.Description}
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
  return {
    columns,
    rows,
  };
};
