import {
    SET_MESSAGE,
    SET_EMAIL,
} from "./types";

import EmailOTPService from "../services/EmailOTPService";
import UserService from "../services/user.service";

export const sendEmail = (email) => (dispatch) => {
    return EmailOTPService.send(email)
    .then((response) => {
            dispatch({
                type: SET_MESSAGE,
                payload: response.data.message,
            });
            const otpTime = new Date();
            UserService.updateOTP(email, {
                otp: response.data.otp,
                otpRequestDate: otpTime
            })
                .then(() => {
                    dispatch({
                        type: SET_EMAIL,
                        payload: { email: email, ref: response.data.ref  },
                    });
                    console.log(response.data.ref);
                    console.log("Updated user");
                })
                .catch((e) => {
                    console.log(e);
                })

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


