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
    <body className="flex justify-center items-center h-screen">
      {children}
    </body>
  );
}
