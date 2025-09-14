// src/services/AuthService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const register = (username, password) => {
  return axios.post(`${API_URL}/register`, { username, password });
};

export const login = (username, password) => {
  return axios.post(`${API_URL}/login`, { username, password });
};
