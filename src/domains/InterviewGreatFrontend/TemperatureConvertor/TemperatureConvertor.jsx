import React from "react";

const TemperatureConvertor = () => {
  const [enteredTemperature, setEnteredTemperature] = React.useState(null);
  const [selectedUnit, setSelectedUnit] = React.useState("Celsius");
  const [convertedTemperature, setConvertedTemperature] = React.useState(null);

  const convertTemperature = (event) => {
    event.preventDefault();
    // Implementation for temperature conversion
    if (selectedUnit === "Celsius") {
      const fahrenheit = (enteredTemperature * 9) / 5 + 32;
      setConvertedTemperature(fahrenheit);
    } else {
      const celsius = ((enteredTemperature - 32) * 5) / 9;
      setConvertedTemperature(celsius);
    }
  };
  return (
    <div>
      <form onSubmit={convertTemperature}>
        <input
          type="number"
          placeholder="Enter temperature"
          value={enteredTemperature}
          onChange={(e) => {
            setEnteredTemperature(e.target.value);
            setConvertedTemperature(null);
          }}
        />
        <fieldset>
          <legend>Unit</legend>
          {["Celsius", "Fahrenheit"].map((level) => (
            <label key={level}>
              <input
                type="radio"
                name="unit"
                value={level}
                checked={selectedUnit === level}
                onChange={(e) => {
                  setSelectedUnit(e.target.value);
                  setConvertedTemperature(null);
                }}
              />
              {level}
            </label>
          ))}
        </fieldset>
        <button
          disabled={!enteredTemperature}
          type="submit"
        >{`Convert to ${selectedUnit === "Celsius" ? "Fahrenheit" : "Celsius"}`}</button>
      </form>
      <div
        style={{
          margin: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {convertedTemperature !== null && (
          <p>
            {enteredTemperature}°{selectedUnit === "Celsius" ? "C" : "F"} is
            equal to {convertedTemperature.toFixed(2)}°
            {selectedUnit === "Celsius" ? "F" : "C"}
          </p>
        )}
      </div>
    </div>
  );
};

export default TemperatureConvertor;
