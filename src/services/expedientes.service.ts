import { Service } from "./Service";

export class ExpedientesService extends Service {
  async getAll() {
    return await this.get("/expedientes");
  }
  async getById(id: string) {
    return await this.get(`/expedientes/${id}`);
  }
  async save(id: string, expediente) {
    return await this.post(`/expedientes/${id}`, expediente);
  }
  async create(expediente) {
    return await this.post("/expedientes", expediente);
  }
  async update(_id: string, expediente) {
    return await this.post(`/expedientes/${_id}`, expediente);
  }
  async borrar(_id: string) {
    console.log(_id);
    return await this.delete(`/expedientes/${_id}`);
  }
  async porFacturar() {
    return await this.post(`/expedientes/porFacturar`, {});
  }
  async getColaboraciones(id: string) {
    return await this.post(`/expedientes/colaboraciones`, { usuario: id });
  }
  async getRecibo(recibo: any) {
    return await this.post(`/expedientes/imprimirRecibo`, recibo);
  }
}
