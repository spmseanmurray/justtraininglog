import React, {useState} from 'react';
import axios from 'axios'
import {Button,Col,Row,Form,FormGroup,Input,FormFeedback} from 'reactstrap';
import {Alert} from 'react-bootstrap'
import {Link} from 'react-router-dom';
import {getUser,login,getIsVerified,logout} from '../../utils/common';
import {validatePassword,validateEmail,validatePasswordLiteral} from '../../utils/regex';
import { useHistory } from "react-router-dom";

function Register(){
  const [emailRegister, setEmailRegister] = useState('');
  const [passwordRegister, setPasswordRegister] = useState('');
  const [passwordConfirmRegister, setPasswordConfirmRegister] = useState('');
  const [firstNameRegister, setFirstNameRegister] = useState('');
  const [lastNameRegister, setLastNameRegister] = useState('');
  const [alertRegister, setAlertRegister] = useState(false);
  const [alertMessageRegister, setAlertMessageRegister] = useState('');
  const [alertAlreadyLoggedIn, setAlertAlreadyLoggedIn] = useState(false);
  const history = useHistory();

  const dismissAlerts= () => {
    setAlertMessageRegister('');
    setAlertAlreadyLoggedIn(false);
    setAlertRegister(false);
  };

  async function handleRegister(){
    try{
      dismissAlerts();
      if (!emailRegister||!passwordRegister||!passwordConfirmRegister||!firstNameRegister||!lastNameRegister){
        dismissAlerts();
        setAlertRegister(true);
        setAlertMessageRegister("Please fill in all required fields");
      } else {
        if (!getUser()){
          const payload = {
            "email":emailRegister,
            "password":passwordRegister,
            "first":firstNameRegister,
            "last":lastNameRegister,
          };
          let data = {};
          console.log(payload);
          try {
            data = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/register`, payload);
          } catch (err) {console.error(err.message)}

          login(data.data.user,data.data.user.isVerified);
          if(!getIsVerified()){
            history.push('/verify');
          } else {
            history.push(`/`);
          }
        } else {
          dismissAlerts();
          setAlertAlreadyLoggedIn(true);
        }
    }
    } catch (error){
      if (error.response.status === 401){
        dismissAlerts();
        setAlertRegister(true);
        setAlertMessageRegister(error.response.data.msg);
      } else {
        dismissAlerts();
        setAlertRegister(true);
        setAlertMessageRegister("Oops... Something Went Wrong");
      } 
    };
  };
  
  return <div>
    <div style = {{height:'5vh',display:'flex', alignItems:'center',justifyContent:'center'}}></div>
    <div style = {{height:'80vh',display:'flex', alignItems:'center',justifyContent:'center'}}>
      <div style = {{height:'80vh',width:'40vw',display:'flex', alignItems:'center',justifyContent:'center'}}>
        <Col>
        <Alert show={alertRegister} onClose={() => setAlertRegister(false)} dismissible transition={false}>
          {alertMessageRegister}
        </Alert>
        <Alert show={alertAlreadyLoggedIn} onClose={() => setAlertAlreadyLoggedIn(false)} dismissible transition={false}>
                Please <Link to="/auth" onClick={()=>{setAlertAlreadyLoggedIn(false);logout()}}>Logout</Link>
        </Alert>
        <Form className="form">
          <FormGroup>
            <Input
                  type="email"
                  name="Email"
                  placeholder="Email"
                  onChange={(e) => setEmailRegister(e.target.value)}
                  valid={emailRegister.length !== 0 && validateEmail(emailRegister)}
                  invalid={emailRegister.length > 0 && !validateEmail(emailRegister)}
                />
                <FormFeedback>
                  There is an issue with your email. Please input a correct email.
                </FormFeedback>
          </FormGroup>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Input
                      type="text"
                      name="firstnameRegister"
                      placeholder="First Name"
                      invalid={firstNameRegister.length > 0 && /[^a-zA-Z]/.test(firstNameRegister)}
                      valid={firstNameRegister.length !== 0 && !/[^a-zA-Z]/.test(firstNameRegister)}
                      onChange={(e) => setFirstNameRegister(e.target.value)}
                    />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                    <Input
                      type="text"
                      name="lastnameRegister"
                      placeholder="Last Name"
                      invalid={lastNameRegister.length > 0 && /[^a-zA-Z]/.test(lastNameRegister)}
                      valid={lastNameRegister.length !== 0 && !/[^a-zA-Z]/.test(lastNameRegister)}
                      onChange={(e) => setLastNameRegister(e.target.value)}
                    />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Input
                    type="password" 
                    name="passwordRegister"
                    placeholder="Password"
                    invalid={passwordRegister.length > 0 && !validatePassword(passwordRegister)} 
                    valid={validatePassword(passwordRegister)}
                    onChange={(e) => setPasswordRegister(e.target.value)}
                  />
                  <FormFeedback>
                      {validatePasswordLiteral(passwordRegister)}
                  </FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Input
                    type="password" 
                    name="passwordConfirm" 
                    placeholder="Confirm Password" 
                    invalid={passwordConfirmRegister.length > 0 && (!validatePassword(passwordConfirmRegister) || (passwordRegister)!==(passwordConfirmRegister))} 
                    valid={(passwordRegister)===(passwordConfirmRegister) && validatePassword(passwordConfirmRegister)}
                    onChange={(e) => {setPasswordConfirmRegister(e.target.value);}}
                  />
                  <FormFeedback>
                      Passwords do not match
                  </FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <Button 
              size="lg" 
              type="submit"
              disabled={
                !((passwordRegister)===(passwordConfirmRegister) && validatePassword(passwordConfirmRegister))
                ||!(validateEmail(emailRegister))
                ||!(emailRegister.length > 0)
                ||!(lastNameRegister.length !== 0 && !/[^a-zA-Z]/.test(lastNameRegister))
                ||!(firstNameRegister.length !== 0 && !/[^a-zA-Z]/.test(firstNameRegister))} 
              onClick={async (e) => {
                e.preventDefault();
                dismissAlerts();
                await handleRegister();
                }}>
                Register
            </Button> 
        </Form>
        <Button color="link" onClick={()=>{history.push('/login')}}>Already have an account?</Button>
      </Col> 
      </div>
    </div> 
  </div>
};

export default Register;

