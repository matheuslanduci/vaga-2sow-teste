import { Table } from "semantic-ui-react";
import { User } from "../../types";

type Props = {
  users: User[];
  handleUpdate(user: User): void;
  handleDelete(user: User): void;
};

export default function UsersTable({
  users,
  handleUpdate,
  handleDelete
}: Props) {
  return (
    <Table className="table-wrapper" celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell width={4}>Nome</Table.HeaderCell>
          <Table.HeaderCell width={2}>CPF</Table.HeaderCell>
          <Table.HeaderCell width={4}>Email</Table.HeaderCell>
          <Table.HeaderCell>Cidade</Table.HeaderCell>
          <Table.HeaderCell width={1}>Atualizar</Table.HeaderCell>
          <Table.HeaderCell width={1}>Excluir</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {users.map(user => (
          <Table.Row key={user.id}>
            <Table.Cell>{user.nome}</Table.Cell>
            <Table.Cell>{user.cpf}</Table.Cell>
            <Table.Cell>{user.email}</Table.Cell>
            <Table.Cell>{user.endereco.cidade}</Table.Cell>
            <Table.Cell textAlign="center">
              <button
                className="update-button"
                onClick={() => handleUpdate(user)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M13.628,4.371l6,6L6.6,23.4l-5.35.591A1.125,1.125,0,0,1,.006,22.751L.6,17.4,13.628,4.371Zm9.713-.893L20.523.66a2.251,2.251,0,0,0-3.183,0L14.689,3.311l6,6,2.651-2.651a2.251,2.251,0,0,0,0-3.183Z"
                    fill="#fff"
                  />
                </svg>
              </button>
            </Table.Cell>
            <Table.Cell textAlign="center">
              <button
                className="delete-button"
                onClick={() => handleDelete(user)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="24"
                  viewBox="0 0 21 24"
                >
                  <path
                    d="M20.25,1.5H14.625L14.184.623A1.125,1.125,0,0,0,13.177,0H7.819a1.112,1.112,0,0,0-1,.623L6.375,1.5H.75A.75.75,0,0,0,0,2.25v1.5a.75.75,0,0,0,.75.75h19.5A.75.75,0,0,0,21,3.75V2.25A.75.75,0,0,0,20.25,1.5ZM2.494,21.891A2.25,2.25,0,0,0,4.739,24H16.261a2.25,2.25,0,0,0,2.245-2.109L19.5,6H1.5Z"
                    transform="translate(0 0)"
                    fill="#fff"
                  />
                </svg>
              </button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
