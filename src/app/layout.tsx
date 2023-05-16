import "./globals.css";
import React from "react";

export const metadata = {
  title: "Grupo Gestión. Facturación",
  description: "Facturación",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <html lang="es">{children}</html>;
}
