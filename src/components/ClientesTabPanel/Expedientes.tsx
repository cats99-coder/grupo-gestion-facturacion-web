import * as React from "react";
import { useMemo } from "react";
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
  }, [_id]);
  const expedientesProcesados = useMemo(() => {
    const totales: any = expedientes.reduce(
      (prev, current) => {
        const e = {
          importe: prev.importe + current.importe,
          suplidos:
            prev.suplidos +
            current.suplidos.reduce((suma: number, suplido: any) => {
              return suma + Number(suplido.importe);
            }, 0),
          colaboradores:
            prev.colaboradores +
            current.colaboradores.reduce((suma: number, colaborador: any) => {
              return suma + Number(colaborador.importe);
            }, 0),
          cobrado:
            prev.cobrado +
            current.cobros.reduce((suma: number, cobro: any) => {
              return suma + Number(cobro.importe);
            }, 0),
        };
        const IVA =
          prev.IVA +
          (current.importe +
            current.colaboradores.reduce((suma: number, colaborador: any) => {
              return suma + Number(colaborador.importe);
            }, 0)) *
            (current.IVA / 100);
        return { ...e, IVA };
      },
      {
        importe: 0,
        suplidos: 0,
        colaboradores: 0,
        IVA: 0,
        total: 0,
        cobrado: 0,
        pendiente: 0,
      }
    );
    const pendiente: number =
      totales.importe +
      totales.IVA +
      totales.suplidos +
      totales.colaboradores -
      totales.cobrado;
    return { ...totales, pendiente };
  }, [expedientes]);
  const columns: GridColDef[] = [
    { field: "numero_expediente", headerName: "Número Expediente", width: 150 },
    {
      field: "cliente",
      renderCell: (params) => params.row?.cliente?.nombreCompleto,
      headerName: "Cliente",
      width: 350,
    },
    {
      field: "tipo",
      headerName: "Usuario",
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
    { field: "concepto", headerName: "Concepto", width: 400 },
    {
      field: "importe",
      headerName: "Importe",
      renderHeader: (params: GridColumnHeaderParams) => {
        return (
          <div className="flex flex-col leading-4">
            <span>{price((expedientesProcesados as any).importe)}</span>
            <span>Importe</span>
          </div>
        );
      },
      valueGetter(params) {
        return price(params.row.importe);
      },
      width: 150,
    },
    {
      field: "IVA",
      headerName: "IVA",
      renderHeader: (params: GridColumnHeaderParams) => {
        return (
          <div className="flex flex-col leading-4">
            <span>{price((expedientesProcesados as any).IVA)}</span>
            <span>IVA</span>
          </div>
        );
      },
      width: 150,
      valueGetter(params) {
        const importe = params.row.importe;
        const colaboradores = params.row.colaboradores.reduce(
          (suma: number, colaborador: any) => {
            return suma + Number(colaborador.importe);
          },
          0
        );
        const iva = (importe + colaboradores) * (params.row.IVA / 100);
        return price(iva);
      },
    },
    {
      field: "suplidos",
      headerName: "Suplidos",
      renderHeader: (params: GridColumnHeaderParams) => {
        return (
          <div className="flex flex-col leading-4">
            <span>{price((expedientesProcesados as any).suplidos)}</span>
            <span>Suplidos</span>
          </div>
        );
      },
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
      renderHeader: (params: GridColumnHeaderParams) => {
        return (
          <div className="flex flex-col leading-4">
            <span>{price((expedientesProcesados as any).colaboradores)}</span>
            <span>Colaboradores</span>
          </div>
        );
      },
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
      renderHeader: (params: GridColumnHeaderParams) => {
        return (
          <div className="flex flex-col leading-4">
            <span>{price((expedientesProcesados as any).cobrado)}</span>
            <span>Cobrado</span>
          </div>
        );
      },
      valueGetter(params) {
        const total = params.row.cobros.reduce((suma: number, cobro: any) => {
          return suma + Number(cobro.importe);
        }, 0);
        return price(total);
      },
      width: 150,
    },
    {
      field: "pendiente",
      headerName: "Pendiente",
      renderHeader: (params: GridColumnHeaderParams) => {
        return (
          <div className="flex flex-col leading-4">
            <span>{price((expedientesProcesados as any).pendiente)}</span>
            <span>Pendiente</span>
          </div>
        );
      },
      valueGetter(params) {
        let resto =
          params.row.importe +
          params.row.colaboradores.reduce((suma: number, colaborador: any) => {
            return suma + Number(colaborador.importe);
          }, 0);
        resto = resto + resto * (params.row.IVA / 100);
        resto += params.row.suplidos.reduce((suma: number, suplido: any) => {
          return suma + Number(suplido.importe);
        }, 0);
        resto -= params.row.cobros.reduce((suma: number, cobro: any) => {
          return suma + Number(cobro.importe);
        }, 0);
        return price(resto);
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
