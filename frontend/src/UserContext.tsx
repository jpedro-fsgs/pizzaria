import { createContext, ReactNode, useState } from "react";

interface Endereco {
  rua: string;
  numero: number;
  complemento: string;
  cidade: string;
  estado: string;
  cep: string;
}

interface UserContextType {
  isLogged: boolean;
  id: number | undefined;
  nome: string | undefined;
  telefone: string | undefined;
  endereco: Endereco | undefined;
  email: string | undefined;
  adm: boolean | undefined;
  setIsLogged: (logged: boolean) => void;
  setId: (id: number) => void;
  setNome: (nome: string) => void;
  setTelefone: (telefone: string) => void;
  setEndereco: (endereco: Endereco) => void;
  setEmail: (email: string) => void;
  setAdm: (adm: boolean) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [id, setId] = useState<number | undefined>(undefined);
  const [nome, setNome] = useState<string | undefined>(undefined);
  const [telefone, setTelefone] = useState<string | undefined>(undefined);
  const [endereco, setEndereco] = useState<Endereco | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [adm, setAdm] = useState<boolean | undefined>(undefined);

  return (
    <UserContext.Provider
      value={{
        isLogged,
        id,
        nome,
        telefone,
        endereco,
        email,
        adm,
        setIsLogged,
        setId,
        setNome,
        setTelefone,
        setEndereco,
        setEmail,
        setAdm,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
