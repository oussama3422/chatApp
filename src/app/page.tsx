'use client'
import Button from "@/components/ui/Button";
import { signOut } from "next-auth/react";


export default async function Home() {
  return (
   <Button variant='ghost' onClick={()=>signOut()}>Sign out</Button>
  )
}
