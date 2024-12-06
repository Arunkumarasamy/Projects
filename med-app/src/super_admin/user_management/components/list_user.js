import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";

export const List_user = (userList, openEdit, openDelete) => {
  var columns = [
    { Header: "S.No", accessor: "sNo", align: "center" },
    { Header: "User Name", accessor: "user_name", align: "center" },
    {
      Header: "Email",
      accessor: "email",
      align: "center",
    },
    { Header: "Phone", accessor: "phone", align: "center" },
    { Header: "Address", accessor: "address", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];
  var rows = userList.map((val, ind) => ({
    sNo: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
        align="left"
      >
        {ind + 1}
      </Typography>
    ),
    user_name: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
        align="left"
      >
        {val.user_name}
      </Typography>
    ),
    email: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
        align="left"
      >
        {val.user_email}
      </Typography>
    ),
    phone: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
        align="left"
      >
        {val.user_phone}
      </Typography>
    ),
    address: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
        align="left"
      >
        {val.user_address}
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
