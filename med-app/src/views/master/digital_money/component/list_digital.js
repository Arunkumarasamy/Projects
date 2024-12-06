import { Delete, Edit } from "@mui/icons-material";
import { Avatar, IconButton, Typography } from "@mui/material";
import Url from "Api";
import React from "react";

export const List_digital = (digitalList, openEdit, openDelete) => {
  // Profile_Picture component
  const Profile_Picture = ({ profile }) => (
    <Avatar src={profile} style={{ width: 40, height: 40 }} />
  );
  const Api = Url.api;
  console.log(Api);
  const columns = [
    { Header: "S.No", accessor: "sNo", align: "center" },
    { Header: "Payment Image", accessor: "icon", align: "center" },
    { Header: "Payment Name", accessor: "name" },
    { Header: "Actions", accessor: "action", align: "center" },
  ];

  const rows = digitalList.map((val, ind) => ({
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
    icon: <Profile_Picture profile={Url.api + val.digital_payment_icon} />,
    name: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.digital_payment_name}
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
