import { createSlice } from "@reduxjs/toolkit";

export const resetPasswordSlice = createSlice({
  initialState: false,
  name: "resetPasswordSlice",
  reducers: {
    resetPassword: (state, action) => {
      return action.payload;
    },
  },
});

export const { resetPassword } = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;
