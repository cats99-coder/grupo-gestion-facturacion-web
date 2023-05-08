import * as React from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

interface Cliente {
  _id: string;
  nombre: string;
  contactos: Contacto[];
}
interface Contacto {
  _id: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  telefono: string;
}
export default function Contactos({
  contactos,
}: {
  contactos: GridRowsProp<Contacto>;
}) {
  const columns: GridColDef[] = [
    { field: "nombre", headerName: "Nombre", width: 150 },
    { field: "apellido1", headerName: "Primer Apellido", width: 150 },
    { field: "apellido2", headerName: "Segundo Apellido", width: 150 },
    { field: "telefono1", headerName: "Teléfono", width: 150 },
    { field: "telefono2", headerName: "Teléfono", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "relacion", headerName: "Relación", width: 150 },
  ];
  const handleSelection = (e) => {
    console.log(e);
  };
  const [openNew, setOpenNew] = React.useState(false);

  const handleClose = () => {
    setOpenNew(false);
  };
  return (
    <div className="w-full grid grid-rows-[min-content_minmax(0,1fr)] h-full gap-y-2">
      <div className="flex justify-end">
        <Button onClick={()=>setOpenNew(true)}>Añadir</Button>
      </div>
      <DataGrid
        sortModel={[{ field: "nombre", sort: "asc" }]}
        checkboxSelection={true}
        className=""
        getRowId={(row) => row._id}
        rows={contactos}
        columns={columns}
        onRowSelectionModelChange={handleSelection}
      />
      <Dialog open={openNew} onClose={handleClose}>
        <DialogTitle>Nuevo contacto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Introduzca los datos del nuevo contacto
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nombre"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            id="apellido1"
            label="Primer Apellido"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            id="apellido2"
            label="Segundo Apellido"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            id="email"
            label="Email"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            id="relacion"
            label="Relación"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleClose}>Crear</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
