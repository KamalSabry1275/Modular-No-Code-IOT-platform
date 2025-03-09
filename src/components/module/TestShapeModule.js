import { useEffect } from "react";

export const TestShapeMosule = ({ name = "module name" }) => {
  function moveLabel(e) {
    console.log(e.target.style.left);
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

  return (
    <div className="module">
      <div className="container_shape digital-input">
        <span>0</span>
        <input
          onChange={moveLabel}
          onMouseOut={hideLabel}
          onMouseOver={showLabel}
          type="range"
          defaultValue={0}
          min={0}
          max={1023}
        />
        <span>1023</span>
      </div>
      <h2>{name}</h2>
    </div>
  );
};
