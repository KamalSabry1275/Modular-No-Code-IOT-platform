import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apis } from "../../components/URLs";
import { decryptAndRetrieve } from "./authSlice";
import { toast } from "react-toastify";

function getAccessToken() {
  return decryptAndRetrieve("fathy", "access_token");
}

export const fetchRules = createAsyncThunk(
  "rules/fetchRules",
  async ([projecID]) => {
    try {
      const access_token = getAccessToken();

      if (!access_token) {
        throw new Error("Access token not found");
      }

      if (access_token) {
        const res = await fetch(apis.Rule.All.replace(":projectID", projecID), {
          headers: {
            Authorization: `${access_token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        let data = await res.json();

        return data;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const saveRules = createAsyncThunk(
  "rules/addRule",
  async ([projectID, rules]) => {
    try {
      const access_token = getAccessToken();

      if (!access_token) {
        throw new Error("Access token not found");
      }

      if (access_token) {
        const res = await fetch(
          apis.Rule.Save.replace(":projectID", projectID),
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              Authorization: `${access_token}`,
            },
            body: JSON.stringify(rules),
          }
        );
        let data = await res.json();
        if (data?.success) toast.success(data.msg);
        else toast.error(data.msg);
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteRule = createAsyncThunk(
  "rules/deleteRule",
  async ([projectID, moduleID, ruleID]) => {
    try {
      const access_token = getAccessToken();

      if (!access_token) {
        throw new Error("Access token not found");
      }

      if (access_token) {
        let res = await fetch(
          apis.Rule.Delete.replace(":projectID", projectID)
            .replace(":moduleID", moduleID)
            .replace(":ruleID", ruleID),
          {
            method: "DELETE",
            headers: {
              "content-type": "application/json",
              Authorization: `${access_token}`,
            },
          }
        );

        let data = await res.json();
        if (data.success) {
          toast.success(data.msg);
          return data;
        } else {
          toast.error(data.msg);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
);

const rulesSlice = createSlice({
  name: "rules",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRules.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data;
      })
      .addCase(fetchRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
    builder
      .addCase(saveRules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveRules.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data;
      })
      .addCase(saveRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
    builder
      .addCase(deleteRule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRule.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data;
      })
      .addCase(deleteRule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
  },
});

export default rulesSlice.reducer;
