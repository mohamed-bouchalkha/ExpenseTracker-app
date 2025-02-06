import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.1.11:5000/',
  headers: { 'Content-Type': 'application/json' },
});


export default API;
