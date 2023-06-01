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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function RealizarCobro({
  expediente,
  handleOpen,
}: {
  expediente: Expediente;
  handleOpen: () => void;
}) {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
    handleOpen();
  };
  const [suplidos, SetSuplidos] = React.useState(() => {
    return expediente.suplidos
      .map((suplido) => {
        return JSON.parse(JSON.stringify(suplido));
      })
      .map((suplido) => {
        return { ...suplido, aPagar: suplido.importe, check: true };
      });
  });
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      TransitionComponent={Transition}
    >
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleClose}>Cobrar</Button>
      </DialogActions>
      <div className="grid grid-cols-2">
        <div>
          <DialogTitle id="alert-dialog-title">Suplidos por cobrar</DialogTitle>
          <DialogContent>
            <div className="grid bg-gestion grid-cols-[min-content_repeat(4,1fr)] gap-x-5 items-center">
              <div className="w-[46px]"></div>
              <strong>Concepto</strong>
              <strong>Importe</strong>
              <strong>Pendiente</strong>
              <strong>A cobrar</strong>
            </div>
            {suplidos.map((suplido, index) => {
              return (
                <div className="grid grid-cols-[min-content_repeat(4,1fr)] gap-x-5 items-center">
                  <Checkbox
                    checked={suplido.check}
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                  />
                  <div>{suplido.concepto}</div>
                  <div>{price(suplido.importe)}</div>
                  <div>{price(suplido.importe)}</div>
                  <TextField
                    size="small"
                    value={suplido.aPagar}
                    type="number"
                  />
                </div>
              );
            })}
          </DialogContent>
        </div>
        <div>
          <DialogTitle id="alert-dialog-title">Otros Gastos</DialogTitle>
          <DialogContent>
            <div className="grid grid-cols-[min-content_repeat(3,1fr)] gap-x-5 items-center">
              <div></div>
              <div>{expediente.importe}</div>
            </div>
          </DialogContent>
          <DialogTitle id="alert-dialog-title">Pago de cliente</DialogTitle>
          <DialogContent>
            <div>
              <span className="text-lg">Total</span>
            </div>
          </DialogContent>
        </div>
      </div>
    </Dialog>
  );
}
