import { Delete, Edit, Visibility } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";

export const List_tenant = (tanentList, openEdit, openDelete, openView) => {
  var columns = [
    { Header: "S.no", accessor: "sNo", align: "center" },
    { Header: "Tenant Name", accessor: "tenantName" },
    { Header: "User Name", accessor: "userName" },
    { Header: "Email", accessor: "email" },
    { Header: "Phone", accessor: "phone" },
    { Header: "Action", accessor: "action", align: "center" },
  ];
  var rows = tanentList.map((val, ind) => ({
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
    tenantName: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
        align="left"
      >
        {val.tenant_name}
      </Typography>
    ),
    userName: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
        align="left"
      >
        {val.userData?.map((item, ind) => (
          <div key={ind}>{item.user_name ? item.user_name : "No user"}</div>
        ))}
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
        {val.userData?.map((item, ind) => (
          <div key={ind}>{item.email}</div>
        ))}
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
        {val.userData?.map((item, ind) => (
          <div key={ind}>{item.phone} </div>
        ))}
      </Typography>
    ),

    action: (
      <>
        <IconButton onClick={() => openView(val.id)}>
          <Visibility sx={{ color: "orange" }} />
        </IconButton>

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
    columns,
    rows,
  };
};
