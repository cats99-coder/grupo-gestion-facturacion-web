"use client";
import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  AppBar,
  Button,
  Dialog,
  IconButton,
  Slide,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
} from "@mui/material";
import { ClientesService } from "@/services/clientes.service";
import { AuthContext, ToastContext } from "@/components/Providers";
import { useContext } from "react";
import { UsuariosService } from "@/services/usuarios.service";
import { ColaboradoresService } from "@/services/colaboradores.service";
import { ExpedientesService } from "@/services/expedientes.service";
import { price } from "@/utils/Format";
import { DataGrid, GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";

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
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  const { id }: { id: any } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const externo = searchParams?.get("externo");
  const [pendientes, setPendientes] = useState("todos");
  const [openHistorial, setOpenHistoria] = useState(false);
  const [openLiquidacion, setOpenLiquidacion] = useState(false);
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
    new ExpedientesService().getColaboraciones(id).then(async (response) => {
      setColaboraciones(await response.json());
    });
  }, []);
  const pendientesFilter = (value: GridValidRowModel) => {
    if (pendientes === "todos") return true;
    const pendiente =
      value.importe -
      value.pagos.reduce((suma: number, pago: any) => {
        return suma + Number(pago.importe || 0);
      }, 0);
    if (pendiente !== 0) {
      if (pendientes === "pendientes") return true;
    } else {
      if (pendientes === "pagados") return true;
    }
    return false;
  };
  const totales = useMemo(() => {
    const colaboracionesFiltradas = colaboraciones.map((colaboracion: any) => {
      const deudas = colaboracion.deudas.filter(pendientesFilter);
      return { ...colaboracion, deudas };
    });
    const total = colaboracionesFiltradas.reduce(
      (prev: any, current: any, index) => {
        const importe = current.deudas.reduce((suma: number, deuda: any) => {
          return suma + Number(deuda.importe || 0);
        }, 0);
        const pendiente =
          importe -
          current.deudas.reduce((sumTotal: any, deuda: any) => {
            return (
              sumTotal +
              deuda.pagos.reduce((suma: number, pago: any) => {
                return suma + Number(pago.importe || 0);
              }, 0)
            );
          }, 0);
        prev[index] = {
          importe,
          pendiente,
        };
        return prev;
      },
      []
    );
    return { ...total, colaboracionesFiltradas };
  }, [colaboraciones, pendientes]);
  const columns: GridColDef[] = [
    {
      field: "numero_expediente",
      headerName: "Número de Expediente",
      width: 200,
      valueGetter: (params) => {
        return params.row.expediente.numero_expediente;
      },
    },
    {
      field: "cliente",
      headerName: "Cliente",
      width: 300,
      valueGetter: (params) => {
        return params.row.expediente.cliente?.nombreCompleto;
      },
    },
    {
      field: "concepto",
      headerName: "Concepto",
      width: 300,
      valueGetter: (params) => {
        return params.row.expediente.concepto;
      },
    },
    {
      field: "importe",
      headerName: "Importe",
      width: 150,
      renderHeader: (params) => {
        return (
          <div className="flex flex-col leading-4">
            <span>{price(totales[tab].importe)}</span>
            <span>Importe</span>
          </div>
        );
      },
      valueGetter: (params) => {
        return price(params.row.importe);
      },
    },
    {
      field: "pendiente",
      headerName: "Pendiente",
      width: 150,
      renderHeader: (params) => {
        return (
          <div className="flex flex-col leading-4">
            <span>{price(totales[tab].pendiente)}</span>
            <span>Pendiente</span>
          </div>
        );
      },
      valueGetter: (params) => {
        const pagos = params.row.pagos.reduce((suma: number, pago: any) => {
          return suma + Number(pago.importe || 0);
        }, 0);
        return price(params.row.importe - pagos);
      },
    },
  ];
  const columnsHistorial: GridColDef[] = [
    {
      field: "fecha",
      headerName: "Fecha",
      width: 200,
      type: "date",
      valueGetter: (params) => {
        return new Date(params.row.fecha);
      },
    },
    {
      field: "importe",
      headerName: "Importe",
      width: 200,
      valueGetter: (params) => {
        return price(params.row.importe);
      },
    },
    {
      field: "expedientes",
      headerName: "Expedientes",
      width: 400,
      renderCell: (params) => {
        return (
          <div>
            {params.row.expedientes.map((expediente) => {
              console.log(expediente);
              return <div>{expediente}</div>;
            })}
          </div>
        );
      },
    },
  ];
  const handleCloseHistorial = () => {
    setOpenHistoria(false);
  };
  const handleCloseLiquidacion = () => {
    setOpenLiquidacion(false);
  };
  return (
    <section className="h-full grid grid-rows-[min-content_min-content_minmax(0,1fr)] gap-y-2">
      <div className="flex justify-end items-center">
        <Button onClick={() => setOpenLiquidacion(true)}>Liquidación</Button>
        <Button onClick={() => setOpenHistoria(true)}>Historial</Button>
        {/* <Button onClick={() => {}}>
          {id !== "nuevo" ? "Guardar" : "Crear"}
        </Button> */}
      </div>
      {/* FORMULARIO -------------------------------------------- */}
      <div className="grid grid-cols-6 gap-3 grid-rows-1">
        <div>{cliente.nombre}</div>
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
          {totales.colaboracionesFiltradas.map(
            (colaboracion: any, index: number) => {
              return (
                <TabPanel key={colaboracion.tipo} value={tab} index={index}>
                  <DataGrid
                    className="w-full"
                    getRowId={(row) => `${row.expediente.numero_expediente}`}
                    disableRowSelectionOnClick={true}
                    checkboxSelection
                    rows={colaboracion.deudas}
                    columns={columns}
                  />
                </TabPanel>
              );
            }
          )}
        </Box>
      )}
      <Dialog
        fullScreen
        open={openLiquidacion}
        onClose={handleCloseLiquidacion}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseLiquidacion}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Nueva Liquidación
            </Typography>
            <Button autoFocus color="inherit" onClick={handleCloseLiquidacion}>
              Cerrar
            </Button>
          </Toolbar>
        </AppBar>
        <DataGrid
          className="w-full"
          getRowId={(row) => `${row._id}`}
          disableRowSelectionOnClick={true}
          checkboxSelection
          rows={(colaboraciones[tab] as any)?.pagosHistorial}
          columns={columnsHistorial}
        />
      </Dialog>
      <Dialog
        fullScreen
        open={openHistorial}
        onClose={handleCloseHistorial}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseHistorial}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Sound
            </Typography>
            <Button autoFocus color="inherit" onClick={handleCloseHistorial}>
              Cerrar
            </Button>
          </Toolbar>
        </AppBar>
        <DataGrid
          className="w-full"
          getRowId={(row) => `${row._id}`}
          disableRowSelectionOnClick={true}
          checkboxSelection
          rows={(colaboraciones[tab] as any)?.pagosHistorial}
          columns={columnsHistorial}
        />
      </Dialog>
    </section>
  );
}
