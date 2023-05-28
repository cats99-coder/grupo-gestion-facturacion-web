import { GridRowSelectionModel } from "@mui/x-data-grid";
import { Service } from "./Service";

export class FacturasService extends Service {
  async getAll() {
    return await this.get("/facturas");
  }
  async getById(id: string) {
    return await this.get(`/facturas/${id}`);
  }
  async imprimir(id: string) {
    return await this.post(`/facturas/imprimir`, { id });
  }
  async generarExcel(facturas: GridRowSelectionModel) {
    return await this.post(`/facturas/generarExcel`, { facturas });
  }
  async create(factura: any) {
    return await this.post(`/facturas`, factura);
  }
}
