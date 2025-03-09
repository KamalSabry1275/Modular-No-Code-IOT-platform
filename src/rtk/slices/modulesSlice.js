import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../components/URLs";
import { decryptAndRetrieve } from "./authSlice";

function getAccessToken() {
  return decryptAndRetrieve("fathy", "access_token");
}

export const fetchModules = createAsyncThunk(
  "modulesSlice/fetchModules",
  async () => {
    try {
      const access_token = getAccessToken();

      if (!access_token) {
        throw new Error("Access token not found");
      }

      if (access_token) {
        // const res = await fetch("http://localhost:9000/projects");
        const res = await fetch(apis.Module.All, {
          headers: {
            Authorization: `${access_token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        return await res.json();
      }
    } catch (error) {
      console.log(error);
    }
  }
);

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const modulesSlice = createSlice({
  initialState: initialState,
  name: "modulesSlice",
  reducers: {
    // plusModule: (state, action) => {
    //   state.push(action.payload);
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchModules.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchModules.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.data;
    });
    builder.addCase(fetchModules.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message;
    });
  },
});

export const {} = modulesSlice.actions;
export default modulesSlice.reducer;
