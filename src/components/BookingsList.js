import React, { useState, useEffect, useMemo, useRef } from "react";
import BookingDataService from "../services/BookingDataService";
import { useTable } from "react-table";

import { DropdownButton, Dropdown, Container, Row, Col, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingsList = (props) => {
    const [bookings, setBookings] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [dispStatusButton, setDispStatusButton] = useState("-Any Status-")
    const [searchStatus, setSearchStatus] = useState("");
    const bookingsRef = useRef();

    bookingsRef.current = bookings;

    useEffect(() => {
        retrieveBookings();
    }, []);

    const onChangeSearchName = (e) => {
        const searchName = e.target.value;
        
        setSearchName(searchName);
    };

    const onClickStatus = (e) => {
        const status = e.target.name;
        
        switch (status) {
            case "":
                setDispStatusButton("-Any Status-");
                break;
            case "1":
                setDispStatusButton("Booked");
                break;
            case "2":
                setDispStatusButton("CheckedIn");
                break;
            case "3":
                setDispStatusButton("CheckedOut");
                break;
            case "4":
                setDispStatusButton("Canceled");
                break;
            default:
                console.log(status);
        }
        setSearchStatus(status);
    };

    const retrieveBookings = () => {
        BookingDataService.getAll()
            .then((response) => {
                console.log(response.data);
                setBookings(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const refreshList = () => {
        retrieveBookings();
    };

    const removeAllBookings = () => {
        BookingDataService.removeAll()
            .then((response) => {
                console.log(response.data);
                refreshList();
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const findBooking = () => {

        BookingDataService.findBooking(searchName, searchStatus)
            .then((response) => {
                console.log("found!!");
                console.log(response.data);
                setBookings(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }

    const openBooking = (rowIndex) => {
        const id = bookingsRef.current[rowIndex].id;

        props.history.push("/bookings/" + id);
    };

    const deleteBooking = (rowIndex) => {

        const id = bookingsRef.current[rowIndex].id;

        BookingDataService.remove(id)
            .then((response) => {
                props.history.push("/bookings");

                let newBookings = [...bookingsRef.current];
                newBookings.splice(rowIndex, 1);

                setBookings(newBookings);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    var toastId = null;

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


    const columns = useMemo(
        () => [
            {
                Header: "Name",
                accessor: d => (
                    <div>{d.GuestFirstName} {d.GuestLastName}</div>
                  ),
            },

            {
                Header: "Room",
                accessor: "RoomNumber",
            },
            {
                Header: "Check-In",
                accessor: d => (
                    <div>{new Date(d.CheckInDate).getDate()}/{new Date(d.CheckInDate).getMonth()}/{new Date(d.CheckInDate).getFullYear()}</div>
                  ),
            },
            {
                Header: "Check-Out",
                accessor: d => (
                    <div>{new Date(d.CheckOutDate).getDate()}/{new Date(d.CheckOutDate).getMonth()}/{new Date(d.CheckOutDate).getFullYear()}</div>
                  ),
            },
            {
                Header: "Status",
                accessor: "Label",
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: (props) => {
                    const rowIdx = props.row.id;
                    return (
                        <div>
                            <span onClick={() => openBooking(rowIdx)}>
                                <i className="far fa-edit action mr-2"></i>
                            </span>

                            <span onClick={() => deleteBooking(rowIdx)}>
                                <i className="fas fa-trash action"></i>
                            </span>
                        </div>
                    );
                },
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data: bookings,
    });

    return (
        <Container className="sheet padding-10mm">
            <Row>
                <Col xs={9}>
                    <h1>Bookings</h1>
                </Col>

                <Col className="justify-content-md-center">
                    <Button href="/createBooking/">
                        New Booking
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col xs={4}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name"
                        value={searchName}
                        onChange={onChangeSearchName}
                    />
                </Col>
                <Col md="auto">
                    <DropdownButton id="dropdown-item-button" title={dispStatusButton}>
                        <Dropdown.Item as="button" name="" onClick={onClickStatus}>-Any Status-</Dropdown.Item>
                        <Dropdown.Item as="button" name="1" onClick={onClickStatus}>Booked</Dropdown.Item>
                        <Dropdown.Item as="button" name="2" onClick={onClickStatus}>CheckedIn</Dropdown.Item>
                        <Dropdown.Item as="button" name="3" onClick={onClickStatus}>CheckedOut</Dropdown.Item>
                        <Dropdown.Item as="button" name="4" onClick={onClickStatus}>Canceled</Dropdown.Item>
                    </DropdownButton>
                </Col>

                <Col>
                    <Col md="auto">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={findBooking}
                        >
                            Search
                            </button>
                    </Col>
                </Col>

            </Row>
            <Row>
                <Col>
                    <table
                        className="table table-striped table-bordered text-center"
                        {...getTableProps()}
                    >
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th {...column.getHeaderProps()}>
                                            {column.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map((row, i) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map((cell) => {
                                            return (
                                                <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </Col>
            </Row>
            <Row>
                <Col>
                    <button className="btn btn-sm btn-danger"
                        onClick={
                            removeAllBookings
                        }
                    >
                        Remove All
                    </button>
                </Col>

            </Row>
        </Container>
    );
};

export default BookingsList;