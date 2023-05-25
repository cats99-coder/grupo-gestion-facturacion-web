"use client";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridEventListener,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Autocomplete, Button, TextField } from "@mui/material";
import { ExpedientesService } from "@/services/expedientes.service";
import { price } from "@/utils/Format";
import { ColaboradoresService } from "@/services/colaboradores.service";
import { UsuariosService } from "@/services/usuarios.service";

export default function Colaboradores() {
  const [colaboradores, setColaboradores] = useState<GridRowsProp>([]);
  useEffect(() => {
    new UsuariosService().getAll().then(async (response) => {
      const res = await response.json();
      setColaboradores(
        res.map((r: Usuario) => {
          return { ...r, tipo: "usuario" };
        })
      );
      //   new ColaboradoresService().getAll().then(async (response) => {
      //     setColaboradores(await response.json());
      //   });
    });
  }, []);
  const router = useRouter();
  const columns: GridColDef[] = [
    { field: "nombre", headerName: "Nombre", width: 300 },
  ];
  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    router.push(
      `/colaboradores/${params.id}?externo=${
        params.row.tipo === "usuario" ? false : true
      }`
    );
  };
  const handleNuevo = () => {
    router.push(`/colaboradores/nuevo/`);
  };
  return (
    <div className="grid grid-cols-1 grid-rows-[min-content_minmax(0,1fr)] gap-y-2 h-full">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <h1 className="">Colaboradores</h1>
        </div>
        <div className="flex items-center">
          <Button onClick={handleNuevo}>Nuevo</Button>
        </div>
      </div>
      <DataGrid
        className="w-full"
        getRowId={(row) => row._id}
        disableRowSelectionOnClick={true}
        onRowClick={handleRowClick}
        checkboxSelection
        rows={colaboradores}
        columns={columns}
      />
    </div>
  );
}
