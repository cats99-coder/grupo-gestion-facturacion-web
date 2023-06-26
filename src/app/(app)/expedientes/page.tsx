"use client";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridEventListener,
  GridValidRowModel,
  GridToolbarContainer,
  GridColumnHeaderParams,
} from "@mui/x-data-grid";
import { useEffect, useState, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Autocomplete,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { ExpedientesService } from "@/services/expedientes.service";
import { price } from "@/utils/Format";
import { textSpanIntersectsWithPosition } from "typescript";
import { ClientesService } from "@/services/clientes.service";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { ToastContext } from "@/components/Providers";
import { gridFilter } from "@/utils/Filters";

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
      field: "total",
      headerName: "Total",
      renderHeader: (params: GridColumnHeaderParams) => {
        return (
          <div className="flex flex-col leading-4">
            <span>{price((expedientesProcesados as any).total)}</span>
            <span>Total</span>
          </div>
        );
      },
      valueGetter(params) {
        const colaboradores = params.row.colaboradores.reduce(
          (suma: number, suplido: any) => {
            return suma + Number(suplido.importe);
          },
          0
        );
        const suplidos = params.row.suplidos.reduce(
          (suma: number, suplido: any) => {
            return suma + Number(suplido.importe);
          },
          0
        );
        const total =
          params.row.importe + params.row.IVA + suplidos + colaboradores;
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
  const [filterModel, setFilterModel] = useState({});
  const [tipo, setTipo] = useState<Tipos>([]);
  const [cliente, setCliente] = useState<Cliente[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [fechaInicio, setFechaInicio] = useState<DateTime | null>(() => {
    const now = new Date();
    now.setDate(1);
    now.setMonth(0);
    now.setMilliseconds(0);
    now.setHours(0);
    now.setSeconds(0);
    return DateTime.fromJSDate(now);
  });
  const [fechaFin, setFechaFin] = useState<DateTime | null>(null);
  const [pendientes, setPendientes] = useState("todos");
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
  const pendientesFilter = (value: GridValidRowModel) => {
    if (pendientes === "todos") return true;
    let resto =
      value.importe +
      value.colaboradores.reduce((suma: number, colaborador: any) => {
        return suma + Number(colaborador.importe);
      }, 0);
    resto = resto + resto * (value.IVA / 100);
    resto += value.suplidos.reduce((suma: number, suplido: any) => {
      return suma + Number(suplido.importe);
    }, 0);
    resto -= value.cobros.reduce((suma: number, cobro: any) => {
      return suma + Number(cobro.importe);
    }, 0);
    if (resto !== 0) {
      if (pendientes === "pendientes") return true;
    } else {
      if (pendientes === "pagados") return true;
    }
    return false;
  };
  const expedientesProcesados = useMemo(() => {
    const expedientesFiltrados = expedientes
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
      .filter(checkUntil)
      .filter((a: any) => {
        return gridFilter(a, filterModel);
      })
      .filter(pendientesFilter);
    const totales: any = expedientesFiltrados.reduce(
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
    const total: number =
      totales.importe + totales.IVA + totales.suplidos + totales.colaboradores;
    const pendiente: number = total - totales.cobrado;
    return { expedientesFiltrados, ...totales, pendiente, total };
  }, [
    expedientes,
    tipo,
    cliente,
    fechaFin,
    fechaInicio,
    filterModel,
    pendientes,
  ]);
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
            disableCloseOnSelect
            limitTags={2}
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
          <ToggleButtonGroup
            color="primary"
            value={pendientes}
            exclusive
            onChange={(e, value) => setPendientes(value)}
            aria-label="Platform"
          >
            <ToggleButton value="todos">Todos</ToggleButton>
            <ToggleButton value="pagados">Pagados</ToggleButton>
            <ToggleButton value="pendientes">Pendientes</ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div className="flex items-center">
          <Button onClick={handleNuevo}>Nuevo</Button>
        </div>
      </div>
      <DataGrid
        className="w-full"
        getRowId={(row) => row._id}
        onFilterModelChange={(model) => setFilterModel(model)}
        disableRowSelectionOnClick={true}
        onRowClick={handleRowClick}
        checkboxSelection
        rows={expedientesProcesados.expedientesFiltrados}
        columns={columns}
      />
    </div>
  );
}
