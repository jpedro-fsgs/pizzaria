import { UserContext } from "@/UserContext";
import { useContext } from "react";

const index = () => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("Header must be used within a UserProvider");
  }

  const { id, nome, telefone, endereco, email, adm, setId, setNome, setTelefone, setEndereco, setEmail, setAdm } = userContext;
  return <div>index</div>;
};

export default index;
