import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import {
  Button,
  DropdownProps,
  Form,
  Placeholder,
  Table
} from "semantic-ui-react";

import { getUsers } from "../../services";

import "./styles.css";

import UsersTable from "../../components/UsersTable";
import UpdateModal from "../../components/UpdateModal";
import DeleteModal from "../../components/DeleteModal";

import type { Filters, User } from "../../types";
import { Link } from "react-router-dom";
import routes from "../../constants/routes";

type Response = {
  data: User[];
  headers: {
    "x-total-count": string;
  };
};

const sortOptions = [
  {
    key: "none",
    value: "",
    text: "Selecione uma opção para organizar..."
  },
  {
    key: "nome",
    value: "nome",
    text: "Nome"
  },
  {
    key: "email",
    value: "email",
    text: "Email"
  },
  {
    key: "cidade",
    value: "endereco.cidade",
    text: "Cidade"
  }
];

const orderOptions = [
  {
    key: "none",
    value: "",
    text: "Selecione uma opção para ordenar..."
  },
  {
    key: "asc",
    value: "asc",
    text: "Ordem alfabética (A-Z)"
  },
  {
    key: "desc",
    value: "desc",
    text: "Ordem alfabética decrescente (Z-A)"
  }
];

export default function List() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    order: "",
    sort: ""
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  function handleDelete(user: User) {
    setSelectedUser(user);
    setShowDeleteModal(true);
  }

  function handleUpdate(user: User) {
    setSelectedUser(user);
    setShowUpdateModal(true);
  }

  const fetchUsers = useCallback(
    (
      query: string = "",
      filters: Filters = {
        order: "",
        sort: ""
      }
    ) => {
      setIsLoading(true);

      getUsers(page, query, filters).then((response: Response) => {
        const maxPage = Math.ceil(
          parseInt(response.headers["x-total-count"]) / 10
        );

        if (maxPage === 1) {
          setPage(1);
        }

        setMaxPage(maxPage);
        setUsers(response.data);
        setTotalItems(parseInt(response.headers["x-total-count"]));
        setIsLoading(false);
      });
    },
    [page]
  );

  function handleChangeSelect(
    _ev: SyntheticEvent<HTMLElement, Event>,
    { value }: DropdownProps,
    prop: string
  ) {
    setFilters({ ...filters, [prop]: value });
  }

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    document.title = "uPanel | Listagem de usuários";
  }, []);

  return (
    <div id="list-page">
      <div className="container">
        <div className="filters-wrapper">
          <span className="filters-title">Filtros</span>
          <hr />
          <Form onSubmit={() => fetchUsers(searchValue, filters)}>
            <Form.Input
              width={16}
              placeholder="Pesquisar por nome, email, cidade..."
              icon="search"
              value={searchValue}
              onChange={ev => setSearchValue(ev.target.value)}
            />
            <Form.Group>
              <Form.Select
                width={8}
                options={sortOptions}
                placeholder="Selecione uma opção para organizar..."
                value={filters.sort}
                onChange={(ev, props) => handleChangeSelect(ev, props, "sort")}
              />
              <Form.Select
                width={8}
                options={orderOptions}
                placeholder="Selecione uma opção para ordenar..."
                value={filters.order}
                onChange={(ev, props) => handleChangeSelect(ev, props, "order")}
              />
            </Form.Group>
            <Form.Button
              primary
              width={16}
              content="Pesquisar"
              className="full-width-button"
              icon="search"
              type="submit"
            />
            <Form.Button
              width={16}
              content="Resetar filtros"
              className="full-width-button"
              icon="filter"
              type="button"
              onClick={() => {
                setSearchValue("");
                setFilters({
                  order: "",
                  sort: ""
                });
              }}
            />
          </Form>
        </div>
        <div className="list-wrapper">
          <span className="list-title">
            Usuários (exibindo {users.length} de {totalItems})
          </span>
          <hr />

          {isLoading ? (
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
                {Array.from({ length: 3 }).map((_, idx) => (
                  <Table.Row key={idx}>
                    <Table.Cell>
                      <Placeholder>
                        <Placeholder.Line />
                      </Placeholder>
                    </Table.Cell>
                    <Table.Cell>
                      <Placeholder>
                        <Placeholder.Line />
                      </Placeholder>
                    </Table.Cell>
                    <Table.Cell>
                      <Placeholder>
                        <Placeholder.Line />
                      </Placeholder>
                    </Table.Cell>
                    <Table.Cell>
                      <Placeholder>
                        <Placeholder.Line />
                      </Placeholder>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <button className="update-button">
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
                      <button className="delete-button">
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
          ) : (
            <UsersTable
              users={users}
              handleDelete={user => handleDelete(user)}
              handleUpdate={user => handleUpdate(user)}
            />
          )}

          <div className="pages-selector">
            <span className="pages-selector-title">Páginas</span>
            <div className="selectors-container">
              {Array.from({ length: maxPage }).map((_, idx) => (
                <button
                  className={page === idx + 1 ? "selector active" : "selector"}
                  onClick={() => setPage(idx + 1)}
                  key={idx}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
          <Button
            primary
            as={Link}
            to={routes.ADD_USER}
            content="Adicionar um novo usuário"
            className="full-width-button"
            size="huge"
            icon="arrow right"
            labelPosition="right"
            style={{
              marginTop: 64
            }}
          />
        </div>
      </div>
      {selectedUser && (
        <DeleteModal
          user={selectedUser!}
          open={showDeleteModal}
          onOpen={() => setShowDeleteModal(true)}
          onDelete={() => fetchUsers()}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedUser(null);
          }}
        />
      )}
      {selectedUser && (
        <UpdateModal
          user={selectedUser!}
          open={showUpdateModal}
          onOpen={() => setShowUpdateModal(true)}
          onUpdate={() => fetchUsers()}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}
