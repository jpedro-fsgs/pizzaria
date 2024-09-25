import { UserContextType, UserType } from "@/UserContext";
import axios from "axios";
import { useQuery } from "react-query";
import LoadingIcon from "./ui/loading";
import { DataTable } from "./DataTable";
import { columns } from "./UsuariosDashboardColumns";

const UsuariosDashboard = ({ userContext }: { userContext: UserContextType }) => {
  const { token } = userContext;

  const {
    data: usuarios,
    error,
    isLoading,
  } = useQuery<UserType[]>({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const apiURL = import.meta.env.VITE_API_URL;
      //   await new Promise((response) => setTimeout(response, 3000));
      const { data } = await axios.get(apiURL + "/admin/usuarios/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex gap-2 items-center">
        <LoadingIcon />
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="flex gap-2 items-center">Não foi possível conectar ao sevidor</div>;
  }

  if (!usuarios) return;

  return (
    <div className="h-full">
      <DataTable columns={columns} data={usuarios} />
    </div>
  );
};

export default UsuariosDashboard;
