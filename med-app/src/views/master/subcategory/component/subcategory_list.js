import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";

export const Subcategory_List = (
  list,
  edit_subCategory,
  openDel,
  view_subCategory
) => {
  var columns = [
    { Header: "S.No", accessor: "sNo", align: "center" },
    { Header: "Category", accessor: "category" },
    { Header: "Sub Category", accessor: "sub_category" },
    { Header: "Item Count", accessor: "itemCount", align: "center" },
    { Header: "Actual Amount", accessor: "actual_amount" },
    { Header: "Sales Amount", accessor: "sales_amount" },
    // { Header: "Description", accessor: "description", align: "center" },
    { Header: "Actions", accessor: "action", align: "center" },
  ];
  var rows = list.map((val, ind) => ({
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
    category: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.CategoryName}
      </Typography>
    ),
    sub_category: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.SubCategoryName}
      </Typography>
    ),
    itemCount: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.itemcount}
      </Typography>
    ),
    actual_amount: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.actualAmount}
      </Typography>
    ),
    sales_amount: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.salesAmount}
      </Typography>
    ),
    action: (
      <>
        <IconButton onClick={() => view_subCategory(val)}>
          <RemoveRedEye sx={{ color: "orange" }} />
        </IconButton>
        <IconButton onClick={() => edit_subCategory(val)}>
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
