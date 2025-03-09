import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { routes, apis } from "../components/URLs";
import { ThemeMode } from "../components/LocalStorage";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../rtk/slices/authSlice";
import { clearProject, updateModule } from "../rtk/slices/projectsSlice";
import { socket } from "../socket";
import { checkAccessToken } from "../components/RequireAuth";

export const NavBar = (props) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (visitURL) => {
    navigate(visitURL);
    updateProjectValue();
    let navList = document.querySelectorAll("nav .container-fluid div");
    let btn = document.getElementById("navbarBtn");
    navList?.forEach((item) => {
      item.classList.remove("show");
    });
    btn.classList.add("collapsed");
    btn.setAttribute("aria-expanded", "false");
  };

  const handleLogout = (visitURL) => {
    var navList = document.querySelectorAll("nav .container-fluid div");
    var btn = document.getElementById("navbarBtn");
    navList?.forEach((item) => {
      item.classList.remove("show");
    });
    btn.classList.add("collapsed");
    btn.setAttribute("aria-expanded", "false");

    navigate(visitURL);
    dispatch(logout());
    dispatch(clearProject());
  };

  const updateProjectValue = async () => {
    const projectId = document.querySelector(
      "input[type='radio']:checked"
    )?.value;

    if (projectId) {
      const moduleSelect = document.querySelectorAll(
        ".container_modules .module"
      );

      let modulesValue = [...moduleSelect]?.map((module) => {
        let module_index = module?.dataset?.index;
        let moduleDate = JSON.parse(module_index);

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
    }
  };

  useEffect(() => {
    let pathName = location.pathname;
    let labels = document.querySelectorAll(".navbar label");
    if (pathName === routes.Home) {
      if (labels) {
        labels?.forEach((label) => {
          label.classList.remove("label_check");
        });
        labels[0].classList.add("label_check");
      }
    } else if (pathName === routes.Projects) {
      if (labels) {
        labels?.forEach((label) => {
          label.classList.remove("label_check");
        });
        labels[1].classList.add("label_check");
      }
    } else if (pathName === routes.Modules) {
      if (labels) {
        labels?.forEach((label) => {
          label.classList.remove("label_check");
        });
        labels[2].classList.add("label_check");
      }
    } else if (pathName === routes.Login) {
      if (labels) {
        labels?.forEach((label) => {
          label.classList.remove("label_check");
        });
        labels[3].classList.add("label_check");
      }
    } else if (pathName === routes.Register) {
      if (labels) {
        labels?.forEach((label) => {
          label.classList.remove("label_check");
        });
        labels[4].classList.add("label_check");
      }
    }
  }, [location.pathname]);

  return (
    <>
      <nav
        className="navbar navbar-expand-lg bg-body-tertiary position-fixed top-0 end-0 start-0"
        data-bs-theme="dark"
        id="navbarNav"
      >
        <div className="container-fluid">
          <label
            onClick={() => handleNav(routes.Home)}
            className="navbar-brand p-1"
          >
            Home
          </label>
          <button
            className="navbar-toggler"
            type="button"
            id="navbarBtn"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo03"
            aria-controls="navbarTogglerDemo03"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
            <ul className="navbar-nav ">
              <li className="nav-item">
                <label
                  onClick={() => handleNav(routes.Projects)}
                  className="nav-link"
                >
                  Projects
                </label>
              </li>
              <li className="nav-item">
                <label
                  onClick={() => handleNav(routes.Modules)}
                  className="nav-link"
                >
                  Modules
                </label>
              </li>
            </ul>
          </div>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
            <ul className="navbar-nav ms-auto">
              <li style={{ display: "flex" }} className="nav-item">
                {props.children}
              </li>
              {isLoggedIn ? (
                <li className="nav-item">
                  <label
                    onClick={() => handleLogout(routes.Login)}
                    className="nav-link"
                  >
                    Logout
                  </label>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <label
                      onClick={() => handleNav(routes.Login)}
                      className="nav-link"
                    >
                      Login
                    </label>
                  </li>
                  <li className="nav-item">
                    <label
                      onClick={() => handleNav(routes.Register)}
                      className="nav-link"
                    >
                      Register
                    </label>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
