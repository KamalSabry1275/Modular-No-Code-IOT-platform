import { useSelector, useDispatch } from "react-redux";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../components/URLs";
import { jwtDecode } from "jwt-decode";
import { decryptAndRetrieve } from "./authSlice";
import { toast } from "react-toastify";

function getAccessToken() {
  return decryptAndRetrieve("fathy", "access_token");
}

export const fetchProjects = createAsyncThunk(
  "projrctsSlice/fetchProjects",
  async () => {
    try {
      const access_token = getAccessToken();

      if (!access_token) {
        throw new Error("Access token not found");
      }

      if (access_token) {
        const res = await fetch(apis.Project.All, {
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

export const addProject = createAsyncThunk(
  "projrctsSlice/addProject",
  async ([username, projectName, controller, description]) => {
    try {
      const access_token = getAccessToken();

      let res = await fetch(apis.Project.Create, {
        method: "post",
        headers: {
          "content-type": "application/json",
          Authorization: `${access_token}`,
        },
        body: JSON.stringify({
          name: username,
          projectName: projectName,
          controller: controller,
          description: description,
          modules: [],
        }),
      });
      let data = await res.json();

      console.log(data);

      if (data.success === true) {
        toast.success(data.msg);
        return data;
      } else {
        toast.error("the project donot create");
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateRenameDescription = createAsyncThunk(
  "projrctsSlice/renameProject",
  async ([projectID, projectName, description]) => {
    try {
      const access_token = getAccessToken();

      let res = await fetch(
        apis.Project.UpdateRenameDescription.replace(":projectID", projectID),
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            Authorization: `${access_token}`,
          },
          body: JSON.stringify({
            projectName: projectName,
            description: description,
          }),
        }
      );
      let data = await res.json();

      if (data.success === true) {
        toast.success(data.msg);
        return data;
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projrctsSlice/deleteProject",
  async ([projectID, projectName]) => {
    try {
      const access_token = getAccessToken();

      let res = await fetch(
        apis.Project.Delete.replace(":projectID", projectID),
        {
          method: "DELETE",
          headers: { Authorization: `${access_token}` },
        }
      );
      let data = await res.json();

      if (data.success === true) {
        toast.success(data.msg);
        return data;
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const editProject = createAsyncThunk(
  "projrctsSlice/editProject",
  async ([
    projectID,
    name,
    projectName,
    controller,
    description,
    projectModules,
  ]) => {
    console.log(projectModules);
    try {
      const access_token = getAccessToken();
      let res = await fetch(
        apis.Project.Update.replace(":projectID", projectID),
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            Authorization: `${access_token}`,
          },
          body: JSON.stringify({
            name: name,
            projectName: projectName,
            controller: controller,
            description: description,
            modules: projectModules,
          }),
        }
      );
      let data = await res.json();

      if (data.success === true) {
        toast.success(data.msg);
        return data;
      } else {
        toast.error(data.msg);
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

export const projectsSlice = createSlice({
  initialState: initialState,
  name: "projectsSlice",
  reducers: {
    clearProject: (state) => initialState,
    updateModule: (state, action) => {
      const { id, newData } = action.payload;

      state.data = state.data.map((item) => {
        // console.log(item._id);
        return item._id === id ? { ...item, modules: [...newData] } : item;
      });

      console.log(state.data);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
    builder
      .addCase(addProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.loading = false;
        state.data =
          action.payload?.data == undefined ? state.data : action.payload?.data;
      })
      .addCase(addProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
    builder
      .addCase(updateRenameDescription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRenameDescription.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data;
      })
      .addCase(updateRenameDescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
    builder
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
    builder
      .addCase(editProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProject.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data;
      })
      .addCase(editProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
  },
});

export const { clearProject, updateModule } = projectsSlice.actions;
export default projectsSlice.reducer;
