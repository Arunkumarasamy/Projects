import {
  AddCircle,
  Close,
  OfflinePin,
  RemoveCircle,
  RotateLeft,
} from "@mui/icons-material";
import {
  Autocomplete,
  CircularProgress,
  Grid,
  IconButton,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Box,
  Stack,
  createTheme,
  ThemeProvider,
  CssBaseline,
  InputAdornment,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@mui/styles";
import Url from "Api";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function Add_sales({
  showToast,
  selectedValue,
  callList,
  closeDialog,
  openEditDialog,
}) {
  const classes = useStyles();

  const [salesId, setSalesId] = useState(null);
  const [cusId, setCusId] = useState(null);
  const [cusName, setCusName] = useState("");
  const [cusEmail, setCusEmail] = useState("");
  const [cusPhone, setCusPhone] = useState("");
  const [cusAdd, setCusAdd] = useState("");
  const [cusTypePay, setCusTypePay] = useState("");
  const [fields, setFields] = useState([
    {
      sales_item_id: 1,
      category_id: null,
      sub_category_id: null,
      unitPrice: "",
      item_quantity: "",
      item_amount: "",
    },
  ]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountType, setDiscountType] = useState("");
  const [discount, setDiscount] = useState("");
  const [payableAmount, setPayableAmount] = useState(0);

  const [paidAmount, setPaidAmount] = useState("");
  const [balanceAmount, setBalanceAmount] = useState("");
  const [payMethods, setPayMethods] = useState("");
  const [radioBtnValue, setRadioBtnValue] = useState("fullypaid");

  const [hspName, setHspName] = useState("");
  const [docName, setDocName] = useState("");
  const [img_id, setImg__id] = useState(null);
  const [imgPath, setImgPath] = useState(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const [openCategory, setOpenCategory] = useState([]);
  const [categoryOption, setCategoryOption] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState([]);

  const [openSubCategory, setOpenSubcategory] = useState([]);
  const [subCategoryOption, setSubCategoryOption] = useState([]);
  const [subCategoryLoading, setSubCategoryLoading] = useState([]);

  // error
  const [errors, setErrors] = useState({
    // valCusName: false,
    valCusEmail: false,
    valCusPhone: false,
    // valCusAdd:false,
    // valCusTypePay: false,
    // valDiscountType: false,
    valDiscount: false,
    valPayMethods: false,
    valPaidAmount: false,
    // valHspName: false,
    // valDocName: false,
    // valImgPath: false,
    fields: [], // Initialize fields as an empty array
  });

  // validation error
  const validateFields = () => {
    // salesAmount.trim() === "" || !/^\d*\.?\d*$/.test(salesAmount)
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,12}$/;
    const newErrors = {
      // valCusName: cusName.trim() === "",
      // valCusEmail: !emailRegex.test(cusEmail),
      valCusPhone: !phoneRegex.test(cusPhone),
      // valCusTypePay: !cusTypePay,
      // valDiscountType: !discountType,
      valPayMethods: !payMethods,
      valPaidAmount: radioBtnValue === "partial" && !paidAmount,
      // valHspName: hspName.trim() === "",
      // valDocName: docName.trim() === "",
      // valImgPath: !fileName,
    };
    // Add individual field validation
    const fieldErrors = fields.map((field) => ({
      valCategory_id: !field.category_id,
      valSubCategory_id: !field.sub_category_id,
      valUnit: !field.unitPrice,
      valQuantity: !field.item_quantity,
    }));
    const hasFieldErrors = fieldErrors.some(
      (field) =>
        field.valCategory_id ||
        field.valSubCategory_id ||
        field.valUnit ||
        field.valQuantity
    );
    setErrors({ ...newErrors, fields: fieldErrors });
    return !Object.values(newErrors).some((error) => error) && !hasFieldErrors;
  };

  // category dropdown fetch
  const fetchCategoryData = async (setCategoryOption) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(Url.api + Url.categoryList, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const categories = data.result.categoryData.map((item) => ({
        title: item.CategoryName,
        id: item.id,
      }));

      setCategoryOption(categories); // Update state with the data
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  // category Onchange
  useEffect(() => {
    console.log("summa");
    if (openEditDialog) {
      console.log("summa1");
      fetchCategoryData(setCategoryOption);
    }
  }, [openEditDialog]);

  // category change
  const categoryChange = (ind, event, value) => {
    if (value) {
      mulFields(ind, "category_id", value.id);
      setErrors((prevErrors) => {
        const updatedFields = [...prevErrors.fields];
        updatedFields[ind] = {
          ...updatedFields[ind],
          valCategory_id: false,
        };
        return { ...prevErrors, fields: updatedFields };
      });
    } else {
      mulFields(ind, "category_id", null);
      setErrors((prevErrors) => {
        const updatedFields = [...prevErrors.fields];
        updatedFields[ind] = {
          ...updatedFields[ind],
          valCategory_id: true,
        };
        return { ...prevErrors, fields: updatedFields };
      });
    }
  };

  // subcategory dropdown fetch
  const fetchSubCategoryData = async (setSubCategoryOption) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(Url.api + Url.subCategoryList, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const subcategories = data.result.SubCategoryData.map((item) => ({
        title: item.SubCategoryName,
        id: item.Id,
      }));
      setSubCategoryOption(subcategories); // Update state with the data
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    if (openEditDialog) {
      fetchSubCategoryData(setSubCategoryOption);
    }
  }, [openEditDialog]);

  // subCategory Onchange
  const subCategoryChange = (ind, event, value) => {
    if (value) {
      mulFields(ind, "sub_category_id", value.id);
      setErrors((prevErrors) => {
        const updatedFields = [...prevErrors.fields];
        updatedFields[ind] = {
          ...updatedFields[ind],
          valSubCategory_id: false,
        };
        return { ...prevErrors, fields: updatedFields };
      });
    } else {
      mulFields(ind, "sub_category_id", null);
      setErrors((prevErrors) => {
        const updatedFields = [...prevErrors.fields];
        updatedFields[ind] = {
          ...updatedFields[ind],
          valSubCategory_id: true,
        };
        return { ...prevErrors, fields: updatedFields };
      });
    }
  };

  const handleCategoryOpen = (index) => {
    setOpenCategory((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  // Handle category dropdown close
  const handleCategoryClose = (index) => {
    setOpenCategory((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
  };

  // Handle subcategory dropdown open
  const handleSubCategoryOpen = (index) => {
    setOpenSubcategory((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  // Handle subcategory dropdown close
  const handleSubCategoryClose = (index) => {
    setOpenSubcategory((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
  };

  // add fields
  const additionItems = () => {
    setFields([
      ...fields,
      {
        sales_item_id: fields.length + 1,
        category_id: null,
        sub_category_id: null,
        unitPrice: "",
        item_quantity: "",
        item_amount: "",
      },
    ]);
  };
  const removeItems = (ind) => {
    const dataStore = fields.filter((_, index) => index !== ind);
    setFields(dataStore);
  };

  // multiple fields
  const mulFields = (index, field, value) => {
    // Regex to allow numeric values, including decimals
    const isNumeric = (val) => /^-?\d*\.?\d*$/.test(val);
    const updatedValue =
      field === "unitPrice" || field === "item_quantity"
        ? isNumeric(value)
          ? value
          : ""
        : value;

    const updatedFields = fields.map((f, i) => {
      if (i === index) {
        const updatedField = { ...f, [field]: updatedValue };
        if (field === "unitPrice" || field === "item_quantity") {
          const unitPrice = parseFloat(updatedField.unitPrice) || 0;
          const quantity = parseFloat(updatedField.item_quantity) || 0;

          // toFixed is return a string represent a num
          updatedField.item_amount = (unitPrice * quantity).toFixed(2);
        }
        const updatedErrors = { ...errors };
        if (field === "unitPrice") {
          updatedErrors.fields[index] = {
            ...updatedErrors.fields[index],
            valUnit: !updatedValue,
          };
        } else if (field === "item_quantity") {
          updatedErrors.fields[index] = {
            ...updatedErrors.fields[index],
            valQuantity: !updatedValue,
          };
        }
        setErrors(updatedErrors);
        return updatedField;
      }
      return f;
    });
    setFields(updatedFields);
  };

  // radio Btn
  const radioBtn = (event) => {
    const selectedBtn = event.target.value;
    setRadioBtnValue(selectedBtn);
    if (selectedBtn === "fullypaid") {
      setPaidAmount(payableAmount);
      setBalanceAmount("0");
    } else {
      setPaidAmount(""); // Reset paid amount
      setBalanceAmount(""); // Reset balance amount
    }
  };
  // Update balance amount based on paid amount
  useEffect(() => {
    if (radioBtnValue === "partial") {
      const calculatedBalance = (
        parseFloat(payableAmount) - parseFloat(paidAmount)
      ).toFixed(2);
      setBalanceAmount(calculatedBalance < -1000 ? "0" : calculatedBalance);
    }
  }, [paidAmount, payableAmount, radioBtnValue]);

  //  upload img
  const UploadImg = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    let token = localStorage.getItem("token");
    try {
      const response = await fetch(Url.api + Url.prescriptionFile, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      console.log("upload api----", Url.api + Url.prescriptionFile);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (response.ok) {
        setImg__id(data.responseData.image_id);
        setImgPath(data.responseData.Path);
        console.log();
        console.log("File uploaded successfully:", data.apiStatus.message);
        showToast(data.apiStatus.message, "success");
      } else {
        showToast(data.apiStatus.message, "error");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setImg__id(file.icon_id);
      setImgPath(file.Path);
      UploadImg(file);
    }
  };
  const handleTextFieldClick = () => {
    fileInputRef.current.click();
  };

  // cal total quantity and amount
  useEffect(() => {
    const totalQty = fields.reduce(
      (sum, field) => sum + (parseFloat(field.item_quantity) || 0),
      0
    );
    const totalAmt = fields.reduce(
      (sum, field) => sum + (parseFloat(field.item_amount) || 0),
      0
    );

    const discountPercent = parseFloat(discount) / 100 || 0;
    const discountAmt = totalAmt * discountPercent;
    const payableAmt = totalAmt - discountAmt;

    setTotalQuantity(totalQty);
    setTotalAmount(totalAmt);
    setPayableAmount(payableAmt);
    logic_Amount_Discount(discountType, discount);
  }, [fields, discount, discountType]);

  // discount type

  const changeDiscountType = (event) => {
    const newDiscountType = event.target.value;
    setDiscountType(newDiscountType);
    setDiscount("");
    // setErrors((prevErrors) => ({
    //   ...prevErrors,
    //   valDiscountType: !newDiscountType,
    // }));
    logic_Amount_Discount(newDiscountType, "");
  };

  const changeDiscountValue = (event) => {
    const discountValue = event.target.value;
    if (/^\d*\.?\d*$/.test(discountValue)) {
      setDiscount(discountValue);
      if (discountValue.trim() !== "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          valDiscount: false,
        }));
      }
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        valDiscount: true,
      }));
    }
    logic_Amount_Discount(discountType, discountValue); // Recalculate payable amount
  };

  const logic_Amount_Discount = (type, discountValue) => {
    let payable = parseFloat(totalAmount);

    if (isNaN(payable)) {
      console.error("Invalid totalAmount value");
      setPayableAmount("0.00");
      return;
    }

    if (type === "percentage" && discountValue) {
      const percentage = parseFloat(discountValue);
      if (!isNaN(percentage)) {
        payable -= (payable * percentage) / 100;
      } else {
        console.error("Invalid percentage value");
      }
    } else if (type === "amount" && discountValue) {
      const amount = parseFloat(discountValue);
      if (!isNaN(amount)) {
        payable -= amount;
      } else {
        console.error("Invalid amount value");
      }
    }

    setPayableAmount(
      isNaN(payable) ? "0.00" : payable < 0 ? "0.00" : payable.toFixed(2)
    );
  };

  // debugging--------fields

  // useEffect(() => {
  //   console.log("Fields:", fields);
  // }, [fields]);

  useEffect(() => {
    setPayableAmount(totalAmount);
  }, [totalAmount]);

  // date
  const today = dayjs();
  const date = today.format("YYYY-MM-DD");
  console.log("date checking----", date);

  // bind value
  useEffect(() => {
    if (selectedValue) {
      const salesDetails = selectedValue.SalesDetails;
      const prescription = selectedValue.prescription;
      const customerDetails = selectedValue.CustomerDetails;

      setSalesId(selectedValue.sales_id || "");
      setCusId(selectedValue?.customerDetails?.customer_id || "");
      // setDate(dayjs(salesDetails?.credit_details?.credit_date || new Date())); // Handle invalid date gracefully

      setTotalAmount(selectedValue.total_amount || 0);
      setDiscountType(selectedValue.discount_type || "");
      setDiscount(selectedValue.discount_value || 0);
      setPayableAmount(selectedValue.payable_amount || 0);
      setPayMethods(selectedValue.payment_method || "");
      setRadioBtnValue(selectedValue.payment_type || "");
      setTotalQuantity(selectedValue.total_quantity || 0);
      setPaidAmount(selectedValue.paid_amount || 0);
      setBalanceAmount(selectedValue.balance_amount || 0);

      setDocName(selectedValue.refered_by || "");
      setHspName(selectedValue.hospital_name || "");
      // Uncomment to bind the file name
      // setFileName(prescription?.original_file_name || "");
      setCusName(selectedValue?.customerDetails?.customer_name || "");
      setCusPhone(selectedValue?.customerDetails?.customer_mobile || "");
      setCusAdd(selectedValue?.customerDetails?.customer_address || "");
      setCusEmail(selectedValue?.customerDetails?.customer_email || "");
      setCusTypePay(selectedValue?.customerDetails?.customer_type || "");

      setFields(selectedValue?.sales_items || []);
      console.log("field value----", selectedValue?.sales_items);
      // setFileName(selectedValue.original_file_name)  //---bind img name
    }
  }, [selectedValue]);

  // update api call
  const updateButton = async (eve) => {
    if (!validateFields()) {
      return;
    }
    const finalPaidAmount =
      radioBtnValue === "fullypaid" ? payableAmount : paidAmount;

    eve.preventDefault();
    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.salesEdit, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        SalesDetails: {
          salesId: salesId, // ID of the sales entry
          totalQuantity: totalQuantity,
          discountType: discountType,
          discountValue: discount,
          payableAmount: payableAmount,
          paymentMethod: payMethods,
          paymentType: radioBtnValue,
          totalAmount: totalAmount,
          paidAmount: finalPaidAmount,
          balanceAmount: balanceAmount,
          sales_items: fields.map((field) => ({
            id: field.sales_item_id,
            categoryId: field.category_id,
            subCategoryId: field.sub_category_id,
            unit_price: field.unitPrice,
            quantity: field.item_quantity,
            amount: field.item_amount,
          })),
        },
        customerDetails: {
          customerId: cusId,
          customerName: cusName,
          customerMobile: cusPhone,
          customerPhone: cusPhone,
          customerEmail: cusEmail,
          customerAddress: cusAdd,
          customerType: cusTypePay,
        },
        prescription_details: {
          refered_by: docName,
          hospital_name: hspName,
        },
        date: date,
      }),
    });
    try {
      const responseData = await response.json();
      console.log("this response Data---", responseData);
      if (responseData.apiStatus.code === "200") {
        setCategoryOption([]);
        setSubCategoryOption([]);
        callList();
        showToast(responseData.apiStatus.message, "success");
      } else {
        showToast(responseData.apiStatus.message, "error");
      }
    } catch (err) {
      console.log("fetch error------", err);
    }
  };

  const closeBtn = () => {
    setCategoryOption([]); // Update state with the data
    setSubCategoryOption([]);
    closeDialog();
  };
  console.log("category option:------", categoryOption);
  console.log("category fields:------", fields);
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Dialog
            open={openEditDialog}
            onClose={closeBtn}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              <Typography>Edit Sales</Typography>
              <IconButton
                aria-label="close"
                onClick={closeBtn}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: "grey",
                  "&:hover": {
                    color: "tomato",
                  },
                }}
              >
                <Close />
              </IconButton>
            </DialogTitle>

            <DialogContent>
              <div>
                <Typography
                  component="h6"
                  sx={{
                    color: "#344767",
                    fontWeight: 600,
                    lineHeight: 1.625,

                    fontSize: "1rem",
                  }}
                  pl={7}
                >
                  Customer Details
                </Typography>
                <Grid
                  container
                  spacing={2}
                  mt={-3}
                  sx={{ padding: "0px 60px" }}
                >
                  <Grid item xs={12} sm={2}>
                    <TextField
                      variant="outlined"
                      label="Name"
                      value={cusName}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCusName(value);
                        // setErrors((prevErrors) => ({
                        //   ...prevErrors,
                        //   valCusName: value.trim() === "",
                        // }));
                      }}
                      fullWidth
                      margin="normal"
                      // error={errors.valCusName}
                      // helperText={errors.valCusName ? "Name is required" : ""}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      label="Mobile Number"
                      variant="outlined"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) && value.length <= 12) {
                          setCusPhone(value);
                        }
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          valCusPhone: !/^[0-9]{10,12}$/.test(value),
                        }));
                      }}
                      value={cusPhone}
                      required
                      inputProps={{ maxLength: 10 }}
                      fullWidth
                      margin="normal"
                      error={errors.valCusPhone}
                      helperText={
                        errors.valCusPhone ? "Mobile number is required *" : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      label="Email"
                      variant="outlined"
                      onChange={(e) => {
                        setCusEmail(e.target.value);
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          valCusEmail: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                            e.target.value
                          ),
                        }));
                      }}
                      value={cusEmail}
                      fullWidth
                      margin="normal"
                      error={errors.valCusEmail}
                      helperText={
                        errors.valCusEmail ? "Invalid email address" : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Address"
                      variant="outlined"
                      value={cusAdd}
                      onChange={(e) => setCusAdd(e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={2} sm={2} mt={2}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      // error={errors.valCusTypePay}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Customer Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          setCusTypePay(selectedValue);
                          // setErrors((prevErrors) => ({
                          //   ...prevErrors,
                          //   valCusTypePay: !selectedValue,
                          // }));
                        }}
                        value={cusTypePay}
                        // onChange={(e) => setCusTypePay(e.target.value)}
                        label="Customer Type"
                        error={errors.valCusTypePay}
                      >
                        <MenuItem value={"normal_pay"}>Normal Pay</MenuItem>
                        <MenuItem value={"monthly_pay"}>Monthly Pay</MenuItem>
                      </Select>
                      {/* {errors.valCusTypePay && (
                <FormHelperText>Customer Type is required *</FormHelperText>
              )} */}
                    </FormControl>
                  </Grid>
                </Grid>
              </div>
              <div className={classes.add_fields}>
                <div>
                  <Typography
                    component="h6"
                    sx={{
                      color: "#344767",
                      fontWeight: 600,
                      lineHeight: 1.625,

                      fontSize: "1rem",
                    }}
                    pl={4}
                    mt={-3}
                  >
                    Order Details
                  </Typography>
                  {fields.map((field, index) => (
                    <Grid container spacing={2} padding={4} mt={-5} key={index}>
                      <Grid item xs={12} md={3} lg={3}>
                        <Autocomplete
                          id={`category-${index}`}
                          // sx={{ width: 260 }}
                          fullWidth
                          open={openCategory[index] || false}
                          onOpen={() => handleCategoryOpen(index)}
                          onClose={() => handleCategoryClose(index)}
                          value={
                            categoryOption.find(
                              (option) => option.id === field.category_id
                            ) || null
                          }
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          getOptionLabel={(option) => option.title} //----------
                          options={categoryOption}
                          loading={categoryLoading[index]}
                          onChange={(e, value) =>
                            categoryChange(index, e, value)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Category"
                              required
                              error={errors.fields[index]?.valCategory_id}
                              // helperText={
                              //   errors.fields[index]?.valCategory_id
                              //     ? "Category is required"
                              //     : ""
                              // }
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {categoryLoading[index] ? (
                                      <CircularProgress
                                        color="inherit"
                                        size={20}
                                      />
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

                      <Grid item xs={12} md={3} lg={3}>
                        <Autocomplete
                          id={`subCategory-${index}`}
                          // sx={{ width: 260 }}
                          fullWidth
                          value={
                            subCategoryOption.find(
                              (option) => option.id === field.sub_category_id
                            ) || null
                          }
                          open={openSubCategory[index] || false}
                          onOpen={() => handleSubCategoryOpen(index)}
                          onClose={() => handleSubCategoryClose(index)}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          getOptionLabel={(option) => option.title} //----------
                          options={subCategoryOption}
                          loading={subCategoryLoading[index]}
                          onChange={(e, value) =>
                            subCategoryChange(index, e, value)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Sub-Category"
                              required
                              error={errors.fields[index]?.valSubCategory_id}
                              // helperText={
                              //   errors.fields[index]?.valSubCategory_id
                              //     ? "SubCategory is required"
                              //     : ""
                              // }
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {subCategoryLoading[index] ? (
                                      <CircularProgress
                                        color="inherit"
                                        size={20}
                                      />
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
                      <Grid item xs={4} md={1} lg={1} width={"100%"}>
                        <TextField
                          label="Units price"
                          placeholder="ex:20"
                          variant="outlined"
                          value={field.unitPrice}
                          onChange={(e) =>
                            mulFields(index, "unitPrice", e.target.value)
                          }
                          error={errors.fields[index]?.valUnit}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={4} md={1} lg={1} width={"100%"}>
                        <TextField
                          label="Quantity"
                          value={field.item_quantity}
                          onChange={(e) =>
                            mulFields(index, "item_quantity", e.target.value)
                          }
                          variant="outlined"
                          fullWidth
                          error={errors.fields[index]?.valQuantity}
                        />
                      </Grid>

                      <Grid item xs={4} md={2} lg={2}>
                        <TextField
                          label="Amount"
                          value={field.item_amount}
                          variant="outlined"
                          InputProps={{ readOnly: true }}
                          fullWidth
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={1}
                        lg={1}
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
                </div>
                <>
                  <div>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#344767",
                        fontWeight: 600,
                        lineHeight: 1.625,
                        fontSize: "1rem",
                      }}
                      pl={4}
                      mt={-1}
                    >
                      Order Summary
                    </Typography>
                    <Grid container spacing={2} padding={4} mt={-5}>
                      <Grid item xs={6} md={3}>
                        <TextField
                          label="Total Quantity"
                          variant="outlined"
                          fullWidth
                          value={totalQuantity}
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <TextField
                          label="Total Amount"
                          variant="outlined"
                          fullWidth
                          value={totalAmount}
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={2} md={2}>
                        <FormControl
                          variant="outlined"
                          fullWidth
                          // error={errors.valDiscountType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Discount Type
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={discountType}
                            onChange={changeDiscountType}
                            label="Discount Type"
                          >
                            <MenuItem value={"percentage"}>%</MenuItem>
                            <MenuItem value={"amount"}>Amount</MenuItem>
                          </Select>
                          {/* {errors.valDiscountType && (
                    <FormHelperText>Discount Type is required</FormHelperText>
                  )} */}
                        </FormControl>
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <TextField
                          label={
                            discountType === "percentage"
                              ? "Discount (%)"
                              : "Discount (Rs)"
                          }
                          variant="outlined"
                          fullWidth
                          value={discount}
                          onChange={changeDiscountValue}
                          error={errors.valDiscount}
                          helperText={
                            errors.valDiscount ? "Invalid discount value" : ""
                          }
                        />
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <TextField
                          label="Payable Amount"
                          variant="outlined"
                          fullWidth
                          value={payableAmount}
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                    </Grid>
                  </div>
                  <div>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#344767",
                        fontWeight: 600,
                        lineHeight: 1.625,
                        fontSize: "1rem",
                      }}
                      pl={4}
                      mt={-1}
                    >
                      Payment Type
                    </Typography>

                    <Grid container spacing={2} padding={4} mt={-5}>
                      <Grid item xs={6} md={6}>
                        <FormControl row>
                          <FormLabel id="demo-controlled-radio-buttons-group">
                            <RadioGroup
                              name="controlled-radio-buttons-group"
                              value={radioBtnValue}
                              onChange={radioBtn}
                              defaultValue="fullypaid"
                              row
                              sx={{ gap: 2 }}
                            >
                              <FormControlLabel
                                value="fullypaid"
                                control={<Radio />}
                                label="Fullypaid"
                                sx={{
                                  "& .MuiFormControlLabel-label": {
                                    color: "#7b809a",
                                    fontWeight: 400,
                                  },
                                }}
                              />
                              <FormControlLabel
                                value="partial"
                                control={<Radio />}
                                label="Partial"
                                sx={{
                                  "& .MuiFormControlLabel-label": {
                                    color: "#7b809a",
                                    fontWeight: 400,
                                  },
                                }}
                              />
                            </RadioGroup>
                          </FormLabel>
                        </FormControl>
                      </Grid>
                      {/* <Grid item xs={4} md={4}>
                        <DatePicker
                          value={date}
                          onChange={(newValue) => setDate(dayjs(newValue))}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              error={errors.valDate}
                              helperText={
                                errors.valDate ? "Date is required" : ""
                              }
                            />
                          )}
                          defaultValue={today}
                          views={["day", "month", "year"]}
                        />
                        {errors.valDate && (
                          <Typography variant="caption" color="error">
                            Date is required *
                          </Typography>
                        )}
                      </Grid> */}
                      <Grid item xs={6} md={6}>
                        <FormControl
                          variant="outlined"
                          fullWidth
                          error={errors.valPayMethods}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            PayMethod
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={payMethods}
                            // onChange={paymethod}
                            onChange={(e) => {
                              const selectedValue = e.target.value;
                              setPayMethods(selectedValue);
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                valPayMethods: !selectedValue,
                              }));
                            }}
                            label="Customer Type"
                            required
                          >
                            <MenuItem value={"Cash"}>Cash</MenuItem>
                            <MenuItem value={"Online Pay"}>Online Pay</MenuItem>
                          </Select>
                          {errors.valPayMethods && (
                            <FormHelperText>
                              PayMethod is required *
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                  </div>
                  {/* when click the partial open fields */}
                  {radioBtnValue === "partial" && (
                    <Box position="relative" padding={4} mt={-8}>
                      <Grid container spacing={3}>
                        <Grid item xs={6} md={6}>
                          <TextField
                            label="Paid Amount"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={paidAmount}
                            // onChange={(e) => setPaidAmount(e.target.value)}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*\.?\d*$/.test(value)) {
                                setPaidAmount(value);
                                if (value.trim() !== "") {
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    valPaidAmount: false,
                                  }));
                                }
                              }
                            }}
                            error={errors.valPaidAmount}
                            helperText={
                              errors.valPaidAmount
                                ? "Paid amount is required for partial payments"
                                : ""
                            }
                          />
                        </Grid>
                        <Grid item xs={6} md={6}>
                          <TextField
                            label="Balance Amount"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            // onChange={(e) => setBalanceAmount(e.target.value)}
                            value={balanceAmount}
                            InputProps={{ readOnly: true }} // Make the field read-only
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                  <Box mt={1} position="relative">
                    <div>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#344767",
                          fontWeight: 600,
                          lineHeight: 1.625,
                          fontSize: "1rem",
                        }}
                        pl={4}
                        mt={-3}
                      >
                        Prescription Details
                      </Typography>
                      <Grid container spacing={2} padding={4} mt={-7}>
                        <Grid item xs={6} md={6}>
                          <TextField
                            label="Hospital Name"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            value={hspName}
                            // onChange={(e) => setHspName(e.target.value)}
                            onChange={(e) => {
                              const value = e.target.value;
                              setHspName(value);
                              // setErrors((prevErrors) => ({
                              //   ...prevErrors,
                              //   valHspName: value.trim() === "",
                              // }));
                            }}
                            // error={errors.valHspName}
                            // helperText={
                            //   errors.valHspName ? "Hospital Name is required" : ""
                            // }
                          />
                        </Grid>
                        <Grid item xs={6} md={6}>
                          <TextField
                            label="Doctor Name"
                            fullWidth
                            value={docName}
                            margin="normal"
                            variant="outlined"
                            // onChange={(e) => setDocName(e.target.value)}
                            onChange={(e) => {
                              const value = e.target.value;
                              setDocName(value);
                              // setErrors((prevErrors) => ({
                              //   ...prevErrors,
                              //   valDocName: value.trim() === "",
                              // }));
                            }}
                            // error={errors.valDocName}
                            // helperText={
                            //   errors.valDocName ? "Doctor Name is required" : ""
                            // }
                          />
                        </Grid>
                        {/* <Grid item xs={4} md={4} mt={2}>
                          <TextField
                            variant="outlined"
                            fullWidth
                            sx={{
                              cursor: "pointer",
                              "&:hover": {
                                cursor: "pointer",
                              },
                            }}
                            label="Prescription"
                            value={fileName}
                            name="file"
                            onClick={handleTextFieldClick}
                            InputProps={{
                              readOnly: true,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <input
                                    accept="*"
                                    style={{ display: "none" }}
                                    id="raised-button-file"
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                  />
                                  <Typography
                                    // variant="caption"
                                    variant="body1"
                                    backgroundColor="primary.main"
                                    color="white"
                                    padding="7px 5px"
                                    borderRadius="4px"
                                    fontWeight="medium"
                                    component="span"
                                    // onClick={handleTextFieldClick}
                                    sx={{
                                      cursor: "pointer",
                                      "&:hover": {
                                        backgroundColor: "primary.dark",
                                      },
                                    }}
                                  >
                                    Choose File
                                  </Typography>
                                </InputAdornment>
                              ),
                            }}
                            // error={errors.valImgPath}
                            // helperText={
                            //   errors.valImgPath ? "Prescription is required *" : ""
                            // }
                          />
                        </Grid> */}
                      </Grid>
                    </div>
                  </Box>
                  <Stack direction="row" justifyContent="center" gap="10px">
                    <Button
                      variant="contained"
                      sx={{
                        color: "white",
                        backgroundColor: "grey",
                        "&:hover": { backgroundColor: "darkgrey" },
                      }}
                      onClick={closeBtn}
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
                </>
              </div>
            </DialogContent>
          </Dialog>
        </ThemeProvider>
      </LocalizationProvider>
    </>
  );
}

// date
const today = dayjs();

//style
const useStyles = makeStyles({
  add_fields: {
    borderRadius: "4px",
    padding: "16px",
    margin: "15px",
  },
});
const theme = createTheme({
  palette: {
    success: {
      main: "#4caf50", // Define your success color
      contrastText: "#ffffff", // Define the text color for the success button
    },
  },
});
