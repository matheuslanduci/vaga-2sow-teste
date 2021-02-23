import { ChangeEvent, KeyboardEvent, useState } from "react";
import { Button, Divider, Form, Modal } from "semantic-ui-react";
import { toast } from "react-toastify";
import InputMask from "react-input-mask";
import * as EmailValidator from "email-validator";

import { getAddress, updateUser } from "../../services";
import { SanitizeCEP, SanitizeCPF } from "../../utils";

import type { User, Error } from "../../types";

type UpdateFormValues = {
  nome: string;
  cpf: string;
  email: string;
  endereco: {
    cep: string;
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
  };
};

type Props = {
  user: User;
  open: boolean;
  onOpen(): void;
  onUpdate(): void;
  onClose(): void;
};

type ErrorState = {
  nome: Error | null;
  email: Error | null;
  cpf: Error | null;
  cep: Error | null;
  bairro: Error | null;
  cidade: Error | null;
  numero: Error | null;
  rua: Error | null;
};

export default function UpdateModal({
  user,
  open,
  onOpen,
  onClose,
  onUpdate
}: Props) {
  const [values, setValues] = useState<UpdateFormValues>({
    nome: user.nome,
    cpf: user.cpf,
    email: user.email,
    endereco: {
      bairro: user.endereco.bairro,
      cep: user.endereco.cep.toString(),
      cidade: user.endereco.cidade,
      numero: user.endereco.numero.toString(),
      rua: user.endereco.rua
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingCEP, setIsLoadingCEP] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorState>({
    nome: null,
    email: null,
    cpf: null,
    cep: null,
    bairro: null,
    cidade: null,
    numero: null,
    rua: null
  });

  function handleChange(
    ev: ChangeEvent<HTMLInputElement>,
    prop: "nome" | "email" | "cpf"
  ) {
    setErrors({ ...errors, [prop]: null });

    setValues({ ...values, [prop]: ev.target.value });
  }

  function handleChangeAddress(
    ev: ChangeEvent<HTMLInputElement>,
    prop: "cep" | "cidade" | "bairro" | "numero" | "rua"
  ) {
    if (prop === "cep") {
      const sanitizedCEP = SanitizeCEP(ev.target.value);

      if (sanitizedCEP.length === 8) {
        setIsLoadingCEP(true);

        getAddress(sanitizedCEP).then(response => {
          if (response.data.erro) {
            notifyWarn(
              "Não foi encontrado uma rua válida com este CEP. Tente novamente."
            );
          } else {
            setValues({
              ...values,
              endereco: {
                ...values.endereco,
                bairro: response.data.bairro,
                rua: response.data.logradouro,
                cidade: response.data.localidade,
                cep: response.data.cep
              }
            });
            document
              .querySelector<HTMLInputElement>("#numero-update-input")
              ?.focus()!;
            setIsLoadingCEP(false);
          }
        });
      }
    }
    setErrors({ ...errors, [prop]: null });
    setValues({
      ...values,
      endereco: { ...values.endereco, [prop]: ev.target.value }
    });
  }

  function handleClickUpdate() {
    setIsLoading(true);

    if (values.nome.length === 0) {
      setErrors({
        ...errors,
        nome: { content: "Esse campo é obrigatório", pointing: "below" }
      });
      notifyError("O campo NOME é obrigatório!");
      document.querySelector<HTMLInputElement>("#nome-update-input")?.focus()!;
      return setIsLoading(false);
    }

    if (values.email.length === 0) {
      setErrors({
        ...errors,
        email: { content: "Esse campo é obrigatório", pointing: "below" }
      });
      notifyError("O campo EMAIL é obrigatório!");
      document.querySelector<HTMLInputElement>("#email-update-input")?.focus()!;
      return setIsLoading(false);
    }

    if (!EmailValidator.validate(values.email)) {
      setErrors({
        ...errors,
        email: { content: "Insira um email válido.", pointing: "below" }
      });
      notifyError("O campo EMAIL é inválido!");
      document.querySelector<HTMLInputElement>("#email-update-input")?.focus()!;
      return setIsLoading(false);
    }

    if (SanitizeCPF(values.cpf).length !== 11) {
      setErrors({
        ...errors,
        cpf: { content: "Esse campo é obrigatório", pointing: "below" }
      });
      notifyError("O campo CPF é obrigatório!");
      document.querySelector<HTMLInputElement>("#cpf-update-input")?.focus()!;
      return setIsLoading(false);
    }

    if (SanitizeCEP(values.endereco.cep).length !== 8) {
      setErrors({
        ...errors,
        cep: { content: "Esse campo é obrigatório", pointing: "below" }
      });
      notifyError("O campo CEP é obrigatório!");
      document.querySelector<HTMLInputElement>("#cep-update-input")?.focus()!;
      return setIsLoading(false);
    }

    if (values.endereco.cidade.length === 0) {
      setErrors({
        ...errors,
        cidade: { content: "Esse campo é obrigatório", pointing: "below" }
      });
      notifyError("O campo CIDADE é obrigatório!");
      document
        .querySelector<HTMLInputElement>("#cidade-update-input")
        ?.focus()!;
      return setIsLoading(false);
    }

    if (values.endereco.bairro.length === 0) {
      setErrors({
        ...errors,
        bairro: { content: "Esse campo é obrigatório", pointing: "below" }
      });
      notifyError("O campo BAIRRO é obrigatório!");
      document
        .querySelector<HTMLInputElement>("#bairro-update-input")
        ?.focus()!;
      return setIsLoading(false);
    }

    if (values.endereco.rua.length === 0) {
      setErrors({
        ...errors,
        rua: { content: "Esse campo é obrigatório", pointing: "below" }
      });
      notifyError("O campo RUA é obrigatório!");
      document.querySelector<HTMLInputElement>("#rua-update-input")?.focus()!;
      return setIsLoading(false);
    }

    if (values.endereco.numero.length === 0) {
      setErrors({
        ...errors,
        numero: { content: "Esse campo é obrigatório", pointing: "below" }
      });
      notifyError("O campo NÚMERO é obrigatório!");
      document
        .querySelector<HTMLInputElement>("#numero-update-input")
        ?.focus()!;
      return setIsLoading(false);
    }

    updateUser({
      id: user.id!,
      nome: values.nome,
      cpf: values.cpf,
      email: values.email,
      endereco: {
        bairro: values.endereco.bairro,
        cep: parseInt(SanitizeCEP(values.endereco.cep)),
        cidade: values.endereco.cidade,
        rua: values.endereco.rua,
        numero: parseInt(values.endereco.numero)
      }
    })
      .then(() => {
        setIsLoading(false);
        onUpdate();
        onClose();
      })
      .catch(() => {
        notifyError(
          "Erro! Não foi possível atualizar o usuário. Atualize a página."
        );
      });
  }

  function handleKeyDown(ev: KeyboardEvent<HTMLInputElement>) {
    if (ev.key === "Enter") {
      document
        .querySelector<HTMLButtonElement>("#submit-form-button")
        ?.click()!;
    }
  }

  function notifyError(message: string) {
    toast.error(message, { position: "top-left" });
  }

  function notifyWarn(message: string) {
    toast.warn(message, { position: "top-left" });
  }

  return (
    <Modal open={open} onOpen={onOpen} onClose={onClose}>
      <Modal.Header>Atualizar este usuário</Modal.Header>
      <Modal.Content>
        <Form loading={isLoading}>
          <Form.Input
            label="Nome"
            placeholder="Insira um novo nome aqui..."
            value={values.nome}
            onChange={ev => handleChange(ev, "nome")}
            width={8}
            required
            id="nome-update-input"
            error={errors.nome}
          />
          <Form.Input
            label="Email"
            placeholder="Insira um novo email aqui..."
            value={values.email}
            onChange={ev => handleChange(ev, "email")}
            width={8}
            required
            id="email-update-input"
            error={errors.email}
          />
          <Form.Field width={4} required error={errors.cpf}>
            <label>CPF</label>
            <Form.Input
              placeholder="Insira um novo CPF aqui..."
              as={InputMask}
              mask="999.999.999.99"
              value={values.cpf}
              onChange={ev => handleChange(ev, "cpf")}
              id="cpf-update-input"
            />
          </Form.Field>
          <Divider />
          <Form.Group>
            <Form.Field width={4} required error={errors.cep}>
              <label>CEP</label>
              <Form.Input
                placeholder="Insira um novo CEP aqui..."
                as={InputMask}
                mask="99999-999"
                value={values.endereco.cep}
                onChange={ev => handleChangeAddress(ev, "cep")}
                id="cep-update-input"
                loading={isLoadingCEP}
              />
            </Form.Field>
            <Form.Input
              placeholder="Insira uma nova cidade aqui..."
              value={values.endereco.cidade}
              onChange={ev => handleChangeAddress(ev, "cidade")}
              label="Cidade"
              width={4}
              required
              id="cidade-update-input"
              error={errors.cidade}
              loading={isLoadingCEP}
            />
            <Form.Input
              placeholder="Insira um novo bairro aqui..."
              value={values.endereco.bairro}
              onChange={ev => handleChangeAddress(ev, "bairro")}
              label="Bairro"
              width={8}
              required
              id="bairro-update-input"
              error={errors.bairro}
              loading={isLoadingCEP}
            />
          </Form.Group>
          <Form.Group>
            <Form.Input
              placeholder="Insira uma nova rua aqui..."
              value={values.endereco.rua}
              onChange={ev => handleChangeAddress(ev, "rua")}
              label="Rua"
              width={12}
              required
              id="rua-update-input"
              error={errors.rua}
              loading={isLoadingCEP}
            />
            <Form.Input
              placeholder="Insira um novo número aqui..."
              value={values.endereco.numero}
              onChange={ev => handleChangeAddress(ev, "numero")}
              label="Número"
              width={4}
              onKeyDown={handleKeyDown}
              required
              id="numero-update-input"
              error={errors.numero}
              loading={isLoadingCEP}
            />
          </Form.Group>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button content="Cancelar" onClick={onClose} />
        <Button
          id="submit-form-button"
          positive
          loading={isLoading}
          content="Sim, atualizar este usuário"
          labelPosition="right"
          icon="check"
          onClick={handleClickUpdate}
        />
      </Modal.Actions>
    </Modal>
  );
}
