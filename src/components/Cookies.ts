"use server";
import { cookies } from "next/headers";

export async function cookiesSet(data) {
  cookies().set("token", data);
}
