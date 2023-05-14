import * as React from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { ClientesService } from "@/services/clientes.service";
import { Button } from "@mui/material";
import { FacturasService } from "@/services/facturas.service";

export default function Facturas({ _id }: { _id: string }) {
  const [facturas, setFacturas] = React.useState<GridRowsProp>([]);
  React.useEffect(() => {
    new ClientesService().getFacturas(_id).then(async (response) => {
      try {
        if (!response.ok) throw new Error("error en petición");
        const res = await response.json();
        setFacturas(res);
      } catch (error) {}
    });
  }, []);
  const verFactura = (e: any, id: string) => {
    e.stopPropagation();
    new FacturasService()
      .imprimir(id)
      .then(async (response) => {
        const res = await response.blob();
        return res;
      })
      .then((blob) => {
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
  return (
    <div className="w-full grid grid-rows-[minmax(0,1fr)] overflow-hidden h-full gap-y-2">
      <DataGrid
        sortModel={[{ field: "numero_factura", sort: "desc" }]}
        checkboxSelection={true}
        getRowId={(row) => row._id}
        rows={facturas}
        columns={columns}
      />
    </div>
  );
}
