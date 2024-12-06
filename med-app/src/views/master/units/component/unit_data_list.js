import { Delete, Edit, HighlightOff } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";

export const Unit_Data_List = (list, edit_units_description, openDel) => {
  const columns = [
    { Header: "S.No", accessor: "sNo", align: "center" },
    { Header: "Unit Name", accessor: "unitname" },
    { Header: "Units", accessor: "units", align: "center" },
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
    unitname: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.UnitName}
      </Typography>
    ),
    units: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.Unit}
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
        <IconButton onClick={() => edit_units_description(val)}>
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
