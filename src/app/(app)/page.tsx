"use client";
import { AuthContext } from "@/components/Providers";
import { useContext } from "react";

export default function Home() {
  const { user } = useContext<any>(AuthContext);
  return <main>{user && user.nombre}</main>;
}
