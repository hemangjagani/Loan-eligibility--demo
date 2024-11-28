import React, { useState } from "react";
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
import axios from "axios";

// Field Configuration
const fieldConfig = [
  { label: "NO OF DEPENDENTS", name: "no_of_dependents", type: "number" },
  {
    label: "EDUCATION",
    name: "education",
    type: "select",
    options: ["Graduate", "Non-Graduate"],
  },
  {
    label: "SELF EMPLOYED",
    name: "self_employed",
    type: "radio",
    options: ["Yes", "No"],
  },
  { label: "INCOME (ANNUAL)", name: "income_annum", type: "number" },
  { label: "LOAN AMOUNT", name: "loan_amount", type: "number" },
  {
    label: "LOAN TERM (2-20 YEARS)",
    name: "loan_term",
    type: "number",
    min: 2,
    max: 20,
  },
  {
    label: "CIBIL SCORE (300-900)",
    name: "cibil_score",
    type: "number",
    min: 300,
    max: 900,
  },
  {
    label: "RESIDENTIAL ASSETS VALUE",
    name: "residential_assets_value",
    type: "number",
  },
  {
    label: "COMMERCIAL ASSETS VALUE",
    name: "commercial_assets_value",
    type: "number",
  },
  { label: "LUXURY ASSETS VALUE", name: "luxury_assets_value", type: "number" },
  { label: "BANK ASSET VALUE", name: "bank_asset_value", type: "number" },
];

// Yup Validation Schema
const validationSchema = Yup.object().shape(
  fieldConfig.reduce((acc, field) => {
    if (field.type === "number") {
      acc[field.name] = Yup.number()
        .required(`Please provide your ${field.label.toLowerCase()}.`)
        .min(0, `${field.label} cannot be negative.`);
    } else {
      acc[field.name] = Yup.string().required(
        `Please provide your ${field.label.toLowerCase()}.`
      );
    }
    return acc;
  }, {})
);

const LoanEligibilityForm = () => {
  const [results, setResults] = useState([]); // Ensure results is initialized as an array
  const [loaneligibility,seteligibility]=useState([])
  const initialValues = fieldConfig.reduce(
    (acc, field) => ({ ...acc, [field.name]: "" }),
    {}
  );

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      model: "RandomForest", // Replace with the desired model
      features: {
        loan_id: 1, // Assuming a static loan_id for now
        ...values,
      },
    };

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response from server:", response.data);
      seteligibility(response.data)
    } catch (error) {
      console.error("Error sending data:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const displayingmodel = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/metrics");
      console.log("API Response:", response.data);
      const formattedResults = Object.keys(response.data).map((key) => ({
        name: key,
        ...response.data[key],
      }));
      setResults(formattedResults);
    } catch (error) {
      console.error("API Error:", error);
    }
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
            <Typography>{field.label}</Typography>
            <RadioGroup
              row
              name={field.name}
              onChange={handleChange}
              value={field.value}
            >
              {field.options.map((option, i) => (
                <FormControlLabel
                  key={i}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
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
          />
        );
    }
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Loan Eligibility App</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: 3 }}>
        <Paper sx={{ padding: 3 }}>
          <Typography variant="h4" sx={{ marginBottom: 3 }}>
            Loan Eligibility Checker
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, handleChange, isSubmitting }) => (
              <Form>
                <Grid container spacing={2}>
                  {fieldConfig.map((field, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      {renderField(field, errors, touched, handleChange)}
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ textAlign: "center", marginTop: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Check Eligibility"}
                  </Button>
                </Box>

                {loaneligibility && (
      <Box sx={{ marginTop: 3, textAlign: "center" }}>
        <Typography
          variant="h6"
          color={loaneligibility.loan_status === "Approved" ? "green" : "red"}
        >
          Loan Status: {loaneligibility.loan_status}
        </Typography>
        <Typography variant="subtitle1">
          Selected Model: {loaneligibility.selected_model}
        </Typography>
      </Box>
    )}
              </Form>
            )}
          </Formik>
          <Box sx={{ marginTop: 3 }}>
            <Button variant="outlined" onClick={displayingmodel}>
              Display Model Results
            </Button>
            {results.length > 0 && (
              <div>
                <h2>Model Results</h2>
                <ul>
                  {results.map((result, index) => (
                    <li key={index}>
                      <strong>{result.name}:</strong> Accuracy:{" "}
                      {(result.accuracy * 100).toFixed(2)}%
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoanEligibilityForm;
