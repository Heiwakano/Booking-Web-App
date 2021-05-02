import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Link } from 'react-router-dom';

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import { checkotp } from "../actions/otp";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const CheckOTP = () => {
  const form = useRef();
  const checkBtn = useRef();

  const [loading, setLoading] = useState(false);
  const [otp, setOTP] = useState("");

  const { email } = useSelector(state => state.auth);
  const { ref } = useSelector(state => state.auth);
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
    if (checkBtn.current.context._errors.length === 0) {
      dispatch(checkotp(email, otp, sendTime))
        .then(() => {
          setLoading(false);
          setIsSubmit(true);
        })
        .catch(() => {
          setLoading(false);
        })
    } else {
      setLoading(false);
    }


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
                <label htmlFor="otp">Sent to Email :</label>
                <Input
                  type="text"
                  className="form-control"
                  name="otp"
                  value={email}
                  disabled
                />
              </div>
              <div className="form-group">
                <label htmlFor="otp">Ref :</label>
                <Input
                  type="text"
                  className="form-control"
                  name="otp"
                  value={ref}
                  disabled
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


export default CheckOTP;