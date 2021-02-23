import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000"
});

export const viacepAPI = axios.create({
  baseURL: "https://viacep.com.br/"
});
