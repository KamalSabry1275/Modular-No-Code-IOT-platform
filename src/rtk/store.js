import { configureStore } from "@reduxjs/toolkit";
import resetPasswordReducer from "./slices/resetPasswordSlice";
import projectsReducer from "./slices/projectsSlice";
import modulesReducer from "./slices/modulesSlice";
import rulesReducer from "./slices/rulesSlice";
import imagesReducer from "./slices/imagesSlice";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    resetPassword: resetPasswordReducer,
    projects: projectsReducer,
    modules: modulesReducer,
    rules: rulesReducer,
    images: imagesReducer,
    auth: authReducer,
  },
});

export default store;
