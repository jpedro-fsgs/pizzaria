import { UserContext } from "@/UserContext";
import { useContext } from "react";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

//pegas a iniciais do primeiro e último nome
const getInitials = (nome: string) => {
  const nomeArray = nome.split(" ");
  return nomeArray[0][0] + nomeArray[nomeArray.length - 1][0];
};

const ProfileButton = () => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("Header must be used within a UserProvider");
  }

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/profile");
  };

  const nome = "Myoui Mina";

  return (
    <Button onClick={handleClick} className="hover:brightness-90 hover:bg-secondary bg-secondary transition duration-200 max-h-7 h-4 min-h-10 md:h-12 pl-2 md:px-3" aria-label="Abrir login do usuário">
      <span className="hidden md:block group-hover:scale-105 text-primary font-semibold">{nome && getInitials(nome)}</span>
      <User className="h-6 w-6 transition duration-200 text-primary" aria-hidden="true" />
    </Button>
  );
};

export default ProfileButton;
