import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Link } from 'react-router-dom';

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import UserService from "../services/user.service";

import {
  SET_OTP,
} from "../actions/types";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const SendOTP = (props) => {
  const form = useRef();
  const checkBtn = useRef();

  const [loading, setLoading] = useState(false);
  const [otp, setOTP] = useState("");

  const { email } = useSelector(state => state.auth);
  const { message } = useSelector(state => state.message);

  const [isSubmit, setIsSubmit] = useState(false);

  const dispatch = useDispatch();


  const onChangeOTP = (e) => {
    const otp = e.target.value;
    setOTP(otp);
  }

  const handleCheckOTP = (e) => {
    e.preventDefault();
    form.current.validateAll();
    setLoading(true);
    const sendTime = new Date().getTime();
    UserService.checkOTPUser(email,{
      otp: otp,
      sendTime: sendTime
    })
      .then((response) => {
        setLoading(false);
        switch(response.data.type) {
          case "Correct":
            dispatch({
              type: SET_OTP,
              payload: { otp: otp,username: response.data.username },
            });
            setIsSubmit(true);
            break;
          case "Wrong":
            console.log("Wrong");
            break;
          case "TimeOut":
            console.log("TimeOut");
            break;
          default:
            console.log(response.data.type);
        }
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      })
  };

  if (isSubmit) {
    return <Redirect to="/resetpassword" />;
  }

  return (
    <div>
        <div>
          <div className="col-md-12">
            <div className="card card-container">
              <img
                src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                alt="profile-img"
                className="profile-img-card"
              />

              <Form onSubmit={handleCheckOTP} ref={form}>
                <div className="form-group">
                  <label htmlFor="otp">OTP</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="otp"
                    value={otp}
                    onChange={onChangeOTP}
                    validations={[required]}
                  />
                </div>

                <div className="form-group">
                  <button className="btn btn-primary btn-block" disabled={loading}>
                    {loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>OK</span>
                  </button>
                </div>
                {message && (
                  <div className="form-group">
                    <div className="alert alert-danger" role="alert">
                      {message}
                    </div>
                  </div>
                )}
                <CheckButton style={{ display: "none" }} ref={checkBtn} />

              </Form>
            </div>
          </div>
        </div>
    </div>
  );
};


export default SendOTP;