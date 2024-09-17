import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReactNode } from "react";
import { Pedido } from "./MeusPedidosTab";
import { IoWarningOutline } from "react-icons/io5";
import PixQRCode from "./PixQRCode";

const PixModal = ({ children, pedido }: { children: ReactNode; pedido: Pedido }) => {


  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="bg-base-100">
        <DialogHeader>
          <DialogTitle>Pagamento Pix R$ {pedido.total.toFixed(2)}</DialogTitle>
                <DialogDescription>Escaneie o QR Code ou copie o código</DialogDescription>
                <PixQRCode id={pedido.id} />
                <div className="text-sm text-warning-content bg-warning px-3 py-1 rounded flex gap-3 items-center w-fit mx-auto">
                  <IoWarningOutline className="w-10 h-10 p-1" />
                  <span>Esta pizzaria é fictícia. O pagamento não terá efeito.</span>
                </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PixModal;
