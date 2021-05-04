import React, {useState} from 'react';
import {Button,Col,Form, FormGroup,FormFeedback,Input} from 'reactstrap';
import {Alert} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {useHistory} from "react-router-dom";
import {login,logout} from '../../utils/common';
import {validateEmail} from '../../utils/regex';
import {apiLogin} from '../../utils/api';

function Login(){
    const [emailLogin, setEmailLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');
    const [alertLogin, setAlertLogin] = useState(false);
    const [alertInvalidLoginCreds, setAlertInvalidLoginCreds] = useState(false);
    const [alertAlreadyLoggedIn, setAlertAlreadyLoggedIn] = useState(false);
    const [alertMessageLogin, setAlertMessageLogin] = useState('');
    const history = useHistory();

    const dismissAlerts= () => {
        setAlertLogin(false);
        setAlertAlreadyLoggedIn(false);
        setAlertInvalidLoginCreds(false);
        setAlertMessageLogin('');
    };

    async function handleLogin(){
    try{
      if (!emailLogin||!passwordLogin){
        dismissAlerts();
        setAlertLogin(true);
        setAlertMessageLogin("Please fill in all required fields");
      } else {
        if (!sessionStorage.getItem('id')){
          const payload = {"email":emailLogin,"password":passwordLogin}
          const data = await apiLogin(payload);
          login(data.data.user._id);
          console.log(sessionStorage.getItem('id'))
          if(!data.data.user.isVerified){
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
      console.log(error);
      if (error.response.status === 401){
        dismissAlerts();
        setAlertInvalidLoginCreds(true);
      } else {
        dismissAlerts();
        setAlertLogin(true);
        setAlertMessageLogin("Oops... Something Went Wrong");
      } 
    };
    };
  
    return <div className="Login" data-testid="Login"> 
        <div style = {{height:'5vh',display:'flex', alignItems:'center',justifyContent:'center'}}></div>
        <div style = {{height:'80vh',display:'flex', alignItems:'center',justifyContent:'center'}}>
        <div style = {{height:'80vh',width:'40vw',display:'flex', alignItems:'center',justifyContent:'center'}}>
        <Col>
            <Alert data-testid="login-alert-incomplete-creds" show={alertLogin} onClose={() => setAlertLogin(false)} dismissible transition={false}>
                {alertMessageLogin}
            </Alert>
            <Alert data-testid="login-alert-invalid-creds" show={alertInvalidLoginCreds} onClose={() => setAlertInvalidLoginCreds(false)} dismissible transition={false}>
                We can't find that username and password.
            </Alert>
            <Alert data-testid="login-alert-3" show={alertAlreadyLoggedIn} onClose={() => setAlertAlreadyLoggedIn(false)} dismissible transition={false}>
                Please <Link to="/auth" onClick={()=>{setAlertAlreadyLoggedIn(false);logout()}}>Logout</Link>
            </Alert>
              <Form className="form">
                <FormGroup>
                  <Input
                    data-testid="login-email-input"
                    type="email"
                    name="Email"
                    placeholder="Email"
                    onChange={(e) => setEmailLogin(e.target.value)}
                    valid={ validateEmail(emailLogin) }
                    invalid={ emailLogin.length > 0 && !validateEmail(emailLogin)}
                    value={emailLogin}
                  />
                  <FormFeedback data-testid="login-form-feedback">
                      There is an issue with your email. Please input a correct email.
                  </FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Input
                      data-testid="login-password-input"
                      type="password"
                      name="passwordLogin"
                      placeholder="Password"
                      onChange={(e) => setPasswordLogin(e.target.value)}
                      value={passwordLogin}
                  />
                </FormGroup>
                </Form>
                <Button
                  data-testid="login-button"
                  size="lg"
                  type="submit"
                  disabled={
                    !(validateEmail(emailLogin))
                    ||!(emailLogin.length > 0)} 
                  onClick={async (e) => {
                    e.preventDefault();
                    dismissAlerts();
                    await handleLogin();
                  }}> Sign In</Button>
              <br/>
                Don't Have an Account?
              <Link style={{marginLeft:'1vw'}} onClick={()=>{history.push('/register')}}>Sign Up Now</Link>
              <br/>
              <Link onClick={()=>{history.push('/recover')}}>Forgot Password?</Link>
          </Col>  
          </div>
        </div>
  </div>
};
export default Login;