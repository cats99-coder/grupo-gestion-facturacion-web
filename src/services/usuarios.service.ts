import { Service } from "./Service";

interface Usuario {
  _id?: string;
  nombre: string;
  usuario: string;
  email: string;
}

export class UsuariosService extends Service {
  async getAll() {
    return await this.get("/usuarios");
  }
  async create(cliente: Usuario) {
    return await this.post("/usuarios", cliente);
  }
  async update(_id: string, cliente: Usuario) {
    return await this.post(`/usuarios/${_id}`, cliente);
  }
}
