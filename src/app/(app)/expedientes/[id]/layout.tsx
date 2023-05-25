"use client";
import * as React from "react";
import TextField from "@mui/material/TextField";
import { useParams, useRouter } from "next/navigation";
import { ExpedientesService } from "@/services/expedientes.service";
import { DatePicker } from "@mui/x-date-pickers";

import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tab,
  Tabs,
} from "@mui/material";
import { ClientesService } from "@/services/clientes.service";
import { ToastContext } from "@/components/Providers";
import { DateTime } from "luxon";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Suplidos from "@/components/Expedientes/Suplidos";
import Totales, { totales } from "@/components/Expedientes/Totales";
import { TabPanel, a11yProps } from "@/utils/Tabs";
import Colaboradores from "@/components/Expedientes/Colaboradores";
import Cobros from "@/components/Expedientes/Cobros";

export default function ExpedienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [clientes, setClientes] = React.useState<Cliente[]>([]);
  const [facturado, setFacturado] = React.useState<boolean>(false);
  const [expediente, setExpediente] = React.useState<Expediente>({
    _id: "",
    numero_expediente: "",
    cliente: null,
    fecha: new Date(Date.now()),
    usuario: null,
    concepto: "",
    importe: 0,
    provisiones: 0,
    suplidos: [],
    colaboradores: [],
    cobros: [],
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
  const handleSuplidos = (suplidos: Suplido[]) => {
    setExpediente({
      ...expediente,
      suplidos,
    });
  };
  const handleColaboradores = (colaboradores: Colaborador[]) => {
    setExpediente({
      ...expediente,
      colaboradores,
    });
  };
  const handleCobros = (cobros: Cobro[]) => {
    setExpediente({
      ...expediente,
      cobros,
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
        .then(async (response: Response) => {
          const res = await response.json();
          router.push(`/expedientes/${res?._id}`);
          setOpenSuccess(true);
          setMessageSuccess("Creado con éxito");
        });
    }
  };
  const total = totales(expediente);
  const router = useRouter();
  const goToInvoice = () => {
    router.push(`/facturas/${expediente.factura._id}`);
  };
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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
    <section className="h-full grid grid-rows-[min-content_min-content_minmax(0,1fr)] gap-y-2">
      <div className="flex justify-end items-center">
        <Totales total={total} />
        {facturado && (
          <>
            <span className="mr-2">
              Factura nº {expediente.factura.numero_factura}{" "}
              {expediente?.factura?.serie && `/ ${expediente?.factura?.serie}`}
            </span>
            <Button onClick={goToInvoice}>Ver Factura</Button>
          </>
        )}
        <Button onClick={saveExpediente}>
          {id !== "nuevo" ? "Guardar" : "Crear"}
        </Button>
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
          className="col-span-3"
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
          name="provisiones"
          disabled={facturado}
          value={expediente.provisiones}
          id="provisiones"
          label="Provisiones"
          variant="outlined"
          autoComplete="off"
        />
      </div>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "grid",
          gridTemplateRows: "min-content minmax(0,1fr)",
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="tabs-expediente"
          >
            <Tab label="Suplidos" {...a11yProps(0)} />
            <Tab label="Colaboradores" {...a11yProps(1)} />
            <Tab label="Cobros" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Suplidos
            initialRows={expediente.suplidos}
            handleSuplidos={handleSuplidos}
            facturado={facturado}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Colaboradores
            initialRows={expediente.colaboradores}
            handleColaboradores={handleColaboradores}
          />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Cobros initialRows={expediente.cobros} handleCobros={handleCobros} />
        </TabPanel>
      </Box>
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
    </section>
  );
}
