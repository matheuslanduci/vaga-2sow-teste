import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Divider, Form } from "semantic-ui-react";
import InputMask from "react-input-mask";
import * as EmailValidator from "email-validator";
import { v4 } from "uuid";

import { getAddress, createUser } from "../../services";
import { SanitizeCEP, SanitizeCPF } from "../../utils";
import routes from "../../constants/routes";

import "./styles.css";

import type { Error } from "../../types";

type FormValues = {
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

export default function AddUser() {
  const [values, setValues] = useState<FormValues>({
    nome: "",
    cpf: "",
    email: "",
    endereco: {
      bairro: "",
      cep: "",
      cidade: "",
      numero: "",
      rua: ""
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

  function handleSubmit() {
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

    createUser({
      id: v4(),
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
        notifySuccess("Usuário cadastrado com sucesso!");
        handleResetForm();
      })
      .catch(() => {
        notifyError(
          "Erro! Não foi possível atualizar o usuário. Atualize a página."
        );
      });
  }

  function handleResetForm() {
    setValues({
      nome: "",
      cpf: "",
      email: "",
      endereco: {
        bairro: "",
        cep: "",
        cidade: "",
        numero: "",
        rua: ""
      }
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

  function notifySuccess(message: string) {
    toast.success(message, { position: "top-left" });
  }

  useEffect(() => {
    document.title = "uPanel | Adicionar usuário";
  }, []);

  return (
    <div id="add-user-page">
      <div className="container">
        <div className="form-wrapper">
          <div className="form-container">
            <Form loading={isLoading}>
              <Form.Input
                label="Nome"
                placeholder="Insira um nome aqui..."
                value={values.nome}
                onChange={ev => handleChange(ev, "nome")}
                width={16}
                required
                id="nome-update-input"
                error={errors.nome}
              />
              <Form.Input
                label="Email"
                placeholder="Insira um email aqui..."
                value={values.email}
                onChange={ev => handleChange(ev, "email")}
                width={16}
                required
                id="email-update-input"
                error={errors.email}
              />
              <Form.Field width={16} required error={errors.cpf}>
                <label>CPF</label>
                <Form.Input
                  placeholder="Insira um CPF aqui..."
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
                    placeholder="Insira um CEP aqui..."
                    as={InputMask}
                    mask="99999-999"
                    value={values.endereco.cep}
                    onChange={ev => handleChangeAddress(ev, "cep")}
                    required
                    id="cep-update-input"
                    loading={isLoadingCEP}
                  />
                </Form.Field>
                <Form.Input
                  placeholder="Insira uma cidade aqui..."
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
                  placeholder="Insira um bairro aqui..."
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
                  placeholder="Insira uma rua aqui..."
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
                  placeholder="Insira um número aqui..."
                  value={values.endereco.numero}
                  onChange={ev => handleChangeAddress(ev, "numero")}
                  label="Número"
                  width={4}
                  required
                  id="numero-update-input"
                  error={errors.numero}
                  loading={isLoadingCEP}
                  onKeyDown={handleKeyDown}
                />
              </Form.Group>
              <Form.Button
                type="button"
                content="Adicionar"
                positive
                className="full-width-button"
                id="submit-form-button"
                onClick={handleSubmit}
                loading={isLoading}
                style={{
                  marginTop: 32
                }}
              />
              <Form.Button
                type="button"
                content="Limpar"
                className="full-width-button"
                onClick={handleResetForm}
              />
            </Form>
            <Button
              primary
              as={Link}
              to={routes.HOME}
              content="Listar os usuários"
              className="full-width-button"
              size="huge"
              icon="arrow left"
              labelPosition="left"
              style={{
                marginTop: 64
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
