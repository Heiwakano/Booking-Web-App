import React, { useState, useEffect } from "react";
import BookingDataService from "../services/BookingDataService";

import { Col, Row, Button, Container } from "react-bootstrap";

const CheckOut = props => {

    const [booking, setBooking] = useState({
        CheckInDate: "",
        CheckOutDate: "",
        GuestFirstName: "",
        GuestLastName: "",
        Label: "",
        NumberOfAdults: 0,
        NumberOfChildren: 0,
        Price: 0,
        RoomNumber: "000",
        id: 22,
    });

    const getBooking = id => {
        BookingDataService.get(id)
            .then(response => {
                const data = response.data[0];
                setBooking(data);
                console.log(data);

            })
            .catch(e => {
                console.log(e);
            });
    };

    useEffect(() => {
        console.log("UseEffect active checkout");
        console.log(props.match.params.bookingId);
        getBooking(props.match.params.bookingId);

    }, [props.match.params.id]);

    const BookingDetail = props => {
        return (
            <Row>
                <Col md="3">
                    {props.name}
                </Col>
                <Col>
                    {props.value}
                </Col>
            </Row>
        )
    };

    const updateStatus = () => {
        BookingDataService.update(booking.id, { statusId: 3 })
            .then(response => {
                props.history.push("/bookings");
                // successSaveNotify();
            })
            .catch(e => {
                // errorNotify();
                console.log(e);
            })
    };

    var checkIn = new Date(booking.CheckInDate);
    const timeCheckIn = checkIn.getTime();
    var dd = String(checkIn.getDate()).padStart(2, '0');
    var mm = String(checkIn.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = checkIn.getFullYear();

    checkIn = dd + '/' + mm + '/' + yyyy;

    var checkOut = new Date(booking.CheckOutDate);
    const timeCheckOut = checkOut.getTime();
    dd = String(checkOut.getDate()).padStart(2, '0');
    mm = String(checkOut.getMonth() + 1).padStart(2, '0'); //January is 0!
    yyyy = checkOut.getFullYear();

    checkOut = dd + '/' + mm + '/' + yyyy;

    const night = (timeCheckOut-timeCheckIn)/(1000*60*60*24);

    return (
        <Container>
            <Row>
                <h1>Check Out {booking.GuestFirstName} {booking.GuestLastName}</h1>
            </Row>
            <BookingDetail name="Room" value={booking.RoomNumber} />
            <BookingDetail name="Check-In" value={checkIn} />
            <BookingDetail name="Check-Out" value={checkOut} />
            <BookingDetail name="Nights" value={night} />
            <BookingDetail name="Adults" value={booking.NumberOfAdults} />
            <BookingDetail name="Children" value={booking.NumberOfChildren} />
            <BookingDetail name="Room Price" value={
                "฿" + booking.Price.toString() + " per night"
            } />
            <BookingDetail name="Total" value={
                "฿" + (booking.Price * night)} />
            <Row>
                <Col md="3">
                    <Button as="input" type="button" value="Confirm Check-Out" onClick={updateStatus} />{' '}
                </Col>
                <Col md="3">
                    <Button as="input" type="button" value="Cancel" onClick={() => props.history.push("/bookings/" + booking.id)} />{' '}
                </Col>
            </Row>




        </Container>
    )
};
export default CheckOut;