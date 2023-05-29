"use client";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useParams, useRouter } from "next/navigation";
import Contactos from "@/components/ClientesTabPanel/Contactos";
import Expedientes from "@/components/ClientesTabPanel/Expedientes";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { ClientesService } from "@/services/clientes.service";
import Facturas from "@/components/ClientesTabPanel/Facturas";
import { AuthContext, ToastContext } from "@/components/Providers";
import { useContext } from "react";
import Documentos from "@/components/ClientesTabPanel/Documentos";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`clientes-tabpanel-${index}`}
      aria-labelledby={`clientes-tab-${index}`}
      {...other}
      className="h-full overflow-auto"
    >
      {value === index && <Box sx={{ p: 3, height: "100%" }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `clientes-tabpanel-${index}`,
    "aria-controls": `clientes-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [tab, setTab] = React.useState(0);
  interface Cliente {
    _id: string;
    NIF: string;
    tipo: "EMPRESA" | "PERSONA";
    razon_social?: string;
    nombre?: string;
    apellido1?: string;
    apellido2?: string;
    numero_cuenta: string;
    telefono: string;
    email: string;
    codigo_postal: string;
    localidad: string;
    provincia: string;
    pais: string;
    retencion: boolean;
    contactos: Contacto[];
  }
  interface Contacto {
    _id: string;
    nombre: string;
    apellido1: string;
    apellido2: string;
    telefono: string;
    email: string;
    relacion: string;
  }
  const [cliente, setCliente] = React.useState<Cliente>({
    _id: "",
    NIF: "",
    razon_social: "",
    nombre: "",
    apellido1: "",
    tipo: "PERSONA",
    apellido2: "",
    numero_cuenta: "",
    email: "",
    codigo_postal: "",
    localidad: "",
    telefono: "",
    provincia: "",
    pais: "",
    retencion: false,
    contactos: [],
  });
  const { id } = useParams();
  React.useEffect(() => {
    if (id !== "nuevo") {
      new ClientesService().getById(id).then(async (response) => {
        const res: Cliente = await response.json();
        setCliente(res);
      });
    }
  }, []);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };
  const handleContactos = (contactos) => {
    setCliente({ ...cliente, contactos });
  };
  const handleCliente = (
    e: React.ChangeEvent<HTMLInputElement>,
    name?: string
  ) => {
    if (e.target.name === "retencion") {
      setCliente({ ...cliente, [e.target.name]: e.target.checked });
    } else {
      setCliente({ ...cliente, [e.target.name]: e.target.value });
    }
  };
  const { setOpenSuccess, setMessageSuccess } =
    React.useContext<any>(ToastContext);
  const handleTipo = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    setCliente({ ...cliente, tipo: newAlignment });
  };
  const router = useRouter();
  const saveClient = () => {
    if (id !== "nuevo") {
      new ClientesService().update(id, cliente).then(async (response) => {
        setOpenSuccess(true);
        setMessageSuccess("Actualizado con éxito");
      });
    } else {
      const { _id, ...createClient } = cliente;
      new ClientesService().create(createClient).then(async (response) => {
        const res = await response.json();
        router.push(`/clientes/${res?._id}`);
        setOpenSuccess(true);
        setMessageSuccess("Creado con éxito");
      });
    }
  };
  const { user } = useContext<any>(AuthContext);
  return (
    <section className="h-full grid grid-rows-[min-content_min-content_minmax(0,1fr)] gap-y-2">
      <div className="flex justify-end items-center">
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={cliente.retencion}
                name="retencion"
                onChange={handleCliente}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label="Retención"
          />
          <ToggleButtonGroup
            value={cliente.tipo}
            exclusive
            onChange={handleTipo}
            aria-label="text alignment"
          >
            <ToggleButton value="EMPRESA" aria-label="empresa">
              EMPRESA
            </ToggleButton>
            <ToggleButton value="PERSONA" aria-label="persona">
              PERSONA
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <Documentos _id={cliente._id} />
        <Button onClick={saveClient}>
          {id !== "nuevo" ? "Guardar" : "Crear"}
        </Button>
      </div>
      {/* FORMULARIO -------------------------------------------- */}
      <div className="grid grid-cols-6 gap-3 grid-rows-1">
        <TextField
          className="col-span-1"
          size="small"
          onChange={handleCliente}
          name="NIF"
          value={cliente.NIF}
          id="NIF"
          label="NIF"
          variant="outlined"
          autoComplete="off"
        />
        {cliente.tipo === "EMPRESA" && (
          <TextField
            className="col-span-3"
            size="small"
            onChange={handleCliente}
            name="razon_social"
            value={cliente.razon_social}
            id="razon_social"
            label="Razón Social"
            variant="outlined"
            autoComplete="off"
          />
        )}
        {cliente.tipo === "PERSONA" && (
          <>
            <TextField
              className="col-span-1"
              size="small"
              onChange={handleCliente}
              name="nombre"
              value={cliente.nombre}
              id="NIF"
              label="Nombre"
              variant="outlined"
              autoComplete="off"
            />
            <TextField
              className="col-span-1"
              size="small"
              onChange={handleCliente}
              name="apellido1"
              value={cliente.apellido1}
              id="apellido1"
              label="Primer Apellido"
              variant="outlined"
              autoComplete="off"
            />
            <TextField
              className="col-span-1"
              size="small"
              onChange={handleCliente}
              name="apellido2"
              value={cliente.apellido2}
              id="apellido2"
              label="Segundo Apellido"
              variant="outlined"
              autoComplete="off"
            />
          </>
        )}
        <TextField
          className="col-span-2"
          type="email"
          size="small"
          onChange={handleCliente}
          name="email"
          value={cliente.email}
          id="email"
          label="email"
          variant="outlined"
          autoComplete="off"
        />
        <TextField
          className="col-span-1"
          size="small"
          onChange={handleCliente}
          name="telefono"
          value={cliente.telefono}
          id="telefono"
          label="Teléfono"
          variant="outlined"
          autoComplete="off"
        />
        <TextField
          className="col-span-1"
          size="small"
          onChange={handleCliente}
          name="codigo_postal"
          value={cliente.codigo_postal}
          id="codigo_postal"
          label="Código Postal"
          variant="outlined"
          autoComplete="off"
        />
        <TextField
          className="col-span-1"
          size="small"
          onChange={handleCliente}
          name="localidad"
          value={cliente.localidad}
          id="localidad"
          label="Localidad"
          variant="outlined"
          autoComplete="off"
        />
        <TextField
          className="col-span-1"
          size="small"
          onChange={handleCliente}
          name="provincia"
          value={cliente.provincia}
          id="provincia"
          label="Provincia"
          variant="outlined"
          autoComplete="off"
        />
        <TextField
          className="col-span-1"
          size="small"
          onChange={handleCliente}
          name="pais"
          value={cliente.pais}
          id="pais"
          label="País"
          variant="outlined"
          autoComplete="off"
        />
        <TextField
          className="col-span-1"
          size="small"
          onChange={handleCliente}
          name="numero_cuenta"
          value={cliente.numero_cuenta}
          id="numero_cuenta"
          label="Número Cuenta"
          variant="outlined"
          autoComplete="off"
        />
      </div>
      {/* TAB -------------------------------------------- */}
      {id !== "nuevo" && (
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
              value={tab}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Contactos" {...a11yProps(0)} />
              <Tab label="Expedientes" {...a11yProps(1)} />
              <Tab label="Facturas" {...a11yProps(2)} />
              <Tab label="Estadísticas" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <TabPanel value={tab} index={0}>
            <Contactos
              initialRows={cliente.contactos}
              handleContactos={handleContactos}
            />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <Expedientes _id={cliente._id} />
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <Facturas _id={cliente._id} />
          </TabPanel>
        </Box>
      )}
    </section>
  );
}
