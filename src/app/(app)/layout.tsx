import Header from "@/components/Header";
import Providers from "@/components/Providers";
import { cookies } from "next/headers";
import * as Jose from "jose";

export const metadata = {
  title: "Grupo Gestión. Facturación",
  description: "Facturación",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get("token")?.value || "";
  const tokenDecoded = Jose.decodeJwt(token);
  return (
    <Providers token={tokenDecoded}>
      <body className="h-screen grid grid-rows-[min-content_minmax(0,1fr)] overflow-hidden">
        <Header />
        <main className="p-3">{children}</main>
      </body>
    </Providers>
  );
}
