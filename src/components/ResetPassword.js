import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Link } from 'react-router-dom';

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import { resetpassword } from "../actions/resetpassword";

import { clearMessage } from "../actions/message";

import Swal from 'sweetalert2';

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const ResetPassword = (props) => {
  const form = useRef();
  const checkBtn = useRef();

  const [newpassword1, setNewPassword1] = useState("");
  const [newpassword2, setNewPassword2] = useState("");
  const [loading, setLoading] = useState(false);

  const { isLoggedIn } = useSelector(state => state.auth);
  const { message } = useSelector(state => state.message);

  const { email } = useSelector(state => state.auth);
  const { otp } = useSelector(state => state.auth);
  const { username } = useSelector(state => state.auth);
  const { time } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  const onChangeNewPass1 = (e) => {
    const newpass1 = e.target.value;
    setNewPassword1(newpass1);
  }

  const onChangeNewPass2 = (e) => {
    const newpass2 = e.target.value;
    setNewPassword2(newpass2);
  }

  if (isLoggedIn) {
    return <Redirect to="/profile" />;
  }

  const handleCheckNewPassword = (e) => {
    e.preventDefault();
    form.current.validateAll();
    setLoading(true);
    if (checkBtn.current.context._errors.length === 0) {
      dispatch(resetpassword(email, newpassword1, newpassword2, otp, time))
        .then(() => {
          setLoading(false);
          dispatch(clearMessage());
          Swal.fire(
            'Saved!',
            'Your password has been changed.',
            'success'
          )
            .then(() => props.history.push("/login"));
        })
        .catch((e) => {
          setLoading(false);
          console.log(e);
        })
    }
    else {
      setLoading(false);
    }
  };

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
            <Form onSubmit={handleCheckNewPassword} ref={form}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <Input
                  type="text"
                  className="form-control"
                  name="username"
                  value={username}
                  readOnly

                />
              </div>
              <div className="form-group">
                <label htmlFor="username">Reset Password</label>
                <Input
                  type="password"
                  className="form-control"
                  name="newpass1"
                  value={newpassword1}
                  onChange={onChangeNewPass1}
                  validations={[required, vpassword]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="username">Confirm Password</label>
                <Input
                  type="password"
                  className="form-control"
                  name="newpass2"
                  value={newpassword2}
                  onChange={onChangeNewPass2}
                  validations={[required, vpassword]}
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


export default ResetPassword;