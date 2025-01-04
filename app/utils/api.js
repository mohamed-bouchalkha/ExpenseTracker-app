import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.209.24:5000/',
  headers: { 'Content-Type': 'application/json' },
});

export default API;
