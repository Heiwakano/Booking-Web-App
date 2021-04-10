import React, { useState, useEffect, useMemo, useRef } from "react";
import RoomDataService from "../services/RoomDataService";
import { useTable } from "react-table";

import { Container, Row, Col, Button } from 'react-bootstrap';
const RoomsList = (props) => {
  const [rooms, setRooms] = useState([]);
  const [searchRoomNumber, setSearchRoomNumber] = useState("");
  const roomsRef = useRef();

  roomsRef.current = rooms;

  useEffect(() => {
    retrieveRooms();
  }, []);

  const onChangeSearchRoomNumber = (e) => {
    const searchRoomNumber = e.target.value;
    setSearchRoomNumber(searchRoomNumber);
  };

  const retrieveRooms = () => {
    RoomDataService.getAll()
      .then((response) => {
        console.log(response.data);
        setRooms(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveRooms();
  };

  const removeAllRooms = () => {
    RoomDataService.removeAll()
      .then((response) => {
        console.log(response.data);
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const findByRoomNumber = () => {
    RoomDataService.findByRoomNumber(searchRoomNumber)
      .then((response) => {
        setRooms(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const openRoom = (rowIndex) => {
    const id = roomsRef.current[rowIndex].id;

    props.history.push("/rooms/" + id);
  };

  const createRoom = () => {

    props.history.push("/createRoom");
  };

  const deleteRoom = (rowIndex) => {
    const id = roomsRef.current[rowIndex].id;

    RoomDataService.remove(id)
      .then((response) => {
        props.history.push("/rooms");

        let newRooms = [...roomsRef.current];
        newRooms.splice(rowIndex, 1);

        setRooms(newRooms);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const columns = useMemo(
    () => [
      {
        Header: "Room Number",
        accessor: "RoomNumber",
      },
      {
        Header: "Adults Capacity",
        accessor: "AdultsCapacity",
      },
      {
        Header: "Children Capacity",
        accessor: "ChildrenCapacity",
      },
      {
        Header: "Price",
        accessor: "Price",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
              <span onClick={() => openRoom(rowIdx)}>
                <i className="far fa-edit action mr-2"></i>
              </span>

              <span onClick={() => deleteRoom(rowIdx)}>
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
    data: rooms,
  });

  return (
    <Container className="sheet padding-10mm">
      <Row>
        <Col xs={9}>
          <h1>Rooms</h1>
        </Col>

        <Col className="justify-content-md-center">
          <Button href="/createRoom/">
            New Room
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by room number"
            value={searchRoomNumber}
            onChange={onChangeSearchRoomNumber}
          />
        </Col>
        <Col>
          <Col md="auto">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByRoomNumber}
            >
              Search
                            </button>
          </Col>
        </Col>
      </Row>
      <div className="col-md-12 list">
        <table
          className="table table-striped table-bordered"
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
      </div>

      <div className="col-md-8">
        <button className="btn btn-sm btn-danger"
          onClick={
            removeAllRooms
          }
        >
          Remove All
        </button>
      </div>
    </Container>
  );
};

export default RoomsList;