import {
    SET_OTP,
    SET_MESSAGE,
} from "./types";

import UserService from "../services/user.service";

export const checkotp = (email, otp, sendTime) => (dispatch) => {
    return UserService.checkOTPUser(email, {
        otp: otp,
        sendTime: sendTime
    }).then(
        (response) => {
            dispatch({
                type: SET_OTP,
                payload: { otp: response.data.otp, username: response.data.username, time: response.data.time },
            });

            dispatch({
                type: SET_MESSAGE,
                payload: response.data.message,
            });

            return Promise.resolve();

        },
        (error) => {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });

            return Promise.reject();
        }
    );
};


