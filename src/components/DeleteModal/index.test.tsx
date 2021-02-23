import { render, screen } from "@testing-library/react";

import DeleteModal from ".";

const user = {
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
};

test("render user value on modal", async () => {
  render(
    <DeleteModal
      open={true}
      user={user}
      onDelete={() => {}}
      onClose={() => {}}
      onOpen={() => {}}
    />
  );

  const Username = await screen.findByText("Usuário 1");

  expect(Username).toBeInTheDocument();
});
