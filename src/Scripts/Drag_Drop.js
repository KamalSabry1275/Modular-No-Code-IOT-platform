export function Drag_Drop() {
  let modules = document.querySelectorAll(".collection_modules .module");
  let newModules = document.querySelectorAll(".project_page .module");
  let newModule;

  newModules?.forEach((newModule) => {
    newModule.addEventListener("dragstart", (e) => {
      newModule.classList.add("dragging");
    });
    newModule.addEventListener("dragend", (e) => {
      newModule.classList.remove("dragging");
    });
  });

  modules?.forEach((module) => {
    module.addEventListener("dragstart", (e) => {
      module.classList.add("dragging");
      newModule = module.cloneNode(true);
      // newModule.addEventListener("click", (e) => {
      //   e.target.classList.add("focus");
      // });
    });
    module.addEventListener("dragend", (e) => {
      module.classList.remove("dragging");
      // add module in modules in modules reducer
      // console.log(newModule);

      // const addModule =  modules.filter((module)=>module.modlueName == module)
      // dispatch(plusModule());
      newModule.classList.remove("dragging");
      newModule = undefined;
      let newModules = document.querySelectorAll(".project_page .module");
      newModules.forEach((newModule) => {
        newModule.addEventListener("dragstart", (e) => {
          newModule.classList.add("dragging");
        });
        newModule.addEventListener("dragend", (e) => {
          newModule.classList.remove("dragging");
        });
      });
    });
  });

  let project_page = document.querySelector(".container_modules");

  // container.addEventListener("dragleave", (e) => {
  //   if (newItem != null) container.removeChild(newItem);
  // });
  project_page?.addEventListener("dragover", (e) => {
    e.preventDefault();

    let dragging = document.querySelector(".dragging");
    let element = addElement(project_page, e.clientY);

    if (newModule == null) {
      if (element == null) project_page.appendChild(dragging);
      else project_page.insertBefore(dragging, element);
    } else {
      if (element == null) project_page.appendChild(newModule);
      else project_page.insertBefore(newModule, element);
    }
  });

  project_page?.addEventListener("mousedown", (e) => {
    if (e.button == "2") {
      e.preventDefault();
    }
  });

  function addElement(project_page, y) {
    let modules = [
      ...project_page.querySelectorAll(".project_page .module:not(.dragging)"),
    ];

    return modules.reduce(
      (total, module) => {
        let box = module.getBoundingClientRect();
        box = y - box.top - box.height / 2;

        if (box < 0 && box > total.offect) {
          return { offect: box, element: module };
        } else {
          return total;
        }
      },
      { offect: Number.NEGATIVE_INFINITY }
    ).element;
  }
}
