import axios from 'axios';

export async function apiLogin(payload) {
    try { 
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/login`, payload);
        return res;
    } catch (error){
        console.log(error.response);
        throw error;
    }    
};

export async function apiRegister(payload) {
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/register`, payload);
        return res;
    } catch (error){
        console.log(error.response);
        throw error;
    }    
};

export async function apiUser(id) {
    try { 
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/${id}`);
        return res;
    } catch (error){
        console.log(error.response);
        throw error;
    }    
};

export async function apiVerify(payload) {
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/token/verify`, payload);
        return res;
    } catch (error){
        console.log(error.response);
        throw error;
    }    
};

export async function apiToken(payload) {
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/token`, payload);
        return res;
    } catch (error){
        console.log(error.response);
        throw error;
    }    
};