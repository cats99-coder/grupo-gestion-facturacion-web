import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { RubenService } from "@/services/ruben.service";
import { useState, ChangeEvent } from "react";

export default function RubenContratoAutonomo({
  _id,
  open,
  handleClose,
}: {
  _id: string;
  open: boolean;
  handleClose: () => void;
}) {
  const blobProcess = (blob: Blob) => {
    const objectURL = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectURL;
    a.target = "_blank";
    a.click();
  };
  const handleContratoAutonomo = () => {
    new RubenService()
      .imprimir({ _id, ...datos })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        const res = await response.blob();
        return res;
      })
      .then((blob) => {
        blobProcess(blob);
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [datos, setDatos] = useState({
    precio_servicio_fiscal: 60,
    precio_alta_baja: 90,
    precio_servicio_laboral: 37,
    precio_servicio_laboral_siguientes: 15,
  });
  const handleDatos = (e: ChangeEvent<HTMLInputElement>) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Contrato Autónomo</DialogTitle>
      <DialogContent>
        <DialogContentText>Introduzca los datos necesarios.</DialogContentText>
        <TextField
          autoFocus
          size="small"
          margin="dense"
          id="servicio_fiscal"
          label="Servicio Fiscal"
          type="number"
          value={datos.precio_servicio_fiscal}
          name="precio_servicio_fiscal"
          onChange={handleDatos}
          fullWidth
          variant="outlined"
        />
        <TextField
          size="small"
          margin="dense"
          id="alta_baja"
          label="Alta y Baja"
          type="number"
          value={datos.precio_alta_baja}
          name="precio_alta_baja"
          onChange={handleDatos}
          fullWidth
          variant="outlined"
        />
        <TextField
          size="small"
          margin="dense"
          id="servicio_laboral"
          label="Servicio Laboral"
          type="number"
          value={datos.precio_servicio_laboral}
          name="precio_servicio_laboral"
          onChange={handleDatos}
          fullWidth
          variant="outlined"
        />
        <TextField
          size="small"
          margin="dense"
          id="servicio_laboral"
          label="Servicio Laboral. Siguientes trabajadores"
          type="number"
          value={datos.precio_servicio_laboral_siguientes}
          name="precio_servicio_laboral_siguientes"
          onChange={handleDatos}
          fullWidth
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleContratoAutonomo}>Generar</Button>
      </DialogActions>
    </Dialog>
  );
}
