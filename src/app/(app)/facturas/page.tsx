"use client";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridEventListener,
  GridValidRowModel,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FacturasService } from "@/services/facturas.service";
import { Autocomplete, Button, TextField } from "@mui/material";
import { ClientesService } from "@/services/clientes.service";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";

export default function Facturas() {
  const [facturas, setFacturas] = useState<GridRowsProp>([]);
  useEffect(() => {
    new FacturasService().getAll().then(async (response) => {
      console.log(response.ok);
      setFacturas(await response.json());
    });
  }, []);
  useEffect(() => {
    new ClientesService().getAll().then(async (response) => {
      setClientes(await response.json());
    });
  }, []);
  const router = useRouter();
  const [fechaInicio, setFechaInicio] = useState<DateTime | null>(null);
  const [fechaFin, setFechaFin] = useState<DateTime | null>(null);
  const checkFrom = (value: GridValidRowModel) => {
    if (fechaInicio === null) return true;
    if (DateTime.fromISO(value.fecha).diff(fechaInicio).valueOf() < 0)
      return false;
    return true;
  };
  const checkUntil = (value: GridValidRowModel) => {
    if (fechaFin === null) return true;
    if (DateTime.fromISO(value.fecha).diff(fechaFin).valueOf() > 0)
      return false;
    return true;
  };
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
  const generarExcel = (e: any) => {
    e.stopPropagation();
    console.log(facturasSeleccionadas);
    new FacturasService()
      .generarExcel(facturasSeleccionadas)
      .then(async (response) => {
        const res = await response.blob();
        return res;
      })
      .then((blob) => {
        console.log(blob);
        const objectURL = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objectURL;
        a.download = "invoices.xlsx";
        // a.target = "_blank";
        a.click();
      });
  };
  const [facturasSeleccionadas, setFacturasSeleccionadas] =
    useState<GridRowSelectionModel>([]);
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
      headerName: "Ver Factura",
      width: 150,
    },
    { field: "numero_factura", headerName: "Número Factura", width: 150 },
    {
      field: "cliente",
      renderCell: (params) => params.row?.cliente?.nombreCompleto,
      headerName: "Cliente",
      width: 300,
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
    {
      field: "usuario",
      renderCell: (params) => params.row?.tipo,
      headerName: "Usuario",
      width: 150,
    },
    {
      field: "facturado_por",
      renderCell: (params) => params.row?.usuario?.nombre,
      headerName: "Facturado por",
      width: 150,
    },
  ];
  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    router.push(`/facturas/${params.id}/`);
  };
  const handleNueva = () => {
    router.push(`/facturas/nueva/`);
  };
  // Buscador de Tipos
  const tipos = ["RUBEN", "INMA", "ANDREA", "CRISTINA"];
  const [tipo, setTipo] = useState<Tipos>([]);
  // Buscador de Clientes
  const [cliente, setCliente] = useState<Cliente[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  return (
    <div className="grid grid-cols-1 grid-rows-[min-content_minmax(0,1fr)] gap-y-2 h-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="">Facturas</h1>
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
          <Button onClick={(e) => generarExcel(e)}>Excel</Button>
          <Button onClick={handleNueva}>Nueva</Button>
        </div>
      </div>
      <DataGrid
        className="w-full"
        getRowId={(row) => row._id}
        disableRowSelectionOnClick={true}
        onRowSelectionModelChange={(rows) => setFacturasSeleccionadas(rows)}
        //onRowClick={handleRowClick}
        checkboxSelection
        rows={facturas
          .filter((factura) => {
            if (tipo.length === 0) {
              return true;
            }
            return tipo.includes(factura.tipo);
          })
          .filter((factura) => {
            if (cliente.length === 0) {
              return true;
            }
            return (
              -1 !==
              cliente.findIndex((value) => {
                console.log(factura.cliente?._id, value._id);
                return factura.cliente?._id === value._id;
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
