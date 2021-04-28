import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/test/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};

const getModeratorBoard = () => {
  return axios.get(API_URL + "mod", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(API_URL + "admin", { headers: authHeader() });
};

const updateOTP = (email, data) => {
  return axios.put(API_URL+ "user/otp/" + `${email}`, data);
};

// const updateLoginAttempts = (username, data) => {
//   return axios.put(API_URL+ "user/" + `${username}`, data);
// };

const getUser = (username) => {
  return axios.get(API_URL + "user/" + `${username}`,{ headers: authHeader() });
};

const checkOTPUser = (email, data) => {
  return axios.put(API_URL + "checkotp/" + `${email}`, data);
}

const resetPassword = (email, data) => {
  return axios.put(API_URL + "resetpassword/" + `${email}`, data);
}

const updateEmployeeName = (id, data) => {
  return axios.put(API_URL +`user/${id}`, data);
};

export default {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
  updateOTP,
  getUser,
  checkOTPUser,
  resetPassword,
  updateEmployeeName,
};