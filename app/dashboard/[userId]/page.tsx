'use client'

import Content from "@/components/Content";
import axios from "axios";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

function ButtonDestructive() {
  return <Button onClick={() =>
    signOut({
      redirect: true,
      callbackUrl: "/",
    })
  } variant="destructive">Log Out</Button>
}


export default function Page({
  params,
}: {
  params: {
    userId: string;
  };
}) {

  const [proposals, setProposals] = useState<{
    content: string,
    id: String,
    title: string,
    userId: string
  }[]>()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      try {
        const axiosData = await axios.get(`https://drafton-assignment-v1.vercel.app/api/proposals?userId=${params.userId}`)
        setProposals(axiosData.data.proposals)
        setLoading(false)
      }
      catch (e) {
        console.log(e)
      }

    }
    init()
  }, [])

  return (
    <main className="bg-black min-h-screen h-full flex justify-center items-center">
      {loading ? <svg
        className="animate-spin text-white size-20"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg> : <div className="flex flex-col justify-center items-center p-6">
        <h2 className="text-white text-3xl font-semibold px-2 pt-1">Sample proposals</h2>
        <div className="order grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-10 gap-10">
          {proposals?.map((proposal, index) => <Content key={index} templateId={(index + 1).toString()} content={proposal.content} />)}
        </div>
        <ButtonDestructive />
      </div>}
    </main>
  );
}
