import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Module } from "../components/module/Module";
import { useEffect, useState } from "react";
import { socket } from "../socket";

export const ShowProjectModules = () => {
  //get project id from param in route
  const projectId = useParams()?.projectId;
  //get all projects from redex
  const projects = useSelector((state) => state?.projects?.data);
  //filter the projects by id to get one project
  const project = projects?.filter((project) => project._id == projectId)[0];
  //modules in my project
  const modules = project?.modules;
  //ID of all modules in my project
  const IDs = modules?.map((module) => module._id);
  //const types of modules
  const typeOfModule = {
    "on-off": "on-off",
    input_number: "input_number",
    output_number: "output_nmber",
  };

  let myData = [];
  const [data, setData] = useState({});

  const listenRoom = (d) => {
    let updatedData = myData.map((obj) => {
      if (obj.id == d.msg.roomId) {
        return { id: obj.id, value: d.msg.value, source: d.msg.source };
      } else {
        return { ...obj, source: "" };
      }
    });

    let updatedState = {
      projectID: projectId,
      modules: updatedData,
    };

    setData(updatedState);
  };

  //focus and get data for chooose module
  const choose_Module = (e) => {
    const moduleSelect = e.target.closest(".module");
    let module_index = moduleSelect?.dataset?.index;
    let moduleDate;
    console.log(module_index);
    // console.log(data);

    if (module_index !== undefined) {
      moduleDate = JSON.parse(module_index);

      let input = e.target.closest("input");

      if (input) {
        let dataSend;
        if (moduleDate.type == typeOfModule["on-off"]) {
          if (input.checked) {
            dataSend = {
              msg: {
                source: "web",
                roomId: moduleDate._id,
                value: "on",
                status: true,
              },
              data: { user: project.name, projectName: project.projectName },
            };
          } else {
            dataSend = {
              msg: {
                source: "web",
                roomId: moduleDate._id,
                value: "off",
                status: true,
              },
              data: { user: project.name, projectName: project.projectName },
            };
          }

          moduleDate.lastValue = dataSend.msg.value;
        } else if (moduleDate.type == typeOfModule.input_number) {
          dataSend = {
            msg: {
              source: "web",
              roomId: moduleDate._id,
              value: input.value,
              status: true,
            },
            data: { user: project.name, projectName: project.projectName },
          };
          moduleDate.lastValue = dataSend.msg.value;
        }

        let updatedData = data?.modules?.map((obj) =>
          obj.id === dataSend.msg.roomId
            ? {
                id: obj.id,
                value: dataSend.msg.value,
                source: dataSend.msg.source,
                status: true,
              }
            : {
                ...obj,
                source: "",
              }
        );

        moduleSelect.dataset.index = JSON.stringify(moduleDate);

        // console.log(data);
        let updatedState = {
          projectID: projectId,
          modules: updatedData,
        };

        console.log(updatedData);

        setData(updatedState);

        // console.log(dataSend.msg.value);

        socket.emit("messageToRoom", dataSend);
      }
    }

    if (moduleSelect) {
      // Remove "focus" class from all modules
      document
        .querySelectorAll(".module")
        .forEach((m) => m.classList.remove("focus"));
      // Add "focus" class to the clicked module
      moduleSelect.classList.add("focus");
    }
  };

  useEffect(() => {
    console.log("IDs", IDs);

    socket.on("roomMessagess", (d) => {
      listenRoom(d);
    });
    return () => {
      socket.off("roomMessagess", (d) => {
        listenRoom(d);
      });
    };
  }, [modules]);

  useEffect(() => {
    console.log("the value for leave project: ", data);

    myData = modules?.map((module) => ({
      id: module._id,
      value: module.lastValue,
    }));

    let updatedData = { projectID: projectId, modules: myData };
    console.log("the value for enter project: ", updatedData);
    setData(updatedData);
  }, [projectId]);

  useEffect(() => {
    let project_page = document.querySelector(".project_page");
    project_page?.addEventListener("change", choose_Module);
    return () => {
      project_page?.removeEventListener("change", choose_Module);
    };
  }, [choose_Module]);

  return (
    <>
      <div className="project_page">
        <div className="container_modules">
          {data?.modules && modules.length > 0 ? (
            modules.map((module, index) => {
              console.log(module);
              return (
                <Module
                  key={module._id}
                  visible_module={true}
                  data_module={module}
                  data_sent={data?.modules[index]}
                  lastValue={module.lastValue}
                />
              );
            })
          ) : (
            <label>The project is empty</label>
          )}
        </div>
      </div>
    </>
  );
};
