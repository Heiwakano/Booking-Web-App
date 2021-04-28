import React, { useState, useEffect } from "react";
import RoomDataService from "../services/RoomDataService";

import { Redirect } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { Col, Form } from "react-bootstrap";

import { useSelector } from "react-redux";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

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
  const [currentRoom, setCurrentRoom] = useState("");

  const { user: currentUser } = useSelector((state) => state.auth);

  //sweetalert
  const MySwal = withReactContent(Swal);

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
      },
    },
  });

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

  const updateRoom = (event) => {

    event.preventDefault();
    event.stopPropagation();

    const data = {
      RoomNumber: getValues("RoomNumber"),
      AdultsCapacity: getValues("AdultsCapacity"),
      ChildrenCapacity: getValues("ChildrenCapacity"),
      Price: getValues("Price"),
    }
    console.log("data", data);
    console.log("Id", getValues("Id"));
    RoomDataService.update(getValues("Id"), data)
      .then(() => {
        Swal.fire(
          'Saved!',
          'Your room has been saved.',
          'success'
      )
          .then(() => props.history.push("/rooms"));
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
  };

  const deleteRoom = () => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "you want to permanently delete this room?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const id = props.match.params.roomId;
        RoomDataService.remove(id)
          .then(() => {
            Swal.fire(
              'Deleted!',
              'Your room has been deleted.',
              'success'
            )
              .then(() => props.history.push("/rooms"));
          })
          .catch((e) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
              // footer: '<a href>Why do I have this issue?</a>'
            })
            console.log(e);
          });
      }
    })

  };

  const cancelEdit = () => {
    props.history.push("/rooms");
  };

  const haddleChange = (e) => {
    const roomnumber = e.target.value;
    setCurrentRoom(roomnumber);
  }

  return (
    <div className="sheet padding-10mm">
      {submitted ? (
        <Redirect to="/rooms" />
      ) : (
        <div>
          <Form noValidate onSubmit={(event) => handleSubmit(updateRoom(event))}>
            <Form.Row className="header-create">
              <h1>Room {currentRoom}</h1>
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
                  onChange={haddleChange}
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
                {errors.RoomNumber?.type === "maxLength" && (
                  <p>Max room number length eqaul to 3.</p>
                )}
                {errors.RoomNumber?.type === "required" && (
                  <p>Need room number.</p>
                )}
                {errors.RoomNumber?.type === "pattern" && (
                  <p>Need number type[0-9].</p>
                )}
                {errors.RoomNumber?.type === "positive" && (
                  <p>Room number must not be negative.</p>
                )}
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
                  min="0"
                  ref={register({
                    required: true,
                    validate: {
                      positive: (value) => value >= 0,
                    }
                  })
                  }
                />
                {errors.AdultsCapacity?.type === "required" && (
                  <p>Need number or 0.</p>
                )}
                {errors.AdultsCapacity?.type === "positive" && (
                  <p>Need number more than or eqaul 0.</p>
                )}
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
                {errors.ChildrenCapacity?.type === "required" && (
                  <p>Need number or 0.</p>
                )}
                {errors.ChildrenCapacity?.type === "positive" && (
                  <p>Need number more than or eqaul 0.</p>
                )}
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
                {errors.Price?.type === "required" && (
                  <p>Need price</p>
                )}
                {errors.Price?.type === "positive" && (
                  <p>Need price more than or eqaul 0.</p>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>

            {currentUser && currentUser.roles.includes('moderator') &&<ThemeProvider theme={theme}>
                <Button variant="contained" type="submit" size="large" name="save" color="primary" >Save</Button>
              </ThemeProvider>}

              {currentUser && currentUser.roles.includes('moderator') && <ThemeProvider theme={theme}>
                <Button variant="contained" size="large" onClick={deleteRoom} name="delete" color="secondary" >Delete</Button>
              </ThemeProvider>}

              <ThemeProvider theme={theme}>
                <Button variant="contained" size="large" onClick={cancelEdit} name="Back" color="default" >Back</Button>
              </ThemeProvider>

            </Form.Row>
          </Form>
        </div>
      )}
    </div>
  );
};





export default EditRoom;