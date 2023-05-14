"use client";
import * as React from "react";
import { TextField, Autocomplete } from "@mui/material";
import Box from "@mui/material/Box";
import { useParams } from "next/navigation";
import { AuthContext } from "@/components/Providers";
import { useContext } from "react";
import { Button } from "@mui/material";
import { UsuariosService } from "@/services/usuarios.service";

export default function BasicTabs() {
  const [tab, setTab] = React.useState(0);
  interface Usuario {
    _id: string;
    nombre: string;
    usuario: string;
    email: string;
    roles: string[];
  }
  const [cliente, setCliente] = React.useState<Usuario>({
    _id: "",
    nombre: "",
    email: "",
    usuario: "",
    roles: [],
  });
  const { id } = useParams();
  React.useEffect(() => {
    if (id !== "nuevo") {
      fetch(`http://localhost:3001/usuarios/${id}`).then(async (response) => {
        const res: Usuario = await response.json();
        setCliente(res);
      });
    }
  }, []);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };
  const handleCliente = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };
  const handleRoles = (e: React.ChangeEvent<HTMLInputElement>, value: string[]) => {
    setCliente({ ...cliente, roles: value });
  }
  const saveClient = () => {
    if (id !== "nuevo") {
      new UsuariosService().update(id, cliente);
    } else {
      const { _id, ...createClient } = cliente;
      new UsuariosService().create(createClient).then(async (response) => {});
    }
  };
  const { user } = useContext<any>(AuthContext);
  const roles = ["FISCAL", "ABOGACIA", "GESTORIA"];
  return (
    <section className="h-full grid grid-rows-[min-content_min-content_minmax(0,1fr)] gap-y-2">
      <div className="flex justify-end items-center">
        <Button onClick={saveClient}>
          {id !== "nuevo" ? "Guardar" : "Crear"}
        </Button>
      </div>
      {/* FORMULARIO -------------------------------------------- */}
      <div className="grid grid-cols-6 gap-3 grid-rows-1">
        <TextField
          className="col-span-1"
          size="small"
          onChange={handleCliente}
          name="usuario"
          value={cliente.usuario}
          id="usuario"
          label="Usuario"
          variant="outlined"
          autoComplete="off"
        />
        <TextField
          className="col-span-3"
          size="small"
          onChange={handleCliente}
          name="nombre"
          value={cliente.nombre}
          id="nombre"
          label="Nombre"
          variant="outlined"
          autoComplete="off"
        />
        <TextField
          className="col-span-2"
          type="email"
          size="small"
          onChange={handleCliente}
          name="email"
          value={cliente.email}
          id="email"
          label="email"
          variant="outlined"
          autoComplete="off"
        />
        <Autocomplete
          multiple
          limitTags={2}
          id="multiple-limit-tags"
          options={roles}
          size="small"
          className="col-span-3"
          getOptionLabel={(option) => option}
          value={cliente.roles}
          onChange={handleRoles}
          renderInput={(params) => (
            <TextField {...params} label="Roles" placeholder="Roles" />
          )}
        />
      </div>
    </section>
  );
}
