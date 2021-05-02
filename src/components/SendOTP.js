import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from 'react-router-dom';

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import { sendEmail } from "../actions/sendEmail";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const SendOTP = () => {
  const form = useRef();
  const checkBtn = useRef();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);

  const { message } = useSelector(state => state.message);

  const dispatch = useDispatch();

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  }

  const handleSendOTP = (e) => {

    e.preventDefault();
    form.current.validateAll();
    setLoading(true);

    if (checkBtn.current.context._errors.length === 0) {
      dispatch(sendEmail(email))
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
    return <Redirect to="/checkotp" />;
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

            <Form onSubmit={handleSendOTP} ref={form}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Input
                  type="text"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={onChangeEmail}
                  validations={[required]}
                />
              </div>

              <div className="form-group">
                <button className="btn btn-primary btn-block" disabled={loading}>
                  {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>Send OTP</span>
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