import { Service } from "./Service";

interface Cliente {
  NIF: string;
  nombre: string;
  numero_cuenta: string;
  email: string;
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
    return await this.post(`/clientes/${_id}`, cliente);
  }
}
