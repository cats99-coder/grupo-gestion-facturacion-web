import * as React from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { ClientesService } from "@/services/clientes.service";
import { price } from "@/utils/Format";

interface Expediente {
  _id: string;
  numero_expediente: string;
}
export default function Expedientes({ _id }: { _id: string }) {
  const [expedientes, setExpedientes] = React.useState<GridRowsProp>([]);
  React.useEffect(() => {
    new ClientesService().getExpedients(_id).then(async (response) => {
      try {
        if (!response.ok) throw new Error("error en petición");
        const res = await response.json();
        setExpedientes(res);
      } catch (error) {}
    });
  }, []);
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
  return (
    <div className="w-full grid grid-rows-[minmax(0,1fr)] overflow-hidden h-full gap-y-2">
      <DataGrid
        sortModel={[{ field: "numero_expediente", sort: "asc" }]}
        checkboxSelection={true}
        className="h-full overflow-x-auto"
        getRowId={(row) => row._id}
        rows={expedientes}
        columns={columns}
      />
    </div>
  );
}
