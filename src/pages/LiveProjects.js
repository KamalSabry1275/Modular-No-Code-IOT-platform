import { useSelector, useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { socket } from "../socket";
import { useEffect, useState } from "react";
import { ConnectionManager } from "../components/socket-io/ConnectionManager";
import { useParams } from "react-router-dom";
import { updateModule } from "../rtk/slices/projectsSlice";
import { checkAccessToken } from "../components/RequireAuth";
import { routes } from "../components/URLs";

export const LiveProjecys = () => {
  const projectId = useParams()?.projectId;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  let projects = useSelector((state) => state?.projects?.data);

  const [isConnected, setIsConnected] = useState(socket.connected);

  const handleRadioChange = (event, joinprojectId) => {
    navigate(event.target.value);
    let project = projects?.filter((project) => project._id == projectId)[0];
    let modules = project?.modules;
    let IDs = modules?.map((module) => module._id);

    socket.emit("leaveRooms", IDs);
    console.log("leave from rooms", IDs);

    project = projects?.filter((project) => project._id == joinprojectId)[0];
    modules = project?.modules;
    IDs = modules?.map((module) => module._id);

    socket.emit("joinRooms", IDs);
    console.log("join to rooms", IDs);
  };

  const updateProjectValue = async () => {
    const moduleSelect = document.querySelectorAll(
      ".container_modules .module"
    );

    let modulesValue = [...moduleSelect]?.map((module) => {
      let module_index = module?.dataset?.index;
      let moduleDate = JSON.parse(module_index);
      console.log(moduleDate.lastValue);
      console.log(moduleDate._id);
      return {
        id: moduleDate._id,
        value: moduleDate.lastValue,
      };
    });

    let values = {
      projectID: projectId,
      modules: modulesValue,
    };

    let modulesDate = [...moduleSelect]?.map((module) => {
      return JSON.parse(module?.dataset?.index);
    });

    console.log(values);
    socket.emit("updateValues", values);

    const res = await checkAccessToken(dispatch, navigate, location);

    if (res) {
      dispatch(updateModule({ id: projectId, newData: modulesDate }));
    }
  };

  const onConnect = () => {
    setIsConnected(true);
    const project = projects?.filter(
      (project) => project._id == projects[0]?._id
    )[0];
    const modules = project?.modules;
    const IDs = modules?.map((module) => module._id);

    socket.emit("joinRooms", IDs);
    console.log("join to rooms", IDs);
  };

  const onDisconnect = () => {
    setIsConnected(false);
  };

  useEffect(() => {
    navigate(projects[0]?._id);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    if (!isConnected) {
      document.documentElement.style.setProperty("--color-blob", `red`);
    } else {
      document.documentElement.style.setProperty("--color-blob", `green`);
    }
  }, [isConnected]);

  return (
    <div className="container">
      <div className="live-projects">
        <div className="header">
          <h1>Live Control</h1>
          <ConnectionManager />
        </div>

        <div className="nav-projects text_color">
          {projects?.map((project, i) => {
            return (
              <div key={i}>
                <input
                  className="label-live-project"
                  type="radio"
                  id={i + "radio"}
                  name="page"
                  value={project._id}
                  onChange={(e) => handleRadioChange(e, project._id)}
                  defaultChecked={project._id == projects[0]._id}
                  hidden
                />
                <label
                  htmlFor={i + "radio"}
                  onClick={updateProjectValue}
                  className="project-title"
                  key={i}
                >
                  {project.projectName}
                </label>
              </div>
            );
          })}
        </div>
        <Outlet />
      </div>
    </div>
  );
};
