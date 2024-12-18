import axios from 'axios';

const API = axios.create({
  // replace (localhost) by ur laptop ip adress here for phone simulator
  baseURL: 'http://192.168.1.6:5000/api/auth', 
  headers: { 'Content-Type': 'application/json' },
});

export default API;
