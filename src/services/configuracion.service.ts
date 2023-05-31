import { Service } from "./Service";

export class ConfiguracionService extends Service {
  async getAll() {
    return await this.get("/configuracion");
  }
  async update(config: {}) {
    return await this.post("/configuracion", {config});
  }
}
