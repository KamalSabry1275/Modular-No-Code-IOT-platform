import { createSlice } from "@reduxjs/toolkit";
import cryptoJs from "crypto-js";
import { jwtDecode } from "jwt-decode";

export const encryptAndStore = (key, string, data) => {
  const encryptedData = cryptoJs.AES.encrypt(
    JSON.stringify(data),
    key
  ).toString();
  localStorage.setItem(string, encryptedData);
};

export const decryptAndRetrieve = (key, string) => {
  const encryptedData = localStorage.getItem(string);
  if (encryptedData) {
    const bytes = cryptoJs.AES.decrypt(encryptedData, key);
    const decryptedData = JSON.parse(bytes.toString(cryptoJs.enc.Utf8));
    return decryptedData;
  }
  return null;
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    isLoggedIn: !!localStorage.getItem("username"),
    username: localStorage.getItem("username") || null,
  },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.username = action.payload;
      localStorage.setItem(
        "username",
        jwtDecode(action.payload.token).payLoad.user.name
      );
      encryptAndStore("fathy", "role", "user");
      encryptAndStore("fathy", "access_token", action.payload.token);
      encryptAndStore("fathy", "refresh_token", action.payload.refresh_token);
    },
    logout(state) {
      state.isLoggedIn = false;
      state.username = null;
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("access_token");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
