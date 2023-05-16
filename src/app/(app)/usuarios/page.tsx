"use client";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridEventListener,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import { UsuariosService } from "@/services/usuarios.service";

export default function Clientes() {
  const [clientes, setClientes] = useState<GridRowsProp>([]);
  useEffect(() => {
    new UsuariosService().getAll().then(async (response) => {
      setClientes(await response.json());
    });
  }, []);
  const router = useRouter();
  const columns: GridColDef[] = [
    { field: "nombre", headerName: "Nombre", width: 250 },
    { field: "usuario", headerName: "Usuario", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
  ];
  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    router.push(`/usuarios/${params.id}/`);
  };
  const handleNuevo = () => {
    router.push(`/usuarios/nuevo/`);
  };
  return (
    <div className="grid grid-rows-[min-content_minmax(0,1fr)] gap-y-2 h-full">
      <div className="flex justify-between items-center">
        <h1 className="">Usuarios</h1>
        <div className="flex items-center">
          <Button onClick={handleNuevo}>Nuevo</Button>
        </div>
      </div>
      <DataGrid
        getRowId={(row) => row._id}
        autoHeight={true}
        disableRowSelectionOnClick={true}
        onRowClick={handleRowClick}
        checkboxSelection
        rows={clientes}
        columns={columns}
      />
    </div>
  );
}
