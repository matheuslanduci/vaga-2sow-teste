import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Form } from "semantic-ui-react";
import * as EmailValidator from "email-validator";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/Auth";

import "./styles.css";

import asset from "./assets/main-login-asset.svg";

import { Error } from "../../types";

type FormValues = {
  email: string;
  password: string;
};

type ErrorState = {
  email: Error | null;
  password: Error | null;
};

export default function Login() {
  const [values, setValues] = useState<FormValues>(() => {
    const data = localStorage.getItem("USER_DATA");

    if (data) {
      const { email, password } = JSON.parse(data);

      return {
        email,
        password
      };
    } else {
      return {
        email: "",
        password: ""
      };
    }
  });
  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    const data = localStorage.getItem("USER_DATA");

    if (data) {
      return true;
    } else {
      return false;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorState>({
    email: null,
    password: null
  });
  const { Authenticate } = useAuth();

  function handleChange(
    ev: ChangeEvent<HTMLInputElement>,
    prop: "email" | "password"
  ) {
    if (errors[prop]) {
      setErrors({ ...errors, [prop]: null });
    }
    setValues({ ...values, [prop]: ev.target.value });
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault();

    setIsLoading(true);

    if (!EmailValidator.validate(values.email)) {
      notifyError("Erro de autenticação: Email inválido.");
      setErrors({
        ...errors,
        email: {
          content: "Por favor, insira um email válido!",
          pointing: "below"
        }
      });
      document.querySelector<HTMLInputElement>(".login-input input")?.focus();
      return setIsLoading(false);
    }

    if (values.password.length < 5) {
      notifyError("Erro de autenticação: Senha inválida.");
      setErrors({
        ...errors,
        password: {
          content: "Por favor, insira uma senha maior que 4 caracteres!",
          pointing: "below"
        }
      });
      document
        .querySelectorAll<HTMLInputElement>(".login-input input")[1]
        ?.focus();
      return setIsLoading(false);
    }

    if (rememberMe) {
      localStorage.setItem(
        "USER_DATA",
        JSON.stringify({ email: values.email, password: values.password })
      );
    } else {
      localStorage.removeItem("USER_DATA");
    }

    setTimeout(async () => {
      await Authenticate(values.email, values.password);
    }, 2000);
  }

  function notifyError(message: string) {
    return toast.error(message, { position: "top-left" });
  }

  useEffect(() => {
    document.title = "uPanel | Faça o login agora!";
  }, []);

  return (
    <div id="login-page">
      <div className="login-container">
        <div className="logo-container">
          <span className="logo-text">
            u<span className="logo-text-secondary">.</span>Panel
          </span>
          <span className="logo-caption">Controle de usuários</span>
        </div>
        <Form className="login-form" onSubmit={handleSubmit}>
          <Form.Input
            placeholder="Email"
            className="login-input"
            value={values.email}
            error={errors.email}
            onChange={ev => handleChange(ev, "email")}
          />
          <Form.Input
            type="password"
            placeholder="Senha"
            className="login-input"
            error={errors.password}
            value={values.password}
            onChange={ev => handleChange(ev, "password")}
          />
          <Form.Checkbox
            label="Lembrar de mim"
            className="login-checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <Form.Button
            type="submit"
            primary
            className="login-button"
            content="Entrar"
            loading={isLoading}
          />
        </Form>
      </div>
      <div className="asset-container">
        <h1>Novo sistema de controle de usuários</h1>
        <img src={asset} alt="" />
        <h2>Conte conosco na hora de qualquer coisa!</h2>
        <span className="logo-text">
          u<span className="logo-text-secondary">.</span>Panel
        </span>
      </div>
    </div>
  );
}
