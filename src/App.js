import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Router, Switch, Route, Link, Redirect } from "react-router-dom";


import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import "./App.css";

import Login from "./components/Login";
import SendOTP from "./components/SendOTP";
import CheckOTP from "./components/CheckOTP";
import ResetPassword from "./components/ResetPassword";
// import Register from "./components/Register";
import Registerv1 from "./components/Registerv1";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";

import { history } from "./helpers/history";

import EditRoom from "./components/EditRoom";
import EditBooking from "./components/EditBooking";
import BookingsList from "./components/BookingsList";
import RoomsList from "./components/RoomsList";
import CreateBooking from "./components/CreateBooking";
import CreateRoom from "./components/CreateRoom";
import CheckOut from "./components/CheckOut";

import { NavDropdown } from 'react-bootstrap';


import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';


import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import MenuIcon from '@material-ui/icons/Menu';
import HotelIcon from '@material-ui/icons/Hotel';

import UserService from "./services/user.service";

import {
  SET_PROFILEPICTURE,
} from "./actions/types";

const App = () => {
  // const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  // const [showAdminBoard, setShowAdminBoard] = useState(false);
  const baseUrl = "http://localhost:8080/api/get/profilePicture/";
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    large: {
      width: theme.spacing(5),
      height: theme.spacing(5),
    },
  }));

  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {

    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage()); // clear message when changing location
    });
  }, [dispatch]);

  useEffect(() => {
    currentUser && getUser();
    // if (currentUser) {
    //   setShowModeratorBoard(currentUser.roles.includes("ROLE_MODERATOR"));
    //   setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
    // }
  }, []);

  const getUser = () => {
    UserService.getUser(currentUser.username)
      .then(response => {
        const profilePicture = response.data[0].employees[0].profilePicture;
        const firstname = response.data[0].employees[0].firstName;
        const lastname = response.data[0].employees[0].lastName;
        const user = {
          ...currentUser,
          profilePicture: profilePicture,
          firstname: firstname,
          lastname: lastname,
        };
        dispatch({
          type: SET_PROFILEPICTURE,
          payload: { user: user }
        })
      })
      .catch((e) => {
        console.log(e);
      })
  };

  const logOut = () => {
    setOpen(false);
    dispatch(logout());
  };

  return (
    <Router history={history}>
      <div>
        <nav className="navbar navbar-expand" style={{ padding: '0 16px', backgroundColor: "rgb(70, 34, 121)" }}>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              {currentUser ? <Link to={"/"} className="nav-link" style={{padding: '0px 8px 0px 0px'}}>
                <HotelIcon style={{ fontSize: '36px', color: 'white', paddingBottom: '8px' }} /> <b style={{ fontSize: '24px', color: 'white' }}>Hotel</b>
              </Link> 
              : <Link to={"/login"} className="nav-link" style={{padding: '0px 8px 0px 0px'}}>
                <HotelIcon style={{ fontSize: '36px', color: 'white', paddingBottom: '8px' }} /> <b style={{ fontSize: '24px', color: 'white' }}>Hotel</b>
              </Link>}
              
            </li>
            <li className="nav-item">
              {currentUser ? <Link to={"/"} className="nav-link">
                Home
              </Link> :  <Link to={"/login"} className="nav-link">
                Home
              </Link>}
            </li>
            <li className="nav-item">
              {currentUser && <NavDropdown title="Bookings" id="basic-nav-dropdown">
                <NavDropdown.Item>
                  <Link to={"/bookings"} className="nav-link">
                    Bookings
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item>
                  <Link to={"/createBooking"} className="nav-link">
                    New Booking
                  </Link>
                </NavDropdown.Item>
              </NavDropdown>}
            </li>
            <li className="nav-item">
              {currentUser && <NavDropdown title="Rooms" id="basic-nav-dropdown">
                <NavDropdown.Item >
                  <Link to={"/rooms"} className="nav-link">
                    Rooms
                  </Link>
                </NavDropdown.Item>
                {currentUser && currentUser.roles.includes('manager') && <NavDropdown.Divider />}
                {currentUser && currentUser.roles.includes('manager') && <NavDropdown.Item >
                  <Link to={"/createRoom"} className="nav-link">
                    New Room
                  </Link>
                </NavDropdown.Item>}
              </NavDropdown>}
            </li>

            {/* {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/mod"} className="nav-link">
                  Moderator Board
                </Link>
              </li>
            )}

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link">
                  Admin Board
                </Link>
              </li>
            )} */}


          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">

              <Button
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
              >
                <Avatar alt="currentUser.username" src={baseUrl + currentUser.profilePicture} className={classes.large} />
              <div style={{ margin: "5%" }}>
                <b style={{ color: "white" }}>{currentUser.firstname}</b>
              </div>
              {/* <MenuIcon style={{ color: "white" }}/> */}
              </Button>
              <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={() => setOpen(false)}>
                        <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                          <MenuItem name="Profile" onClick={handleClose}>
                            <Link to={"/profile"} className="nav-link">
                              Profile
                            </Link>
                          </MenuItem>
                          {/* <MenuItem name="Myaccount" onClick={handleClose}>My account</MenuItem> */}
                          <MenuItem name="Logout" >
                            <Link to={"/login"} className="nav-link" onClick={logOut}>
                              LogOut
                            </Link>
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3 container_height">
          <Switch>
            <Route exact path={["/rooms"]} component={RoomsList} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/resetpassword" component={ResetPassword} />
            <Route exact path="/sendotp" component={SendOTP} />
            <Route exact path="/checkotp" component={CheckOTP} />
            <Route exact path="/register" component={Registerv1} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/user" component={BoardUser} />
            <Route path="/mod" component={BoardModerator} />
            <Route path="/admin" component={BoardAdmin} />
            <Route exact path="/bookings" component={BookingsList} />
            <Route exact path="/createBooking" component={CreateBooking} />
            <Route exact path="/createRoom" component={CreateRoom} />
            <Route path="/rooms/:roomId" component={EditRoom} />
            <Route path="/bookings/:bookingId" component={EditBooking} />
            <Route path="/checkout/:bookingId" component={CheckOut} />
            <Route path={["/"]} component={Home} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;