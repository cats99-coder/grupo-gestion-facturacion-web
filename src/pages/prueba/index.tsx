import { useLeavePageConfirmation } from "@/utils/hooks/useLeavePageConfirmation";

export default function Prueba() {
  useLeavePageConfirmation(true);
  return <main></main>;
}
