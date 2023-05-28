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

export const totales = (expediente: Expediente): Total => {
  return useMemo(() => {
    const suplidos = expediente.suplidos.reduce((suma, suplido) => {
      return suma + suplido.importe;
    }, 0);
    const cobros = expediente.cobros.reduce((suma, cobro) => {
      return suma + cobro.importe;
    }, 0);
    const base = Number(expediente.importe);
    const IVA = Number(expediente.importe) * (Number(expediente.IVA) / 100);
    const total = base + IVA + Number(suplidos);
    const pendiente = total - cobros - expediente.provisiones;
    return {
      base,
      suplidos,
      IVA,
      total,
      pendiente,
    };
  }, [expediente, expediente.suplidos, expediente.cobros]);
};
