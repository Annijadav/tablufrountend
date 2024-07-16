"use server"

import { cookies } from "next/headers";

export async function settoken(token){
    const cookieStore = cookies()
    await cookieStore.set("authToken",token)
}