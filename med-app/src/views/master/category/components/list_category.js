import { Delete, Edit, HighlightOff } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

export const List_Category = (categoryList, editCategory, openDel) => {
  const columns = [
    { Header: "S.No", accessor: "sNo", align: "center" },
    { Header: "Name", accessor: "name" },
    { Header: "Description", accessor: "description" },
    { Header: "Actions", accessor: "action", align: "center" },
  ];

  const rows = categoryList.map((val, ind) => ({
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
        {val.CategoryName}
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
        <IconButton onClick={() => editCategory(val)}>
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
