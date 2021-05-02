import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_EMAIL,
  SET_OTP,
  SET_PROFILEPICTURE,
  SET_USERNAME,

} from "../actions/types";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, 
    user: null, otp: "", 
    email: "", ref: "",
    username: "", 
    time: "",
  };

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_USERNAME:
      return {
        ...state,
        user: payload.user,
      };
    case SET_PROFILEPICTURE:
      return {
        ...state,
        user: payload.user,
      };
    case SET_OTP:
      return {
        ...state,
        otp: payload.otp,
        username: payload.username,
        time: payload.time,
      };
    case SET_EMAIL:
      return {
        ...state,
        email: payload.email,
        ref: payload.ref,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
      };
    case REGISTER_FAIL:
      return {
        ...state,
        isLoggedIn: false,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user: payload.user,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    default:
      return state;
  }
}
