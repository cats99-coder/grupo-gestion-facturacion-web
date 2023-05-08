"use client";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useParams } from "next/navigation";
import Contactos from "@/components/ClientesTabPanel/Contactos";
import Expedientes from "@/components/ClientesTabPanel/Expedientes";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { ClientesService } from "@/services/clientes.service";
import Facturas from "@/components/ClientesTabPanel/Facturas";
import { AuthContext } from "@/components/Providers";
import { useContext } from "react";

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
    nombre: string;
    numero_cuenta: string;
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
    nombre: "",
    numero_cuenta: "",
    email: "",
    codigo_postal: "",
    localidad: "",
    provincia: "",
    pais: "",
    retencion: false,
    contactos: [],
  });
  const [contactos, setContactos] = React.useState<Contacto[]>([]);
  const { id } = useParams();
  React.useEffect(() => {
    if (id !== "nuevo") {
      fetch(`http://localhost:3001/clientes/${id}`).then(async (response) => {
        const res: Cliente = await response.json();
        setCliente(res);
        setContactos(res.contactos);
      });
    }
  }, []);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };
  const handleCliente = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "retencion") {
      setCliente({ ...cliente, [e.target.name]: e.target.checked });
    } else {
      setCliente({ ...cliente, [e.target.name]: e.target.value });
    }
  };
  const saveClient = () => {
    if (id !== "nuevo") {
      new ClientesService().update(id, cliente);
    } else {
      const { _id, ...createClient } = cliente;
      new ClientesService().create(createClient).then(async (response) => {});
    }
  };
  const { user } = useContext<any>(AuthContext);
  return (
    <section className="h-full grid grid-rows-[min-content_min-content_minmax(0,1fr)] gap-y-2">
      <div className="flex justify-end items-center">
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
        <TextField
          className="col-span-3"
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
          className="col-span-2"
          size="small"
          onChange={handleCliente}
          name="numero_cuenta"
          value={cliente.numero_cuenta}
          id="numero_cuenta"
          label="Número Cuenta"
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
            <Contactos contactos={contactos} />
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
