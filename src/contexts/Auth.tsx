import { createContext, ReactNode, useContext, useState } from "react";

import { signIn } from "../services";

type User = {
  email: string;
  token: string;
};

type AuthContextData = {
  signed: boolean;
  user: User | null;
  Authenticate(email: string, password: string): Promise<void>;
  Logout(): void;
};

type Props = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: Props) {
  const [signed, setSigned] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  async function Authenticate(email: string, password: string) {
    await signIn(email, password).then(response => {
      setUser({ email, token: response.token });
      setSigned(true);
      localStorage.setItem("USER_TOKEN", response.token);
    });
  }

  function Logout() {
    setUser(null);
    setSigned(false);
    localStorage.removeItem("USER_TOKEN");
  }

  return (
    <AuthContext.Provider value={{ signed, user, Authenticate, Logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
