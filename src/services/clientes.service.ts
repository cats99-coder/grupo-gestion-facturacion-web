import { Service } from "./Service";

interface Cliente {
  _id: string;
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

export class ClientesService extends Service {
  async getAll() {
    return await this.get("/clientes");
  }
  async getById(id: string) {
    return await this.get(`/clientes/${id}`);
  }
  async getExpedients(_id: string) {
    return await this.post("/expedientes/porCliente", { cliente: _id });
  }
  async getFacturas(_id: string) {
    return await this.post("/facturas/porCliente", { cliente: _id });
  }
  async create(cliente: Cliente) {
    return await this.post("/clientes", cliente);
  }
  async update(_id: string, cliente: Cliente) {
    if (cliente.tipo === "EMPRESA") {
      const { nombre, apellido1, apellido2, ...clienteEmpresa } = cliente;
      return await this.post(`/clientes/${_id}`, clienteEmpresa);
    } else {
      const { razon_social, ...clientePersona } = cliente;
      return await this.post(`/clientes/${_id}`, clientePersona);
    }
  }
}
