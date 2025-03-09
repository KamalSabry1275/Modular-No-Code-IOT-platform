import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { RelationModule } from "../../components/module/RelationModule";
import { apis, routes } from "../../components/URLs";
import { decryptAndRetrieve } from "../../rtk/slices/authSlice";
import { saveRules } from "../../rtk/slices/rulesSlice";
import { toast } from "react-toastify";
import { checkAccessToken } from "../../components/RequireAuth";
import {
  AnimationButtonLoadingStart,
  AnimationButtonLoadingStop,
} from "../../components/Button";
import { Loading } from "../../components/Loading";

export const EditorRule = () => {
  //get all projects from redex
  const projects = useSelector((state) => state.projects.data);
  //usedispatch
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  //have id of project edit now
  const { projectID } = useParams();
  //get project for edit
  const [project_edit] = projects?.filter(
    (project) => project._id == projectID
  );
  //these the module will show in project
  const myModules = [...(project_edit?.modules || [])];
  //get the rule of project
  const myRules = useSelector((state) => state.rules?.data) ?? [];
  const loading = useSelector((state) => state.images?.loading);

  //my relation
  const [rules, setRules] = useState([...(myRules || [])]);
  //tempelate for realrion
  const tempelateRelation = {
    triggerModuleId: "",
    condition: "",
    conditionValue: "",
    actionModuleId: "",
    action: { type: "", value: "" },
    _id: "",
  };

  const generateHexString = (length) => {
    let result = "";
    const characters = "abcdef0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  //function of add relation
  const addRelation = () => {
    let id = generateHexString(24);
    tempelateRelation._id = id;
    setRules([tempelateRelation, ...rules]);
  };

  //function of delete relation
  const deleteRule = (index) => {
    let myRule = [...rules];
    let removeItems = myRule.splice(index, 1);
    setRules(myRule);
    console.log(myRule);
  };

  //function of save relations
  const saveEditRules = async () => {
    AnimationButtonLoadingStart();
    let myRule = [...document.querySelectorAll(".relation-module")];

    let rules = myRule?.map((relation) => {
      let relationDate = { ...tempelateRelation };
      if (
        relation.children["triggerModuleId"].value &&
        relation.children["condition"].value &&
        relation.children["conditionValue"].value &&
        relation.children["actionModuleId"].value &&
        relation.children["action.type"].value &&
        relation.children["action.value"].value
      ) {
        relationDate[relation.children["triggerModuleId"].name] =
          relation.children["triggerModuleId"].value;
        relationDate[relation.children["condition"].name] =
          relation.children["condition"].value;
        relationDate[relation.children["conditionValue"].name] =
          relation.children["conditionValue"].value;
        relationDate[relation.children["actionModuleId"].name] =
          relation.children["actionModuleId"].value;
        relationDate.action = {
          type: relation.children["action.type"].value,
          value: relation.children["action.value"].value,
        };
      } else {
        toast.error("There field is empty");
        return false;
      }

      return {
        triggerModuleId: relationDate.triggerModuleId,
        condition: relationDate.condition,
        conditionValue: relationDate.conditionValue,
        actionModuleId: relationDate.actionModuleId,
        action: {
          type: relationDate.action.type,
          value: relationDate.action.value,
        },
      };
    });

    if (rules.includes(false)) {
      toast.error("Donot save");
      AnimationButtonLoadingStop("Save");
    } else {
      const res = await checkAccessToken(dispatch, navigate, location);

      if (res) {
        await dispatch(saveRules([projectID, rules]));
        console.log(rules);
        AnimationButtonLoadingStop("Save");
      }
    }
  };

  useEffect(() => {
    setRules([...myRules]);
  }, [myRules]);

  return (
    <div className="editor_rule">
      {/* navbar of editor project */}
      <div className="header">
        <h2>
          <label>{project_edit?.projectName}</label>
          <button className="btn btn-success ms-2" onClick={addRelation}>
            Add
          </button>
        </h2>

        <button
          onClick={() => {
            console.log(rules);
            saveEditRules();
          }}
          className="btn btn-success loading"
        >
          Save
        </button>
      </div>
      {/* relation in project edit */}
      <div className="rule_page">
        <div className="container_modules">
          {loading ? (
            <Loading />
          ) : rules.length === 0 ? (
            <h2 className="text_color">No found any rule</h2>
          ) : (
            rules?.map((relation, index) => (
              <RelationModule
                key={relation._id ?? `${index}-rule`}
                projectID={projectID}
                rules={relation}
                modules={myModules}
                deleteRule={deleteRule}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
