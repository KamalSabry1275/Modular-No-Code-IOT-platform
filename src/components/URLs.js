export const routes = {
  Home: "/",
  Login: "/login",
  Register: "/register",
  Resetpassword: "/Resetpassword",
  Projects: "/projects",
  Modules: "/modules",
  ActiveEmail: "/activeemail",
  LiveProjects: "/liveprojects",
  EditorProject: "/editor/:projectID/project",
  EditorRule: "/editor/:projectID/rule",
  EditorImage: "/editor/:projectID/image",
  EditorSafety: "/editor/:projectID/safety",
};

const DOMIN = "graduation-api-zaj9.onrender.com";
const PROTOCOL = "https://";
// const DOMIN = "192.168.43.183:5500";
// const PROTOCOL = "http://";

export const apis = {
  Project: {
    All: `${PROTOCOL}${DOMIN}/api/v1/project/all`,
    Create: `${PROTOCOL}${DOMIN}/api/v1/project/create`,
    UpdateRenameDescription: `${PROTOCOL}${DOMIN}/api/v1/project/update-project-details/:projectID`,
    Update: `${PROTOCOL}${DOMIN}/api/v1/project/update/:projectID`,
    Delete: `${PROTOCOL}${DOMIN}/api/v1/project/delete/:projectID`,
  },

  Module: {
    All: `${PROTOCOL}${DOMIN}/api/v1/module/all`,
    Create: `${PROTOCOL}${DOMIN}/api/v1/project/create`,
    Rename: `${PROTOCOL}${DOMIN}/api/v1/project/update-project-name/:projectID`,
    Description: `${PROTOCOL}${DOMIN}/api/v1/project/update-project-description/:projectID`,
    Update: `${PROTOCOL}${DOMIN}/api/v1/project/update/:projectID`,
    Delete: `${PROTOCOL}${DOMIN}/api/v1/project/delete/:projectID`,
  },

  Rule: {
    All: `${PROTOCOL}${DOMIN}/api/v1/rule/all/:projectID`,
    Save: `${PROTOCOL}${DOMIN}/api/v1/rule/save/:projectID`,
    Delete: `${PROTOCOL}${DOMIN}/api/v1/rule/delete/:projectID/:moduleID/:ruleID`,
  },

  Image: {
    All: `${PROTOCOL}${DOMIN}/api/v1/files/picture/:projectID`,
    Add: `${PROTOCOL}${DOMIN}/api/v1/files/upload-picture`,
    Delete: `${PROTOCOL}${DOMIN}/api/v1/files/delete/:projectID`,
  },

  Login: `${PROTOCOL}${DOMIN}/api/v1/user/login`,
  LoginByGoogle: `${PROTOCOL}${DOMIN}/api/v1/user/google-login`,
  Register: `${PROTOCOL}${DOMIN}/api/v1/user/register`,
  RegisterByGoogle: `${PROTOCOL}${DOMIN}/api/v1/user/google-register`,
  Logout: `${PROTOCOL}${DOMIN}/api/v1/user/logout`,
  ResetPassword: `${PROTOCOL}${DOMIN}/api/v1/user/reset-password`,
  ForgetPassword: `${PROTOCOL}${DOMIN}/api/v1/user/forget-password`,
  VerifyEmail: `${PROTOCOL}${DOMIN}/api/v1/user/verify-email`,
  SendEmailVerify: `${PROTOCOL}${DOMIN}/api/v1/user/sendEmail-verify`,
  RefreshToken: `${PROTOCOL}${DOMIN}/api/v1/user/refresh-token`,
};

// console.log(routes.Home); // Output: "/"
// console.log(routes.EditorProject.replace(":projectID", "123")); // Output: "/editorproject/123"
