import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Link } from 'react-router-dom';

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import { login } from "../actions/auth";
import EmailOTPService from "../services/EmailOTPService";
import UserService from "../services/user.service";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const Login = (props) => {
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newpassword1, setNewPassword1] = useState("");
  const [newpassword2, setNewPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");

  const { isLoggedIn } = useSelector(state => state.auth);
  const { message } = useSelector(state => state.message);

  const [isForgotPass, setIsForgotPass] = useState(false);
  const [isSendOTP, setIsSendOTP] = useState(false);
  const [isOTPCorrect, setIsOTPCorrect] = useState(false);

  const [numFailLogin, setNumFailLogin] = useState(0);

  const dispatch = useDispatch();

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  }

  const onChangeOTP = (e) => {
    const otp = e.target.value;
    setOTP(otp);
  }

  const onChangeNewPass1 = (e) => {
    const newpass1 = e.target.value;
    setNewPassword1(newpass1);
  }

  const onChangeNewPass2 = (e) => {
    const newpass2 = e.target.value;
    setNewPassword2(newpass2);
  }

  const handleLogin = (e) => {
    e.preventDefault();

    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      dispatch(login(username, password))
        .then(() => {
          UserService.updateUser(username, {
            loginAttempts: 0,
            lastLoginAttempsDate: null,
            lastLoginDate: new Date()
          })
            .then(() => {
              setNumFailLogin(0);
              props.history.push("/profile");
              window.location.reload();
            })
            .catch((e) => {
              console.log(e);
            })
        })
        .catch(() => {
          setLoading(false);
          UserService.getUser(username)
            .then((response) => {
              console.log(response.data);
              console.log("loginAttempts", response.data[0].loginAttempts);
              if (response.data[0].loginAttempts >= 3) {
                setIsForgotPass(true);
              }
              UserService.updateUser(username, {
                loginAttempts: numFailLogin + 1,
                lastLoginAttempsDate: new Date()
              })
                .then(() => {
                  setNumFailLogin(numFailLogin + 1);
                })
                .catch((e) => {
                  console.log(e);
                })
            })
            .catch((e) => {
              console.log(e);
            })


        });
    } else {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return <Redirect to="/profile" />;
  }

  const handleSendOTP = (e) => {
    e.preventDefault();
    form.current.validateAll();
    setLoading(true);
    const ranNum = Math.floor(1000 + Math.random() * 9000);
    const makeid = (length) => {
      var result = [];
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
      }
      return result.join('');
    }

    const data = {
      to: email,
      subject: "Your OTP to reset password",
      digit: ranNum.toString(),
      char: makeid(4)
    }
    if (checkBtn.current.context._errors.length === 0) {
      EmailOTPService.create(data)
        .then(() => {
          setLoading(false);
          console.log("send OTP success!");
          const otpTime = new Date();
          UserService.updateUser(username, {
            otp: ranNum.toString(),
            otpRequestDate: otpTime
          })
            .then(() => {
              console.log("Updated user");
              setNumFailLogin(numFailLogin + 1);
            })
            .catch((e) => {
              setLoading(false);
              console.log(e);
            })
          setIsSendOTP(true);
        })
        .catch((e) => {
          setLoading(false);
          console.log(e);
        })

    } else {
      setLoading(false);
    }
  };

  const handleCheckOTP = (e) => {
    e.preventDefault();
    form.current.validateAll();
    setLoading(true);
    const sendTime = new Date().getTime();
    UserService.getUser(username)
      .then((response) => {
        const otpRequestTime = new Date(response.data[0].otpRequestDate).getTime();
        const correctOTP = response.data[0].otp;
        console.log("otpRequestTime", otpRequestTime);
        console.log("sendTime", sendTime);
        console.log("diffTime ", (sendTime - otpRequestTime) / (1000 * 60));
        if ((sendTime - otpRequestTime) / (1000 * 60) > 15) {
          console.log("Time Out!!");
          setLoading(false);
        }
        else {
          if (correctOTP === otp) {
            setLoading(false);
            setIsOTPCorrect(true);
            console.log("Correct!!");
          }
          else {
            setLoading(false);
            console.log("Wrong!!");
          }
        }
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      })
  };

  const handleCheckNewPassword = (e) => {
    e.preventDefault();
    form.current.validateAll();
    setLoading(true);
    if (newpassword1 === newpassword2) {
      UserService.updateUser(username, {
        password: newpassword1
      })
        .then(() => {
          setLoading(false);
          console.log("Update new password successfully");
          setIsForgotPass(false);
          setIsSendOTP(false);
          setIsOTPCorrect(false);
          props.history.push("/login");
          window.location.reload();
        })
        .catch((e) => {
          setLoading(false);
          console.log(e);
        })
    }
    else {
      setLoading(false);
      console.log("New Password doesn't match.");
    }
  };

  return (
    <div>
      {isForgotPass ? isSendOTP ? isOTPCorrect ? (
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
                  <label htmlFor="username">Reset Password</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="newpass1"
                    value={newpassword1}
                    onChange={onChangeNewPass1}
                    validations={[required]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="username">New Password Again</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="newpass2"
                    value={newpassword2}
                    onChange={onChangeNewPass2}
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
                {/* {message && (
                  <div className="form-group">
                    <div className="alert alert-danger" role="alert">
                      {message}
                    </div>
                  </div>
                )} */}
                <CheckButton style={{ display: "none" }} ref={checkBtn} />

              </Form>
            </div>
          </div>
        </div>
      ) : (
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
                  <label htmlFor="username">OTP</label>
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
                {/* {message && (
                  <div className="form-group">
                    <div className="alert alert-danger" role="alert">
                      {message}
                    </div>
                  </div>
                )} */}
                <CheckButton style={{ display: "none" }} ref={checkBtn} />

              </Form>
            </div>
          </div>
        </div>
      )
        : (
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
                    <label htmlFor="username">Email</label>
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
                  {/* {message && (
                    <div className="form-group">
                      <div className="alert alert-danger" role="alert">
                        {message}
                      </div>
                    </div>
                  )} */}
                  <CheckButton style={{ display: "none" }} ref={checkBtn} />

                </Form>
              </div>
            </div>
          </div>
        ) : (
        <div>
          <div className="col-md-12">
            <div className="card card-container">
              <img
                src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                alt="profile-img"
                className="profile-img-card"
              />

              <Form onSubmit={handleLogin} ref={form}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="username"
                    value={username}
                    onChange={onChangeUsername}
                    validations={[required]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={onChangePassword}
                    validations={[required]}
                  />
                </div>

                <div className="form-group">
                  <Link onClick={() => setIsForgotPass(true)} className="nav-link">Forgot password?</Link>

                </div>

                <div className="form-group">
                  <button className="btn btn-primary btn-block" disabled={loading}>
                    {loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Login</span>
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
      )}
    </div>
  );
};


export default Login;