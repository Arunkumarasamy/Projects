import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import React from "react";

export const List_denomination = (denominationList, openEdit, openDelete) => {
  const columns = [
    { Header: "S.No", accessor: "sNo", align: "center" },
    { Header: "Currency Code", accessor: "currency" },
    // { Header: "Denaomination Type", accessor: "type", align: "center" },
    { Header: "Value", accessor: "value", align: "center" },
    { Header: "Name", accessor: "name" },
    { Header: "Actions", accessor: "action", align: "center" },
  ];
  const rows = denominationList.map((val, ind) => ({
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
    currency: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.Currency_code}
      </Typography>
    ),
    // type: (
    //   <Typography
    //     component="h5"
    //     variant="caption"
    //     color="text"
    //     fontWeight="medium"
    //   >
    //     {val.denomination_type}
    //   </Typography>
    // ),
    value: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.denomination_value}
      </Typography>
    ),
    name: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.denomination_name}
      </Typography>
    ),
    action: (
      <>
        <IconButton onClick={() => openEdit(val)}>
          <Edit sx={{ color: "blue" }} />
        </IconButton>
        <IconButton onClick={() => openDelete(val)}>
          <Delete sx={{ color: "red" }} />
        </IconButton>
      </>
    ),
  }));
  return {
    rows,
    columns,
  };
};
