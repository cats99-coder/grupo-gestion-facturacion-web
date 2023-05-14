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
  async porFacturar(departamento: string | undefined) {
    return await this.post(`/expedientes/porFacturar`, { departamento });
  }
}
