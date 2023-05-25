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
import { textSpanIntersectsWithPosition } from "typescript";

export default function Clientes() {
  const [clientes, setClientes] = useState<GridRowsProp>([]);
  useEffect(() => {
    new ExpedientesService().getAll().then(async (response) => {
      setClientes(await response.json());
    });
  }, []);
  const router = useRouter();
  const columns: GridColDef[] = [
    { field: "numero_expediente", headerName: "Número Expediente", width: 150 },
    {
      field: "cliente",
      renderCell: (params) => params.row?.cliente?.nombreCompleto,
      headerName: "Cliente",
      width: 250,
    },
    {
      field: "tipo",
      headerName: "Usuario",
      width: 250,
    },
    {
      field: "fecha",
      type: "date",
      valueGetter: (params) => {
        return new Date(params.row?.fecha);
      },
      headerName: "Fecha",
      width: 150,
    },
    { field: "concepto", headerName: "Concepto", width: 250 },
    {
      field: "importe",
      headerName: "Importe",
      valueGetter(params) {
        return price(params.row.importe);
      },
      width: 150,
    },
    {
      field: "suplidos",
      headerName: "Suplidos",
      width: 150,
      valueGetter(params) {
        const total = params.row.suplidos.reduce(
          (suma: number, suplido: any) => {
            return suma + Number(suplido.importe);
          },
          0
        );
        return price(total);
      },
    },
    {
      field: "colaboradores",
      headerName: "Colaboradores",
      valueGetter(params) {
        const total = params.row.colaboradores.reduce(
          (suma: number, colaborador: any) => {
            return suma + Number(colaborador.importe);
          },
          0
        );
        return price(total);
      },
      width: 150,
    },
    {
      field: "cobros",
      headerName: "Cobrado",
      valueGetter(params) {
        const total = params.row.cobros.reduce((suma: number, cobro: any) => {
          return suma + Number(cobro.importe);
        }, 0);
        return price(total);
      },
      width: 150,
    },
  ];
  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    router.push(`/expedientes/${params.id}/`);
  };
  const handleNuevo = () => {
    router.push(`/expedientes/nuevo/`);
  };
  const tipos = ["RUBEN", "INMA", "ANDREA", "CRISTINA"];
  const [tipo, setTipo] = useState<Tipos>([]);
  return (
    <div className="grid grid-cols-1 grid-rows-[min-content_minmax(0,1fr)] gap-y-2 h-full">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <h1 className="">Expedientes</h1>
          <Autocomplete
            multiple={true}
            options={tipos}
            className="col-span-3"
            size="small"
            sx={{ width: 300 }}
            value={tipo}
            onChange={(e, value) => setTipo(value)}
            renderInput={(params) => <TextField {...params} label="Usuario" />}
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
        rows={clientes.filter((cliente) => {
          if (tipo.length === 0) {
            return true;
          }
          return tipo.includes(cliente.tipo);
        })}
        columns={columns}
      />
    </div>
  );
}
