"use client";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridEventListener,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { Autocomplete, Button, TextField } from "@mui/material";
import { ExpedientesService } from "@/services/expedientes.service";
import { price } from "@/utils/Format";
import { textSpanIntersectsWithPosition } from "typescript";
import { ClientesService } from "@/services/clientes.service";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { ToastContext } from "@/components/Providers";

export default function Expedientes() {
  const [expedientes, setExpedientes] = useState<GridRowsProp>([]);
  useEffect(() => {
    new ExpedientesService().getAll().then(async (response) => {
      setExpedientes(await response.json());
    });
  }, []);
  useEffect(() => {
    new ClientesService().getAll().then(async (response) => {
      setClientes(await response.json());
    });
  }, []);
  const {
    setOpenWarning,
    setMessageWarning,
    setOpenSuccess,
    setMessageSuccess,
  } = useContext<any>(ToastContext);
  const router = useRouter();
  const deleteExpediente = (e: any, _id: string) => {
    console.log("Eliminar");
    e.stopPropagation();
    new ExpedientesService()
      .borrar(_id)
      .then(async (response: any) => {
        if (!response.ok) throw new Error("Expediente con factura");
        new ExpedientesService().getAll().then(async (response) => {
          setExpedientes(await response.json());
          setOpenSuccess(true);
          setMessageSuccess("Borrado con éxito");
        });
      })
      .catch((err: any) => {
        setOpenWarning(true);
        setMessageWarning("" + err);
      });
  };
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
    {
      field: "eliminar",
      renderCell: (params) => {
        return (
          <Button
            color="error"
            onClick={(e) => deleteExpediente(e, params.row._id)}
          >
            Borrar
          </Button>
        );
      },
      headerName: "Eliminar",
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
  const [cliente, setCliente] = useState<Cliente[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [fechaInicio, setFechaInicio] = useState<DateTime | null>(null);
  const [fechaFin, setFechaFin] = useState<DateTime | null>(null);
  const checkFrom = (value: GridValidRowModel) => {
    if (fechaInicio === null) return true;
    if (DateTime.fromISO(value.fecha).diff(fechaInicio).valueOf() <= 0)
      return false;
    return true;
  };
  const checkUntil = (value: GridValidRowModel) => {
    if (fechaFin === null) return true;
    if (DateTime.fromISO(value.fecha).diff(fechaFin).valueOf() > 0)
      return false;
    return true;
  };
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
          <Autocomplete
            multiple={true}
            options={clientes}
            className="col-span-3"
            size="small"
            sx={{ width: 300 }}
            value={cliente}
            isOptionEqualToValue={(option, value) => {
              return option._id === value._id;
            }}
            getOptionLabel={(value) => {
              return value.nombreCompleto;
            }}
            onChange={(e, value) => setCliente(value)}
            renderInput={(params) => <TextField {...params} label="Clientes" />}
          />
          <DatePicker
            label="Fecha Inicio"
            value={fechaInicio}
            format="dd/MM/yyyy"
            onChange={(value) => setFechaInicio(value)}
          />
          <DatePicker
            label="Fecha Fin"
            value={fechaFin}
            format="dd/MM/yyyy"
            onChange={(value) => setFechaFin(value)}
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
        rows={expedientes
          .filter((expediente) => {
            if (tipo.length === 0) {
              return true;
            }
            return tipo.includes(expediente.tipo);
          })
          .filter((expediente) => {
            if (cliente.length === 0) {
              return true;
            }
            return (
              -1 !==
              cliente.findIndex((value) => {
                return expediente.cliente?._id === value._id;
              })
            );
          })
          .filter(checkFrom)
          .filter(checkUntil)}
        columns={columns}
      />
    </div>
  );
}
