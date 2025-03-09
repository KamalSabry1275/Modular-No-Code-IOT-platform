import { useEffect, useState } from "react";
import swal from "sweetalert2";
import { ContextMenu } from "../components/ContextMenu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MenuContext } from "../Scripts/MenuContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faInfoCircle,
  faPlay,
  faTableCellsLarge,
  faTableList,
} from "@fortawesome/free-solid-svg-icons";

import "simplebar-react/dist/simplebar.min.css";
import { useSelector, useDispatch } from "react-redux";
import {
  addProject,
  deleteProject,
  fetchProjects,
  updateRenameDescription,
} from "../rtk/slices/projectsSlice";
import { apis, routes } from "../components/URLs";
import { fetchRules } from "../rtk/slices/rulesSlice";
import { socket } from "../socket";
import { fetchImages } from "../rtk/slices/imagesSlice";
import { checkAccessToken } from "../components/RequireAuth";
import Swal from "sweetalert2";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons/faTrashCan";
import { Loading } from "../components/Loading";

export const Projects_page = () => {
  const [point, setPoint] = useState({
    y: 0,
    x: 0,
  });

  const [clicked, setClicked] = useState(false);
  const [reversed, setReversed] = useState("");
  const [project, setProject] = useState("");
  const [view, setView] = useState(localStorage?.getItem("viewStyle") ?? "");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const projects = useSelector((state) => state.projects?.data);
  const loading = useSelector((state) => state.projects?.loading);

  const createProject = async () => {
    const { value: DetailsOfProject } = await swal.fire({
      title: "Details of project",
      icon: "question",
      html: `
      <div style="display:flex;flex-direction:column;gap:1rem;">
        <input id="swal-input1" class="swal2-input" placeholder="Project name">
        <select 
          id="swal-input2" 
          class="swal2-select" 
          style="color:#00000040;border: 0.12rem solid #00000020;border-radius:0.25rem;outline:none;height: 2.625em;" 
          onfocus="this.style.border='1px solid #b4dbed';this.style.outline= 'none';this.style.boxShadow= 'inset 0 1px 1px rgba(0, 0, 0, .06), 0 0 0 3px rgba(100, 150, 200, .5)';"
          onblur="this.style.borderColor='#00000020'; this.style.boxShadow='';"
          onchange="this.style.color = this.value ? '#545454' : 'red';"
        >
          <option style="color: red;" value="" selected disabled hidden>Select the controller</option>
          <option style="color: #545454;" value="Node MCU">Node MCU</option>
          <option style="color: #545454; value="ARDUINO UNO">ARDUINO UNO</option>
          <option style="color: #545454; value="ARDUINO LEONARDO">ARDUINO LEONARDO</option>
        </select>
        <textarea id="swal-input3" class="swal2-textarea" placeholder="Desceiption"></textarea>
      </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Create",

      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
          document.getElementById("swal-input3").value,
        ];
      },
    });

    if (DetailsOfProject) {
      console.log(DetailsOfProject);
      let username = localStorage.getItem("username"),
        projectName = DetailsOfProject[0],
        controller = DetailsOfProject[1],
        description = DetailsOfProject[2];

      if (projectName !== "" && controller !== "" && description !== "") {
        const res = await checkAccessToken(dispatch, navigate, location);

        if (res) {
          dispatch(
            addProject([username, projectName, controller, description])
          );
        }
      } else {
        swal.fire({
          icon: "error",
          html: `
            <div style="display:flex;flex-direction:column;">
              ${!projectName ? "<label>The projec name is empty</label>" : ""}
              ${!controller ? "<label>The controller is empty</label>" : ""}
              ${!description ? "<label>The description is empty</label>" : ""}
            </div>
          `,
        });
      }
    }
  };

  const delete_project = (projectID) => {
    swal
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",

        preConfirm: async () => {
          const res = await checkAccessToken(dispatch, navigate, location);

          if (res) {
            dispatch(deleteProject([projectID]));
          }
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          swal.fire({
            title: "Deleted!",
            text: "Your project has been deleted.",
            icon: "success",
          });
        }
      });
  };

  const editor = async (projectID) => {
    const res = await checkAccessToken(dispatch, navigate, location);

    if (res) {
      dispatch(fetchRules([projectID]));
      dispatch(fetchImages([projectID]));
      navigate(routes.EditorProject.replace(":projectID", projectID));
    }
  };

  const edit_project = async (project) => {
    const { value: DetailsOfProject } = await swal.fire({
      title: "Details of project",
      icon: "question",
      html: `
      <div style="display:flex;flex-direction:column;gap:1rem;">
        <input id="swal-input1" class="swal2-input" placeholder="Project name" value="${project.projectName}">
        <textarea id="swal-input2" class="swal2-textarea" placeholder="Desceiption">${project.description}</textarea>
      </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Create",

      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
        ];
      },
    });

    if (DetailsOfProject) {
      console.log(DetailsOfProject);
      let username = localStorage.getItem("username"),
        projectName = DetailsOfProject[0],
        description = DetailsOfProject[1];

      if (projectName !== "" && description !== "") {
        const res = await checkAccessToken(dispatch, navigate, location);

        if (res) {
          dispatch(
            updateRenameDescription([project._id, projectName, description])
          );
        }
      } else {
        swal.fire({
          icon: "error",
          html: `
            <div style="display:flex;flex-direction:column;">
              ${!projectName ? "<label>The projec name is empty</label>" : ""}
              ${!description ? "<label>The description is empty</label>" : ""}
            </div>
          `,
        });
      }
    }
  };

  const menuShow = (e, project) => {
    e.preventDefault();
    if (
      e.pageY > window.innerHeight - 6 * 16 &&
      e.pageX > window.innerWidth - 6 * 16
    ) {
      setPoint({ y: e.pageY - 6 * 16, x: e.pageX - 6 * 16 });
      setReversed("column-reverse");
    } else if (e.pageY > window.innerHeight - 6 * 16) {
      setPoint({ y: e.pageY - 6 * 16, x: e.pageX });
      setReversed("column-reverse");
    } else if (e.pageX > window.innerWidth - 6 * 16) {
      setPoint({ y: e.pageY, x: e.pageX - 6 * 16 });
      setReversed("column");
    } else {
      setPoint({ y: e.pageY, x: e.pageX });
      setReversed("column");
    }
    setClicked(true);
    setProject(project);
  };

  const menuHide = () => {
    setClicked(false);
  };

  const viewStle = (style) => {
    setView(style);
  };

  useEffect(() => {
    MenuContext(() => menuHide());
    return () => {};
  }, []);

  useEffect(() => {
    if (view != "") localStorage.setItem("viewStyle", view);
    return () => {};
  }, [view]);

  return (
    <>
      <div className="container">
        <div className="page-item">
          {clicked && (
            <ContextMenu top={point.y} left={point.x}>
              <ul style={{ flexDirection: reversed }}>
                <li
                  onClick={() => {
                    setClicked(false);
                    edit_project(project);
                  }}
                >
                  <FontAwesomeIcon
                    style={{
                      width: "1em",
                      marginRight: "0.4rem",
                      fontSize: "1rem",
                      cursor: "pointer",
                    }}
                    icon={faPenToSquare}
                  />
                  Edit
                </li>
                <li
                  onClick={() => {
                    setClicked(false);
                    delete_project(project._id);
                  }}
                >
                  <FontAwesomeIcon
                    style={{
                      width: "1em",
                      marginRight: "0.4rem",
                      fontSize: "1rem",
                      cursor: "pointer",
                    }}
                    icon={faTrashCan}
                  />
                  Delete
                </li>
              </ul>
            </ContextMenu>
          )}
          <div className="item-title">
            <h1>My Projects</h1>
            <div className="view_icons">
              <a
                onClick={async () => {
                  await dispatch(fetchProjects());
                  navigate(routes.LiveProjects);
                }}
              >
                <label className="text_color">Start Control</label>
                <FontAwesomeIcon
                  style={{
                    width: "1em",
                    marginLeft: "0.4rem",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    color: "green",
                  }}
                  icon={faPlay}
                />
              </a>
              <input
                name="theme-style"
                type="radio"
                onChange={(e) => {
                  console.log("grid");
                }}
                checked={view == "grid"}
                hidden
              />
              <div>
                <FontAwesomeIcon
                  style={{
                    width: "1em",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                  }}
                  icon={faTableCellsLarge}
                  onClick={() => viewStle("grid")}
                />
              </div>
              <input
                name="theme-style"
                type="radio"
                onChange={(e) => {
                  console.log("list");
                }}
                checked={view == "list"}
                hidden
              />
              <div>
                <FontAwesomeIcon
                  style={{
                    width: "1em",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                  }}
                  icon={faTableList}
                  onClick={() => viewStle("list")}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <div
              className={`items ${
                view != ""
                  ? view
                  : localStorage.getItem("viewStyle") != undefined
                  ? localStorage.getItem("viewStyle")
                  : "grid"
              }`}
              onScroll={menuHide}
            >
              <button
                className="card btn-add-item"
                onClick={() => {
                  createProject();
                }}
              >
                <div className="card-body">
                  <FontAwesomeIcon
                    style={{
                      margin: "auto",
                      fontSize: "2rem",
                    }}
                    icon={faAdd}
                  />
                  <label>add project</label>
                </div>
              </button>
              {projects?.map((project) => {
                return (
                  <div
                    className="card"
                    key={project._id}
                    onClick={(e) => {
                      // menuShow(e, project);
                      if (e.target?.closest("svg")?.tagName == "svg") {
                        Swal.fire({
                          title: "Description",
                          html: `
                          <p>${project.description}</p>
                          <pre>--------------------</pre>
                          ${project?.modules
                            .map(
                              (module) =>
                                module.pins
                                  .map(
                                    (pin) =>
                                      `<pre>${module.moduleName} => ${pin.pinNumber}</pre>`
                                  )
                                  .join("\n") // Join with line breaks
                            )
                            .join("\n")}
                          `,
                        });
                      } else {
                        editor(project._id);
                      }
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      menuShow(e, project);
                    }}
                  >
                    <div className="card-body" title={project.description}>
                      <h5 className="card-title">
                        <label>{project.projectName}</label>
                      </h5>
                      <h6 className="card-subtitle opacity-75">
                        <FontAwesomeIcon
                          style={{
                            width: "1rem",
                            fontSize: "1rem",
                            cursor: "pointer",
                            opacity: "80%",
                          }}
                          icon={faInfoCircle}
                        />
                        <label>{project.createdAt.slice(0, 10)}</label>
                      </h6>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
