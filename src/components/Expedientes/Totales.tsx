import { price } from "@/utils/Format";
import { useMemo } from "react";

interface Total {
  base: number;
  IVA: number;
  suplidos: number;
  total: number;
  pendiente: number;
}
const SubTotal = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="flex flex-col p-1 border-black rounded-md justify-between w-32">
      <span className="text-xs font-bold">{label}</span>
      <span className="text-xl font-semibold">{price(value)}</span>
    </div>
  );
};
const Total = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="flex flex-col p-1 border-black rounded-md justify-between w-32">
      <span className="text-xs font-bold">{label}</span>
      <span className="text-xl font-semibold">{price(value)}</span>
    </div>
  );
};
const Pendiente = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="flex flex-col p-1 border-black rounded-md justify-between w-32">
      <span className="text-xs font-bold">{label}</span>
      <span
        className={`text-xl ${value > 0 ? "text-gestion" : ""} font-semibold`}
      >
        {price(value)}
      </span>
    </div>
  );
};
export default function Totales({ total }: { total: Total }) {
  return (
    <div className="flex justify-end items-start gap-5">
      <SubTotal label="Base" value={total.base} />
      <SubTotal label="Suplidos" value={total.suplidos} />
      <SubTotal label="IVA" value={total.IVA} />
      <Total label="Total" value={total.total} />
      <Pendiente label="Pendiente" value={total.pendiente} />
    </div>
  );
}

export const totales = (expediente: Expediente) => {
  return useMemo(() => {
    const suplidos = expediente.suplidos.reduce((suma, suplido) => {
      return suma + suplido.importe;
    }, 0);
    const colaboradores = expediente.colaboradores.reduce(
      (suma, colaborador: any) => {
        return suma + colaborador.importe;
      },
      0
    );
    const cobros = expediente.cobros.reduce((suma, cobro) => {
      return suma + cobro.importe;
    }, 0);
    const cobrosPorTipo = expediente.cobros.reduce(
      (cobros: any, cobro: any) => {
        if (cobro.tipo === "SUPLIDO") {
          cobros.suplido.push({
            _id: cobro.suplido,
            importe: cobro.importe,
          });
        }
        if (cobro.tipo === "GENERAL") {
          cobros.general += Number(cobro.importe || 0);
        }
        if (cobro.tipo === "PROVISION") {
          cobros.provision += Number(cobro.importe || 0);
        }
        return cobros;
      },
      {
        suplido: [],
        provision: 0,
        general: 0,
      }
    );
    const base = Number(expediente.importe) + Number(colaboradores);
    const IVA = base * (Number(expediente.IVA) / 100);
    const restoSuplidos =
      Number(suplidos) -
      cobrosPorTipo.suplido.reduce((suma, suplido) => {
        return suma + suplido.importe;
      }, 0);
    const restoIVA =
      (base - cobrosPorTipo?.general) * (Number(expediente.IVA) / 100);
    const total = base + IVA + Number(suplidos);
    const pendiente = total - cobros - expediente.provisiones;
    return {
      base,
      suplidos,
      IVA,
      restoIVA,
      restoSuplidos,
      total,
      pendiente,
      cobrosPorTipo,
      colaboradores,
    };
  }, [expediente, expediente.suplidos, expediente.cobros]);
};
