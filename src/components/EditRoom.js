import React, { useState, useEffect } from "react";
import RoomDataService from "../services/RoomDataService";

import { Redirect } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { Col, Form, Button } from "react-bootstrap";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditRoom = props => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    errors,
    formState: { touched }
  } = useForm({
    defaultValues: {
      Id: undefined,
      RoomNumber: undefined,
      AdultsCapacity: undefined,
      ChildrenCapacity: undefined,
      Price: undefined,
    }
  });

  const [submitted, setSubmitted] = useState(false);
  const [currentRoom,setCurrentRoom] = useState("");

  const getRoom = id => {
    RoomDataService.get(id)
      .then(response => {
        setValue("Id", response.data.id, { shouldDirty: true });
        setValue("RoomNumber", response.data.RoomNumber, { shouldDirty: true });
        setValue("AdultsCapacity", response.data.AdultsCapacity, { shouldDirty: true });
        setValue("ChildrenCapacity", response.data.ChildrenCapacity, { shouldDirty: true });
        setValue("Price", response.data.Price, { shouldDirty: true });
        setCurrentRoom(response.data.RoomNumber);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    console.log("UseEffect active");
    getRoom(props.match.params.roomId);

  }, [props.match.params.id]);

  var toastId = null;

  const successSaveNotify = () => {
    return (toastId = toast.success('Saved Room!', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      // pauseOnHover: true,
      draggable: true,
      progress: undefined,
      onClose: () => setSubmitted(true)
      }));
  }

  const successDeleteNotify = () => {
    return (toastId = toast.success('Deleted Room!', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      // pauseOnHover: true,
      draggable: true,
      progress: undefined,
      onClose: () => props.history.push("/rooms")
      }));
  }

  const errorNotify = () => {
    return (toastId = toast.error('Error occurs while saving room!', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      // pauseOnHover: true,
      draggable: true,
      progress: undefined,
      // onClose: () => setSubmitted(true)
      }));
  }

  const errorDeleteNotify = () => {
    return (toastId = toast.error('Error occurs while deleting room!', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      // pauseOnHover: true,
      draggable: true,
      progress: undefined,
      // onClose: () => setSubmitted(true)
      }));
  }

  const updateRoom = () => {

    const data = {
      RoomNumber: getValues("RoomNumber"),
      AdultsCapacity: getValues("AdultsCapacity"),
      ChildrenCapacity: getValues("ChildrenCapacity"),
      Price: getValues("Price"),
    }
    console.log("data", data);
    console.log("Id", getValues("Id"));
    RoomDataService.update(getValues("Id"), data)
      .then(response => {
        setCurrentRoom(response.data.RoomNumber);
        successSaveNotify();
      })
      .catch(e => {
        errorNotify();
        console.log(e);
      });
  };

  const deleteRoom = () => {
    RoomDataService.remove(getValues("Id"))
      .then(response => {
        console.log(response.data);
        successDeleteNotify();
        // props.history.push("/rooms");
      })
      .catch(e => {
        console.log(e);
        errorDeleteNotify();
      });
  };

  const cancelEdit = () => {
    props.history.push("/rooms");
  };

  return (
    <div className="sheet padding-10mm">
      {submitted ? (
        <Redirect to="/rooms" />
      ) : (
        <div>
          <Form noValidate onSubmit={handleSubmit(updateRoom)}>
            <Form.Row className="header-create">
              <h1>Room {getValues("RoomNumber")}</h1>
            </Form.Row>
            <Form.Row>
              <Col md="3">
                <Form.Label>Room Number</Form.Label>
              </Col>
              <Form.Group as={Col} className="inputData" md="6">
                <Form.Control
                  as="input"
                  type="text"
                  name="Id"
                  ref={register}
                  className="hidden-input"
                />
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
                  ref={register({
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
            <Form.Row>
              <Col md="1.5">
                <Button as="input"
                  type="submit"
                  value="Save"
                />{' '}
                <ToastContainer />
              </Col>
              <Col md="1.5">
                <Button as="input"
                  type="button"
                  value="Delete"
                  onClick={deleteRoom}
                />{' '}
              </Col>
              <Col md="1">
                <Button as="input"
                  type="button"
                  value="Cancel"
                  onClick={cancelEdit}
                />{' '}
              </Col>
            </Form.Row>
          </Form>
        </div>
      )}
    </div>
  );
};





export default EditRoom;