import "./App.css";
import "./sass/main.css";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import { NavBar } from "./layout/NavBar";
import RequireAccess from "./layout/RequireAccess";
import { routes } from "./components/URLs";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import { useEffect, useState } from "react";
import { ActiveEmail } from "./pages/ActiveEmail";
import { EditorImage } from "./pages/editor_management/EditorImage";
import { Editor } from "./pages/editor_management/Editor";
import { EditorProject } from "./pages/editor_management/EditorProject";
import { EditorRule } from "./pages/editor_management/EditorRule";
import { Projects_page } from "./pages/Projects_page";
import { Modules_page } from "./pages/Modules_page";
import { RequireAuth } from "./components/RequireAuth";
import { LiveProjecys } from "./pages/LiveProjects";
import { ShowProjectModules } from "./pages/ShowProjectModules";
import { EditorSafety } from "./pages/editor_management/EditorSafety";

function App() {
  const [theme, setTheme] = useState(JSON.parse(localStorage.getItem("theme")));

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    if (performance.navigation.type === 1) {
      window.location.href = routes.Projects;
    }
  }, []);

  return (
    <div theme={`${theme}`}>
      <div className="App">
        <NavBar>
          <button
            className="btn_theme"
            onClick={() => {
              setTheme(!theme);
            }}
          >
            <span></span>
          </button>
        </NavBar>

        <Routes>
          <Route path={routes.Register} element={<Register />} />
          <Route path={routes.Login} element={<Login />} />
          <Route
            path={routes.Resetpassword}
            element={
              <RequireAccess>
                <ResetPassword />
              </RequireAccess>
            }
          />
          <Route path={routes.ActiveEmail} element={<ActiveEmail />} />
          <Route path={routes.Home} element={<Home />} />
          <Route element={<RequireAuth allowedRoles={"user"} />}>
            <Route path={routes.Projects} element={<Projects_page />} />
            <Route path={routes.Modules} element={<Modules_page />} />
            <Route element={<Editor />}>
              <Route path={routes.EditorProject} element={<EditorProject />} />
              <Route path={routes.EditorRule} element={<EditorRule />} />
              <Route path={routes.EditorImage} element={<EditorImage />} />
              <Route path={routes.EditorSafety} element={<EditorSafety />} />
            </Route>
            <Route path={routes.LiveProjects} element={<LiveProjecys />}>
              <Route path=":projectId" element={<ShowProjectModules />} />
            </Route>
          </Route>
        </Routes>

        <ToastContainer theme="colored" hideProgressBar />
      </div>
    </div>
  );
}

export default App;
