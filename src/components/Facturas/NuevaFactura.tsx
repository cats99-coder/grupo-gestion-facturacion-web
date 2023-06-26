import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField, Checkbox } from "@mui/material";
import { price } from "@/utils/Format";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { FacturasService } from "@/services/facturas.service";
import { ToastContext } from "../Providers";
import { DateTime } from "luxon";
import { DatePicker } from "@mui/x-date-pickers";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function NuevaFactura({
  expedientes,
  handleClose,
  serie,
  persona,
}: {
  expedientes: Expediente[];
  handleClose: () => void;
  serie: number;
  persona: string;
}) {
  const {
    setOpenWarning,
    setMessageWarning,
    setOpenSuccess,
    setMessageSuccess,
  } = React.useContext<any>(ToastContext);
  const [open, setOpen] = React.useState(true);
  const [fecha, setFecha] = React.useState<DateTime | null>(() => {
    const now = new Date();
    now.setMilliseconds(0);
    now.setHours(0);
    now.setSeconds(0);
    return DateTime.fromJSDate(now);
  });
  const [expedientesSeleccionados, setExpedientesSeleccionados] =
    React.useState(expedientes);
  const close = () => {
    setOpen(false);
    handleClose();
  };

  const handleFacturar = () => {
    new FacturasService()
      .create({
        expedientes: expedientesSeleccionados.map((expediente) => {
          return { _id: expediente._id, IVA: expediente.IVA };
        }),
        serie,
        tipoParaFacturar: persona,
        fecha,
      })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Error al facturar");
        }
        setOpenSuccess(true);
        setMessageSuccess("Facturado con exito!");
      })
      .catch((err) => {
        setOpenWarning(true);
        setMessageWarning("Imposible facturar");
      });
    setOpen(false);
    handleClose();
  };
  const handleIVA = (id, value) => {
    setExpedientesSeleccionados((prev) => {
      return prev.map((expediente) => {
        console.log(prev);
        if (expediente._id === id) {
          return { ...expediente, IVA: value };
        }
        return expediente;
      });
    });
  };
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      TransitionComponent={Transition}
    >
      <DialogTitle>Expedientes a facturar</DialogTitle>
      <DialogContent>
        <div className="flex gap-3 p-5 flex-col">
          <DatePicker
            label="Fecha Inicio"
            value={fecha}
            format="dd/MM/yyyy"
            onChange={(value) => setFecha(value)}
          />
          {expedientesSeleccionados.map((expediente) => {
            return (
              <div className="flex items-center gap-2" key={expediente._id}>
                <div>{expediente.numero_expediente}</div>
                <TextField
                  label="IVA"
                  size="small"
                  onChange={(e) => {
                    handleIVA(expediente._id, e.target.value);
                  }}
                  value={expediente.IVA}
                />
              </div>
            );
          })}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleFacturar}>Facturar</Button>
        <Button onClick={handleClose}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
}
