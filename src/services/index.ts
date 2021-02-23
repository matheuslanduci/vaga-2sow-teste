import jwt from "jsonwebtoken";

import { api, viacepAPI } from "./api";

import { Filters, User } from "../types";

type AuthResponse = {
  email: string;
  token: string;
};

const SECRET = "SUPER_SECRET_KEY";

export function signIn(email: string, password: string) {
  const token = jwt.sign({ email, password }, SECRET, { expiresIn: "1 day" });

  return new Promise<AuthResponse>(resolve => {
    resolve({
      email,
      token
    });
  });
}

export function getUsers(page: number, q: string, filters: Filters) {
  return api.get(
    `/usuarios?_page=${page}&limit=10&q=${q}&_sort=${filters.sort}&_order=${filters.order}`
  );
}

export function deleteUser(id: string) {
  return api.delete(`/usuarios/${id}`);
}

export function updateUser(user: User) {
  return api.put(`/usuarios/${user.id}`, {
    nome: user.nome,
    cpf: user.cpf,
    email: user.email,
    endereco: user.endereco
  });
}

export function getAddress(cep: string) {
  return viacepAPI.get(`/ws/${cep}/json/`);
}

export function createUser(user: User) {
  return api.post("/usuarios", user);
}
