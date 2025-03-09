import { useRef } from "react";
import { ModuleShape } from "./ModuleShape";
import { useSelector } from "react-redux";

export function Module({
  enable_delete = false,
  visible_module = false,
  draggable = false,
  class_name = "module",
  data_module,
  data_sent,
  lastValue,
}) {
  const modules = useSelector((state) => state.modules?.data);

  const exists = modules
    ?.map((obj) =>
      JSON.stringify({
        moduleName: obj?.moduleName,
        type: obj?.type,
        pins: obj?.pins?.map((pin) => {
          if (pin.type != undefined) {
            return { pinMode: pin?.pinMode, type: pin?.type };
          } else {
            return { pinMode: pin?.pinMode, type: "" };
          }
        }),
      })
    )
    .includes(
      JSON.stringify({
        moduleName: data_module?.moduleName,
        type: data_module?.type,
        pins: data_module?.pins?.map((pin) => {
          if (pin.type != undefined) {
            return { pinMode: pin?.pinMode, type: pin?.type };
          } else {
            return { pinMode: pin?.pinMode, type: "" };
          }
        }),
      })
    );

  return (
    <>
      {exists ? (
        <div
          tabIndex={-1}
          data-index={JSON.stringify(data_module)}
          draggable={draggable}
          className={class_name}
        >
          {enable_delete && <button className="btn_delete">X</button>}
          {visible_module && (
            <ModuleShape
              id={data_module?._id}
              type={data_module?.type}
              data_sent={data_sent}
              lastValue={lastValue}
            />
          )}
          <h2>{data_module?.alternateName ?? data_module?.moduleName}</h2>
        </div>
      ) : (
        <div
          tabIndex={-1}
          data-index={JSON.stringify(data_module)}
          draggable={draggable}
          className={class_name}
        >
          {enable_delete && <button className="btn_delete">X</button>}
          {visible_module && <ModuleShape type="none" />}
          <h2>invalid module</h2>
        </div>
      )}
    </>
  );
}
