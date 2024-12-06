import { Delete, Edit, Visibility } from "@mui/icons-material";
import { IconButton, Typography, createTheme } from "@mui/material";

export const List_sales = (salesList, openEdit, openDel, openView) => {
  const columns = [
    { Header: "S.No", accessor: "sNo", align: "center" },
    { Header: "Category", accessor: "category", align: "left" },
    {
      Header: "Subcategory",
      accessor: "subcategory",
      align: "left",
    },
    { Header: "Payment method", accessor: "payment_method" },
    { Header: "Paid Amount", accessor: "p_amount" },
    { Header: "Balance Amount", accessor: "b_amount" },
    { Header: "actions", accessor: "action", align: "center" },
  ];
  const rows = Array.isArray(salesList)
    ? salesList.map((val, ind) => {
        // Extract sales details
        // const customerDetails = val.CustomerDetails || {};
        // const salesDetails = val.SalesDetails || {};
        // const paymentDetails = salesDetails.sales_details || {};

        // const { payment_method, paid_amount, balance_amount, sales_id } =
        //   paymentDetails;

        return {
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
              {val.sales_items?.map((item, index) => (
                <div key={index}>{item.category_name}</div>
              ))}
            </Typography>
          ),
          subcategory: (
            <Typography
              component="h5"
              variant="caption"
              color="text"
              fontWeight="medium"
            >
              {val.sales_items?.map((item, index) => (
                <div key={index}>{item.sub_category_name}</div>
              ))}
            </Typography>
          ),
          payment_method: (
            <Typography
              component="h5"
              variant="caption"
              color="text"
              fontWeight="medium"
            >
              {val.payment_method || "N/A"}
            </Typography>
          ),
          p_amount: (
            <Typography
              component="h5"
              variant="caption"
              color="text"
              fontWeight="medium"
            >
              {val.paid_amount || "0"}
            </Typography>
          ),
          b_amount: (
            <Typography
              component="h5"
              variant="caption"
              color="text"
              fontWeight="medium"
            >
              {val.balance_amount || "0"}
            </Typography>
          ),
          action: (
            <>
              <IconButton onClick={() => openView(val)}>
                <Visibility sx={{ color: "orange" }} />
              </IconButton>
              <IconButton onClick={() => openEdit(val)}>
                <Edit sx={{ color: "blue" }} />
              </IconButton>
              <IconButton onClick={() => openDel(val)}>
                <Delete sx={{ color: "red" }} />
              </IconButton>
            </>
          ),
        };
      })
    : [];

  return {
    columns,
    rows,
  };
};

const theme = createTheme({
  palette: {
    success: {
      main: "#4caf50",
      contrastText: "#ffffff",
      hover: "#66bb6a",
    },
    warning: {
      main: "#ff9800",
      contrastText: "#ffffff",
      hover: "#ffa733",
    },
  },
});
