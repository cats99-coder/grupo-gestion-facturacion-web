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
import { ToastContext } from "@/components/Providers";

export default function Facturar() {
  const [expedientes, setExpedientes] = useState<GridRowsProp>([]);
  const [seleccionados, setSeleccionados] = useState<GridRowSelectionModel>([]);
  const [serie, setSerie] = useState<number>(23);
  const [tipo, setTipo] = useState<string | undefined>("FISCAL");
  const {
    setOpenWarning,
    setMessageWarning,
    setOpenSuccess,
    setMessageSuccess,
  } = useContext<any>(ToastContext);
  useEffect(() => {
    new ExpedientesService().porFacturar(tipo).then(async (response) => {
      setExpedientes(await response.json());
    });
  }, [tipo]);
  const router = useRouter();
  const columns: GridColDef[] = [
    { field: "numero_expediente", headerName: "Número Expediente", width: 150 },
    { field: "tipo", headerName: "Tipo", width: 100 },
    {
      field: "cliente",
      renderCell: (params) => params.row?.cliente?.nombre,
      headerName: "Cliente",
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
    { field: "usuario", headerName: "Usuario", width: 150 },
    { field: "concepto", headerName: "Concepto", width: 250 },
    { field: "importe", headerName: "Importe", width: 150 },
    { field: "suplidos", headerName: "Suplidos", width: 150 },
    { field: "colaborador", headerName: "Colaborador", width: 150 },
    { field: "cobrado", headerName: "Cobrado", width: 150 },
  ];
  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    router.push(`/expedientes/${params.id}/`);
  };
  const facturar = () => {
    new FacturasService()
      .create({ tipo, expedientes: seleccionados, serie })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Error al facturar");
        }
        new ExpedientesService().porFacturar(tipo).then(async (response) => {
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
  return (
    <div className="grid grid-cols-1 grid-rows-[min-content_minmax(0,1fr)] gap-y-2 h-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="">Expedientes pendientes de facturar</h1>
          <Autocomplete
            options={["FISCAL", "GESTORIA", "ABOGACIA"]}
            className="w-52"
            disableClearable={true}
            openOnFocus={true}
            size="small"
            value={tipo}
            onChange={(e, value) => setTipo(value)}
            renderInput={(params) => <TextField {...params} label="Tipo" />}
          />
        </div>
        <div className="flex items-center">
          {tipo === "FISCAL" && (
            <Autocomplete
              options={[23, 22, 21]}
              className="w-52"
              disableClearable={true}
              openOnFocus={true}
              size="small"
              value={serie}
              getOptionLabel={(option) => String(option)}
              onChange={(e, value) => setSerie(value)}
              renderInput={(params) => <TextField {...params} label="Tipo" />}
            />
          )}
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
        rows={expedientes}
        columns={columns}
      />
    </div>
  );
}
