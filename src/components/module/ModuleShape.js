import { useEffect, useState } from "react";

export const ModuleShape = ({ id, type = "none", data_sent, lastValue }) => {
  const [value, setValue] = useState(lastValue || "off");
  const [defaultValue, setDefaultValue] = useState(lastValue || "0");
  const [defaultString, setDefaultString] = useState(lastValue || "...");

  useEffect(() => {
    console.log(data_sent?.id, data_sent?.source, data_sent?.value);
    if (
      (data_sent?.value === "off" || data_sent?.value === "on") &&
      data_sent?.source !== "web" &&
      data_sent?.source !== ""
    ) {
      setValue(data_sent?.value === "on" ? "on" : "off");
    }
    if (
      data_sent?.value !== "on" &&
      data_sent?.value !== "off" &&
      data_sent?.source !== ""
    )
      setDefaultValue(data_sent?.value || lastValue || "0");
    if (data_sent?.source !== undefined && data_sent?.source !== "")
      setDefaultString(String(data_sent?.value));
  }, [data_sent]);

  useEffect(() => {
    if (defaultValue !== undefined) setDefaultValue("0");
    if (defaultString !== undefined) setDefaultString("...");
    if (
      type != "on-off" ||
      type != "output_number" ||
      type != "output_text" ||
      type != "input_number"
    ) {
      type = "none";
    }
  }, []);

  useEffect(() => {
    const inputElement = document.getElementById(id);
    if (inputElement) {
      moveLabel({ target: inputElement });
      hideLabel({ target: inputElement });
    }
  }, [defaultValue]);

  const MODULES = {
    none: (
      <>
        <div className="container_shape text">
          <p>Unknow Module</p>
        </div>
      </>
    ),
    "on-off": (
      <>
        <div className="container_shape container-toggle">
          <input
            type="checkbox"
            className="check"
            id={id}
            onChange={(e) => {
              setValue(e.target.checked ? "on" : "off");
            }}
            checked={value === "on" ?? data_sent?.value === "on"}
            hidden
          />
          <label htmlFor={id} className="toggle">
            <div className="toggle-circle"></div>
          </label>
          <div className="toggle-text">
            <span>ON</span>
            <span>OFF</span>
          </div>
        </div>
      </>
    ),
    output_number: (
      <>
        <div className="container_shape digital">{defaultValue}</div>
      </>
    ),
    output_text: (
      <>
        <div className="container_shape text">
          <p>{defaultString}</p>
        </div>
      </>
    ),
    input_number: (
      <>
        <div className="container_shape input-digital">
          <span>0</span>
          <input
            id={id}
            onInput={(e) => {
              setDefaultValue(e.target.value);
              moveLabel(e);
            }}
            onChange={moveLabel}
            onMouseOut={hideLabel}
            onMouseOver={showLabel}
            type="range"
            value={defaultValue}
            min={0}
            max={1023}
          />
          <span>1023</span>
        </div>
      </>
    ),
  };

  function moveLabel(e) {
    e.target.style.setProperty("--after-content", `"${e.target.value}"`);
    e.target.style.setProperty(
      "--after-left",
      (e.target.value / e.target.max) * (e.target.offsetWidth - 16) + "px"
    );
    e.target.style.setProperty(
      "--before-left",
      (e.target.value / e.target.max) * (e.target.offsetWidth - 16) + "px"
    );
  }

  function showLabel(e) {
    e.target.style.setProperty("--after-opacity", "1");
    e.target.style.setProperty("--before-opacity", "1");
  }

  function hideLabel(e) {
    e.target.style.setProperty("--after-opacity", "0");
    e.target.style.setProperty("--before-opacity", "0");
  }

  useEffect(() => {
    const inputElement = document.getElementById(id);
    if (inputElement) {
      hideLabel({ target: inputElement });
      moveLabel({ target: inputElement });
    } else {
      // console.warn(`Element with ID '${id}' not found.`);
    }
  }, []);

  return <>{MODULES[type]}</>;
};
