import { Typography } from "@mui/material";

export const OverAll_return_list = (overAllData) => {
  var columns = [
    { Header: "Return Date", accessor: "date" },
    { Header: "Bill Number", accessor: "billNo" },
    { Header: "Return Amount", accessor: "amount" },
    { Header: "Description", accessor: "description" },
  ];
  const rows = overAllData.map((val, ind) => ({
    date: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.ReturnDate}
      </Typography>
    ),
    billNo: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.BillNo}
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
        {val.Description || "N/A"}
      </Typography>
    ),
  }));

  return {
    columns,
    rows,
  };
};
