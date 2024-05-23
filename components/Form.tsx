"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from 'axios'
import { useToast } from "@/components/ui/use-toast"
import { z } from 'zod'
import { Toaster } from "@/components/ui/toaster"
import Floating from "./Floating";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string;
        };
    }
}

const companySchema = z.object({
    companyName: z.string().min(1),
    details: z.string().min(1),
    testimonials: z.string().min(1),
    previousProjects: z.string().min(1),
    executiveSummary: z.string().min(1),
    pricingSegment: z.string().min(1),
    objectives: z.string().min(1),
    problems: z.string().min(1),
    solutions: z.string().min(1)
})

function InputArea({ fieldName, placeholder, onChange }: { fieldName: string, placeholder: string, onChange: ChangeEventHandler<HTMLTextAreaElement> | undefined }) {
    return (
        <div className="grid w-full gap-1.5">
            <Label className="text-white" htmlFor="message">{fieldName}<span className="text-red-500">*</span></Label>
            <Textarea className="bg-[#09090B] w-72 text-white" required onChange={onChange} placeholder={placeholder} id="message" />
        </div>
    )
}

export default function Form() {
    const companyNameRef = useRef("");
    const detailsRef = useRef("");
    const testimonialsRef = useRef("");
    const previousProjectsRef = useRef("");
    const executiveSummaryRef = useRef("");
    const pricingSectorRef = useRef("");
    const objectivesRef = useRef("");
    const problemsRef = useRef("");
    const solutionsRef = useRef("");

    const [generating, setGenerating] = useState(false)
    const [float, setFloat] = useState(false)
    const [loading, setLoading] = useState(true)

    const { toast } = useToast()
    const router = useRouter()
    const { data: session } = useSession()
    const userId = session?.user.id

    useEffect(() => {
        async function init() {
            const proposalsExist = await axios.get(`http://localhost:3000/api/proposals?userId=${userId}`)
            if (proposalsExist.data.proposals.length) {
                router.push(`/dashboard/${userId}`)
            }
            setLoading(false)
        }
        init()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function ButtonOutline() {
        return <Button onClick={async () => {
            setGenerating(true)
            setFloat(true)
            try {
                companySchema.parse({
                    companyName: companyNameRef.current,
                    details: detailsRef.current,
                    testimonials: testimonialsRef.current,
                    previousProjects: previousProjectsRef.current,
                    executiveSummary: executiveSummaryRef.current,
                    pricingSegment: pricingSectorRef.current,
                    objectives: objectivesRef.current,
                    problems: problemsRef.current,
                    solutions: solutionsRef.current
                })
                await axios.post("http://localhost:3000/api/generate", {
                    userId: userId,
                    name: companyNameRef.current,
                    details: detailsRef.current,
                    testimonials: testimonialsRef.current,
                    previous_projects: previousProjectsRef.current,
                    executive_summary: executiveSummaryRef.current,
                    pricing_sector: pricingSectorRef.current,
                    objectives: objectivesRef.current,
                    problems: problemsRef.current,
                    solutions: solutionsRef.current,
                })
                setTimeout(() => setGenerating(false), 45000)
            }
            catch (e) {
                toast({
                    title: "Ahh! Something went wrong.",
                    description: "Some fields are missing",
                })
                console.log(e)
                setFloat(false)
                setGenerating(false)
            }
        }} className="bg-black text-white hover:bg-gray-700 transition-colors duration-300 hover:text-white col-span-1 mt-5" variant="outline">Generate</Button>
    }

    return (
        <>
            {loading ? <div className="bg-black min-h-screen h-full flex justify-center items-center">
                <svg
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
                </svg>
            </div> : <div className="order lg:order-cols-2 sm:grid-cols-2 grid-cols-1 gap-4 p-4">
                <div>
                    <h2 className="text-white text-sm">Company Name <span className="text-red-500">*</span></h2>
                    <Input
                        required
                        className="bg-[#09090B] text-white text-sm"
                        type="text"
                        placeholder="Engineerians"
                        onChange={(e) => companyNameRef.current = e.target.value}
                    />
                </div>
                <InputArea
                    fieldName="Details of your company"
                    onChange={(e) => detailsRef.current = e.target.value}
                    placeholder="Enter company details"
                />
                <InputArea
                    fieldName="Testimonials"
                    onChange={(e) => testimonialsRef.current = e.target.value}
                    placeholder="Enter testimonials"
                />
                <InputArea
                    fieldName="Previous Projects"
                    onChange={(e) => previousProjectsRef.current = e.target.value}
                    placeholder="Previous Projects from your company"
                />
                <InputArea
                    fieldName="Additonal Summary"
                    onChange={(e) => executiveSummaryRef.current = e.target.value}
                    placeholder="Summary from your company"
                />
                <InputArea
                    fieldName="Pricing List"
                    onChange={(e) => pricingSectorRef.current = e.target.value}
                    placeholder="Define Price"
                />
                <InputArea
                    fieldName="Objectives"
                    onChange={(e) => objectivesRef.current = e.target.value}
                    placeholder="Goal/Aim"
                />
                <InputArea
                    fieldName="Problems"
                    onChange={(e) => problemsRef.current = e.target.value}
                    placeholder="Enter the Problem"
                />
                <InputArea
                    fieldName="Solutions"
                    onChange={(e) => solutionsRef.current = e.target.value}
                    placeholder="Enter the Overcome"
                />
                <ButtonOutline />
                <Toaster />
                <Floating onClick={() => router.push(`/dashboard/${userId}`)} generating={generating} setFloat={setFloat} float={float} />
            </div>}
        </>
    );
}