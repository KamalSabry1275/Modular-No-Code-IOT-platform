import React from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { routes } from "../../components/URLs";
import { useDispatch } from "react-redux";
import { fetchRules } from "../../rtk/slices/rulesSlice";
import { NavItemRadio } from "../../components/NavItemRadio";

export const Editor = () => {
  const projectID = useParams()?.projectID;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function to handle radio button change
  const handleRadioChange = (event) => {
    navigate(event.target.value.replace(":projectID", projectID));
  };

  return (
    <div className="editor">
      <div className="editor-nav">
        {/* Radio button for the Project page */}
        <NavItemRadio
          label="project"
          value={routes.EditorProject}
          onChange={handleRadioChange}
          defaultChecked={true}
        />

        {/* Radio button for the Rule page */}
        <NavItemRadio
          label="rule"
          value={routes.EditorRule}
          onChange={handleRadioChange}
        />

        {/* Radio button for the Image page */}
        <NavItemRadio
          label="image"
          value={routes.EditorImage}
          onChange={handleRadioChange}
        />

        {/* Radio button for the Safety page */}
        <NavItemRadio
          label="safety"
          value={routes.EditorSafety}
          onChange={handleRadioChange}
        />
      </div>
      <div className="editor-container">
        <Outlet />
      </div>
    </div>
  );
};
