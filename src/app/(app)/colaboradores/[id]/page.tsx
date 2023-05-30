"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@mui/material";
import { ClientesService } from "@/services/clientes.service";
import { AuthContext, ToastContext } from "@/components/Providers";
import { useContext } from "react";
import { UsuariosService } from "@/services/usuarios.service";
import { ColaboradoresService } from "@/services/colaboradores.service";
import { ExpedientesService } from "@/services/expedientes.service";
import { price } from "@/utils/Format";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

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
  const [cliente, setCliente] = React.useState<Cliente>({
    _id: "",
    NIF: "",
    razon_social: "",
    nombre: "",
    apellido1: "",
    tipo: "PERSONA",
    nombreCompleto: "",
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const externo = searchParams.get("externo");
  React.useEffect(() => {
    if (id !== "nuevo") {
      if (externo === null) {
        router.push("/colaboradores");
      }
      if (externo === "false") {
        new UsuariosService().getById(id).then(async (response) => {
          const res: Cliente = await response.json();
          setCliente(res);
        });
      } else {
        new ColaboradoresService().getById(id).then(async (response) => {
          const res: Cliente = await response.json();
          setCliente(res);
        });
      }
    }
  }, []);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
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
  const [colaboraciones, setColaboraciones] = useState([]);
  useEffect(() => {
    if (externo === "false") {
      new ExpedientesService().getColaboraciones(id).then(async (response) => {
        setColaboraciones(await response.json());
      });
    }
  }, []);
  console.log(colaboraciones);
  const columns: GridColDef[] = [
    { field: "expediente", headerName: "Número de Expediente", width: 300 },
    {
      field: "importe",
      headerName: "Importe",
      width: 300,
      valueGetter: (params)=> {
        return price(params.row.importe);
      },
    },
  ];
  return (
    <section className="h-full grid grid-rows-[min-content_min-content_minmax(0,1fr)] gap-y-2">
      <div className="flex justify-end items-center">
        <Button onClick={saveClient}>
          {id !== "nuevo" ? "Guardar" : "Crear"}
        </Button>
      </div>
      {/* FORMULARIO -------------------------------------------- */}
      <div className="grid grid-cols-6 gap-3 grid-rows-1">
        <div>{cliente.nombre}</div>
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
              {colaboraciones.map((colaboracion: any, index) => {
                return <Tab label={colaboracion.tipo} {...a11yProps(index)} />;
              })}
            </Tabs>
          </Box>
          {colaboraciones.map((colaboracion: any, index) => {
            return (
              <TabPanel key={colaboracion.tipo} value={tab} index={index}>
                <DataGrid
                  className="w-full"
                  getRowId={(row) => `${row.expediente}`}
                  disableRowSelectionOnClick={true}
                  checkboxSelection
                  rows={colaboracion.deudas}
                  columns={columns}
                />
              </TabPanel>
            );
          })}
        </Box>
      )}
    </section>
  );
}
