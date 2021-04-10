import React, { useState, useRef } from "react";
import RoomDataService from "../services/RoomDataService";

import { Redirect } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { Col, Form, Button } from "react-bootstrap";

const AddRoom = () => {

  const { register, handleSubmit, errors, formState, getValues } = useForm({
    mode: "onChange"
  });

  const { touched } = formState;

  const [submitted, setSubmitted] = useState(false);


  const saveRoom = () => {
    var data = {
      RoomNumber: getValues("RoomNumber"),
      AdultsCapacity: getValues("AdultsCapacity"),
      ChildrenCapacity: getValues("ChildrenCapacity"),
      Price: getValues("Price"),
    };

    RoomDataService.create(data)
      .then(response => {
        setSubmitted(true);
        console.log("saved Room in data base");
        console.log(response.data);
      })
      .catch(e => {
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
            <Col md="3">
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
                    }
                  })
                }
                isValid={!errors.RoomNumber && touched.RoomNumber}
              />
              {errors.RoomNumber?.type === "maxLength" && (
                <p>Max room number length eqaul to 3.</p>
              )}
              {errors.RoomNumber?.type === "required" && (
                <p>Need room number.</p>
              )}
              {errors.RoomNumber?.type === "pattern" && (
                <p>Need number type[0-9].</p>
              )}
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Col md="3">
              <Form.Label>Adults Capacity</Form.Label>
            </Col>
            <Form.Group as={Col} className="inputData" md="6">
              <Form.Control
                as="input"
                type="number"
                name="AdultsCapacity"
                ref={
                  register({
                    required: true
                  })
                }
                isValid={!errors.AdultsCapacity && touched.AdultsCapacity}
              />
              {errors.AdultsCapacity?.type === "required" && (
                <p>Need number or 0.</p>
              )}
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Col md="3">
              <Form.Label>Children Capacity</Form.Label>
            </Col>
            <Form.Group as={Col} className="inputData" md="6">
              <Form.Control
                as="input"
                type="number"
                name="ChildrenCapacity"
                ref={
                  register({
                    required: true
                  })
                }
                isValid={!errors.ChildrenCapacity && touched.ChildrenCapacity}
              />
              {errors.ChildrenCapacity?.type === "required" && (
                <p>Need number or 0.</p>
              )}
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Col md="3">
              <Form.Label>Price</Form.Label>
            </Col>
            <Form.Group as={Col} className="inputData" md="6">
              <Form.Control
                as="input"
                type="number"
                step="0.01"
                name="Price"
                ref={
                  register({
                    required: true
                  })
                }
                isValid={!errors.Price && touched.Price}
              />
              {errors.Price?.type === "required" && (
                <p>Need price</p>
              )}
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Form.Row>


          <Button as="input" type="submit" className="btn btn-success" value="Submit"/>{' '}
            
      </Form>
      )}
    </div>
  );
};

export default AddRoom;