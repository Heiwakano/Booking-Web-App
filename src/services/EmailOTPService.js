import http from "../http-common";

//Create a OTP 
const create = data => {
    return http.post("/text-mail", data);
  };

  export default {
    create,
  };