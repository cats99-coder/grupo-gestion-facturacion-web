import Header from "@/components/Header";
import Providers from "@/components/Providers";
import { cookies } from "next/headers";

export const revalidate = 1;
export const metadata = {
  title: "Grupo Gestión. Facturación",
  description: "Facturación",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <Providers>
      <body className="h-screen grid grid-rows-[min-content_minmax(0,1fr)] overflow-hidden">
        <Header />
        <main className="p-3">{children}</main>
      </body>
    </Providers>
  );
}
