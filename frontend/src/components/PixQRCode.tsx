import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import { useQuery } from "react-query";
import LoadingIcon from "./ui/loading";
import { VscError } from "react-icons/vsc";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

const PixQRCode = ({ id }: { id: number }) => {
  const fetchPixCode = async (pedidoId: number) => {
    const response = await axios.get(`http://localhost:2130/pedidos/pix/${pedidoId}/`);
    return response.data;
  };

  const { data, isLoading, error } = useQuery(["pixCode", id], () => fetchPixCode(id));

  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <LoadingIcon />
      </div>
    );
  }

  if (error) {
    toast.error("Não foi possível gerar o código Pix");
    return (
      <div className="h-full flex justify-center items-center">
        <VscError className="text-error" size={96} />
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(data.payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  console.log(data);

  return (
    <div className="flex flex-col pb-8">
      <QRCodeSVG value={data.payload} className="mx-auto size-full p-10 md:p-20"/>
      <div className="flex items-center space-x-2 p-4 bg-gray-100 rounded-lg w-fit mx-auto mt-auto justify-self-end">
        <pre className="font-mono text-sm whitespace-pre-wrap break-all">{data.payload}</pre>
        <Button onClick={handleCopy} variant="outline" size="sm">
          {copied ? (
            <>
              <Check className="h-4 w-4" />
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PixQRCode;
