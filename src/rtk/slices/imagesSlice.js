import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apis } from "../../components/URLs";
import { decryptAndRetrieve } from "./authSlice";
import { toast } from "react-toastify";

function getAccessToken() {
  return decryptAndRetrieve("fathy", "access_token");
}

export const fetchImages = createAsyncThunk(
  "images/fetchImages",
  async ([projectID]) => {
    try {
      const access_token = getAccessToken();

      if (!access_token) {
        throw new Error("Access token not found");
      }

      if (access_token) {
        const res = await fetch(
          apis.Image.All.replace(":projectID", projectID),
          {
            headers: {
              Authorization: `${access_token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        let data = await res.json();

        console.log(data);

        return data;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const addImages = createAsyncThunk(
  "images/addImages",
  async ([projectID, picture, pictureName]) => {
    try {
      const access_token = getAccessToken();

      if (!access_token) {
        throw new Error("Access token not found");
      }

      const formData = new FormData();
      formData.append("pictureName", pictureName);
      formData.append("projectID", projectID);
      formData.append("picture", picture);

      if (access_token) {
        const res = await fetch(apis.Image.Add, {
          method: "POST",
          headers: {
            Authorization: `${access_token}`,
          },
          body: formData,
        });
        let data = await res.json();
        if (data?.success == true) toast.success(data.msg);
        else toast.error(data.msg);
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteImage = createAsyncThunk(
  "images/deleteImage",
  async ([projectID]) => {
    try {
      const access_token = getAccessToken();

      if (!access_token) {
        throw new Error("Access token not found");
      }

      if (access_token) {
        let res = await fetch(
          apis.Image.Delete.replace(":projectID", projectID),
          {
            method: "DELETE",
            headers: {
              "content-type": "application/json",
              Authorization: `${access_token}`,
            },
          }
        );

        let data = await res.json();
        if (data?.success == true) toast.success(data.msg);
        else toast.error(data.msg);
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

const imagesSlice = createSlice({
  name: "images",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    plusImage: (state, action) => {
      // state.data = [...state.data, action.payload];
      console.log(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
    builder
      .addCase(addImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addImages.fulfilled, (state, action) => {
        state.loading = false;
        // state.data = [...state.data, action.payload?.data];
      })
      .addCase(addImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
    builder
      .addCase(deleteImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.loading = false;
        // state.data = action.payload?.data;
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
  },
});

export const { plusImage } = imagesSlice.actions;
export default imagesSlice.reducer;
