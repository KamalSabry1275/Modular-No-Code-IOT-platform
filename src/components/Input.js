import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

function Input({ name, type, value, progress, onChange }) {
  let password = false;
  const [typeValue, setType] = useState(type);

  function hundleEvent(e) {
    onChange(e);
  }

  const setClass = () => {
    if (name == "password" && progress != "false") {
      password = true;
      return "field_form field_form_password";
    } else {
      password = false;
      return "field_form";
    }
  };

  const inputElement = () => {
    return (
      <>
        <input
          id={name}
          type={typeValue}
          value={value ?? ""}
          onChange={hundleEvent}
        ></input>
        <label htmlFor={name}>{name}</label>
        {showPassword()}
      </>
    );
  };

  const progressStatus = (value) => {
    switch (value) {
      case 50:
        return { width: "50%" };
      case 75:
        return { width: "75%" };
      case 100:
        return { width: "100%" };
      default:
        return { width: "25%" };
    }
  };

  const passwordStatusColor = (value) => {
    switch (value) {
      case 50:
        return "-info";
      case 75:
        return "-warning";
      case 100:
        return "-success";
      default:
        return "-danger";
    }
  };

  const passwordStatus = (value) => {
    switch (value) {
      case 50:
        return "fair";
      case 75:
        return "good";
      case 100:
        return "strong";
      default:
        return "weak";
    }
  };

  useEffect(() => {
    if (name == "password" || name == "confirm password") setType("password");
  }, []);

  const showPassword = () => {
    return (
      <>
        {name == "password" || name == "confirm password" ? (
          typeValue == "password" ? (
            <div>
              <FontAwesomeIcon
                icon={faEyeSlash}
                style={{ color: "#858585", width: "2em" }}
                onClick={() => {
                  type = "text";
                  setType(type);
                }}
              />
            </div>
          ) : (
            <div>
              <FontAwesomeIcon
                icon={faEye}
                style={{ color: "#FFF", width: "2em" }}
                onClick={() => {
                  type = "password";
                  setType(type);
                }}
              />
            </div>
          )
        ) : null}
      </>
    );
  };

  return (
    <div className={setClass()}>
      {password ? (
        <div className="password">
          <div tabIndex={0} className="field_input">
            {inputElement()}
          </div>
          <div className="container-progress">
            <div
              className="progress"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className={"progress-bar bg" + passwordStatusColor(progress)}
                style={progressStatus(progress)}
              />
            </div>
            <h5 className={"text" + passwordStatusColor(progress)}>
              {passwordStatus(progress)}
            </h5>
          </div>
        </div>
      ) : (
        <div className="field_input">{inputElement()}</div>
      )}
    </div>
  );
}

export default Input;
