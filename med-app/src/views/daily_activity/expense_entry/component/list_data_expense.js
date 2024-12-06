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
import Edit_Expense from "./edit_expense";
import { useEffect, useState } from "react";
import Url from "Api";

export default function List_Data_Expense() {
  const [editExpenseDialog, setEditExpenseDialog] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const editExpense = (expenseValue) => {
    setEditExpenseDialog(true);
    setSelectedExpense(expenseValue);
  };

  // expense List
  const [expenseList, setExpenseList] = useState([]);

  const expense_list = async (e) => {
    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.expenseList, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        pageIndex: 0,
        dataLength: 10,
      }),
    });
    try {
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.apiStatus.code == "200") {
        setExpenseList(responseData.result.expenses);
      } else {
        console.log("error");
      }
    } catch (err) {
      console.log("error from fetch" + err);
    }
  };
  useEffect(() => {
    expense_list();
  }, []);

  const closeDialog = () => {
    setEditExpenseDialog(false);
  };

  // delete

  const openDel = (exp) => {
    setOpenDelete(true);
    setSelectedExpense(exp);
  };

  const closeBtn = () => {
    setOpenDelete(false);
    setSelectedExpense(null);
  };

  const deleteExpense = async () => {
    let token = localStorage.getItem("token");
    const response = await fetch(
      Url.api + Url.expenseDelete + selectedExpense.id,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (response.ok) {
      setExpenseList((prevList) =>
        prevList.filter((item) => item.id !== selectedExpense.id)
      );
      closeBtn();
    } else {
      console.error("Failed to delete expense");
    }
  };

  var columns = [
    { Header: "S.No", accessor: "sNo", align: "center" },
    { Header: "Date", accessor: "date", align: "center" },
    {
      Header: "Medicin expense",
      accessor: "medicin_expense",
      align: "center",
    },
    { Header: "Vendor", accessor: "vendar", align: "center" },
    { Header: "Descripition", accessor: "descripition", align: "center" },
    { Header: "Bill Number", accessor: "bill_num", align: "center" },
    { Header: "Amount", accessor: "amount", align: "center" },
    { Header: "Total_amount", accessor: "total_amount", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];
  var rows = expenseList.map((val, ind) => ({
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
    date: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.date}
      </Typography>
    ),
    vendar: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.vendorName}
      </Typography>
    ),

    medicin_expense: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.expense}
      </Typography>
    ),
    descripition: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
        textAlign={"left"}
      >
        {val.description}
      </Typography>
    ),

    bill_num: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.expensesDetails?.map((item, index) => (
          <div key={index}>{item.bill_no}</div>
        ))}
      </Typography>
    ),
    amount: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.expensesDetails?.map((item, index) => (
          <div key={index}>{item.amount}</div>
        ))}
      </Typography>
    ),

    total_amount: (
      <Typography
        component="h5"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {val.total_amount}
      </Typography>
    ),
    action: (
      <>
        <IconButton onClick={() => editExpense(val)}>
          <Edit sx={{ color: "blue" }} />
        </IconButton>

        <IconButton onClick={() => openDel(val)}>
          <Delete sx={{ color: "red" }} />
        </IconButton>
        <Edit_Expense
          openDialogEditExpense={editExpenseDialog}
          closeDialogbox={closeDialog}
          expense={selectedExpense}
        />
        <Dialog open={openDelete} onClose={closeBtn}>
          <DialogTitle
            sx={{ textAlign: "center", fontSize: 100, color: "red" }}
          >
            <HighlightOff />
          </DialogTitle>
          <DialogContent sx={{ mt: -2, textAlign: "center" }}>
            Are you sure you want to delete
            <DialogContentText>
              <b>"{selectedExpense?.vendorName}"?</b>
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <Button
              onClick={closeBtn}
              sx={{
                backgroundColor: "#9e9e9e",
                color: "#F5F5F5",
                "&:hover": {
                  backgroundColor: "#757575",
                  color: "#F5F5F5",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={deleteExpense}
              sx={{
                backgroundColor: "#f44336",
                color: "#F5F5F5",
                "&:hover": {
                  backgroundColor: "#d32f2f",
                  color: "#F5F5F5",
                },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>
    ),
  }));

  return {
    columns,
    rows,
  };
}
