import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import React from "react";

export const List_currency = (currencyList, openEdit, openDel) => {
  const columns = [
    { Header: "S.No", accessor: "sNo", align: "center" },
    { Header: "Country", accessor: "country" },
    { Header: "Code", accessor: "code" },
    { Header: "Symbol", accessor: "symbol", align: "center" },
    { Header: "Currency", accessor: "currency" },
    { Header: "Actions", accessor: "action", align: "center" },
  ];
  const rows = currencyList.map((val, ind) => ({
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
    country: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.country_name}
      </Typography>
    ),
    code: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.currency_code}
      </Typography>
    ),
    symbol: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.currency_symbol}
      </Typography>
    ),
    currency: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.currency_name}
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
