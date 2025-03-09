import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTableCellsLarge,
  faTableList,
} from "@fortawesome/free-solid-svg-icons";

import "simplebar-react/dist/simplebar.min.css";
import { useSelector } from "react-redux";
import { Loading } from "../components/Loading";

export const Modules_page = () => {
  const [view, setView] = useState(localStorage?.getItem("viewStyle") ?? "");

  const modules = useSelector((state) => state.modules?.data);
  const loading = useSelector((state) => state.modules?.loading);

  const viewStle = (style) => {
    setView(style);
  };

  useEffect(() => {
    if (view != "") localStorage.setItem("viewStyle", view);
    return () => {};
  }, [view]);

  return (
    <div className="container">
      <div className="page-item">
        <div className="item-title">
          <h1>My Modules</h1>

          <div className="view_icons">
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
                style={{ width: "1em", fontSize: "1.5rem", cursor: "pointer" }}
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
                style={{ width: "1em", fontSize: "1.5rem", cursor: "pointer" }}
                icon={faTableList}
                onClick={() => viewStle("list")}
              />
            </div>
          </div>
        </div>

        <div
          className={`items ${
            view != ""
              ? view
              : localStorage.getItem("viewStyle") != undefined
              ? localStorage.getItem("viewStyle")
              : "grid"
          }`}
        >
          {loading ? (
            <Loading />
          ) : (
            modules?.map((module) => {
              return (
                <div className="card" key={module._id}>
                  <div className="card-body">
                    <h5 className="card-title">{module.moduleName}</h5>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
