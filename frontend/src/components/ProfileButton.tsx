import { UserContext } from "@/UserContext";
import { useContext } from "react";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

//pega as iniciais do primeiro e último nome
const getInitials = (nome: string) => {
  const nomeArray = nome.split(" ");
  return nomeArray[0][0] + nomeArray[nomeArray.length - 1][0];
};

const ProfileButton = () => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("Header must be used within a UserProvider");
  }

  const { nome } = userContext;

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/profile");
  };

  return (
    <Button onClick={handleClick} size="icon" className="hover:brightness-90 hover:bg-secondary bg-secondary w-10 h-10 md:w-fit px-2 transition duration-200" aria-label="Perfil">
      <User className="h-6 w-6 transition duration-200 text-primary" aria-hidden="true" />
      <span className="hidden md:block group-hover:scale-105 text-primary font-semibold">{nome}</span>
    </Button>
  );
};

export default ProfileButton;
