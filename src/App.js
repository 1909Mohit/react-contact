import React, { useState, useEffect } from 'react';
import { Table, Container, Row, Col, Button, ButtonGroup, Form, Navbar } from 'react-bootstrap';
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import './App.css';

// const api = "http://localhost:5000/users";

const initialState = {
  name: "",
  email: "",
  contact: "",
  address: "",
}

function App() {
  const [state, setState] = useState(initialState);
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const { name, email, contact, address } = state;

  useEffect(() => {
    loadUsers();
  }, [])
     
  const devEnv = process.env.NODE_ENV !== "production";
  const {REACT_APP_DEV_URL, REACT_APP_PROD_URL} = process.env;
  const api = devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL;
  const loadUsers = async () => { 
    const response = await axios.get(api);
    setData(response.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you wanted to delete that user ?")) {
      axios.delete(`${api}/${id}`);
      toast.success("Deleted Successfully");
      setTimeout(() => loadUsers(), 500);
    }
  }

  const handleUpdate = (id) => {
    const singleUser = data.find((item) => item.id === id);
    setState({ ...singleUser });
    console.log(id)
    setUserId(id); 
    setEditMode(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !address || !email || !contact) {
      toast.error("Please fill all input field");
    }
    else {
      if (!editMode) {
        axios.post(api, state);
        toast.success("Added Successfully");
        setState({ name: "", email: "", contact: "", address: "" });
        setTimeout(() => loadUsers(), 500) ;
      }
      else {
        axios.put(`${api}/${userId}`, state);
        toast.success("Updated Successfully");
        setState({ name: "", email: "", contact: "", address: "" });
        setTimeout(() => loadUsers(), 500);
        setUserId(null);
        setEditMode(false); 
      }   
    }
  }

  return (
    <>
      <ToastContainer />
      <Navbar bg='primary' variant='dark' className='justify-content-center'>
        <Navbar.Brand>
          Contacts Store
        </Navbar.Brand>
      </Navbar>
      <Container style={{marginTop:'70px'}}>
        <Row>
          <Col md={4}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className='mb-3'>
                <Form.Label for='name' style={{ textAlign: 'left' }}>Name</Form.Label>
                <Form.Control id='name' type='text' placeholder='Enter Name' name='name' value={name} onChange={handleChange}></Form.Control>
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Label for='email' style={{ textAlign: 'left' }}>Email</Form.Label>
                <Form.Control id='email' type='email' placeholder='Enter Email' name='email' value={email} onChange={handleChange}></Form.Control>
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Label for='contact' style={{ textAlign: 'left' }}>Contact</Form.Label>
                <Form.Control id='contact' type='text' placeholder='Enter Contact' name='contact' value={contact} onChange={handleChange}></Form.Control>
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Label for='address' style={{ textAlign: 'left' }}>Address</Form.Label>
                <Form.Control id='address' type='text' placeholder='Enter Address' name='address' value={address} onChange={handleChange}></Form.Control>
              </Form.Group>
              <div className='d-grid gap-2 mt-2'>
                <Button type='submit' variant='primary' size='md'>Submit</Button>
              </div>
            </Form>
          </Col>
          <Col md={8}>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>Action</th>
                </tr>
              </thead>
              {data && data.map((item, index) => (
                <tbody key={index}>
                  <tr>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.contact}</td>
                    <td>{item.address}</td>
                    <td>
                      <ButtonGroup>
                        <Button style={{ marginRight: '5px' }} variant="secondary" onClick={() => handleUpdate(item.id)}>
                          Update
                        </Button>
                        <Button style={{ marginRight: '5px' }} variant="danger" onClick={() => handleDelete(item.id)}>
                          Delete
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                </tbody>
              ))}
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
