import React, { useState } from "react";
import "../BasicFormReact18/styles.css";

const MortgageCalculator = () => {
  // CHANGE: Add errors state to track validation errors
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    principal: "",
    interest: "",
    years: "",
  });
  const [monthlyPayment, setMonthlyPayment] = useState(null);

  // Example validation function
  const validate = () => {
    const newErrors = {};

    const validateField = (name, label) => {
      const value = String(form[name]).trim();
      if (!value) {
        newErrors[name] = `${label} is required`;
        return;
      }

      const numericValue = Number(value);
      if (Number.isNaN(numericValue) || !Number.isFinite(numericValue)) {
        newErrors[name] = `${label} must be a valid number`;
        return;
      }

      if (numericValue <= 0) {
        newErrors[name] = `${label} must be greater than zero`;
      }
    };

    validateField("principal", "Principal");
    validateField("interest", "Interest rate");
    validateField("years", "Years");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    // Optionally clear error for the field being edited
    setErrors({
      ...errors,
      [e.target.name]: undefined,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const principalValue = Number(form.principal);
    const annualInterest = Number(form.interest) / 100;
    const months = Number(form.years) * 12;

    const monthlyRate = annualInterest / 12;
    const payment =
      monthlyRate === 0
        ? principalValue / months
        : (principalValue * monthlyRate) /
          (1 - Math.pow(1 + monthlyRate, -months));

    setMonthlyPayment(payment);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Principal:
            <input
              type="text"
              name="principal"
              value={form.principal}
              onChange={handleChange}
            />
          </label>
          {errors.principal && (
            <span style={{ color: "red" }}>{errors.principal}</span>
          )}
        </div>
        <div>
          <label>
            Interest Rate:
            <input
              type="text"
              name="interest"
              value={form.interest}
              onChange={handleChange}
            />
          </label>
          {errors.interest && (
            <span style={{ color: "red" }}>{errors.interest}</span>
          )}
        </div>
        <div>
          <label>
            Years:
            <input
              type="text"
              name="years"
              value={form.years}
              onChange={handleChange}
            />
          </label>
          {errors.years && <span style={{ color: "red" }}>{errors.years}</span>}
        </div>
        <button type="submit">Calculate</button>
      </form>
      {monthlyPayment !== null && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          <div>
            <strong>Mortgage:</strong> ${monthlyPayment.toFixed(2)} / month
          </div>
        </div>
      )}
    </>
  );
};

export default MortgageCalculator;
