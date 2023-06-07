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
import { ClientesService } from "@/services/clientes.service";

export default function Clientes() {
  const [clientes, setClientes] = useState<GridRowsProp>([]);
  useEffect(() => {
    new ClientesService().getAll().then(async (response) => {
      setClientes(await response.json());
    });
  }, []);
  console.log(clientes);
  const router = useRouter();
  const columns: GridColDef[] = [
    { field: "NIF", headerName: "NIF", width: 150 },
    {
      field: "nombreCompleto",
      headerName: "Nombre / Razón Social",
      width: 400,
    },
    { field: "telefono", headerName: "Teléfono", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "codigo_postal", headerName: "Código Postal", width: 150 },
    { field: "localidad", headerName: "Localidad", width: 150 },
    { field: "provincia", headerName: "Provincia", width: 150 },
    { field: "pais", headerName: "País", width: 150 },
    { field: "numero_cuenta", headerName: "Número Cuenta", width: 150 },
  ];
  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    router.push(`/clientes/${params.id}/`);
  };
  const [clientesSelecionados, setClientesSeleccionados] = useState([]);
  const handleNuevo = () => {
    router.push(`/clientes/nuevo/`);
  };
  return (
    <div className="grid grid-cols-1 grid-rows-[min-content_minmax(0,1fr)] gap-y-2 h-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="">Clientes</h1>
          <Autocomplete
            multiple={true}
            options={clientes}
            className="col-span-3"
            size="small"
            sx={{ width: 400 }}
            value={clientesSelecionados}
            isOptionEqualToValue={(option, value) => {
              return option._id === value._id;
            }}
            getOptionLabel={(value) => {
              return value.nombreCompleto;
            }}
            onChange={(e, value) => setClientesSeleccionados(value)}
            renderInput={(params) => <TextField {...params} label="Clientes" />}
          />
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
        rows={clientes.filter((cliente: any) => {
          if (clientesSelecionados.length === 0) {
            return true;
          }
          return (
            -1 !==
            clientesSelecionados.findIndex((value: any) => {
              return cliente?._id === value._id;
            })
          );
        })}
        columns={columns}
      />
    </div>
  );
}
