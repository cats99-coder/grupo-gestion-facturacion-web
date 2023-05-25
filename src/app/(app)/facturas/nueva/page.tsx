"use client";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridEventListener,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Button,
  TextField,
} from "@mui/material";
import { ExpedientesService } from "@/services/expedientes.service";
import { FacturasService } from "@/services/facturas.service";
import { AuthContext, ToastContext } from "@/components/Providers";
import { price } from "@/utils/Format";

export default function Facturar() {
  const [expedientes, setExpedientes] = useState<GridRowsProp>([]);
  const [seleccionados, setSeleccionados] = useState<GridRowSelectionModel>([]);
  const [serie, setSerie] = useState<number>(23);
  const {
    setOpenWarning,
    setMessageWarning,
    setOpenSuccess,
    setMessageSuccess,
  } = useContext<any>(ToastContext);
  useEffect(() => {
    new ExpedientesService().porFacturar().then(async (response) => {
      setExpedientes(await response.json());
    });
  }, []);
  const router = useRouter();
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
  ];
  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    router.push(`/expedientes/${params.id}/`);
  };
  const facturar = () => {
    new FacturasService()
      .create({ expedientes: seleccionados, serie, tipoParaFacturar })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Error al facturar");
        }
        new ExpedientesService().porFacturar().then(async (response) => {
          setOpenSuccess(true);
          setMessageSuccess("Facturado con exito!");
          setExpedientes(await response.json());
        });
      })
      .catch((err) => {
        setOpenWarning(true);
        setMessageWarning("Imposible facturar");
      });
  };
  const { user }: { user: any } = useContext(AuthContext);
  const tipos = ["RUBEN", "INMA", "ANDREA", "CRISTINA"];
  const [tipo, setTipo] = useState<Tipos>([]);
  const [tipoParaFacturar, setTipoParaFacturar] = useState<Tipo>(user.rol);
  return (
    <div className="grid grid-cols-1 grid-rows-[min-content_minmax(0,1fr)] gap-y-2 h-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="">Expedientes pendientes de facturar</h1>
          <Autocomplete
            multiple={true}
            options={tipos}
            className="col-span-3"
            size="small"
            sx={{ width: 350 }}
            value={tipo}
            onChange={(e, value) => setTipo(value)}
            renderInput={(params) => <TextField {...params} label="Usuario" />}
          />
        </div>
        <div className="flex items-center gap-2">
          {tipoParaFacturar === "RUBEN" && (
            <Autocomplete
              options={[23, 22, 21]}
              className="w-52"
              disableClearable={true}
              openOnFocus={true}
              size="small"
              value={serie}
              getOptionLabel={(option) => String(option)}
              onChange={(e, value) => setSerie(value)}
              renderInput={(params) => <TextField {...params} label="Serie" />}
            />
          )}
          <Autocomplete
            options={tipos}
            className="w-52"
            disableClearable={true}
            openOnFocus={true}
            size="small"
            value={tipoParaFacturar}
            getOptionLabel={(option) => String(option)}
            onChange={(e, value) => setTipoParaFacturar(value)}
            renderInput={(params) => <TextField {...params} label="Facturar a nombre de" />}
          />
          <Button onClick={facturar}>Facturar</Button>
        </div>
      </div>
      <DataGrid
        className="w-full"
        getRowId={(row) => row._id}
        onRowSelectionModelChange={(rows) => setSeleccionados(rows)}
        disableRowSelectionOnClick={false}
        //onRowClick={handleRowClick}
        checkboxSelection
        rows={expedientes.filter((expediente) => {
          if (tipo.length === 0) {
            return true;
          }
          return tipo.includes(expediente.tipo);
        })}
        columns={columns}
      />
    </div>
  );
}
