import React, { useEffect } from "react";
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
  SET_PROFILEPICTURE,
} from "../actions/types";


const Profile = () => {
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

  useEffect(() => {
    getUser();
  }, []);

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  console.log("user", currentUser);

  const getUser = () => {
    UserService.getUser(currentUser.username)
      .then(response => {
        const profilePicture = response.data[0].employees[0].profilePicture;
        const firstname = response.data[0].employees[0].firstName;
        const lastname = response.data[0].employees[0].lastName;
        setValue("firstname", firstname, { shouldDirty: true });
        setValue("lastname", lastname, { shouldDirty: true });
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
        dispatch({
          type: SET_USERNAME,
          payload: { user: user },
        })
      })
      .catch(e => {
        console.log(e);
      });
  }



  return (
    <div className="sheet padding-10mm">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.username}</strong> Profile
        </h3>


      </header>

      <Grid container justify="center" alignItems="center" direction="column">
        <Avatar alt={currentUser.username} src={currentUser.profilePicture} className={classes.large}  />

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
        <Form.Row>
          <Col md="1" className="button-center">
            <Button as="input"
              type="submit"
              value="Save"
            />{' '}
          </Col>
        </Form.Row>

      </Form>

    </div>
  );
};

export default Profile;