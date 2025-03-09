import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { editProject } from "../../rtk/slices/projectsSlice";
import { checkAccessToken } from "../../components/RequireAuth";
import {
  AnimationButtonLoadingStart,
  AnimationButtonLoadingStop,
} from "../../components/Button";

export const EditorSafety = () => {
  const { projectID } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get all projects from Redux
  const projects = useSelector((state) => state.projects.data);

  // Get the project to edit
  const projectEdit = projects?.find((project) => project._id === projectID);
  const myModules = projectEdit?.modules || [];

  const alternateNameOfModuleForCamera = "CameraDoor";

  const cameraDoorModule = myModules.find(
    (module) => module.alternateName === alternateNameOfModuleForCamera
  );

  const [cameraIsActive, setCameraIsActive] = useState(!!cameraDoorModule);
  const [pinNum, setPinNum] = useState(
    cameraDoorModule?.pins[0]?.pinNumber ?? "--"
  );

  const arduinoPins = {
    analog: ["--", "A0", "A1", "A2", "A3", "A4", "A5"],
    digital: [
      "--",
      "D2",
      "D3 PWM",
      "D4",
      "D5 PWM",
      "D6 PWM",
      "D7",
      "D8",
      "D9 PWM",
      "D10 PWM",
      "D11 PWM",
      "D12",
    ],
  };

  const typeOfPins = {
    "Node MCU": {
      analog: ["--", "A0"],
      digital: [
        "--",
        "D0",
        "D1",
        "D2 PWM",
        "D3",
        "D4",
        "D5 PWM",
        "D6 PWM",
        "D7",
        "D8 PWM",
      ],
    },
    "ARDUINO UNO": arduinoPins,
    "ARDUINO LEONARDO": arduinoPins,
  };

  const [microController, setMicroController] = useState(
    projectEdit?.controller ?? "Node MCU"
  );

  const availablePins = typeOfPins[microController];
  const notAvailablePins = myModules.flatMap((module) =>
    module.pins.map((pin) => pin.pinNumber)
  );
  const [pinsNumSelected, setPinsNumSelected] = useState(
    notAvailablePins ?? []
  );

  const moduleForCamera = {
    moduleName: "on-off",
    alternateName: alternateNameOfModuleForCamera,
    pins: [
      {
        pinMode: "output_digital",
        pinNumber: pinNum,
        _id: "65df8ba893e2d4323bd9fba3",
      },
    ],
    rules: [],
    type: "on-off",
  };

  const saveEditProjects = async () => {
    AnimationButtonLoadingStart();
    const updatedModules = cameraIsActive
      ? [
          moduleForCamera,
          ...myModules.filter(
            (module) => module.alternateName !== alternateNameOfModuleForCamera
          ),
        ]
      : myModules.filter(
          (module) => module.alternateName !== alternateNameOfModuleForCamera
        );

    const res = await checkAccessToken(dispatch, navigate, location);

    if (res) {
      await dispatch(
        editProject([
          projectID,
          projectEdit?.name,
          projectEdit?.projectName,
          projectEdit?.controller,
          projectEdit?.description,
          updatedModules,
        ])
      );

      AnimationButtonLoadingStop("Save");
    }
  };

  const handleInputChange = (e) => {
    const newPinNum = e.target.value;
    setPinsNumSelected((prev) => [
      ...prev.filter((pin) => pin !== pinNum),
      newPinNum,
    ]);
    setPinNum(newPinNum);
  };

  return (
    <div className="editor_rule">
      <div className="header">
        <h2>
          <label>{projectEdit?.projectName}</label>
        </h2>
        <button onClick={saveEditProjects} className="btn btn-success loading">
          Save
        </button>
      </div>
      <div className="rule_page">
        <div className="container_modules">
          <div className="camera_module">
            <h2 className="title text_color">Camera Safety</h2>
            <div className="container_checkbox">
              <input
                type="checkbox"
                onChange={(e) => setCameraIsActive(e.target.checked)}
                checked={cameraIsActive}
              />
              <label className="text_color">OFF</label>
              <span>
                <span></span>
              </span>
              <label className="text_color">ON</label>
            </div>
            <label className="text_color">Pin Number:</label>
            <select
              name="pins[0].pinNumber"
              onChange={handleInputChange}
              value={pinNum}
            >
              {availablePins?.digital?.map((pinNumber) => (
                <option
                  key={pinNumber}
                  value={pinNumber.split(" ")[0]}
                  disabled={pinsNumSelected.includes(pinNumber.split(" ")[0])}
                >
                  {pinNumber}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
