import axios from "axios";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface Endereco {
  rua: string;
  numero: number;
  complemento: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface UserContextType {
  isLogged: boolean;
  token: string;
  id: number | undefined;
  nome: string | undefined;
  telefone: string | undefined;
  endereco: Endereco | undefined;
  email: string | undefined;
  adm: boolean | undefined;
  setIsLogged: (logged: boolean) => void;
  setToken: (token: string) => void;
  setId: (id: number) => void;
  setNome: (nome: string) => void;
  setTelefone: (telefone: string) => void;
  setEndereco: (endereco: Endereco) => void;
  setEmail: (email: string) => void;
  setAdm: (adm: boolean) => void;
  logout: () => void;
}

interface UserType {
  id: number;
  nome: string;
  telefone: string;
  endereco: Endereco;
  email: string;
  adm: boolean;
}



export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [token, setToken] = useState<string>("")
  const [id, setId] = useState<number | undefined>(undefined);
  const [nome, setNome] = useState<string | undefined>(undefined);
  const [telefone, setTelefone] = useState<string | undefined>(undefined);
  const [endereco, setEndereco] = useState<Endereco | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [adm, setAdm] = useState<boolean | undefined>(undefined);

  const navigate = useNavigate();

  const setUserData = (data: UserType) => {
    setIsLogged(true);
    setId(data.id);
    setNome(data.nome);
    setTelefone(data.telefone);
    setEndereco(data.endereco)
    setEmail(data.email);
    setAdm(data.adm);
  };

  const logout = () => {
    setToken("");
    localStorage.setItem("access_token", "");
    navigate("/");
    location.reload();
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if(storedToken && storedToken !== ""){
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    console.log(token);
    if(!token) return;
    localStorage.setItem("access_token", token);
    axios.get("http://localhost:2130/usuarios/atual", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      setUserData(response.data)
    })
    .catch((error) => {
      if(error.status === 401){
        alert("Sessão expirada, faça login novamente");
        logout();
      }
      console.error(error)
    })
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        isLogged,
        token,
        id,
        nome,
        telefone,
        endereco,
        email,
        adm,
        setIsLogged,
        setToken,
        setId,
        setNome,
        setTelefone,
        setEndereco,
        setEmail,
        setAdm,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
