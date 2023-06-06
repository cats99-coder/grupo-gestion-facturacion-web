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
import { totales } from "./Totales";
import { ExpedientesService } from "@/services/expedientes.service";

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
  cobrar,
}: {
  expediente: Expediente;
  handleOpen: () => void;
  cobrar: (suplido: any, aPagar: number) => void;
}) {
  const total = totales(expediente);
  const [open, setOpen] = React.useState(true);
  const [openRecibo, setOpenRecibo] = React.useState(false);
  const [pagoCliente, setPagoCliente] = React.useState<number | null>(null);
  const handleClose = () => {
    setOpen(false);
    handleOpen();
  };
  const handleCobroSinRecibo = (): void => {
    setOpen(false);
    cobrar(suplidos, Number(pagoCliente || 0));
    handleClose();
  };
  const handleCobroConRecibo = (): void => {
    setOpen(false);
    cobrar(suplidos, Number(pagoCliente || 0));
    new ExpedientesService()
      .getRecibo({ suplidos, pagoCliente, expediente })
      .then(async (response) => {
        const res = await response.blob();
        return res;
      })
      .then((blob) => {
        const objectURL = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objectURL;
        a.target = "_blank";
        a.click();
      });
    handleClose();
  };
  const [suplidos, setSuplidos] = React.useState(() => {
    return expediente.suplidos
      .map((suplido) => {
        return JSON.parse(JSON.stringify(suplido));
      })
      .map((suplido) => {
        const cobro = total.cobrosPorTipo.suplido.reduce(
          (suma: number, s: any) => {
            if (suplido._id === s._id) {
              return suma + Number(s.importe || 0);
            }
            return suma;
          },
          0
        );
        const pendiente = Number(suplido.importe || 0) - Number(cobro || 0);
        return {
          ...suplido,
          aPagar: pendiente,
          check: pendiente !== 0,
        };
      });
  });
  const handleCheck = (id, checked) => {
    setSuplidos(
      suplidos.map((suplido) => {
        if (suplido._id === id) {
          suplido.check = checked;
        }
        return suplido;
      })
    );
  };
  const handleCobrar = () => {
    setOpenRecibo(true);
  };
  const handleSuplidoImporte = (id, value) => {
    setSuplidos(
      suplidos.map((suplido) => {
        if (suplido._id === id) {
          suplido.aPagar = value;
        }
        return suplido;
      })
    );
  };
  const pendientes = React.useMemo(() => {
    const suplidosSumaPagar = suplidos.reduce((suma, suplido) => {
      const pagoSuplido = suplido.check ? Number(suplido.aPagar || 0) : 0;
      return suma + pagoSuplido;
    }, 0);
    const suplidoPendiente =
      Number(total.suplidos || 0) -
      Number(total.cobrosPorTipo.restoSuplidos || 0) -
      Number(suplidosSumaPagar || 0);
    const base =
      total.base + total.IVA - (total as any)?.cobrosPorTipo?.general;
    const pagar = base + suplidosSumaPagar;
    console.log('realizar')
    const cambio = Number(pagoCliente || 0) - pagar;
    const pendiente = total.pendiente - Number(pagoCliente || 0);
    return {
      base,
      suplidos: suplidoPendiente,
      pagar,
      cambio,
      pendiente,
    };
  }, [pagoCliente, suplidos, expediente]);
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
      </DialogActions>
      <div className="grid grid-cols-2">
        <div>
          <DialogTitle id="alert-dialog-title">Suplidos por cobrar</DialogTitle>
          <DialogContent>
            <div className="grid bg-gestion text-white rounded-md p-3 grid-cols-[min-content_repeat(4,1fr)] gap-x-5 items-center">
              <div className="w-[46px]"></div>
              <strong>Concepto</strong>
              <strong>Importe</strong>
              <strong>Pendiente</strong>
              <strong>A cobrar</strong>
            </div>
            {suplidos
              .filter((suplido) => suplido.aPagar !== 0)
              .map((suplido, index) => {
                return (
                  <div className="grid grid-cols-[min-content_repeat(4,1fr)] p-3 gap-x-5 items-center">
                    <Checkbox
                      checked={suplido.check}
                      onChange={(e, value) => handleCheck(suplido._id, value)}
                      sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                    />
                    <div>{suplido.concepto}</div>
                    <div>{price(suplido.importe)}</div>
                    <div>{price(suplido.importe)}</div>
                    <TextField
                      size="small"
                      onChange={(e) =>
                        handleSuplidoImporte(suplido._id, e.target.value)
                      }
                      value={suplido.aPagar}
                      type="number"
                    />
                  </div>
                );
              })}
          </DialogContent>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div>
            <DialogTitle id="alert-dialog-title">Importes</DialogTitle>
            <DialogContent>
              <div className="grid grid-cols-[repeat(2,1fr)] gap-x-5 items-center">
                <div>Importe base: </div>
                <div className="justify-self-end text-lg font-semibold">
                  {price(total.base)}
                </div>
              </div>
              <div className="grid grid-cols-[repeat(2,1fr)] gap-x-5 items-center">
                <div>Importe IVA: </div>
                <div className="justify-self-end text-lg font-semibold">
                  {price(total.IVA)}
                </div>
              </div>
              <div className="grid grid-cols-[repeat(2,1fr)] gap-x-5 items-center">
                <div>Importe Suplidos: </div>
                <div className="justify-self-end text-lg font-semibold">
                  {price(total.suplidos)}
                </div>
              </div>
              <div className="grid grid-cols-[repeat(2,1fr)] gap-x-5 items-center">
                <div className="text-lg">Total: </div>
                <div className="justify-self-end text-xl text-blue-800 font-bold">
                  {price(total.total)}
                </div>
              </div>
            </DialogContent>
          </div>

          <div>
            <DialogTitle id="alert-dialog-title">
              Importes Pendientes
            </DialogTitle>
            <DialogContent>
              <div className="grid grid-cols-[repeat(2,1fr)] gap-x-5 items-center">
                <div>Importe base: </div>
                <div className="justify-self-end text-lg font-semibold">
                  {price(
                    total.base +
                      total.IVA -
                      (total as any)?.cobrosPorTipo?.general
                  )}
                </div>
              </div>
              <div className="grid grid-cols-[repeat(2,1fr)] gap-x-5 items-center">
                <div>Importe Suplidos: </div>
                <div className="justify-self-end text-lg font-semibold">
                  {price(total.restoSuplidos)}
                </div>
              </div>
              <div className="grid grid-cols-[repeat(2,1fr)] gap-x-5 items-center">
                <div className="text-lg">Total: </div>
                <div className="justify-self-end text-xl text-red-800 font-bold">
                  {price(total.pendiente)}
                </div>
              </div>
            </DialogContent>
          </div>
          <div className="col-span-2">
            <DialogContent>
              <div className="grid grid-cols-[repeat(2,1fr)] gap-x-5 items-center">
                <div className="text-2xl font-bold">A pagar: </div>
                <div className="justify-self-end text-3xl font-bold">
                  {price(pendientes?.pagar)}
                </div>
              </div>
            </DialogContent>
            <DialogTitle id="alert-dialog-title">
              Entrega del cliente
            </DialogTitle>
            <DialogContent className="grid grid-cols-3 gap-1">
              <TextField
                autoFocus
                value={pagoCliente}
                onChange={(e) => setPagoCliente(e.target.value)}
                className="col-span-2"
                fullWidth
                autoComplete="off"
                type="number"
              />
              <Button onClick={handleCobrar}>Cobrar</Button>
            </DialogContent>
          </div>
          <div className="col-span-2">
            {/* <DialogTitle id="alert-dialog-title">
              Importes después del pago
            </DialogTitle> */}
            <DialogContent>
              {/* <div className="grid grid-cols-[repeat(2,1fr)] gap-x-5 items-center">
                <div>Importe base: </div>
                <div className="justify-self-end text-lg font-semibold">
                  {price(pendientes.base)}
                </div>
              </div>
              <div className="grid grid-cols-[repeat(2,1fr)] gap-x-5 items-center">
                <div>Importe IVA: </div>
                <div className="justify-self-end text-lg font-semibold">
                  {price(pendientes.IVA)}
                </div>
              </div>
              <div className="grid grid-cols-[repeat(2,1fr)] gap-x-5 items-center">
                <div>Importe Suplidos: </div>
                <div className="justify-self-end text-lg font-semibold">
                  {price(pendientes.suplidos)}
                </div>
              </div> */}
              <div className="grid grid-cols-[repeat(2,1fr)] gap-x-5 items-center">
                <div className="text-2xl font-bold">Cambio: </div>
                <div className="justify-self-end text-3xl text-red-800 font-bold">
                  {price(pendientes.cambio)}
                </div>
              </div>
              <div className="grid grid-cols-[repeat(2,1fr)] gap-x-5 items-center">
                <div className="text-2xl font-bold">Pendiente: </div>
                <div className="justify-self-end text-3xl text-red-800 font-bold">
                  {price(pendientes.pendiente)}
                </div>
              </div>
            </DialogContent>
          </div>
        </div>
      </div>
      <Dialog
        open={openRecibo}
        onClose={() => {}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Imprimir recibo</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Desea generar un recibo?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCobroSinRecibo}>Sin Recibo</Button>
          <Button onClick={handleCobroConRecibo} autoFocus>
            Con Recibo
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
