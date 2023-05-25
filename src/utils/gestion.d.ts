interface Usuario {
  _id: string;
  nombre: string;
}
type Tipo = "RUBEN" | "INMA" | "ANDREA" | "CRISTINA";
type Tipos = Array<Tipo>;
interface Cliente {
  _id?: string;
  NIF: string;
  tipo: "EMPRESA" | "PERSONA";
  razon_social?: string;
  nombre?: string;
  apellido1?: string;
  apellido2?: string;
  numero_cuenta: string;
  email: string;
  codigo_postal: string;
  localidad: string;
  provincia: string;
  pais: string;
  retencion: boolean;
  contactos: Contacto[];
}
interface Contacto {
  _id: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  telefono: string;
  email: string;
  relacion: string;
}
interface Colaborador {
  _id: string;
  nombre: string;
}
type CobroType = "BIZUM C" | "EFECTIVO R";
interface Cobro {
  _id: string;
  tipo: CobroType;
  importe;
}
interface Expediente {
  _id: string;
  numero_expediente: string;
  cliente: Cliente | null;
  fecha: Date;
  usuario: Usuario | null;
  concepto: string;
  importe: number;
  colaboradores: Colaborador[];
  provisiones: number;
  cobros: Cobro[];
  IVA: number;
  factura: Factura;
  suplidos: Suplido[];
  estados: Estado[];
}
interface Suplido {
  _id?: string;
  concepto: string;
  importe: number;
}
interface ColaboradorExpediente {
  _id?: string;
  usuario: Usuario | Proveedor;
}
interface Estado {
  _id?: string;
  concepto: string;
  fecha: Date;
}
interface Concepto {
  nombre: string;
}
interface Factura {
  _id: string;
  numero_factura: number;
  serie: number;
}
