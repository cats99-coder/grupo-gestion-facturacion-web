import { Service } from "./Service";

interface ContratoAutonomo {
  _id: string;
}
export class RubenService extends Service {
  async imprimir(contratoAutonomoParams: ContratoAutonomo) {
    return await this.post(`/ruben/contrato-autonomo`, contratoAutonomoParams);
  }
}
