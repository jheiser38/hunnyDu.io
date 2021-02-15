import React, { useRef, useState, useContext } from 'react';
import { HunnyduContext } from './Context/index';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';


// Form used to send an email change request to a user's new desired email.
const ChangeEmailForm = (props) => {

  // Declare context api data.
  const {actions} = useContext(HunnyduContext);

  // Declare state variable for handling form validation.
  const [hasBeenValidated, setHasBeenValidated] = useState(false);

  // Declare form refs.
  const email = useRef();


  // Method to handle form submission.
  // Upon successful validation, user is redirected to '/'.
  const handleSubmit = (e) => {
    e.preventDefault();
    setHasBeenValidated(true);
    let form = e.currentTarget;
    // Validate that required fields contain data.
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      // Custom validation.
      if (!email.current.value.match('@') || !email.current.value.match('.')) {
        email.current.value = '';
        setHasBeenValidated(true);
        e.stopPropagation();
      }
      // No response data sent back to the user.
      actions.sendChangeEmailRequest(email.current.value);
      console.log('Email sent.')
      let path='/';
      props.history.push(path);
    }
  }


  // Return component jsx.
  return (
    <Container >
      <h1 className="pageTitle"> Enter your email address: </h1>
      <Form
      noValidate
      validated={hasBeenValidated}
      className="subtaskForm"
      onSubmit={handleSubmit}>
        <Form.Group as={Row}>
          <Col>
            <Form.Control
            required
            placeholder="Email"
            ref={email}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid email address.
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
        <Row>
          <Button variant="success" size="md" type={"submit"}>
            Send request
          </Button>
        </Row>
      </Form>
      <br />
    </Container>
  );
}


export default ChangeEmailForm;
