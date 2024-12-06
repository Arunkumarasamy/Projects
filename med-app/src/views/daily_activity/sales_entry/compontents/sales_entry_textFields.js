import * as React from "react";
import PropTypes from "prop-types";
import { IMaskInput } from "react-imask";
import { NumericFormat } from "react-number-format";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import styled from "@emotion/styled";
import { useState } from "react";
import { AddCircle, Close, RemoveCircle } from "@mui/icons-material";

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask={/^[0-9!@#$%^&*(),.?":{}|<>]*$/}
      definitions={{
        "#": /[0-9!@#$%^&*(),.?":{}|<>]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

// this asynoc autocomplete

function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

TextMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(
  props,
  ref
) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      prefix="Rs:"
    />
  );
});

NumericFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function Sales_entry_textFields() {
  // style

  const classes = useStyles();

  const [values, setValues] = React.useState({
    // textmask: "(100) 000-0000",
    // numberformat: "1320",
  });

  // this radio button
  const [radioOpen, setRadioOpen] = useState(false);
  const [radioValue, setRadioValue] = useState("");

  const handleClose = () => {
    setRadioOpen(false);
    setRadioValue("");
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log("Form submitted");
    setRadioOpen(false);
  };

  const radioBtnClicked = (event) => {
    setRadioValue(event.target.value);
    if (event.target.value === "pending") {
      setRadioOpen(true);
    }
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const [selectedValue, setSelectedValue] = React.useState("a");

  const handleChangeRadioBtn = (event) => {
    setSelectedValue(event.target.value);
  };

  const controlPropsRadio = (item) => ({
    checked: selectedValue === item,
    onChange: handleChangeRadioBtn,
    value: item,
    name: "color-radio-button-demo",
    inputProps: { "aria-label": item },
  });
  // Autocomplete

  // asynco category
  const [medicinCategery, setMedicinCategery] = React.useState(false);
  const [categoryOptions, setCategoryOptions] = React.useState([]);
  const waiting = medicinCategery && categoryOptions.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!waiting) {
      return undefined;
    }

    (async () => {
      await sleep(1e3);

      if (active) {
        setCategoryOptions([...category]);
      }
    })();

    return () => {
      active = false;
    };
  }, [waiting]);

  React.useEffect(() => {
    if (!medicinCategery) {
      setCategoryOptions([]);
    }
  }, [medicinCategery]);

  // asynchro syntoms
  const [auto, setAuto] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = auto && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e4); // For demo purposes.

      if (active) {
        setOptions([...medicin]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!auto) {
      setOptions([]);
    }
  }, [auto]);

  // add order fields

  const [fields, setFields] = useState([{ id: 1 }]);

  //add sameFieldsby order

  const addAnotherField = () => {
    setFields([...fields, { id: fields.length + 1 }]);
  };

  const removeField = (ind) => {
    let dataStore = [...fields];
    dataStore.splice(ind, 1);
    setFields(dataStore);
  };
  return (
    <Stack direction="row" spacing={3}>
      {fields.map((addFields) => (
        <div key={addFields.id}>
          <Box className={classes.formContainer}>
            <div className={classes.autoComp}>
              <Autocomplete
                id="category"
                sx={{ width: 200 }}
                open={medicinCategery}
                onOpen={() => {
                  setMedicinCategery(true);
                }}
                onClose={() => {
                  setMedicinCategery(false);
                }}
                isOptionEqualToValue={(categoryOptions, value) =>
                  categoryOptions.title === value.title
                }
                getOptionLabel={(categoryOptions) => categoryOptions.title}
                options={categoryOptions}
                loading={waiting}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {waiting ? (
                            <CircularProgress color="inherit" />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                    InputLabelProps={{
                      style: {
                        fontSize: "14px",
                      },
                    }}
                    inputProps={{
                      ...params.inputProps,
                      style: {
                        height: "25px",
                        padding: "0 7px",
                        fontSize: "14px",
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

              <Autocomplete
                id="medicineName"
                sx={{ width: 200 }}
                open={auto}
                onOpen={() => {
                  setAuto(true);
                }}
                onClose={() => {
                  setAuto(false);
                }}
                isOptionEqualToValue={(option, value) =>
                  option.title === value.title
                }
                getOptionLabel={(option) => option.title}
                options={options}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="MedicineName/Syntoms"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                    fullWidth
                    InputLabelProps={{
                      style: {
                        fontSize: "14px",
                      },
                    }}
                    inputProps={{
                      ...params.inputProps,
                      style: {
                        height: "25px",
                        padding: "0px 7px",
                        fontSize: "14px",
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
            </div>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  label="units"
                  placeholder="eg:20mg"
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  label="Quantity"
                  InputProps={{
                    inputComponent: TextMaskCustom,
                  }}
                  //   helperText="Only numbers and symbols are allowed"
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  label="Total Amount"
                  //   onChange={handleChange}
                  name="numberformat"
                  id="formatted-numberformat-input"
                  InputProps={{
                    inputComponent: NumericFormatCustom,
                  }}
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Discount"
                  InputProps={{
                    inputComponent: TextMaskCustom,
                  }}
                  //   helperText="Only numbers and symbols are allowed"
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Payable Amount"
                  //   onChange={handleChange}
                  name="numberformat"
                  id="formatted-numberformat-input"
                  InputProps={{
                    inputComponent: NumericFormatCustom,
                  }}
                  variant="standard"
                  fullWidth
                />
              </Grid>
            </Grid>

            <RadioGroup name="customized-radios">
              <div className={classes.radioBtn}>
                <FormControlLabel
                  value="payout"
                  control={<BpRadio />}
                  label="Payout"
                />
                <FormControlLabel
                  value="pending"
                  control={<BpRadio />}
                  label="Pending"
                  onClick={radioBtnClicked}
                />
              </div>
            </RadioGroup>
          </Box>
        </div>
      ))}

      {/* <IconButton onClick={addAnotherField} sx={{ fontSize: "32px" }}>
        <AddCircle />
      </IconButton>
      <IconButton onClick={removeField} sx={{ fontSize: "32px" }}>
        <RemoveCircle />
      </IconButton> */}
      <Dialog open={radioOpen} onClose={handleClose}>
        <DialogTitle>
          Balance Amount
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Paid Amount"
            //   onChange={handleChange}
            name="numberformat"
            id="formatted-numberformat-input"
            InputProps={{
              inputComponent: NumericFormatCustom,
            }}
            variant="standard"
            fullWidth
          />
          <TextField
            label="Remaining Amount"
            //   onChange={handleChange}
            name="numberformat"
            id="formatted-numberformat-input"
            InputProps={{
              inputComponent: NumericFormatCustom,
            }}
            variant="standard"
            sx={{ marginTop: "5px" }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ color: "whitesmoke" }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

// Inspired by blueprintjs
function BpRadio(props) {
  return (
    <Radio
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      {...props}
    />
  );
}
const BpIcon = styled("span")(({ theme }) => ({
  borderRadius: "50%",
  width: 16,
  height: 16,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 0 0 1px rgb(16 22 26 / 40%)"
      : "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
  backgroundColor: theme.palette.mode === "dark" ? "#394b59" : "#f5f8fa",
  backgroundImage:
    theme.palette.mode === "dark"
      ? "linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))"
      : "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  "input:hover ~ &": {
    backgroundColor: theme.palette.mode === "dark" ? "#30404d" : "#ebf1f5",
  },
  "input:disabled ~ &": {
    boxShadow: "none",
    background:
      theme.palette.mode === "dark"
        ? "rgba(57,75,89,.5)"
        : "rgba(206,217,224,.5)",
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: "#137cbd",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
  "&::before": {
    display: "block",
    width: 16,
    height: 16,
    backgroundImage: "radial-gradient(#fff,#fff 28%,transparent 32%)",
    content: '""',
  },
  "input:hover ~ &": {
    backgroundColor: "#106ba3",
  },
});

const category = [
  { title: "Counter" },
  { title: "Medicin" },
  { title: "General" },
];

const medicin = [
  { title: "Fever" },
  { title: "Headtake" },
  { title: "Cold" },
  { title: "Joint pain" },
  { title: "boost" },
  { title: "Complant" },
];

// style
const useStyles = makeStyles({
  formContainer: {
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "16px",
  },
  salesform: {
    marginLeft: "10px",
  },
  radioBtn: {
    display: "flex",
    justifyContent: "center",
    justifyContent: "space-evenly",
  },
  autoComp: {
    display: "flex",
    justifyContent: "center",
    justifyContent: "space-evenly",
  },
});
