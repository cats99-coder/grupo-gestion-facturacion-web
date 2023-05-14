"use client";
import * as React from "react";
import TextField from "@mui/material/TextField";
import { useParams, useRouter } from "next/navigation";
import { ExpedientesService } from "@/services/expedientes.service";
import { Autocomplete, Button } from "@mui/material";
import { ClientesService } from "@/services/clientes.service";
import { DatePicker } from "@mui/x-date-pickers";
import { ToastContext } from "@/components/Providers";
import { DateTime } from "luxon";

export default function Expediente() {
  interface Expediente {
    _id: string;
    numero_expediente: string;
    cliente: Cliente | null;
    fecha: Date;
    usuario: Usuario | null;
    concepto: string;
    tipo: "FISCAL" | "GESTORIA" | "ABOGACIA";
    importe: number;
    suplidos: number;
    colaborador: number;
    cobrado: number;
    IVA: number;
    factura: Factura;
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
    suplidos: 0,
    colaborador: 0,
    cobrado: 0,
    IVA: 0,
    factura: {
      _id: "",
      numero_factura: 0,
      serie: 0,
    },
  });
  const [fecha, setFecha] = React.useState<DateTime | null>(
    DateTime.fromJSDate(new Date(Date.now()))
  );
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
  const handleExpedienteConcepto = (e: any, value: Concepto) => {
    setExpediente({ ...expediente, concepto: value.nombre });
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
      console.log(expediente);
      new ExpedientesService()
        .create(createExpediente)
        .then(async (response) => {
          setOpenSuccess(true);
          setMessageSuccess("Creado con éxito");
        });
    }
  };
  const router = useRouter();
  const goToInvoice = () => {
    router.push(`/facturas/${expediente.factura._id}`);
  };
  const servicios = [{ concepto: "RENTA" }];
  return (
    <section className="h-full grid grid-rows-[min-content_min-content_minmax(0,1fr)] gap-y-2">
      <div className="flex justify-end items-center">
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
        {/* <Autocomplete
          options={servicios}
          size="small"
          className="col-span-3"
          value={expediente.concepto}
          disabled={facturado}
          onChange={handleExpedienteConcepto}
          isOptionEqualToValue={(cliente, value) => {
            if (!value) return false;
            return cliente.concepto === value;
          }}
          getOptionLabel={(option) => option.concepto}
          renderInput={(params) => <TextField {...params} label="Concepto" />}
        /> */}
        <TextField
          className="col-span-3"
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
          name="suplidos"
          disabled={facturado}
          value={expediente.suplidos}
          id="suplidos"
          label="Suplidos"
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
    </section>
  );
}
