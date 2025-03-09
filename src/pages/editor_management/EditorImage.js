import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  addImages,
  deleteImage,
  fetchImages,
} from "../../rtk/slices/imagesSlice";
import { checkAccessToken } from "../../components/RequireAuth";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loading } from "../../components/Loading";

export const EditorImage = () => {
  const projects = useSelector((state) => state.projects.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { projectID } = useParams();
  const [project_edit] = projects?.filter(
    (project) => project._id === projectID
  );
  const images = useSelector((state) => state.images?.data) || [];
  const loading = useSelector((state) => state.images?.loading);

  const [getImages, setGetImages] = useState(false);

  const streamRef = useRef(null);

  const stopWebcam = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const uploadImage = async () => {
    const { value: file } = await Swal.fire({
      title: "Add image",
      showCancelButton: true,
      html: `
        <head>
        <style>
          .file-input-container {
            margin: auto;
            width: 10rem;
            height: 10rem;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            border:0.2rem solid #00000020;
            border-radius: 50%;
          }
          .file-input {
            display: inline-block;
            padding: 5px 10px;
            cursor: pointer;
          }
          .file-input-hidden {
            opacity: 0;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div style="display:flex;flex-direction:column;">
            
          <div class="file-input-container">
            <div style="display:flex;flex-direction:column;">
              <span style="font-size:2rem;font-weight: bold;margin-top: -1rem;height: 2rem;">+</span>
              <span class="file-input">Choose Image</span>
            </div>
            <input type="file" 
              accept=".jpg"
              id="swal-input1"
              class="file-input-hidden" 
              onChange="let input = document.querySelector('.file-input-hidden'); 
                        let label = document.querySelector('.file-input'); 
                        label.textContent = input.files[0].name;
            ">

          </div>
          <input id="swal-input2" type="text" class="swal2-input" placeholder="Image Name">
        </div>
      </body>
      `,
      preConfirm: async () => {
        return [
          document.getElementById("swal-input1").files[0],
          document.getElementById("swal-input2").value,
        ];
      },
    });

    if (file) {
      let picture = file[0],
        pictureName = file[1];

      if (file[0] !== undefined && file[1] !== "") {
        const reader = new FileReader();
        reader.onload = (e) => {
          Swal.fire({
            title: `Your uploaded image with name ${file[1]}`,
            imageUrl: e.target.result,
            imageAlt: "The uploaded image",
          });
        };
        reader.readAsDataURL(file[0]);
        const res = await checkAccessToken(dispatch, navigate, location);
        if (res) {
          await dispatch(addImages([projectID, picture, pictureName]));
          dispatch(fetchImages([projectID]));
        }
      } else {
        Swal.fire({
          icon: "error",
          html: `
            <div style="display:flex;flex-direction:column;">
              ${!file[0] ? "<label>You did not select the image</label>" : ""}
              ${!file[1] ? "<label>The name is empty</label>" : ""}
            </div>
          `,
        });
      }
    }
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const captureImage = async () => {
    const { value: captured } = await Swal.fire({
      title: "Take Image",
      showCancelButton: true,
      showConfirmButton: false,
      html: `
        <div style="display:flex;flex-direction:column;">
          <video id="webcam" autoplay playsinline style="width:100%;"></video>
          <button id="captureButton" class="btn btn-success" style="margin: 1rem auto;width: fit-content;">Capture Image</button>
        </div>
      `,

      didOpen: () => {
        const video = document.getElementById("webcam");
        const captureButton = document.getElementById("captureButton");

        // Start webcam stream
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            video.srcObject = stream;
            video.play();
            streamRef.current = stream;
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              text: "Failed to access the webcam. Please check your permissions.",
            });
            console.error("Webcam access error: ", error);
          });

        captureButton.addEventListener("click", async () => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext("2d").drawImage(video, 0, 0);
          const dataUrl = canvas.toDataURL("image/jpeg");

          Swal.fire({
            title: `Your captured image`,
            html: `
            <div style="display:flex;flex-direction:column;gap:1rem;">
              <img style="width:100%;padding:0 2.6rem;" class="swal2-image" src="${dataUrl}" alt="image">
              <input id="imageName" type="text" class="swal2-input" placeholder="Image Name" style="margin-top:10px;">
            </div>
            `,
            showCancelButton: true,
            preConfirm: () => {
              const imageName = document.getElementById("imageName").value;
              return [dataUrl, imageName];
            },
            willClose: () => {
              stopWebcam();
            },
          }).then(async (result) => {
            if (result.isConfirmed) {
              const [dataUrl, imageName] = result.value;

              if (dataUrl && imageName) {
                const file = dataURLtoFile(dataUrl, `${imageName}.jpg`);
                if (file) {
                  Swal.fire({
                    title: `Image Name: ${imageName}`,
                    imageUrl: dataUrl,
                    imageAlt: "The confirmed image",
                  });
                  await uploadCapturedImage(file, imageName);
                } else {
                  Swal.fire({
                    icon: "error",
                    text: "Failed to convert captured image to file!",
                  });
                }
              } else {
                Swal.fire({
                  icon: "error",
                  text: "Image name is required!",
                });
              }
              stopWebcam();
            }
          });
        });
      },
      willClose: () => {
        stopWebcam();
      },
    });
  };

  const uploadCapturedImage = async (file, pictureName) => {
    let picture = file;
    const res = await checkAccessToken(dispatch, navigate, location);
    if (res) {
      await dispatch(addImages([projectID, picture, pictureName]));
      dispatch(fetchImages([projectID]));
    }
  };

  // Function to add image
  const addImage = async () => {
    Swal.fire({
      title: "Add Image",
      showCancelButton: true,
      showConfirmButton: false,
      html: `
        <div style="display:flex;flex-direction:row;justify-content:center;align-items:center;gap:1rem;padding:1rem;">
          <button id="webcamButton" class="btn btn-success" style="width:fit-content;">Take Image</button>
          <button id="uploadButton" class="btn btn-success" style="width:fit-content;">Upload Image</button>
        </div>
      `,
      didOpen: () => {
        document
          .getElementById("webcamButton")
          .addEventListener("click", captureImage);
        document
          .getElementById("uploadButton")
          .addEventListener("click", uploadImage);
      },
    });
  };

  return (
    <div className="editor_rule">
      {/* Navbar of editor project */}
      <div className="header">
        <h2>
          <label>{project_edit?.projectName}</label>
          <button
            className="btn btn-success ms-2"
            style={{ width: "fit-content" }}
            onClick={addImage}
          >
            Add Image
          </button>
        </h2>
      </div>
      {/* Relation in project edit */}
      <div className="rule_page">
        <div className="container_modules">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "1rem",
              margin: "1rem",
            }}
          >
            {loading ? (
              <Loading />
            ) : images.length === 0 ? (
              <h2 className="text_color">No found any image</h2>
            ) : (
              images?.map((image) => {
                const byteArray = new Uint8Array(image.data.data);
                const blob = new Blob([byteArray], {
                  type: images.contentType,
                });
                const imageUrl = URL.createObjectURL(blob);
                return (
                  <div key={image._id} style={{ position: "relative" }}>
                    <button
                      className="btn_delete"
                      onClick={() => {
                        Swal.fire({
                          title: "Do you want to delete the image?",
                          icon: "question",
                          showCancelButton: true,
                          preConfirm: async () => {
                            const res = await checkAccessToken(
                              dispatch,
                              navigate,
                              location
                            );

                            if (res) {
                              await dispatch(deleteImage([image._id]));
                              dispatch(fetchImages([projectID]));
                            }
                          },
                        });
                      }}
                    >
                      X
                    </button>
                    <img
                      style={{
                        borderRadius: "2rem",
                        objectFit: "cover",
                        overflow: "hidden",
                      }}
                      width={300}
                      height={300}
                      src={imageUrl}
                    />
                    <h3
                      style={{
                        cursor: "default",
                        margin: "0.5rem",
                        textAlign: "center",
                      }}
                    >
                      {image.pictureName.split(".")[0]}
                    </h3>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
