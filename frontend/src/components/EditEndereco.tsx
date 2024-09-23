import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReactNode, useContext, useState } from "react";
import { FloatingLabelInput } from "./ui/floating-label-input";
import { Endereco, UserContext } from "@/UserContext";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { Button } from "./ui/button";
import LoadingIcon from "./ui/loading";
import { toast } from "sonner";

type EditEnderecoFormFields = {
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
};

const EditEndereco = ({ children, endereco }: { children: ReactNode; endereco: Endereco }) => {
  const apiURL = import.meta.env.VITE_API_URL;

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext not found");
  }

  const { setEndereco, token } = userContext;

  const { rua, numero, complemento, bairro, cidade, estado, cep } = endereco;

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors, isSubmitting, dirtyFields, isDirty },
  } = useForm<EditEnderecoFormFields>({
    defaultValues: {
      rua,
      numero: numero.toString(),
      complemento,
      bairro,
      cidade,
      estado,
      cep,
    },
  });

  const [cepInsert, setCepInsert] = useState(false);

  const onSubmit: SubmitHandler<EditEnderecoFormFields> = async (data) => {
    const putData = {
      rua: dirtyFields.rua || cepInsert ? data.rua : "",
      numero: dirtyFields.numero ? Number(data.numero) : 0,
      complemento: dirtyFields.complemento ? data.complemento : "",
      bairro: dirtyFields.bairro || cepInsert ? data.bairro : "",
      cidade: dirtyFields.cidade || cepInsert ? data.cidade : "",
      estado: dirtyFields.estado || cepInsert ? data.estado : "",
      cep: dirtyFields.cep ? data.cep : "",
    };
    await new Promise((response) => setTimeout(response, 1500));
    console.table(putData);
    axios
      .put(apiURL + "/usuarios/editar-endereco/", putData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setEndereco(response.data);
        setOpen(false);
        reset(response.data);
        toast.success("Dados alterados com sucesso");
      })
      .catch((error) => {
        console.error(error.message);
        if (error.response.status === 409)
          setError("root", {
            message: "Email já cadastrado",
          });
      });
  };

  const [open, setOpen] = useState(false);

  const getEnderecoByCEP = (cep: React.ChangeEvent<HTMLInputElement>) => {
    if (/^\d{5}-?\d{3}$/.test(cep.target.value)) {
      const nCEP = (cep.target.value);
      axios
        .get(`https://viacep.com.br/ws/${nCEP}/json/`)
        .then((response) => {
          if (!response.data.erro) {
            setValue("rua", response.data.logradouro);
            setValue("cidade", response.data.localidade);
            setValue("estado", response.data.estado);
            setValue("bairro", response.data.bairro);
            setCepInsert(true);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="btn">{children}</DialogTrigger>
      <DialogContent className="bg-base-100 max-md:w-[90vw] rounded-lg">
        <DialogHeader>
          <DialogTitle>Editar Endereço</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <FloatingLabelInput
              id="CEP"
              label="CEP"
              {...register("cep", {
                pattern: {
                  value: /^\d{5}-?\d{3}$/,
                  message: "Insira um CEP Válido",
                },
                onChange: getEnderecoByCEP,
              })}
              type="text"
            />
            {errors.cep && <div className="text-error text-sm">{errors.cep.message}</div>}
            <FloatingLabelInput id="Rua" label="Rua" {...register("rua")} />
            {errors.rua && <div className="text-error text-sm">{errors.rua.message}</div>}
            <FloatingLabelInput id="Número" label="Número" {...register("numero")} type="text" inputMode="numeric" />
            {errors.numero && <div className="text-error text-sm">{errors.numero.message}</div>}
            <FloatingLabelInput id="Complemento" label="Complemento" {...register("complemento")} type="text" />
            {errors.complemento && <div className="text-error text-sm">{errors.complemento.message}</div>}
            <FloatingLabelInput id="Bairro" label="Bairro" {...register("bairro")} type="text" />
            {errors.bairro && <div className="text-error text-sm">{errors.bairro.message}</div>}
            <FloatingLabelInput id="Cidade" label="Cidade" {...register("cidade")} type="text" />
            {errors.cidade && <div className="text-error text-sm">{errors.cidade.message}</div>}
            <FloatingLabelInput id="Estado" label="Estado" {...register("estado")} type="text" />
            {errors.estado && <div className="text-error text-sm">{errors.estado.message}</div>}

            <Button className="w-full text-slate-100" type="submit" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? <LoadingIcon /> : "Editar"}
            </Button>
            {errors.root && <div className="text-error text-sm">{errors.root.message}</div>}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditEndereco;
