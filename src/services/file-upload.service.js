import http from "../http-common";

const upload = (file, onUploadProgress) => {
    let formData = new FormData();
    const user = JSON.parse(localStorage.getItem("user"));
    formData.append("file", file);
    formData.append("id", user.id);
    return http.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      });
    };

const getProfilePic = email => {
    return http.get(`/files/${email}`);
};

const getFiles = () => {
  return http.get("/files");
};


export default {
    upload,
    getProfilePic,
    getFiles
};