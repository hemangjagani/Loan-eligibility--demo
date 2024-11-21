import React from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  MenuItem,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const fieldConfig = [
  { label: "NO OF DEPENDENTS", name: "no_of_dependents", type: "number" },
  { label: "EDUCATION", name: "education", type: "select", options: ["Graduate", "Non-Graduate"] },
  { label: "SELF EMPLOYED", name: "self_employed", type: "radio", options: ["Yes", "No"] },
  { label: "INCOME (ANNUAL)", name: "income_annum", type: "number" },
  { label: "LOAN AMOUNT", name: "loan_amount", type: "number" },
  { label: "LOAN TERM (2-20 YEARS)", name: "loan_term", type: "number", min: 2, max: 20 },
  { label: "CIBIL SCORE (300-900)", name: "cibil_score", type: "number", min: 300, max: 900 },
  { label: "RESIDENTIAL ASSETS VALUE", name: "residential_assets_value", type: "number" },
  { label: "COMMERCIAL ASSETS VALUE", name: "commercial_assets_value", type: "number" },
  { label: "LUXURY ASSETS VALUE", name: "luxury_assets_value", type: "number" },
  { label: "BANK ASSET VALUE", name: "bank_asset_value", type: "number" },
];

// Yup Validation Schema
const validationSchema = Yup.object().shape({
  no_of_dependents: Yup.number()
    .required("Please specify the number of dependents.")
    .min(0, "The number of dependents cannot be negative."),
  education: Yup.string().required("Please select your education level."),
  self_employed: Yup.string().required("Please specify if you are self-employed."),
  income_annum: Yup.number()
    .required("Please provide your annual income.")
    .min(1, "Annual income must be a positive number."),
  loan_amount: Yup.number()
    .required("Please enter the loan amount you want to apply for.")
    .min(1, "Loan amount must be a positive number."),
  loan_term: Yup.number()
    .required("Please specify the loan term in years.")
    .min(2, "Loan term must be at least 2 years.")
    .max(20, "Loan term cannot exceed 20 years."),
  cibil_score: Yup.number()
    .required("Please provide your CIBIL score.")
    .min(300, "CIBIL score must be at least 300.")
    .max(900, "CIBIL score cannot exceed 900."),
  residential_assets_value: Yup.number()
    .required("Please provide the value of your residential assets.")
    .min(0, "Residential asset value cannot be negative."),
  commercial_assets_value: Yup.number()
    .required("Please provide the value of your commercial assets.")
    .min(0, "Commercial asset value cannot be negative."),
  luxury_assets_value: Yup.number()
    .required("Please provide the value of your luxury assets.")
    .min(0, "Luxury asset value cannot be negative."),
  bank_asset_value: Yup.number()
    .required("Please provide the value of your bank assets.")
    .min(0, "Bank asset value cannot be negative."),
});


const LoanEligibilityForm = () => {
  const initialValues = fieldConfig.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {});

  const handleSubmit = (values, { setSubmitting, setFieldValue }) => {
    const { income_annum, loan_amount, cibil_score, loan_term } = values;
    const income = parseFloat(income_annum);
    const loan = parseFloat(loan_amount);
    const cibil = parseInt(cibil_score, 10);
    const term = parseInt(loan_term, 10);

    let result;
    if (cibil >= 750 && loan < income * 5 && term >= 2 && term <= 20) {
      result = "Eligible for Loan";
    } else {
      result = "Not Eligible for Loan";
    }

    setSubmitting(false);
    setFieldValue("result", result);
  };

  const renderField = (field, errors, touched, handleChange) => {
    switch (field.type) {
      case "select":
        return (
          <TextField
            select
            label={field.label}
            name={field.name}
            onChange={handleChange}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
            fullWidth
            variant="outlined"
            sx={{ backgroundColor: "#f9f9f9", borderRadius: 2 }}
          >
            {field.options.map((option, i) => (
              <MenuItem key={i} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        );

      case "radio":
        return (
          <FormControl>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {field.label}
            </Typography>
            <RadioGroup
              row
              name={field.name}
              onChange={handleChange}
              error={touched[field.name] && Boolean(errors[field.name])}
            >
              {field.options.map((option, i) => (
                <FormControlLabel key={i} value={option} control={<Radio />} label={option} />
              ))}
            </RadioGroup>
            {touched[field.name] && errors[field.name] && (
              <Typography variant="caption" color="error">
                {errors[field.name]}
              </Typography>
            )}
          </FormControl>
        );

      default:
        return (
          <TextField
            label={field.label}
            name={field.name}
            type={field.type}
            onChange={handleChange}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
            fullWidth
            inputProps={field.min ? { min: field.min, max: field.max } : {}}
            variant="outlined"
            sx={{ backgroundColor: "#f9f9f9", borderRadius: 2 }}
          />
        );
    }
  };

  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <AccountBalanceIcon sx={{ fontSize: 40, color: "#fff", mr: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#fff" }}>
              Loan Eligibility App
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right, #ece9e6, #ffffff)",
          p: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            maxWidth: 900,
            width: "100%",
            p: 4,
            borderRadius: 4,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}>
            Loan Eligibility Checker
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, handleChange, isSubmitting }) => (
              <Form>
                <Grid container spacing={3}>
                  {fieldConfig.map((field, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      {renderField(field, errors, touched, handleChange)}
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      py: 1.5,
                      backgroundColor: "green",
                      "&:hover": { backgroundColor: "darkgreen" },
                      fontWeight: "bold",
                    }}
                    startIcon={<AttachMoneyIcon />}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Check Eligibility"}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>

          {initialValues.result && (
            <Typography
              variant="h6"
              sx={{
                mt: 3,
                textAlign: "center",
                color: initialValues.result.includes("Eligible") ? "green" : "red",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              {initialValues.result.includes("Eligible") ? (
                <CheckCircleOutlineIcon color="success" />
              ) : (
                <ErrorOutlineIcon color="error" />
              )}
              {initialValues.result}
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default LoanEligibilityForm;
