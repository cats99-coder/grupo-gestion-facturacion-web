"use client";
import * as React from "react";
import TextField from "@mui/material/TextField";
import { useParams, useRouter } from "next/navigation";
import { ExpedientesService } from "@/services/expedientes.service";
import { DatePicker } from "@mui/x-date-pickers";

import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { ClientesService } from "@/services/clientes.service";
import { ToastContext } from "@/components/Providers";
import { DateTime } from "luxon";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Suplidos from "@/components/Expedientes/Suplidos";

export default function Expediente() {
  const ObjectId = (rnd = (r16) => Math.floor(r16).toString(16)) =>
    rnd(Date.now() / 1000) +
    " ".repeat(16).replace(/./g, () => rnd(Math.random() * 16));
  interface Expediente {
    _id: string;
    numero_expediente: string;
    cliente: Cliente | null;
    fecha: Date;
    usuario: Usuario | null;
    concepto: string;
    tipo: "FISCAL" | "GESTORIA" | "ABOGACIA";
    importe: number;
    colaborador: number;
    provisiones: number;
    cobrado: number;
    IVA: number;
    factura: Factura;
    suplidos: Suplido[];
    estados: Estado[];
  }
  interface Suplido {
    _id?: string;
    concepto: string;
    importe: number;
  }
  interface Estado {
    _id?: string;
    concepto: string;
    fecha: Date;
  }
  interface Cliente {
    _id: string;
    nombre: string;
  }
  interface Usuario {
    _id: string;
    nombre: string;
  }
  interface Concepto {
    nombre: string;
  }
  interface Factura {
    _id: string;
    numero_factura: number;
    serie: number;
  }
  const [clientes, setClientes] = React.useState<Cliente[]>([]);
  const [facturado, setFacturado] = React.useState<boolean>(false);
  const [expediente, setExpediente] = React.useState<Expediente>({
    _id: "",
    numero_expediente: "",
    cliente: null,
    fecha: new Date(Date.now()),
    usuario: null,
    concepto: "",
    tipo: "FISCAL",
    importe: 0,
    provisiones: 0,
    suplidos: [],
    colaborador: 0,
    cobrado: 0,
    IVA: 0,
    factura: {
      _id: "",
      numero_factura: 0,
      serie: 0,
    },
    estados: [],
  });
  const [fecha, setFecha] = React.useState<DateTime | null>(
    DateTime.fromJSDate(new Date(Date.now()))
  );
  const [estados, setEstados] = React.useState([]);

  const [newEstado, setNewEstado] = React.useState({
    _id: "",
    concepto: "",
    fecha: 0,
  });
  const handleSuplido = (suplidos) => {
    setExpediente({
      ...expediente,
      suplidos,
    });
  };
  const { id } = useParams();
  React.useEffect(() => {
    if (id !== "nuevo") {
      new ExpedientesService().getById(id).then(async (response) => {
        const res: Expediente = await response.json();
        if (res.fecha) {
          res.fecha = new Date(res.fecha);
          setFecha(DateTime.fromJSDate(res.fecha));
        }
        setExpediente({ ...expediente, ...res });
        if (res.factura && res.factura.numero_factura !== 0) {
          setFacturado(true);
        }
      });
    }
    new ClientesService().getAll().then(async (response) => {
      const res: Cliente[] = await response.json();
      setClientes(res);
    });
  }, []);
  const handleExpediente = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpediente({ ...expediente, [e.target.name]: e.target.value });
  };
  const { setOpenSuccess, setMessageSuccess } =
    React.useContext<any>(ToastContext);
  const handleExpedienteCliente = (e: any, value: Cliente) => {
    setExpediente({ ...expediente, cliente: value });
  };
  const handleExpedienteTipo = (
    e: any,
    value: "FISCAL" | "GESTORIA" | "ABOGACIA"
  ) => {
    setExpediente({ ...expediente, tipo: value });
  };
  const saveExpediente = () => {
    if (id !== "nuevo") {
      const { factura, fecha: f, ...updateExpediente } = expediente;
      new ExpedientesService()
        .update(id, { ...updateExpediente, fecha: fecha?.toString() })
        .then((response) => {
          if (!response.ok) return false;
          setOpenSuccess(true);
          setMessageSuccess("Actualizado con exito");
        });
    } else {
      const { _id, numero_expediente, factura, ...createExpediente } =
        expediente;
      new ExpedientesService()
        .create(createExpediente)
        .then(async (response) => {
          setOpenSuccess(true);
          setMessageSuccess("Creado con éxito");
        });
    }
  };
  const total = React.useMemo(() => {
    const suplidos = expediente.suplidos.reduce((suma, suplido) => {
      return suma + suplido.importe;
    }, 0);
    const base = Number(expediente.importe);
    const IVA = Number(expediente.importe) * (Number(expediente.IVA) / 100);
    const total = base + IVA + Number(suplidos);
    return {
      base,
      suplidos,
      IVA,
      total,
    };
  }, [expediente, expediente.suplidos]);
  const router = useRouter();
  const goToInvoice = () => {
    router.push(`/facturas/${expediente.factura._id}`);
  };
  const [openNew, setOpenNew] = React.useState(false);
  const [openEstados, setOpenEstados] = React.useState(false);
  const columns: GridColDef[] = [
    { field: "concepto", headerName: "Concepto", width: 300, editable: true },
    { field: "importe", headerName: "Importe", width: 150, editable: true },
  ];
  const columnsEstados: GridColDef[] = [
    { field: "concepto", headerName: "Concepto", width: 300, editable: true },
    {
      field: "fecha",
      headerName: "Fecha",
      type: "date",
      width: 150,
      editable: true,
    },
  ];
  const handleClose = () => {
    setOpenNew(false);
  };
  const handleCloseEstados = () => {
    setOpenEstados(false);
  };
  return (
    <section className="h-full grid grid-rows-[min-content_min-content_minmax(0,1fr)_min-content] gap-y-2">
      <div className="flex justify-end items-center">
        <Button onClick={() => setOpenEstados(true)}>VER ESTADO</Button>
        {!facturado && (
          <Button onClick={saveExpediente}>
            {id !== "nuevo" ? "Guardar" : "Crear"}
          </Button>
        )}
        {facturado && (
          <>
            <span className="mr-2">
              Factura nº {expediente.factura.numero_factura}{" "}
              {expediente?.factura?.serie && `/ ${expediente?.factura?.serie}`}
            </span>
            <Button onClick={goToInvoice}>Ver Factura</Button>
          </>
        )}
      </div>
      {/* FORMULARIO -------------------------------------------- */}
      <div className="grid grid-cols-6 gap-3 h-min">
        <TextField
          className="col-span-2"
          disabled={true}
          size="small"
          onChange={handleExpediente}
          name="NIF"
          value={expediente.numero_expediente}
          id="numero_expediente"
          label="Número Expediente"
          variant="outlined"
          autoComplete="off"
        />
        <DatePicker
          slotProps={{ textField: { size: "small" } }}
          format="dd/MM/yyyy"
          sx={{ height: "100%" }}
          value={fecha}
          disabled={facturado}
          onChange={(newValue) => setFecha(newValue)}
        />
        <Autocomplete
          options={clientes}
          className="col-span-2"
          size="small"
          value={expediente.cliente}
          disabled={facturado}
          onChange={handleExpedienteCliente}
          isOptionEqualToValue={(cliente, value) => {
            if (!value) return false;
            return cliente._id === value._id;
          }}
          getOptionLabel={(option) => option.nombre}
          renderInput={(params) => <TextField {...params} label="cliente" />}
        />
        <Autocomplete
          options={["FISCAL", "GESTORIA", "ABOGACIA"]}
          size="small"
          value={expediente.tipo}
          disabled={facturado}
          onChange={handleExpedienteTipo}
          renderInput={(params) => <TextField {...params} label="Tipo" />}
        />
        <TextField
          className="col-span-4"
          size="small"
          onChange={handleExpediente}
          name="concepto"
          value={expediente.concepto}
          disabled={facturado}
          id="concepto"
          label="Concepto"
          variant="outlined"
          autoComplete="off"
        />
        <TextField
          className="col-span-1"
          type={"number"}
          size="small"
          onChange={handleExpediente}
          name="importe"
          value={expediente.importe}
          disabled={facturado}
          id="importe"
          label="Importe"
          variant="outlined"
          autoComplete="off"
        />
        <TextField
          className="col-span-1"
          type={"number"}
          size="small"
          onChange={handleExpediente}
          disabled={facturado}
          name="IVA"
          value={expediente.IVA}
          id="iva"
          label="IVA"
          variant="outlined"
          autoComplete="off"
        />
        <TextField
          className="col-span-1"
          type={"number"}
          size="small"
          onChange={handleExpediente}
          name="provisiones"
          disabled={facturado}
          value={expediente.provisiones}
          id="provisiones"
          label="Provisiones"
          variant="outlined"
          autoComplete="off"
        />
        <TextField
          className="col-span-1"
          size="small"
          onChange={handleExpediente}
          name="colaborador"
          disabled={facturado}
          value={expediente.colaborador}
          id="colaborador"
          label="Colaborador"
          variant="outlined"
          autoComplete="off"
        />
      </div>
      <Suplidos
        initialRows={expediente.suplidos}
        handleSuplidos={handleSuplido}
      />
      <Dialog open={openEstados} onClose={handleCloseEstados}>
        <DialogTitle>Estados del expediente</DialogTitle>
        <DialogContent>
          <DialogContentText>Estados del expediente</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            size="small"
            id="suplido-concepto"
            label="Concepto"
            fullWidth
            variant="outlined"
            onChange={(e) =>
              setNewEstado({ ...newEstado, concepto: e.target.value })
            }
          />
          <DatePicker label="Fecha" sx={{ width: "100%" }} slots={{}} />
          <DataGrid
            className=""
            getRowId={(row) => row._id}
            rows={expediente.estados}
            columns={columns}
            // onRowSelectionModelChange={handleSelection}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEstados}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      <div className="flex justify-end items-end gap-5">
        <div className="flex items-end justify-between gap-5 w-36">
          <span className="text-xl font-bold">Base</span>
          <span className="text-lg font-semibold">{total.base}</span>
          <span className="text-lg font-semibold">€</span>
        </div>
        <div className="flex items-end justify-between gap-5 w-36">
          <span className="text-xl font-bold">IVA</span>
          <span className="text-lg font-semibold">{total.IVA}</span>
          <span className="text-lg font-semibold">€</span>
        </div>
        <div className="flex items-end justify-between gap-5 w-48">
          <span className="text-xl font-bold">Suplidos</span>
          <span className="text-lg font-semibold">{total.suplidos}</span>
          <span className="text-lg font-semibold">€</span>
        </div>
        <div className="flex items-end justify-between gap-5 w-52">
          <span className="text-3xl font-bold">Total</span>
          <span className="text-2xl font-semibold">{total.total}</span>
          <span className="text-2xl font-semibold">€</span>
        </div>
      </div>
    </section>
  );
}
