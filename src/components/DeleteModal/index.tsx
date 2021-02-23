import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Modal } from "semantic-ui-react";

import { deleteUser } from "../../services";

import type { User } from "../../types";

type Props = {
  user: User;
  open: boolean;
  onOpen(): void;
  onDelete(): void;
  onClose(): void;
};

export default function DeleteModal({
  user,
  open,
  onOpen,
  onDelete,
  onClose
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleClickDelete() {
    setIsLoading(true);

    deleteUser(user.id)
      .then(() => {
        setIsLoading(false);
        onDelete();
        onClose();
      })
      .catch(() => {
        toast.error(
          "Erro! Não foi possível excluir o usuário. Atualize a página.",
          {
            position: "top-left"
          }
        );
      });
  }

  return (
    <Modal open={open} onOpen={onOpen} onClose={onClose}>
      <Modal.Header>Excluir este usuário</Modal.Header>
      <Modal.Content>
        Você tem certeza que deseja excluir o usuário{" "}
        <span style={{ fontWeight: 700 }}>{user.nome}</span>?
      </Modal.Content>
      <Modal.Actions>
        <Button content="Cancelar" onClick={onClose} />
        <Button
          color="red"
          content="Sim, excluir este usuário"
          labelPosition="right"
          icon="trash"
          onClick={handleClickDelete}
          loading={isLoading}
        />
      </Modal.Actions>
    </Modal>
  );
}
