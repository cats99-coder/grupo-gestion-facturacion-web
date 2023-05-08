"use client";
import { Button, TextField } from "@mui/material";
import Image from "next/image";
import { useState, useContext } from "react";
import { AuthContext } from "@/components/Providers";
import { useRouter } from "next/navigation";
import * as Jose from "jose";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext<any>(AuthContext);
  const router = useRouter();
  const handleLogin = () => {
    fetch("http://localhost:3001/auth/login", {
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
        localStorage.setItem(
          "token",
          JSON.stringify(Jose.decodeJwt(res.access_token))
        );
        setUser(Jose.decodeJwt(res.access_token));
        router.replace(
          "http://localhost:3000/clientes/6453cbeab93ecb717444ab70"
        );
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
