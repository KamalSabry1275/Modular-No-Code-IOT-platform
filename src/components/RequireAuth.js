import { Navigate, Outlet } from "react-router-dom";
import { apis, routes } from "./URLs";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  decryptAndRetrieve,
  encryptAndStore,
  logout,
} from "../rtk/slices/authSlice";
import { useLocation } from "react-router-dom";
import { fetchProjects } from "../rtk/slices/projectsSlice";
import { fetchModules } from "../rtk/slices/modulesSlice";

function setAccessToken(access_token) {
  encryptAndStore("fathy", "access_token", access_token);
}

function setRefreshToken(refresh_token) {
  encryptAndStore("fathy", "refresh_token", refresh_token);
}

export function getAccessToken() {
  return decryptAndRetrieve("fathy", "access_token");
}

export function getRefreshToken() {
  return decryptAndRetrieve("fathy", "refresh_token");
}

export function getRoleUser() {
  return decryptAndRetrieve("fathy", "role");
}

export const checkAccessToken = async (dispatch, navigate, location) => {
  const token = getAccessToken();
  const refreshToken = getRefreshToken();

  if (token && refreshToken) {
    try {
      // token & refreshToken
      const decodedToken = jwtDecode(token);
      const decodedRefreshToken = jwtDecode(refreshToken);

      // expiration time for token & refreshToken
      const expirationTime = decodedToken.exp * 1000;
      const expirationTimeRefreshToken = decodedRefreshToken.exp * 1000;

      console.log(
        "AccessToken: ",
        Date.now() - expirationTime > 0 ? "expired" : "work"
      );

      console.log(
        "RefreshToken: ",
        Date.now() - expirationTimeRefreshToken > 0 ? "expired" : "work"
      );

      if (Date.now() - expirationTime > 0) {
        if (expirationTimeRefreshToken < Date.now()) {
          navigate(routes.Login);
          dispatch(logout());
          return false;
        } else {
          const res = await fetch(apis.RefreshToken, {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              refreshToken: refreshToken,
            }),
          });

          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }

          const data = await res.json();
          setAccessToken(data.new_access_token);

          dispatch(fetchProjects());
          dispatch(fetchModules());

          navigate(location?.state);
          return true;
        }
      }
      return true;
    } catch (error) {
      console.error("Error occurred:", error);
      return false;
    }
  } else {
    console.log("Access token not found");
    navigate(routes.Login);
    dispatch(logout());
    return false;
  }
};

export const RequireAuth = ({ allowedRoles = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const initialSystem = async () => {
    const res = await checkAccessToken(dispatch, navigate, location);
    if (res) {
      dispatch(fetchProjects());
      dispatch(fetchModules());
    }
  };

  useEffect(() => {
    initialSystem();
  }, []);

  const token = getAccessToken();
  const role = getRoleUser();

  // console.log(allowedRoles);
  // console.log(role);
  // console.log(role == allowedRoles);

  return token ? (
    role == allowedRoles ? (
      <Outlet />
    ) : allowedRoles == "" ? (
      <Outlet />
    ) : (
      <Navigate to={routes.Login} />
    )
  ) : allowedRoles == "" ? (
    <Outlet />
  ) : (
    <Navigate to={routes.Login} />
  );
};

export default RequireAuth;
