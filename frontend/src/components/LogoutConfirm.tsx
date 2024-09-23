import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ReactNode } from "react";

const LogoutConfirm = ({ children, onClick }: { children: ReactNode; onClick: React.MouseEventHandler<HTMLButtonElement> }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="btn btn-error">{children}</AlertDialogTrigger>
      <AlertDialogContent className="bg-base-100 max-md:w-[90vw] rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Sair</AlertDialogTitle>
          <AlertDialogDescription>Tem certeza que deseja sair da conta?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="btn btn-ghost">Cancelar</AlertDialogCancel>
          <AlertDialogAction className="btn btn-error" onClick={onClick}>Sair</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutConfirm;
