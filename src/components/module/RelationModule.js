import { useDispatch } from "react-redux";
import { useState } from "react";

export const RelationModule = ({ projectID, modules, rules, deleteRule }) => {
  const dispatch = useDispatch();
  const [actionType, setActionType] = useState("boolean");

  let [actionMId] = modules?.filter(
    (module) => rules.actionModuleId == module._id
  );

  let [triggerMId] = modules?.filter(
    (module) => rules.triggerModuleId == module._id
  );

  const [actionModuleId, setActionModuleId] = useState(
    actionMId?.moduleName ?? ""
  );

  const [conditionValue, setConditionValue] = useState(
    triggerMId?.moduleName ?? ""
  );

  return (
    <>
      <div className="relation-module">
        <button
          className="btn_delete"
          onClick={(e) => {
            function getElementIndex(element) {
              return Array.prototype.indexOf.call(
                element.parentNode.children,
                element
              );
            }
            deleteRule(getElementIndex(e.target.parentElement));
          }}
        >
          X
        </button>
        <label className="label">Trigger Module id</label>
        <select
          name="triggerModuleId"
          className="item"
          onChange={(e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            const dataName = selectedOption.dataset.name;
            setConditionValue(dataName);
          }}
          defaultValue={rules.triggerModuleId}
        >
          <option value="" hidden>
            Selected the module
          </option>
          {modules?.length > 0 ? (
            modules?.map((module) => {
              return (
                <option
                  key={module._id}
                  data-name={module.moduleName}
                  value={module._id}
                >
                  {module.moduleName}
                </option>
              );
            })
          ) : (
            <option value="">No Modules Added</option>
          )}
        </select>
        <label className="label">Condtion</label>
        <select
          name="condition"
          className="item"
          defaultValue={rules.condition}
        >
          {conditionValue == "on-off" ||
          conditionValue == "PIR Motion sensor (Digital/Analog)" ? (
            <>
              <option value={"=="}>{"="}</option>
            </>
          ) : (
            <>
              <option value="" hidden>
                Selected the condition
              </option>
              <option value={"=="}>{"="}</option>
              <option value={"<"}>{"<"}</option>
              <option value={">"}>{">"}</option>
              <option value={"<="}>{"<="}</option>
              <option value={">="}>{">="}</option>
              <option value={"!="}>{"!="}</option>
            </>
          )}
        </select>
        <label className="label">Condition Value</label>
        {conditionValue == "on-off" ? (
          <select
            name="conditionValue"
            className="item"
            defaultValue={rules.conditionValue}
          >
            <option value="on">On</option>
            <option value="off">Off</option>
          </select>
        ) : conditionValue == "PIR Motion sensor (Digital/Analog)" ? (
          <select
            name="conditionValue"
            className="item"
            defaultValue={rules.conditionValue}
          >
            <option value="motion">Motion</option>
            <option value="no motion">No Motion</option>
          </select>
        ) : (
          <input
            name="conditionValue"
            className="item"
            type="text"
            placeholder="Number"
            defaultValue={rules.conditionValue}
          />
        )}
        <label className="label">Action Module id</label>
        <select
          name="actionModuleId"
          className="item"
          onChange={(e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            const dataName = selectedOption.dataset.name;
            setActionModuleId(dataName);
          }}
          defaultValue={rules.actionModuleId}
        >
          <option value="" hidden>
            Selected the module
          </option>
          {modules?.length > 0 ? (
            modules?.map((module) => {
              if (module.moduleName !== "PIR Motion sensor (Digital/Analog)") {
                return (
                  <option
                    key={module._id}
                    data-name={module.moduleName}
                    value={module._id}
                  >
                    {module.moduleName}
                  </option>
                );
              }
            })
          ) : (
            <option value="">No Modules Added</option>
          )}
        </select>
        <label className="title">Action</label>
        <label className="label">Type</label>
        <select
          name="action.type"
          className="item"
          onChange={(e) => setActionType(e.target.value)}
          defaultValue={rules.action?.type}
          disabled
        >
          {actionModuleId == "on-off" ? (
            <option value="boolean">Boolean</option>
          ) : actionModuleId == "PIR Motion sensor (Digital/Analog)" ? (
            <option value="action">action</option>
          ) : (
            <option value="number">Number</option>
          )}
        </select>
        <label className="label">Value</label>
        {actionModuleId == "on-off" ? (
          <select
            name="action.value"
            className="item"
            defaultValue={rules.action?.value}
          >
            <option value="on">On</option>
            <option value="off">Off</option>
          </select>
        ) : actionModuleId == "PIR Motion sensor (Digital/Analog)" ? (
          <select
            name="action.value"
            className="item"
            defaultValue={rules.action?.value}
          >
            <option value="motion">Motion</option>
            <option value="no motion">No Motion</option>
          </select>
        ) : (
          <input
            name="action.value"
            className="item"
            type="text"
            placeholder="Number"
            defaultValue={rules.action?.value}
          />
        )}
      </div>
    </>
  );
};
