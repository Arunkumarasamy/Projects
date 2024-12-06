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
// import { descriptors } from "chart.js/dist/core/core.defaults";
import Toast from "components/Toast";
import { useEffect, useState } from "react";

export default function Edit_subcategory({
  openEdit,
  closeDialogbox,
  subCategoryData,
  reloadListPage,
  showToast,
}) {
  const [id, setId] = useState("");
  const [category_id, setCategory_id] = useState(null);
  const [subCategory_id, setSubCategory_id] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryDescription, setSubCategoryDescription] = useState("");
  const [itemCount, setItemCount] = useState(null);
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

  // category dropdown fetch
  const [openCategory, setOpenCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryOption, setCategoryOption] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
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
          const categoryDD = data.result.categoryData.map((item) => ({
            title: item.CategoryName,
            id: item.id,
          }));
          setCategoryOption(categoryDD); // Update state with the data

          setCategoryLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching vendors:", error);
          setCategoryLoading(false);
        });
    }
  }, [openCategory]);

  const handleTenantChange = (event, value) => {
    if (value) {
      setSelectedCategory(value);
      setCategory_id(value.id);
      setErrors((prevErrors) => ({ ...prevErrors, category_id: false }));
      console.log("Selected Category ID:", value.id);
    } else {
      setSelectedCategory(null);
      setCategory_id(null);
      setErrors((prevErrors) => ({ ...prevErrors, category_id: true }));
    }
  };

  // add items
  const [fields, setFields] = useState([
    {
      ItemId: "",
      itemName: "",
      quantity: "",
      unitPrice: "",
      amount: "",
    },
  ]);

  const additionItems = () => {
    setFields([
      ...fields,
      {
        ItemId: fields.length + 1,
        itemName: "",
        quantity: "",
        unitPrice: "",
        amount: "",
      },
    ]);
    setItemCount(fields.length + 1);
  };

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

          console.log("unit------", unitPrice);
          console.log("qun------", quantity);
          console.log("updated price------", updatedField.amount);
        }
        return updatedField;
      }
      return f;
    });
    setFields(updatedFields);
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

  // validation error

  const validateFields = () => {
    const newErrors = {
      category_id: !category_id,
      name: !subCategoryName,
      salesAmount:
        salesAmount.trim() === "" || !/^\d*\.?\d*$/.test(salesAmount),
    };
    const fieldErrors = fields.map((field) => ({
      itemName: !field.itemName,
      unitPrice: !field.unitPrice,
      quantity: !field.quantity,
    }));
    const hasFieldErrors = fieldErrors.some(
      (field) => field.itemName || field.unitPrice || field.quantity
    );
    setErrors({ ...newErrors, fields: fieldErrors });
    return !Object.values(newErrors).some((error) => error) && !hasFieldErrors;
  };

  // update SubCategory
  useEffect(() => {
    if (subCategoryData) {
      const categoryDD = {
        title: subCategoryData.CategoryName,
        id: subCategoryData.CategoryId,
      };
      setSelectedCategory(categoryDD);
      setCategory_id(subCategoryData.CategoryId);
      setId(subCategoryData.Id);
      setSubCategoryName(subCategoryData.SubCategoryName);
      setSubCategoryDescription(subCategoryData.description);
      setItemCount(subCategoryData.itemcount);
      setActualAmount(subCategoryData.actualAmount);
      setSalesAmount(subCategoryData.salesAmount);
      setFields(subCategoryData.itemdata);
      console.log("-----------", subCategoryData.unitPrice);
      console.log("item name-----------", subCategoryData.itemName);
    }
  }, [subCategoryData]);

  const updateButton = async (eve) => {
    if (!validateFields()) {
      return;
    }
    eve.preventDefault();
    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.subCategoryEdit, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        id: id,
        categoryId: category_id,
        SubCategoryName: subCategoryName,
        description: subCategoryDescription,
        itemCount: itemCount,
        actualAmount: actualAmount,
        salesAmount: salesAmount,

        itemdata: fields.map((field) => ({
          itemName: field.itemName,
          quantity: field.quantity,
          unitPrice: field.unitPrice,
          amount: field.amount,
        })),
      }),
    });
    try {
      const responceData = await response.json();
      console.log(responceData);
      if (responceData.apiStatus.code === "200") {
        reloadListPage();
        showToast(responceData.apiStatus.message, "success");
      } else {
        showToast(responceData.apiStatus.message, "error");
        console.log(responceData.apiStatus.message, "error");
      }
    } catch (err) {
      console.log("error from " + err);
    }
  };

  const closeDialog = () => {
    closeDialogbox();
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Dialog
          open={openEdit}
          onClose={closeDialog}
          // maxWidth="sm"
          fullWidth
          sx={{
            width: "800px",
            height: "600px",
            margin: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DialogTitle>
            <Typography>Edit Subcategory</Typography>
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
            <Grid container spacing={2} sx={{ padding: "10px" }}>
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
                  onChange={handleTenantChange}
                  value={selectedCategory}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category"
                      required
                      error={errors.category_id}
                      helperText={
                        errors.category_id ? "CategoryName is required" : ""
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
                  required
                  fullWidth
                  autoFocus
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
              <Grid item xs={12} md={12} mt={2}>
                <TextField
                  label="Description"
                  variant="outlined"
                  value={subCategoryDescription}
                  onChange={(e) => setSubCategoryDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
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
                    id={`item-name-${index}`}
                    label="Items"
                    variant="outlined"
                    fullWidth
                    required
                    autoFocus
                    value={field.itemName}
                    onChange={(e) => {
                      const value = e.target.value;
                      const updatedFields = fields.map((f, i) =>
                        i === index ? { ...f, itemName: value } : f
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
                    // helperText={errors.itemName && "Item name is required"}
                  />
                </Grid>
                <Grid item xs={8} md={2}>
                  <TextField
                    label="Unit Price"
                    id={`unit-price-${index}`}
                    value={field.unitPrice}
                    fullWidth
                    required
                    autoFocus
                    variant="outlined"
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
                    // helperText={errors.unitPrice && "Unit price is required"}
                  />
                </Grid>
                <Grid item xs={8} md={2}>
                  <TextField
                    label="Quantity"
                    id={`quantity-${index}`}
                    fullWidth
                    required
                    autoFocus
                    variant="outlined"
                    value={field.quantity}
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
                    // helperText={errors.quantity && "Quantity is required"}
                  />
                </Grid>
                <Grid item xs={8} md={2}>
                  <TextField
                    id={`price-${index}`}
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
                  // onChange={actualAmountChange}
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
                  required
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
                  fullWidth
                  autoFocus
                  variant="outlined"
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
                onClick={updateButton}
              >
                Update
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
