import { render, screen } from "@testing-library/react";

import UsersTable from ".";

const mockData = [
  {
    nome: "Usuário 1",
    cpf: "123.456.789.01",
    email: "usuario1@gmaill.com",
    endereco: {
      bairro: "Centro",
      cep: 76963846,
      cidade: "Cacoal",
      rua: "Avenida Porto Velho",
      numero: 222
    },
    id: "89ef5210-3032-4be9-be22-32081b705330"
  },
  {
    nome: "Usuário 2",
    cpf: "123.456.789.02",
    email: "usuario2@gmaill.com",
    endereco: {
      bairro: "Jardim Santa Cecília",
      cep: 18078110,
      cidade: "Sorocaba",
      rua: "Rua Victor Alfarano",
      numero: 222
    },
    id: "8ae6496a-3b0d-4586-a0ae-1afc1d259f01"
  }
];

test("table generates data", async () => {
  render(
    <UsersTable
      users={mockData}
      handleDelete={() => {}}
      handleUpdate={() => {}}
    />
  );

  const mockedUserOne = await screen.findByText("Usuário 1");
  const mockedUserTwo = await screen.findByText("Usuário 2");

  expect(mockedUserOne).toBeInTheDocument();
  expect(mockedUserTwo).toBeInTheDocument();
});
