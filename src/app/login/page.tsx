"use client";
import { Button, TextField } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleLogin = () => {
    fetch(`${process.env.NEXT_PUBLIC_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({
        usuario,
        password,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Error login");
        const res = await response.json();
        Cookies.set("token", res.access_token);
        router.push("/clientes");
      })
      .catch((err) => {});
  };
  return (
    <div className="shadow-md rounded-md px-3 py-2 space-y-3 flex flex-col">
      <div className="flex items-center space-x-2">
        <Image src={"/logo.png"} alt={"logo"} width={50} height={50} />
        <span className="text-lg font-bold">GESTORIA GESTIÓN</span>
      </div>
      <TextField
        onChange={(e) => setUsuario(e.target.value)}
        size="small"
        label="Usuario"
      />
      <TextField
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        size="small"
        label="Contraseña"
      />
      <Button onClick={handleLogin}>Acceder</Button>
    </div>
  );
}
