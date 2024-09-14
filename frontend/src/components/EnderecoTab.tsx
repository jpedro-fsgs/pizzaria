import { Endereco } from "@/UserContext";
import { MailIcon, MapPinIcon, PhoneIcon, UserIcon } from "lucide-react";
import React from "react";

const EnderecoTab = ({ endereco }: { endereco: Endereco | undefined }) => {
  return (
    <div className="py-8 space-y-5 w-fit mx-auto mt-24">
      {endereco ? (
        <>
          <div className="flex text-2xl gap-3 items-center">
            <MapPinIcon className="size-10" />
            Endereço:
          </div>
          <div className="flex text-xl gap-3 items-center pl-10">
            Rua: {endereco.rua}, Nº: {endereco.numero}, {endereco.complemento}
          </div>
          <div className="flex text-xl gap-3 items-center pl-10">
            Cidade: {endereco.cidade}, Estado: {endereco.estado}, CEP: {endereco.cep}
          </div>
        </>
      ) : (
        <div className="text-xl">Adicione um endereço</div>
      )}
    </div>
  );
};

export default EnderecoTab;
