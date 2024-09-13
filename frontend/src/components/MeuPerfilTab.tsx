import { UserContextType } from "@/UserContext"
import { MailIcon, PhoneIcon, UserIcon } from "lucide-react";
import { Button } from "./ui/button";


const MeuPerfilTab = ({ user }:{user: UserContextType}) => {
  const { id, nome, telefone, endereco, email } = user;
  return (
    <div className="py-8 space-y-5 w-fit mx-auto mt-24">
      <div className="flex text-2xl gap-3 items-center"><UserIcon className="size-10" />Nome: {nome}</div>
      <div className="flex text-2xl gap-3 items-center"><PhoneIcon className="size-10" />Telefone: {telefone}</div>
      <div className="flex text-2xl gap-3 items-center"><MailIcon className="size-10" />Email: {email}</div>
    </div>
  )
}

export default MeuPerfilTab