import axios from 'axios';

const api = axios.create({
  baseURL: 'http://20.191.152.89:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
