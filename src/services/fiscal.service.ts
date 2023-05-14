import { Service } from "./Service";

interface ContratoAutonomo {
  _id: string;
}
export class FiscalService extends Service {
  async imprimir(contratoAutonomoParams: ContratoAutonomo) {
    return await this.post(`/fiscal/contrato-autonomo`, contratoAutonomoParams);
  }
}
