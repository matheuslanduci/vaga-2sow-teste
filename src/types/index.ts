export type User = {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  endereco: {
    cep: number;
    rua: string;
    numero: number;
    bairro: string;
    cidade: string;
  };
};

export type Filters = {
  sort: string;
  order: string;
};

export type Error = {
  content: string;
  pointing: "below";
};
