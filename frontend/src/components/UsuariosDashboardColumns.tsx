import { UserType } from "@/UserContext";
import { DropdownMenuIcon } from "@radix-ui/react-icons";
import { ColumnDef, Row } from "@tanstack/react-table";
import { EllipsisIcon, ShieldIcon, ShieldPlusIcon, ShieldXIcon, User2Icon } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const IsAdministrator = ({ row }: { row: Row<UserType> }) => {
	const usuario = row.original;
	return (
		<>
			{usuario.adm ? (
				<div className="bg-info rounded-full mx-auto w-fit p-2">
					<ShieldIcon className="text-base-100" />
				</div>
			) : (
				<div className="bg-secondary rounded-full mx-auto w-fit p-2">
					<User2Icon className="text-primary" />
				</div>
			)}
		</>
	);
};

const Actions = ({ row }: { row: Row<UserType> }) => {
	const usuario = row.original;
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<EllipsisIcon />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="bg-base-100 shadow-2xl">
				<DropdownMenuLabel>{usuario.nome.split(" ")[0]}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>Profile</DropdownMenuItem>
				<DropdownMenuItem>Billing</DropdownMenuItem>
				<DropdownMenuItem>Team</DropdownMenuItem>
				<DropdownMenuItem>Subscription</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export const columns: ColumnDef<UserType>[] = [
	{
		accessorKey: "nome",
		header: "Nome",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "adm",
		header: () => <div className="text-center">ADM</div>,
		cell: IsAdministrator,
	},
	{
		id: "actions",
		cell: Actions,
	},
];
