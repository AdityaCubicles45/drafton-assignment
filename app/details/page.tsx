'use client'

import Form from "@/components/Form";
import { useSession } from "next-auth/react"

export default function Dashboard() {
  const { data: session } = useSession()
  if(session){
    return <main className="bg-[#09090B] min-h-screen h-full flex flex-col justify-center items-center">
      <h2 className="text-white text-3xl font-semibold px-4 text-center pb-2">Onboarding Form</h2>
      <h2 className="text-white text-md pb-9 px-7 border-t-2 pt-2">Enter the Below Details</h2>
      <Form />
    </main>
  }
  else{
    return <main className="bg-[#09090B] min-h-screen h-full flex flex-col justify-center items-center">
    <h2 className="text-white text-3xl font-semibold px-4 text-center pb-2">Please Wait...</h2>
  </main>
  }
}
