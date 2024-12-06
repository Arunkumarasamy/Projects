import {
  AddCircle,
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
} from "@mui/material";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { makeStyles } from "@mui/styles";
import Url from "Api";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function Add_sales({ showToast, refreshList }) {
  const classes = useStyles();

  // const [date, setDate] = useState(dayjs());
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

    invalidPhone: false,
  });

  // validation error
  const validateFields = () => {
    // salesAmount.trim() === "" || !/^\d*\.?\d*$/.test(salesAmount)
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,12}$/;
    const validNumberRegex = /^\d*$/; // For invalid characters check

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
      invalidPhone: !validNumberRegex.test(cusPhone),
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

  // date
  const today = dayjs();
  const date = today.format("YYYY-MM-DD");
  console.log("date checking----", date);

  // category dropdown fetch
  useEffect(() => {
    const token = localStorage.getItem("token");
    const checkDDOpen = openCategory.some((open) => open);

    // find the open index
    if (checkDDOpen) {
      const openIndex = openCategory.findIndex((open) => open);

      setCategoryLoading((prev) => {
        const updatedLoading = [...prev];
        updatedLoading[openIndex] = true; // Set loading for the open dropdown
        return updatedLoading;
      });
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
          const category = data.result.categoryData.map((item) => ({
            title: item.CategoryName,
            id: item.id,
          }));
          setCategoryOption(category);
          setCategoryLoading((prev) => {
            const updatedLoading = [...prev];
            updatedLoading[openIndex] = false;
            return updatedLoading;
          });
        })
        .catch((error) => {
          console.error("Error fetching vendors:", error);
          setCategoryLoading((prev) => {
            const updatedLoading = [...prev];
            updatedLoading[openIndex] = false;
            return updatedLoading;
          });
        });
    } else {
      setCategoryLoading([]);
    }
  }, [openCategory]);

  // subcategory dropdown fetch
  useEffect(() => {
    const token = localStorage.getItem("token");
    const checkDDOpen = openSubCategory.some((open) => open);
    // find the open index
    if (checkDDOpen) {
      const openIndex = openSubCategory.findIndex((open) => open);
      setSubCategoryLoading((prev) => {
        const updatedLoading = [...prev];
        updatedLoading[openIndex] = true;
        return updatedLoading;
      });
      fetch(Url.api + Url.subCategoryList, {
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
          const subCategory = data.result.SubCategoryData.map((item) => ({
            title: item.SubCategoryName,
            id: item.Id,
            salesAmount: item.salesAmount,
          }));
          setSubCategoryOption(subCategory);
          setSubCategoryLoading((prev) => {
            const updatedLoading = [...prev];
            updatedLoading[openIndex] = false;
            return updatedLoading;
          });
        })
        .catch((error) => {
          console.error("Error fetching vendors:", error);
          setSubCategoryLoading((prev) => {
            const updatedLoading = [...prev];
            updatedLoading[openIndex] = false;
            return updatedLoading;
          });
        });
    } else {
      setSubCategoryLoading([]);
    }
  }, [openSubCategory]);

  // Memoize subCategoryOption
  const memoizedSubCategoryOption = useMemo(
    () => subCategoryOption,
    [subCategoryOption]
  );

  // onchanges for category
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
  // onchanges for subcategory
  const subCategoryChange = (ind, event, value) => {
    console.log(`Subcategory selected at index ${ind}:---->`, value);

    if (value) {
      mulFields(ind, "sub_category_id", value.id);
      // mulFields(ind, "unitPrice", value.salesAmount);

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
      mulFields(ind, "unitPrice", "");
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

  //  category dropdown open
  const handleCategoryOpen = (index) => {
    setOpenCategory((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
    setCategoryLoading((prev) => {
      const updatedLoading = [...prev];
      updatedLoading[index] = true;
      return updatedLoading;
    });
  };
  //  subcategory dropdown open
  const handleSubCategoryOpen = (index) => {
    setOpenSubcategory((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
    setSubCategoryLoading((prev) => {
      const updatedLoading = [...prev];
      updatedLoading[index] = true;
      return updatedLoading;
    });
  };

  // category dropdown close
  const handleCategoryClose = (index) => {
    setOpenCategory((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
    setCategoryLoading((prev) => {
      const updatedLoading = [...prev];
      updatedLoading[index] = false;
      return updatedLoading;
    });
  };
  // subcategory dropdown close
  const handleSubCategoryClose = (index) => {
    setOpenSubcategory((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
    setSubCategoryLoading((prev) => {
      const updatedLoading = [...prev];
      updatedLoading[index] = false;
      return updatedLoading;
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
    setDiscount(""); // Reset discount when type changes
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
    // Recalculate payable amount
    logic_Amount_Discount(discountType, discountValue);
  };
  const logic_Amount_Discount = (type, discountValue) => {
    let payable = parseFloat(totalAmount);

    if (isNaN(payable)) {
      console.error("Invalid totalAmount value");
      setPayableAmount("0.00");
      return;
    }

    if (type === "%" && discountValue) {
      const percentage = parseFloat(discountValue);
      if (!isNaN(percentage)) {
        payable -= (payable * percentage) / 100;
      } else {
        console.error("Invalid percentage value");
      }
    } else if (type === "Amount" && discountValue) {
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

  useEffect(() => {
    setPayableAmount(totalAmount);
  }, [totalAmount]);

  // save api call
  const submitButton = async (eve) => {
    if (!validateFields()) {
      return;
    }

    const finalPaidAmount =
      radioBtnValue === "fullypaid" ? payableAmount : paidAmount;

    let token = localStorage.getItem("token");
    const response = await fetch(Url.api + Url.salesCreate, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        date: date,
        customerDetails: {
          customerName: cusName,
          customerMobile: cusPhone,
          customerPhone: null,
          customerEmail: cusEmail,
          customerAddress: cusAdd,
          customerType: cusTypePay,
        },
        SalesDetails: {
          sales_items: fields.map((field) => ({
            categoryId: field.category_id,
            subCategoryId: field.sub_category_id,
            unitPrice: field.unitPrice,
            quantity: field.item_quantity,
            amount: field.item_amount,
          })),

          totalQuantity: totalQuantity,
          discountType: discountType,
          discountValue: discount,
          payableAmount: payableAmount,
          paymentMethod: payMethods,
          paymentType: radioBtnValue,
          totalAmount: totalAmount,
          paidAmount: finalPaidAmount,
          balanceAmount: balanceAmount,
        },
        prescription_details: {
          refered_by: docName,
          hospitalName: hspName,
          prescription: {
            pres_id: img_id,
          },
        },
      }),
    });
    try {
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.apiStatus.code == "200") {
        refreshList();
        showToast(responseData.apiStatus.message, "success");
        resetBtn();
      } else {
        showToast(responseData.apiStatus.message, "error");
        console.log("error");
      }
    } catch (error) {
      console.log("fetch error" + error);
    }
  };

  // reset
  const resetBtn = () => {
    setCusName("");
    setCusEmail("");
    setCusPhone("");
    setCusAdd("");
    setCusTypePay("");
    setFields([
      {
        sales_item_id: 1,
        category_id: null,
        sub_category_id: null,
        unitPrice: "",
        item_quantity: "",
        item_amount: "",
      },
    ]);
    setTotalQuantity(0);
    setTotalAmount(0);
    setDiscountType("");
    setDiscount("");
    setPayableAmount(0);
    setPayMethods("");
    setRadioBtnValue("fullypaid");
    setPaidAmount("");
    setBalanceAmount("");
    setImg__id(null);
    setFileName("");
    setDocName("");
    setHspName("");
    setErrors({
      valCusEmail: false,
      valCusPhone: false,
      valDiscount: false,
      valPayMethods: false,
      valPaidAmount: false,
      fields: [], // Initialize fields as an empty array
    });
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div>
            <Typography variant="h6" pl={7}>
              Customer Details
            </Typography>
            <Grid container spacing={2} mt={-3} sx={{ padding: "0px 60px" }}>
              <Grid item xs={12} md={2} lg={2}>
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
              <Grid item xs={12} md={2} lg={2}>
                <TextField
                  label="Mobile Number"
                  variant="outlined"
                  required
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && value.length <= 12) {
                      setCusPhone(value);
                    }
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      valCusPhone: !/^[0-9]{10,12}$/.test(value),
                      invalidPhone: !/^\d*$/.test(value),
                    }));
                  }}
                  value={cusPhone}
                  inputProps={{ maxLength: 10 }}
                  fullWidth
                  margin="normal"
                  error={errors.valCusPhone || errors.invalidPhone}
                  helperText={
                    errors.invalidPhone
                      ? "Please enter a valid number (0-9)"
                      : errors.valCusPhone
                      ? "Mobile number is required *"
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12} md={2} lg={2}>
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
                  helperText={errors.valCusEmail ? "Invalid email address" : ""}
                />
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <TextField
                  label="Address"
                  variant="outlined"
                  value={cusAdd}
                  onChange={(e) => setCusAdd(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={2} md={2} lg={2} mt={2}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  error={errors.valCusTypePay}
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
              <Typography variant="h6" pl={4} mt={-3}>
                Order Details
              </Typography>
              {fields.map((field, index) => (
                <Grid container spacing={2} padding={4} mt={-5} key={index}>
                  <Grid item xs={12} md={6} lg={2}>
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
                        option.title === value.title
                      }
                      getOptionLabel={(option) => option.title}
                      options={categoryOption}
                      loading={categoryLoading[index] || false}
                      onChange={(e, value) => categoryChange(index, e, value)}
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

                  <Grid item xs={12} md={6} lg={2}>
                    <Autocomplete
                      id={`subCategory-${index}`}
                      // sx={{ width: 260 }}
                      fullWidth
                      open={openSubCategory[index] || false}
                      onOpen={() => handleSubCategoryOpen(index)}
                      onClose={() => handleSubCategoryClose(index)}
                      value={
                        memoizedSubCategoryOption.find(
                          (option) => option.id === field.sub_category_id
                        ) || null
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      getOptionLabel={(option) => option.title} //----------
                      options={memoizedSubCategoryOption}
                      loading={subCategoryLoading[index] || false}
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
                  <Grid item xs={4} md={3} lg={2}>
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
                  <Grid item xs={4} md={3} lg={2}>
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

                  <Grid item xs={4} md={3} lg={3}>
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
                    md={3}
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
                <Typography variant="h6" pl={4} mt={-1}>
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
                        <MenuItem value={"%"}>%</MenuItem>
                        <MenuItem value={"Amount"}>Amount</MenuItem>
                      </Select>
                      {/* {errors.valDiscountType && (
                    <FormHelperText>Discount Type is required</FormHelperText>
                  )} */}
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      label={
                        discountType === "%" ? "Discount (%)" : "Discount (₹)"
                      }
                      variant="outlined"
                      fullWidth
                      value={discount}
                      onChange={changeDiscountValue}
                      error={errors.valDiscount}
                      helperText={errors.valDiscount ? "Invalid value" : ""}
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
                <Typography variant="h6" pl={4} mt={-1}>
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
                          sx={{ gap: 10 }}
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
                      views={["day", "month", "year"]}
                      value={date}
                      onChange={handleDateChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={errors.valDate}
                          helperText={
                            errors.valDate ? "Date is required *" : ""
                          }
                        />
                      )}
                      required
                      defaultValue={today}
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
                      >
                        <MenuItem value={"Cash"}>Cash</MenuItem>
                        <MenuItem value={"Online Pay"}>Online Pay</MenuItem>
                      </Select>
                      {errors.valPayMethods && (
                        <FormHelperText>PayMethod is required *</FormHelperText>
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
                  <Typography variant="h6" pl={4} mt={-3}>
                    Prescription Details
                  </Typography>
                  <Grid container spacing={2} padding={4} mt={-7}>
                    <Grid item xs={4} md={4}>
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
                    <Grid item xs={4} md={4}>
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
                    <Grid item xs={4} md={4} mt={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            cursor: "pointer",
                          },
                        }}
                        label="Uploade image"
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
                    </Grid>
                  </Grid>
                </div>
              </Box>
              <Stack direction="row" justifyContent="center" gap="10px">
                <Button
                  variant="contained"
                  startIcon={<RotateLeft />}
                  sx={{
                    color: "white",
                    backgroundColor: "grey",
                    "&:hover": { backgroundColor: "darkgrey" },
                  }}
                  onClick={resetBtn}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  endIcon={<OfflinePin />}
                  onClick={submitButton}
                >
                  Submit
                </Button>
              </Stack>
            </>
          </div>
        </ThemeProvider>
      </LocalizationProvider>
    </>
  );
}

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
