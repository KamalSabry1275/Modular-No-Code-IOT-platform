import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { editProject, updateModule } from "../../rtk/slices/projectsSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Module } from "../../components/module/Module";
import { toast } from "react-toastify";
import { checkAccessToken } from "../../components/RequireAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import {
  AnimationButtonLoadingStart,
  AnimationButtonLoadingStop,
} from "../../components/Button";
import { routes } from "../../components/URLs";

export function EditorProject() {
  //get all modules from redex
  let modules = useSelector((state) => state.modules.data);

  //remove _id from modules befpre use it
  modules = modules.map((module) => {
    const { _id, ...moduleWithoutId } = module;
    return moduleWithoutId;
  });

  //get all projects from redexc
  const projects = useSelector((state) => state.projects.data);
  //usedispatch
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  //have id of project edit now
  const projectID = useParams().projectID;
  //get project for edit
  const [project_edit] = projects?.filter(
    (project) => project._id === projectID
  );
  //these the module will show in project
  const [myModules, setMyModules] = useState([
    ...(project_edit?.modules || []),
  ]);
  //state for choose module
  const [chooseModule, setChooseModule] = useState(null);
  const [chooseModuleInvalid, setChooseModuleInvalid] = useState(null);
  //state of pin number
  const [pinNum, setPinNum] = useState([]);
  //pins number is selected
  let notAvaiblePins = [];
  const [pinsNumSelected, setPinsNumSelected] = useState(notAvaiblePins || []);
  //number of modules in project now
  const [lenght, setLength] = useState(0);
  //add module in project
  const [addModule, setAddModule] = useState(false);
  //number of module
  const [num, setNum] = useState("");
  //type of pins in micro controller & modules
  const arduinoPins = {
    //pins of analog
    analog: ["--", "A0", "A1", "A2", "A3", "A4", "A5"],
    //pins of digital
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
      //pins of analog
      analog: ["--", "A0"],
      //pins of digital
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

  //type of micro controller
  const [microController, setMicroController] = useState(
    project_edit?.controller ?? "Node MCU"
  );

  //pins of project
  let availablePins = typeOfPins[microController];

  //the name module of safetycamer
  const moduleOfSafety = "cameradoor";

  //button for save files in project end
  const save_project = async () => {
    AnimationButtonLoadingStart();
    let project_page = document.querySelector(".container_modules");
    let modules_in_project = [...project_page?.children].map(
      (module_project) => {
        return JSON.parse(module_project.dataset.index);
      }
    );
    console.log(modules_in_project);

    const res = await checkAccessToken(dispatch, navigate, location);

    if (res) {
      await dispatch(
        editProject([
          projectID,
          project_edit?.name,
          project_edit?.projectName,
          project_edit?.controller,
          project_edit?.description,
          modules_in_project,
        ])
      );

      AnimationButtonLoadingStop("Save");
    }
  };

  const handleChoose_Module = (e, module) => {
    let number_modules = project_page?.children.length;
    if (lenght != number_modules) setLength(number_modules);

    let module_index = module?.dataset?.index;
    let modules = Array.from(
      document.querySelector(".container_modules").children
    );

    let index = modules.indexOf(module);
    setNum(index);

    if (module) {
      // Remove "focus" class from all modules
      document
        .querySelectorAll(".module")
        .forEach((m) => m.classList.remove("focus"));
      // Add "focus" class to the clicked module
      module.classList.add("focus");

      if (e.target.className == "btn_delete") {
        let pinsSelected;
        let pinsRemeoveSelected;
        console.log(module_index);
        pinsSelected = JSON.parse(module_index)?.pins?.reduce(
          (total, pinDelete) => {
            return total.filter((pin) => pin !== pinDelete?.pinNumber);
          },
          pinsNumSelected
        );
        pinsRemeoveSelected = JSON.parse(module_index)?.pins?.map(
          (pinDelete) => {
            return pinsNumSelected.find((pin) => pin == pinDelete?.pinNumber);
          }
        );

        console.log(pinsSelected);
        setPinsNumSelected(pinsSelected);

        module_index = undefined;
        let m = modules?.map((m) => {
          return JSON.parse(m.dataset?.index);
        });

        if (!Object.isExtensible(m)) {
          m = [...m];
        }

        document
          .querySelectorAll(".module")
          .forEach((m) => m.classList.remove("focus"));
        setChooseModule(null);
        m.splice(index, 1);
        setMyModules(m);
        setAddModule(!addModule);
      }
    }

    return module_index;
  };

  //focus and get data for chooose module
  const choose_Module = (e) => {
    const module = e.target.closest(".module"); // Find the closest ancestor with the class "module"
    if (module?.textContent.includes("invalid module")) {
      let module_index = handleChoose_Module(e, module);
      if (module_index != undefined && module_index != null) {
        setChooseModuleInvalid(JSON.parse(module_index));
        setChooseModule(null);
        [...document.querySelectorAll(".properties_module input")].map(
          (input) => (input.value = "")
        );
        setPinNum([]);
      }
    } else {
      let module_index = handleChoose_Module(e, module);
      if (module_index != undefined && module_index != null) {
        setChooseModule(JSON.parse(module_index));
        setChooseModuleInvalid(null);
        [...document.querySelectorAll(".properties_module input")].map(
          (input) => (input.value = "")
        );
        setPinNum([]);
      }
    }
  };

  let project_page;

  //edit data of choose module
  const updateData = () => {
    AnimationButtonLoadingStart();

    if (chooseModule?.alternateName?.toLowerCase() == moduleOfSafety) {
      toast.error("Invalid alternate name ,The name is reserved to the system");
    } else {
      let updateElment = document.querySelector(".module.focus");
      updateElment.setAttribute("data-index", JSON.stringify(chooseModule));
      dispatch(updateModule(chooseModule));
      toast.success("Saved");
    }

    // let Modules = document.querySelectorAll(".project_page .module");

    // console.log([...Modules].map((module) => JSON.parse(module.dataset.index)));
    // setMyModules(
    //   [...Modules].map((module) => JSON.parse(module.dataset.index))
    // );

    AnimationButtonLoadingStop("Save");
  };

  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    const m = { ...chooseModule };

    if (name.startsWith("pins[")) {
      const pinIndex = parseInt(name.match(/\[(\d+)\]/)[1], 10);
      let lastPin = m?.pins?.map((pin) => pin.pinNumber);
      m.pins[pinIndex][name.split(".")[1]] = value;
      let newPin = m?.pins?.map((pin) => pin.pinNumber);

      let pinsSelected = pinsNumSelected.filter(
        (pin) => pin !== lastPin[pinIndex]
      );

      pinsSelected.push(value);
      setPinsNumSelected(pinsSelected);
      pinNum[pinIndex] = value;
    } else {
      m[name] = value;
    }

    setChooseModule(m);
  };

  //handle the drag and drop
  useEffect(() => {
    let project_page = document.querySelector(".container_modules");
    let modules = document.querySelectorAll(".collection_modules .module");
    let newModules = document.querySelectorAll(".project_page .module");
    let newModule;
    let m = myModules;

    if (!Object.isExtensible(m)) {
      m = [...m];
    }

    function handleDragStart(e) {
      this.classList.add("dragging");
      if (this.parentNode.classList.contains("collection_modules")) {
        newModule = this.cloneNode(true);
      }
    }

    function handleDragEnd(e) {
      handleAddDragEnd(e);

      this.classList.remove("dragging");

      if (this.parentNode.classList.contains("collection_modules")) {
        console.log("add module");
        newModule.classList.remove("dragging");
        newModule = undefined;
        setMyModules(m);
        setAddModule(!addModule);
      } else {
        console.log("reorganize module");

        setMyModules(m);
        setAddModule(!addModule);
      }
    }

    function handleDragOver(e) {
      e.preventDefault();
    }

    function handleAddDragEnd(e) {
      let dragging = document.querySelector(".dragging");
      let element = addElement(project_page, e.clientY);

      if (newModule == null) {
        //when reorganize module this is place the module
        let element2 = addElement(
          project_page,
          dragging.getBoundingClientRect().top +
            dragging.getBoundingClientRect().height / 2
        );

        if (element2 == null) m.splice(m.length - 1, 1);
        else m.splice(element2, 1);

        if (element == null)
          m.splice(m.length, 0, JSON.parse(dragging.dataset.index));
        else m.splice(element, 0, JSON.parse(dragging.dataset.index));
      } else {
        if (element == null)
          m.splice(m.length, 0, JSON.parse(dragging.dataset.index));
        else m.splice(element, 0, JSON.parse(dragging.dataset.index));
      }

      console.log(m);
    }

    function addElement(project_page, y) {
      let modules = [
        ...project_page.querySelectorAll(
          ".project_page .module:not(.dragging)"
        ),
      ];

      return modules.reduce(
        (total, module, index) => {
          let box = module.getBoundingClientRect();
          box = y - box.top - box.height / 2;

          if (box < 0 && box > total.offest) {
            return { offest: box, element: module, index: index };
          } else {
            return total;
          }
        },
        { offest: Number.NEGATIVE_INFINITY }
      ).index;
    }

    newModules?.forEach((newModule) => {
      newModule.addEventListener("dragstart", handleDragStart);
      newModule.addEventListener("dragend", handleDragEnd);
    });

    modules?.forEach((module) => {
      module.addEventListener("dragstart", handleDragStart);
      module.addEventListener("dragend", handleDragEnd);
    });

    project_page?.addEventListener("dragover", handleDragOver);

    project_page?.addEventListener("mousedown", (e) => {
      if (e.button == "2") {
        e.preventDefault();
      }
    });

    return () => {
      newModules?.forEach((newModule) => {
        newModule.removeEventListener("dragstart", handleDragStart);
        newModule.removeEventListener("dragend", handleDragEnd);
      });

      modules?.forEach((module) => {
        module.removeEventListener("dragstart", handleDragStart);
        module.removeEventListener("dragend", handleDragEnd);
      });

      project_page?.addEventListener("dragover", handleDragOver);

      project_page?.removeEventListener("mousedown", (e) => {
        if (e.button == "2") {
          e.preventDefault();
        }
      });
    };
  }, [addModule]);

  useEffect(() => {
    project_page = document.querySelector(".container_modules");
    project_page?.addEventListener("click", choose_Module);
    return () => {
      project_page?.removeEventListener("click", choose_Module);
    };
  }, [lenght, pinsNumSelected]);

  useEffect(() => {
    setMyModules([...(project_edit?.modules || [])]);
  }, [project_edit]);

  useEffect(() => {
    let modules = document.querySelectorAll(".project_page .module");
    modules = [...modules].flatMap((index_data) =>
      JSON.parse(index_data.dataset.index)?.pins?.flatMap(
        (pin) => pin.pinNumber
      )
    );
    setPinsNumSelected(modules);
    //console.log(modules);
  }, []);

  return (
    <div className="editor_project">
      {/* navbar of editor project */}
      <div className="header">
        <h2>
          <label>{project_edit?.projectName}</label>
          <div>
            <FontAwesomeIcon
              style={{
                width: "2rem",
                fontSize: "1.5rem",
                cursor: "pointer",
                opacity: "70%",
              }}
              icon={faInfoCircle}
              onClick={() => {
                Swal.fire({
                  title: "Description",
                  text: project_edit?.description,
                });
              }}
            />
          </div>
        </h2>
        <button onClick={save_project} className="btn btn-success loading">
          Save
        </button>
      </div>

      {/* all modules */}
      <div className="collection_modules">
        {modules?.map((module, index) => {
          return <Module key={index} draggable={true} data_module={module} />;
        })}
      </div>

      {/* modules in project edit */}
      <div className="project_page">
        <div className="container_modules">
          {myModules?.map((module, index) => {
            return (
              <Module
                key={index}
                // visible_module={true}
                draggable={true}
                enable_delete={
                  module?.alternateName?.toLowerCase() == moduleOfSafety
                    ? false
                    : true
                }
                data_module={module}
              />
            );
          })}
        </div>
      </div>

      {/* propertiest of module edit */}
      <div className="module_properties">
        {chooseModule && (
          <>
            <div className="properties_module">
              <h2 className="name_module">{chooseModule?.moduleName}</h2>

              <div>
                <label>alternate name:</label>
                <input
                  type="text"
                  placeholder={
                    chooseModule?.alternateName == ""
                      ? chooseModule?.moduleName
                      : chooseModule?.alternateName ?? chooseModule?.moduleName
                  }
                  name="alternateName"
                  onChange={(e) => handleInputChange(e)}
                  disabled={
                    chooseModule?.alternateName?.toLowerCase() == moduleOfSafety
                  }
                />
              </div>

              <div className="module_pins">
                <label>
                  <b>pins</b>
                </label>
                {chooseModule?.pins?.map((pin, index) => (
                  <div key={num.toString() + index} className="module_pins">
                    <div>
                      <label>pin mode:</label>
                      <input
                        type="text"
                        placeholder={pin?.pinMode}
                        name={`pins[${index}].pinMode`}
                        onChange={(e) => handleInputChange(e)}
                        disabled
                      />
                    </div>
                    {pin?.type && (
                      <div>
                        <label>type:</label>
                        <input
                          type="text"
                          placeholder={pin?.type}
                          name={`pins[${index}].type`}
                          onChange={(e) => handleInputChange(e)}
                          disabled
                        />
                      </div>
                    )}
                    <div>
                      <label>pin number:</label>
                      <select
                        name={`pins[${index}].pinNumber`}
                        onChange={(e) => handleInputChange(e, index)}
                        defaultValue={pin?.pinNumber}
                        disabled={
                          chooseModule?.alternateName?.toLowerCase() ==
                          moduleOfSafety
                        }
                      >
                        {availablePins[pin?.pinMode?.split("_")[1]]?.map(
                          (pinNumber) => {
                            return (
                              <option
                                key={pinNumber}
                                value={pinNumber.split(" ")[0]}
                                disabled={pinsNumSelected.includes(
                                  pinNumber.split(" ")[0]
                                )}
                              >
                                {pinNumber}
                              </option>
                            );
                          }
                        )}
                      </select>
                    </div>
                    {chooseModule?.note !== undefined && (
                      <div>
                        <label>
                          <b>note:</b>
                        </label>
                        <p>
                          <strong>{chooseModule?.note}</strong>
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button className="btn btn-success loading" onClick={updateData}>
              Save
            </button>
          </>
        )}
        {chooseModuleInvalid && (
          <>
            <div className="properties_module">
              <h2 className="name_module">invalid module</h2>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
