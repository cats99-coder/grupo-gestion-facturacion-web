import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import Perfil from "./Perfil";

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      className="hover:bg-white hover:text-gestion px-2 py-1 rounded-md"
      href={href}
    >
      {children}
    </Link>
  );
}
export default function Header() {
  return (
    <header className="bg-gestion flex justify-between items-center text-white font-bold px-3 py-2">
      <div className="flex items-center">
        <Image src={"/logo.png"} alt="logo" width={30} height={25} />
        <span className="uppercase">Grupo Gestión</span>
      </div>
      <nav className="flex">
        <ul className="flex items-center">
          <NavLink href={"/usuarios"}>Usuarios</NavLink>
          <NavLink href={"/clientes"}>Clientes</NavLink>
          <NavLink href={"/expedientes"}>Expedientes</NavLink>
          <NavLink href={"/facturas"}>Facturas</NavLink>
        </ul>
        <Perfil />
      </nav>
    </header>
  );
}
