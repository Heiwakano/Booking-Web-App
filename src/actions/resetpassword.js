import {
    SET_MESSAGE,
} from "./types";

import UserService from "../services/user.service";

export const resetpassword = (email, password1, password2, otp, time) => (dispatch) => {
    return UserService.resetPassword(email, {
        password1: password1,
        password2: password2,
        otp: otp,
        time: time,
    }).then(
        () => {

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


