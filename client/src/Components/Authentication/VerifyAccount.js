import React, {useEffect, useState} from 'react';
import {Button,Col,Form,FormGroup,Input} from 'reactstrap';
import {Alert} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import { useHistory } from "react-router-dom";
import {validateToken} from '../../utils/regex';
import {apiVerify, apiToken, apiUser} from '../../utils/api';

function VerifyAccount(){
    const [email, setEmail] = useState('');
    const [h5, setH5] = useState('');
    const [p1, setP1] = useState('');
    const [p2, setP2] = useState('');
    const [alertVerify, setAlertVerify] = useState(false);
    const [alertMessageVerify, setAlertMessageVerify] = useState('');
    const [p1TagVerify,setp1TagVerify]=useState(p1);
    const [p2TagVerify,setp2TagVerify]=useState(p2);
    const [h5TagVerify,seth5TagVerify]=useState(h5);
    const [tokenVerify,setTokenVerify]=useState(false);
    const history = useHistory();
    const [token, setToken] = useState('');
    const [verified,setVerified] = useState(false);
    const [alertInvalidToken, setAlertInvalidToken] = useState(false);
    
    useEffect(async () => {
        const id = await sessionStorage.getItem('id')
        const user = await apiUser(id);
        console.log(user)
        const {first, email} = await user.data[0];
        setEmail(email);
        setH5(`Hello ${first.charAt(0).toUpperCase()+first.slice(1).toLowerCase()},`);
        setP1('Click below to recieve a validation code at:');
        setP2(`${email}`);
        seth5TagVerify(`Hello ${first.charAt(0).toUpperCase()+first.slice(1).toLowerCase()},`);
        setp1TagVerify('Click below to recieve a validation code at:');
        setp2TagVerify(`${email}`);
    },[]);
      
    const getNewToken = () => {
        setAlertVerify(false);
        setAlertInvalidToken(false);
        seth5TagVerify(h5);
        setTokenVerify(false);
        setp1TagVerify(p1);
        setp2TagVerify(p2);
        setToken('');
    };
    const alreadyHaveToken = () => {
        setAlertVerify(false);
        setAlertInvalidToken(false);
        seth5TagVerify('');
        setTokenVerify(true);
        setp1TagVerify('');
        setp2TagVerify('');
        setToken('');
    };

    async function handleVerify(){
        try{
            if (sessionStorage.getItem('id')){
                const payload = {"email":email}
                const data = await apiVerify(payload);
                setp1TagVerify(data.data.msg);
                setp2TagVerify('');
                seth5TagVerify('');
                setTokenVerify(true);
            } else {
                setAlertVerify(true);
                setAlertMessageVerify("You must login first");
            }  
          } catch (error){
                setAlertVerify(true);
                setAlertMessageVerify("Oops... Something Went Wrong");
          };
    };

    async function handleToken(){
        try{
            if (!token){
                setAlertVerify(true);
                setAlertMessageVerify("Please fill in all required fields");
            }
            if (sessionStorage.getItem('id')){
                const payload = {"token":token,"_userId":sessionStorage.getItem('id')}
                const data = await apiToken(payload);
                setp1TagVerify("Woohoo! Your email has been verified.");
                setp2TagVerify('');
                setVerified(true);
            } else {
                setAlertVerify(true);
                setAlertMessageVerify("You must login first");
            }  
          } catch (error){
              console.log(error);
            if (error.response.status === 401){
                setAlertInvalidToken(true);
            } else if (error.response.status === 402) {
                setAlertVerify(true);
                setAlertMessageVerify(error.response.data.msg);
            } else if (error.response.status === 403) {
                history.push(`/`);
            } else {
                setAlertVerify(true);
                setAlertMessageVerify("Oops... Something Went Wrong");
            }
          };
    };

    return <div>
            <div style = {{height:'5vh',display:'flex', alignItems:'center',justifyContent:'center'}}></div>
            <div style = {{height:'80vh',display:'flex', alignItems:'center',justifyContent:'center'}}>
            <div style = {{height:'80vh',width:'40vw',display:'flex', alignItems:'center',justifyContent:'center'}}>
              <Col>
                <Alert show={alertVerify} onClose={() => setAlertVerify(false)} dismissible transition={false}>
                {alertMessageVerify}
                </Alert>
                <Alert show={alertInvalidToken} onClose={() => setAlertInvalidToken(false)} dismissible transition={false}>
                    Your token is incorrect or expired. Please <Link to="/verify" onClick={()=>{getNewToken();}}>request a new token</Link> or try again.
                </Alert>
                <h5>{h5TagVerify}</h5>
                <p>{p1TagVerify}</p>
                <p><strong><em>{p2TagVerify}</em></strong></p>

                <Form hidden={!tokenVerify || verified} className="form" >
                    <FormGroup>
                        <Input
                            type="text"
                            name="token"
                            placeholder="Token"
                            value={token}
                            onChange={(e) => {setToken(e.target.value)}}
                            valid={validateToken(token)}
                            invalid={token.length > 0 && !validateToken(token)} 
                        />
                    </FormGroup> 
                </Form>
                <Button 
                    size="md"
                    hidden={tokenVerify}
                    disabled={!(email.length > 0)}
                    onClick={async () => {
                        setAlertVerify(false);
                        setAlertInvalidToken(false);
                        await handleVerify();
                    }}
                    > Send Me a Code
                </Button>
                <Button 
                    size="md"
                    hidden={!tokenVerify || verified}
                    onClick={async () => {
                        setAlertVerify(false);
                        setAlertInvalidToken(false);
                        await handleToken();
                    }}
                    disabled={!validateToken(token)}
                    > Confirm My Email
                </Button>
                <Button 
                    size="md"
                    hidden={!verified}
                    onClick={() => {history.push(`/strava-auth`);}}
                    > Connect to Strava
                </Button>
                <div></div>
                <Button
                    color="link"
                    size="sm"
                    hidden={tokenVerify}
                    onClick={()=>{alreadyHaveToken();}}
                > I already have a token</Button>
                <Button
                    color="link"
                    size="sm"
                    hidden={!tokenVerify || verified}
                    onClick={()=>{getNewToken();}}
                > I need a token</Button>
            </Col>
        </div>
    </div>
    </div>
};

export default VerifyAccount;