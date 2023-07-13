import NavigationEvents from "@/utils/hooks/useLocalChange";
import { ReactNode, Suspense } from "react";

export default function ExpedienteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <NavigationEvents />
      </Suspense>
    </>
  );
}
