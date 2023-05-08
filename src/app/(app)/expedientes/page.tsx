"use client";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridEventListener,
} from "@mui/x-data-grid";
import { DateField } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";

export default function Clientes() {
  const [clientes, setClientes] = useState<GridRowsProp>([]);
  useEffect(() => {
    fetch("http://localhost:3001/expedientes").then(async (response) => {
      setClientes(await response.json());
    });
  }, []);
  const router = useRouter();
  const columns: GridColDef[] = [
    { field: "numero_expediente", headerName: "Número Expediente", width: 150 },
    { field: "tipo", headerName: "Tipo", width: 100 },
    {
      field: "cliente",
      renderCell: (params) => params.row?.cliente?.nombre,
      headerName: "Cliente",
      width: 250,
    },
    {
      field: "fecha",
      type: 'date',
      valueGetter: (params)=> {
        return new Date(params.row?.fecha)
      },
      headerName: "Fecha",
      width: 150,
    },
    { field: "usuario", headerName: "Usuario", width: 150 },
    { field: "concepto", headerName: "Concepto", width: 250 },
    { field: "importe", headerName: "Importe", width: 150 },
    { field: "suplidos", headerName: "Suplidos", width: 150 },
    { field: "colaborador", headerName: "Colaborador", width: 150 },
    { field: "cobrado", headerName: "Cobrado", width: 150 },
  ];
  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    router.push(`/expedientes/${params.id}/`);
  };
  const handleNuevo = () => {
    router.push(`/expedientes/nuevo/`);
  };
  return (
    <div className="grid grid-cols-1 grid-rows-[min-content_minmax(0,1fr)] gap-y-2 h-full">
      <div className="flex justify-between items-center">
        <h1 className="">Expedientes</h1>
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
        rows={clientes}
        columns={columns}
      />
    </div>
  );
}
