import React from "react";
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

import UploadImagesMUI from "./upload-files-MUI";
import { Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import UserService from "../services/user.service";
import {
  SET_USERNAME,
} from "../actions/types";

import Swal from 'sweetalert2';

const Profile = (props) => {
  const baseUrl = "http://localhost:8080/api/get/profilePicture/";
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'block',
      '& > *': {
        margin: theme.spacing(3),
      },
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    large: {
      width: theme.spacing(25),
      height: theme.spacing(25),
    },
    marginAutoContainer: {
      width: 500,
      height: 80,
      display: 'flex',
    },
    marginAutoItem: {
      margin: 'auto'
    },
    alignItemsAndJustifyContent: {
      width: 500,
      height: 80,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }));

  const classes = useStyles();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    errors,
    formState: { touched }
  } = useForm({
    defaultValues: {
      lastname: currentUser.lastname,
      firstname: currentUser.firstname,
      email: currentUser.email,
      roles: currentUser.roles,
    }
  });

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  console.log("user", currentUser);

  const editName = () => {
    const data = {
      firstname: getValues("firstname"),
      lastname: getValues("lastname"),
    }
    const id = currentUser.id;
    UserService.updateEmployeeName(id, data)
      .then(() => {
        const firstname = getValues("firstname");
        const lastname = getValues("lastname");
        const user = { ...currentUser, firstname: firstname, lastname: lastname };
        Swal.fire(
          'Saved!',
          'Profile has been updated.',
          'success'
        )
        .then(()=>dispatch({
          type: SET_USERNAME,
          payload: { user: user },
        }))
      })
      .catch(e => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          // footer: '<a href>Why do I have this issue?</a>'
        })
        console.log(e);
      });
  }



  return (
    <div className="sheet padding-10mm">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.firstname} {currentUser.lastname}</strong> Profile
        </h3>


      </header>

      <Grid container justify="center" alignItems="center" direction="column">
        <Avatar alt={currentUser.username} src={baseUrl+currentUser.profilePicture} className={classes.large} />

        <UploadImagesMUI email={currentUser.email} user={currentUser} />
      </Grid>

      <Form noValidate onSubmit={handleSubmit(editName)} style={{ "text-align": "center" }}>
        <Form.Row>
          <Col md="3">
            <Form.Label>First Name</Form.Label>
          </Col>
          <Form.Group as={Col} className="inputData" md="6">
            <Form.Control
              as="input"
              type="text"
              name="firstname"
              ref={
                register({
                  required: true,
                  pattern: {
                    value: /[A-Za-z]/
                  }
                })
              }
            />
            {errors.firstname?.type === "required" && (
              <p>Need first name.</p>
            )}
            {errors.firstname?.type === "pattern" && (
              <p>Need text type[A-Z,a-z].</p>
            )}
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Col md="3">
            <Form.Label>Last Name</Form.Label>
          </Col>
          <Form.Group as={Col} className="inputData" md="6">
            <Form.Control
              as="input"
              type="text"
              name="lastname"
              ref={
                register({
                  required: true,
                  pattern: {
                    value: /[A-Za-z]/
                  }
                })
              }
            />
            {errors.lastname?.type === "required" && (
              <p>Need first name.</p>
            )}
            {errors.lastname?.type === "pattern" && (
              <p>Need text type[A-Z,a-z].</p>
            )}
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Col md="3">
            <Form.Label>Email</Form.Label>
          </Col>
          <Form.Group as={Col} className="inputData" md="6">
            <Form.Control
              as="input"
              type="text"
              name="email"
              ref={register}
              readOnly
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Col md="3">
            <Form.Label>Authorities</Form.Label>
          </Col>
          <Form.Group as={Col} className="inputData" md="6">
            <Form.Control
              as="input"
              type="text"
              name="roles"
              ref={register}
              readOnly
            />
          </Form.Group>
        </Form.Row>
        <Form.Row style={{ textAlign: "center"}}>
          <Col>
            <Button as="input"
              type="submit"
              value="Save"
              variant="success"
            />{' '}
          <Button as="input"
              type="button"
              value="Back"
              variant="secondary"
              onClick={()=>props.history.push("/")}
              style={{ marginLeft: "2%"}}
            />{' '}
          </Col>
          
        </Form.Row>

      </Form>

    </div>
  );
};

export default Profile;