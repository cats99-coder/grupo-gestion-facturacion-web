import { Service } from "./Service";

export class ColaboradoresService extends Service {
  async getAll() {
    return await this.get("/colaboradores");
  }
  async getById(id: string) {
    return await this.get(`/colaboradores/${id}`);
  }
  async create(colaborador: Cliente) {
    return await this.post("/colaboradores", colaborador);
  }
  async update(_id: string, colaborador: Cliente) {
    return await this.post(`/colaboradores/${_id}`, colaborador);
  }
}
