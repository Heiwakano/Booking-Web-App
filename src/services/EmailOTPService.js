import http from "../http-common";

//Create a OTP 
const send = email => {
    return http.post("/text-mail", {email: email});
  };

  export default {
    send,
  };