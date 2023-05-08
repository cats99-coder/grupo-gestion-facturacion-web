"use client";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridEventListener,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FacturasService } from "@/services/facturas.service";
import { Button } from "@mui/material";

export default function Facturas() {
  const [facturas, setFacturas] = useState<GridRowsProp>([]);
  useEffect(() => {
    new FacturasService().getAll().then(async (response) => {
      setFacturas(await response.json());
    });
  }, []);
  const router = useRouter();
  const verFactura = (e: any, id: string) => {
    e.stopPropagation();
    new FacturasService()
      .imprimir(id)
      .then(async (response) => {
        const res = await response.blob();
        return res;
      })
      .then((blob) => {
        console.log(blob.name);
        const objectURL = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objectURL;
        a.target = "_blank";
        a.click();
      });
  };
  const columns: GridColDef[] = [
    {
      field: "ver factura",
      renderCell: (params) => {
        return (
          <Button onClick={(e) => verFactura(e, params.row._id)}>
            Ver Factura
          </Button>
        );
      },
      headerName: "Número Factura",
      width: 150,
    },
    { field: "numero_factura", headerName: "Número Factura", width: 150 },
    { field: "serie", headerName: "Número Serie", width: 150 },
    { field: "tipo", headerName: "Tipo", width: 150 },
    {
      field: "cliente",
      renderCell: (params) => params.row?.cliente?.nombre,
      headerName: "Cliente",
      width: 150,
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
  ];
  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    router.push(`/facturas/${params.id}/`);
  };
  const handleNueva = () => {
    router.push(`/facturas/nueva/`);
  };
  return (
    <div className="grid grid-cols-1 grid-rows-[min-content_minmax(0,1fr)] gap-y-2 h-full">
      <div className="flex justify-between items-center">
        <h1 className="">Facturas</h1>
        <div className="flex items-center">
          <Button onClick={handleNueva}>Nueva</Button>
        </div>
      </div>
      <DataGrid
        className="w-full"
        getRowId={(row) => row._id}
        disableRowSelectionOnClick={true}
        onRowClick={handleRowClick}
        checkboxSelection
        rows={facturas}
        columns={columns}
      />
    </div>
  );
}
