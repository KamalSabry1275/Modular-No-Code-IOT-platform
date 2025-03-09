import React from "react";

const VerificationCodeInput = ({ onChange }) => {
  const inputs = ["", "", "", "", ""];

  const handleKeyUp = (e, index) => {
    const value = e.target.value;
    inputs[index] = value;
    const key = e.key;
    const isNumber = /^[0-9]$/.test(key);

    if (
      !isNumber &&
      key !== "Backspace" &&
      key !== "Enter" &&
      key !== "ArrowLeft" &&
      key !== "ArrowUp" &&
      key !== "ArrowRight" &&
      key !== "ArrowDown" &&
      value.length == 1
    ) {
      e.target.value = "";
      inputs[index] = "";
      console.error("Only numeric keys are allowed");
      return;
    } else if (value.length > 1) {
      e.target.value = value.slice(0, 1);
      inputs[index] = value.slice(0, 1);
      console.error("one number allowed");
    }

    if (value.length === 1 && index < 4) {
      e.target.nextElementSibling.focus();
    }

    if (
      inputs[0] !== "" &&
      inputs[1] !== "" &&
      inputs[2] !== "" &&
      inputs[3] !== "" &&
      inputs[4] !== "" &&
      index === 4
    ) {
      console.log(inputs.join(""));
      onChange(inputs.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.target.value.length === 0 && e.key == "Backspace" && index > 0) {
      e.target.previousElementSibling.focus();
    }
  };

  return (
    <div className="code">
      {inputs.map((value, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          onKeyUp={(e) => handleKeyUp(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}
    </div>
  );
};

export default VerificationCodeInput;
