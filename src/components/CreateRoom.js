import React, { useState } from "react";
import RoomDataService from "../services/RoomDataService";

import { useSelector } from "react-redux";

import { Redirect } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { Col, Form } from "react-bootstrap";

import Swal from 'sweetalert2';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const AddRoom = (props) => {

  const { register, handleSubmit, errors, formState, getValues } = useForm({
    mode: "onChange"
  });

  const [submitted, setSubmitted] = useState(false);
  const { user: currentUser } = useSelector((state) => state.auth);

  const theme = createMuiTheme({
    overrides: {
      // Style sheet name ⚛️
      MuiButton: {
        // Name of the rule
        root: {
          // Some CSS
          margin: '0 3% 3% 0',
          //   background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          //   borderRadius: 3,
          //   border: 0,
          //   color: 'white',
          //   height: 48,
          //   padding: '0 30px',
          //   boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        },
        colorInherit: {
          background: '#5cb85c',
          color: 'white',
        }
      },
    },
  });


  const saveRoom = () => {
    var data = {
      RoomNumber: getValues("RoomNumber"),
      AdultsCapacity: getValues("AdultsCapacity"),
      ChildrenCapacity: getValues("ChildrenCapacity"),
      Price: getValues("Price"),
    };

    RoomDataService.create(data)
      .then(response => {
        Swal.fire(
          'Saved!',
          'Your room has been created.',
          'success'
        ).then(() => setSubmitted(true));
        console.log("saved room in data base");
        console.log(response.data);
      })
      .catch(e => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          // footer: '<a href>Why do I have this issue?</a>'
        });
        console.log(e);
      });
  };

  return (
    <div className="sheet padding-10mm">
      {submitted ? (
        <Redirect to="/rooms" />
      ) : (
        <Form noValidate onSubmit={handleSubmit(saveRoom)}>
          <Form.Row className="header-create">
            <h1>New Room</h1>
          </Form.Row>
          <Form.Row>
            <Col md="2">
              <Form.Label>Room Number</Form.Label>
            </Col>
            <Form.Group as={Col} className="inputData" md="6">
              <Form.Control
                as="input"
                type="text"
                name="RoomNumber"
                ref={
                  register({
                    maxLength: 3,
                    required: true,
                    pattern: {
                      value: /[0-9]/
                    },
                    validate: {
                      positive: (value) => value >= 0,
                    }
                  })
                }
              />
            </Form.Group>
            <Col style={{ textAlign: "left", margin: "auto 0" }}>
              {errors.RoomNumber?.type === "maxLength" && (
                <p className="error-validate">Max room number length eqaul to 3.</p>
              )}
              {errors.RoomNumber?.type === "required" && (
                <p className="error-validate">Need room number.</p>
              )}
              {errors.RoomNumber?.type === "pattern" && (
                <p className="error-validate">Need number type[0-9].</p>
              )}
              {errors.RoomNumber?.type === "positive" && (
                <p className="error-validate">Room number must be number.</p>
              )}
            </Col>
          </Form.Row>

          <Form.Row>
            <Col md="2">
              <Form.Label>Adults Capacity</Form.Label>
            </Col>
            <Form.Group as={Col} className="inputData" md="6">
              <Form.Control
                as="input"
                type="number"
                name="AdultsCapacity"
                min="0"
                ref={
                  register({
                    required: true,
                    validate: {
                      positive: (value) => value >= 0,
                    }
                  })
                }
              />
            </Form.Group>
            <Col style={{ textAlign: "left", margin: "auto 0" }}>
              {errors.AdultsCapacity?.type === "required" && (
                <p className="error-validate">Need number or 0.</p>
              )}
              {errors.AdultsCapacity?.type === "positive" && (
                <p className="error-validate">Need number more than or eqaul 0.</p>
              )}
            </Col>
          </Form.Row>

          <Form.Row>
            <Col md="2">
              <Form.Label>Children Capacity</Form.Label>
            </Col>
            <Form.Group as={Col} className="inputData" md="6">
              <Form.Control
                as="input"
                type="number"
                name="ChildrenCapacity"
                min="0"
                ref={
                  register({
                    required: true,
                    validate: {
                      positive: (value) => value >= 0,
                    }
                  })
                }
              />
            </Form.Group>
            <Col style={{ textAlign: "left", margin: "auto 0" }}>
              {errors.ChildrenCapacity?.type === "required" && (
                <p className="error-validate">Need number or 0.</p>
              )}
              {errors.ChildrenCapacity?.type === "positive" && (
                <p className="error-validate">Need number more than or eqaul 0.</p>
              )}
            </Col>
          </Form.Row>

          <Form.Row>
            <Col md="2">
              <Form.Label>Price</Form.Label>
            </Col>
            <Form.Group as={Col} className="inputData" md="6">
              <Form.Control
                as="input"
                type="number"
                step="0.01"
                name="Price"
                min="0"
                ref={
                  register({
                    required: true,
                    validate: {
                      positive: (value) => value >= 0,
                    }
                  })
                }
              />
            </Form.Group>
            <Col style={{ textAlign: "left", margin: "auto 0" }}>
              {errors.Price?.type === "required" && (
                <p className="error-validate">Need price</p>
              )}
              {errors.Price?.type === "positive" && (
                <p className="error-validate">Need price more than or eqaul 0.</p>
              )}
            </Col>
          </Form.Row>
          <Form.Row style={{ textAlign: "left", marginLeft: "6%" }}>
            {currentUser && currentUser.roles.includes('manager') && <ThemeProvider theme={theme}>
              <Button type="submit" variant="contained" size="large" name="createroom" color="inherit"><b>Create Room</b></Button>
            </ThemeProvider>}
            <ThemeProvider theme={theme}>
              <Button variant="outlined" size="large" onClick={() => props.history.push("/rooms")} name="Back" color="default" >Back</Button>
            </ThemeProvider>
          </Form.Row>

        </Form>
      )}
    </div>
  );
};

export default AddRoom;