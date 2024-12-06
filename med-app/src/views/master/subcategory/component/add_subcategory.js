import { AddCircle, Close, RemoveCircle } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  CircularProgress,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import Url from "Api";
import Toast from "components/Toast";
import { number } from "prop-types";
// import theme from "assets/theme";
import { useEffect, useState } from "react";
import Subcategory_List from "./subcategory_list";

export default function Subcategory_Fields({
  openDialog,
  closeDialogbox,
  reloadListPage,
  showToast,
}) {
  const [category_id, setCategory_id] = useState(null);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryDescription, setSubCategoryDescription] = useState("");
  const [itemCount, setItemCount] = useState(1);
  const [actualAmount, setActualAmount] = useState("");
  const [salesAmount, setSalesAmount] = useState("");

  const [errors, setErrors] = useState({
    category_id: false,
    name: false,
    // description: false,
    salesAmount: false,
    itemName: false,
    unitPrice: false,
    quantity: false,
  });
  const closeDialog = () => {
    closeDialogbox();
  };

  // category dropdown fetch
  const [openCategory, setOpenCategory] = useState(false);
  const [categoryOption, setCategoryOption] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (openCategory) {
      setCategoryLoading(true);
      fetch(Url.api + Url.categoryList, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json(); // Parse JSON response
        })
        .then((data) => {
          const tenants = data.result.categoryData.map((item) => ({
            title: item.CategoryName,
            id: item.id,
          }));
          setCategoryOption(tenants); // Update state with the data

          setCategoryLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching vendors:", error);
          setCategoryLoading(false);
        });
    }
  }, [openCategory]);

  const handleCategoryChange = (event, value) => {
    if (value) {
      setCategory_id(value.id);
      setErrors((prevErrors) => ({ ...prevErrors, category_id: false }));
      console.log("Selected Category ID:", value.id);
    } else {
      setCategory_id(null);
      setErrors((prevErrors) => ({ ...prevErrors, category_id: true }));
    }
  };

  // add items
  const [fields, setFields] = useState([
    {
      id: 1,
      item: "",
      unitPrice: "",
      quantity: "",
      amount: "",
    },
  ]);

  const additionItems = () => {
    setFields([
      ...fields,
      {
        id: fields.length + 1,
        item: "",
        unitPrice: "",
        quantity: "",
        amount: "",
      },
    ]);
    setItemCount(fields.length + 1);
  };

  // remove items
  const removeItems = (ind) => {
    const dataStore = fields.filter((_, index) => index !== ind);
    setFields(dataStore);
    setItemCount(dataStore.length);
  };

  // calculation for Actual amount

  useEffect(() => {
    const actualAmt = fields.reduce(
      (sum, field) => sum + (parseFloat(field.amount) || 0),
      0
    );
    setActualAmount(actualAmt.toFixed(2));
  }, [fields]);

  //  calculation for unit and quantity

  const cal_unit_qty = (index, field, value) => {
    const updatedFields = fields.map((f, i) => {
      if (i === index) {
        const updatedField = { ...f, [field]: value };
        if (field === "unitPrice" || field === "quantity") {
          const unitPrice = parseFloat(updatedField.unitPrice) || 0;
          const quantity = parseFloat(updatedField.quantity) || 0;
          // toFixed is return a string represent a num
          updatedField.amount = (unitPrice * quantity).toFixed(2);
        }
        return updatedField;
      }
      return f;
    });
    setFields(updatedFields);
  };

  // validation error

  const validateFields = () => {
    const newErrors = {
      category_id: !category_id,
      name: !subCategoryName,
      salesAmount:
        salesAmount.trim() === "" || !/^\d*\.?\d*$/.test(salesAmount),
    };
    // Add individual field validation
    const fieldErrors = fields.map((field) => ({
      itemName: !field.item,
      unitPrice: !field.unitPrice,
      quantity: !field.quantity,
    }));
    const hasFieldErrors = fieldErrors.some(
      (field) => field.itemName || field.unitPrice || field.quantity
    );
    setErrors({ ...newErrors, fields: fieldErrors });
    return !Object.values(newErrors).some((error) => error) && !hasFieldErrors;
  };

  // create

  const saveSubCategory = async (eve) => {
    if (!validateFields()) {
      return;
    }
    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.subCategoryCreate, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        categoryId: category_id,
        SubCategoryName: subCategoryName,
        description: subCategoryDescription,
        itemCount: itemCount,
        actualAmount: actualAmount,
        salesAmount: salesAmount,
        itemdata: fields.map((field) => ({
          itemName: field.item,
          quantity: field.quantity,
          unitPrice: field.unitPrice,
          amount: field.amount,
        })),
      }),
    });
    try {
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.apiStatus.code == "200") {
        setCategory_id(null);
        setSubCategoryName("");
        setSubCategoryDescription("");
        setItemCount(1);
        setActualAmount("");
        setSalesAmount("");
        setFields([1]);
        reloadListPage();
        showToast(responseData.apiStatus.message, "success");
      } else {
        showToast(responseData.apiStatus.message, "error");
        console.log("error");
      }
    } catch (error) {
      console.log("fetch error" + error);
    }
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Dialog open={openDialog} onClose={closeDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Typography>Add Subcategory</Typography>
            <IconButton
              aria-label="close"
              onClick={closeDialog}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey.main,
                "&:hover": {
                  color: (theme) => theme.palette.tomato.main,
                },
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid
              container
              spacing={2}
              sx={{
                padding: "10px",
              }}
            >
              <Grid item xs={6} md={6}>
                <Autocomplete
                  id="category"
                  // sx={{ width: 260 }}
                  fullWidth
                  open={openCategory}
                  onOpen={() => setOpenCategory(true)}
                  onClose={() => setOpenCategory(false)}
                  isOptionEqualToValue={(option, value) =>
                    option.title === value.title
                  }
                  getOptionLabel={(option) => option.title} //----------
                  options={categoryOption}
                  loading={categoryLoading}
                  onChange={handleCategoryChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category"
                      required
                      error={errors.category_id}
                      helperText={
                        errors.category_id ? "CategoryName is required *" : ""
                      }
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {categoryLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      InputLabelProps={{
                        style: { fontSize: "16px" },
                      }}
                      inputProps={{
                        ...params.inputProps,
                        style: {
                          height: "38px",
                          padding: "0 7px",
                          fontSize: "15px",
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          minHeight: "40px",
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6} md={6}>
                <TextField
                  label="SubCategoryName"
                  fullWidth
                  autoFocus
                  required
                  variant="outlined"
                  // onChange={(e) => setSubCategoryName(e.target.value)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSubCategoryName(value);
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      name: value.trim() === "",
                    }));
                  }}
                  value={subCategoryName}
                  error={errors.name}
                  helperText={errors.name ? "SubCategoryName is required" : ""}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  label="Description"
                  variant="outlined"
                  value={subCategoryDescription}
                  onChange={(e) => setSubCategoryDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  // error={errors.description}
                  // helperText={
                  //   errors.description ? "description is required" : ""
                  // }
                />
              </Grid>
            </Grid>
            {fields.map((field, index) => (
              <Grid
                container
                spacing={2}
                sx={{
                  padding: "10px",
                }}
                key={index}
              >
                <Grid item xs={8} md={4}>
                  <TextField
                    label="Items"
                    variant="outlined"
                    fullWidth
                    autoFocus
                    value={field.item}
                    required
                    onChange={(e) => {
                      const value = e.target.value;
                      const updatedFields = fields.map((f, i) =>
                        i === index ? { ...f, item: value } : f
                      );

                      const newErrors = fields.map((f, i) =>
                        i === index
                          ? { ...f.errors, itemName: value.trim() === "" }
                          : f.errors
                      );

                      setFields(updatedFields);
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        fields: newErrors,
                      }));
                    }}
                    error={
                      errors.fields &&
                      errors.fields[index] &&
                      errors.fields[index].itemName
                    }
                    // helperText={
                    //   errors.fields &&
                    //   errors.fields[index] &&
                    //   errors.fields[index].itemName
                    //     ? "required *"
                    //     : ""
                    // }
                  />
                </Grid>
                <Grid item xs={8} md={2}>
                  <TextField
                    label="Unit Price"
                    value={field.unitPrice}
                    fullWidth
                    autoFocus
                    variant="outlined"
                    required
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        const updatedFields = fields.map((f, i) => {
                          if (i === index) {
                            const updatedField = { ...f, unitPrice: value };
                            if (updatedField.quantity) {
                              updatedField.amount = (
                                parseFloat(value) *
                                parseFloat(updatedField.quantity)
                              ).toFixed(2);
                            }
                            return updatedField;
                          }
                          return f;
                        });

                        const newErrors = fields.map((f, i) =>
                          i === index
                            ? { ...f.errors, unitPrice: value.trim() === "" }
                            : f.errors
                        );

                        setFields(updatedFields);
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          fields: newErrors,
                        }));
                      }
                    }}
                    error={
                      errors.fields &&
                      errors.fields[index] &&
                      errors.fields[index].unitPrice
                    }
                    // helperText={
                    //   errors.fields &&
                    //   errors.fields[index] &&
                    //   errors.fields[index].unitPrice
                    //     ? "required *"
                    //     : ""
                    // }
                  />
                </Grid>
                <Grid item xs={8} md={2}>
                  <TextField
                    label="Quantity"
                    fullWidth
                    autoFocus
                    variant="outlined"
                    value={field.quantity}
                    required
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        const updatedFields = fields.map((f, i) => {
                          if (i === index) {
                            const updatedField = { ...f, quantity: value };
                            if (updatedField.unitPrice) {
                              updatedField.amount = (
                                parseFloat(updatedField.unitPrice) *
                                parseFloat(value)
                              ).toFixed(2);
                            }
                            return updatedField;
                          }
                          return f;
                        });

                        const newErrors = fields.map((f, i) =>
                          i === index
                            ? { ...f.errors, quantity: value.trim() === "" }
                            : f.errors
                        );

                        setFields(updatedFields);
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          fields: newErrors,
                        }));
                      }
                    }}
                    error={
                      errors.fields &&
                      errors.fields[index] &&
                      errors.fields[index].quantity
                    }
                    // helperText={
                    //   errors.fields &&
                    //   errors.fields[index] &&
                    //   errors.fields[index].quantity
                    //     ? "Quantity is required"
                    //     : ""
                    // }
                  />
                </Grid>
                <Grid item xs={8} md={2}>
                  <TextField
                    label="Amount"
                    fullWidth
                    autoFocus
                    variant="outlined"
                    value={field.amount}
                    inputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid
                  item
                  xs={2}
                  md={2}
                  sx={{ display: "flex", float: "right" }}
                >
                  {index === fields.length - 1 ? (
                    <>
                      <IconButton
                        onClick={additionItems}
                        sx={{ fontSize: "27px", color: "green" }}
                      >
                        <AddCircle />
                      </IconButton>
                      {fields.length > 1 && (
                        <IconButton
                          onClick={() => removeItems(index)}
                          sx={{ fontSize: "27px", color: "red" }}
                        >
                          <RemoveCircle />
                        </IconButton>
                      )}
                    </>
                  ) : (
                    <IconButton
                      onClick={() => removeItems(index)}
                      sx={{ fontSize: "27px", color: "red" }}
                    >
                      <RemoveCircle />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            ))}
            <Grid
              container
              spacing={2}
              sx={{
                // marginBottom: "20px",
                padding: "10px",
              }}
            >
              <Grid item xs={4} md={4}>
                <TextField
                  label="Item Count"
                  fullWidth
                  autoFocus
                  variant="outlined"
                  value={itemCount}
                  inputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={4} md={4}>
                <TextField
                  label="Actual amount"
                  value={actualAmount}
                  onChange={(e) => setActualAmount(e.target.value)}
                  fullWidth
                  autoFocus
                  variant="outlined"
                  inputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={4} md={4}>
                <TextField
                  label="Sales amount"
                  value={salesAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {
                      setSalesAmount(value);
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        salesAmount: false,
                      }));
                    } else {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        salesAmount: true,
                      }));
                    }
                  }}
                  required
                  fullWidth
                  autoFocus
                  variant="outlined"
                  error={errors.salesAmount}
                  helperText={
                    errors.salesAmount ? "SalesAmount is required" : ""
                  }
                />
              </Grid>
            </Grid>
            <Stack direction="row" justifyContent="center" gap="10px" mt={5}>
              <Button
                variant="contained"
                sx={{
                  color: "white",
                  backgroundColor: "grey",
                  "&:hover": { backgroundColor: "darkgrey" },
                }}
                onClick={closeDialog}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={saveSubCategory}
              >
                Save
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      </ThemeProvider>
    </>
  );
}

const theme = createTheme({
  palette: {
    success: {
      main: "#4caf50",
      contrastText: "#ffffff",
    },
    remove: {
      main: "red",
      contrastText: "#FF6347",
    },
    grey: {
      main: "#9e9e9e",
      contrastText: "#ffffff",
    },

    tomato: {
      main: "#FF6347",
    },
  },
});
