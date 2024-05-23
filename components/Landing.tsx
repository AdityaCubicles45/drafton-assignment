"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MouseEventHandler, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react";
import { z } from 'zod'
import axios from "axios"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "./ui/use-toast"


export default function Landing() {
    const [isSignIn, setIsSignIn] = useState(true)
    const userNameRef = useRef("")
    const passRef = useRef("")
    const router = useRouter()
    const { toast } = useToast()

    const formSchema = z.object({
        username: z.string().email(),
        password: z.string().min(8)
    })

    const onSubmit = async () => {
        const data = {
            username: userNameRef.current,
            password: passRef.current,
        };
        try {
            if (formSchema.parse(data)) {
                const result = await signIn("credentials", {
                    username: userNameRef.current,
                    password: passRef.current,
                    redirect: false,
                    callbackUrl: "/details",
                });
                if (!result?.ok) {
                    toast({
                        title: "Failed!",
                        description: "Passowrd is incorrect/User doesn't exists",
                    })
                } else {
                    toast({
                        title: "Success!",
                        description: "You will be redirected to details page",
                    })
                    await new Promise(res => setTimeout(res, 1000))
                    router.push("/details");
                }
            }
        } catch (e: any) {
            toast({
                title: "Failed!",
                description: "Check Username and Password",
            })
        }
    };

    async function signUp() {
        try {
            const data = {
                username: userNameRef.current,
                password: passRef.current,
            };
            console.log(data)
            if (formSchema.parse(data)) {
                const result = await axios.post("http://localhost:3000/api/signup", {
                    username: data.username,
                    password: data.password
                })
                toast({
                    title: "Success!.",
                    description: "You will be redirected to login page",
                })
                await new Promise(res => setTimeout(res, 2000))
                setIsSignIn(true)
            }
        }
        catch (e) {
            toast({
                title: "Ahhh Snap! Something went wrong.",
                description: "Check your email and password.",
            })
        }
    }

    function ButtonSecondary({ text, onClick }: { text: string, onClick: MouseEventHandler<HTMLButtonElement> | undefined }) {
        return <Button onClick={onClick} variant="secondary">{text}</Button>
    }

    function ButtonLink({ text }: { text: string }) {
        return <Button onClick={() => setIsSignIn(isSignIn => !isSignIn)} className="text-white" variant="link">{text}</Button>
    }

    return <div className="flex flex-col gap-2">
        <Input onChange={(e) => userNameRef.current = e.target.value} className="bg-gray-700 text-white" type="username" placeholder="johndoe@gmail.com" />
        <Input onChange={(e) => passRef.current = e.target.value} className="bg-gray-700 text-white" type="password" placeholder="password" />
        {
            isSignIn ? <><ButtonSecondary onClick={onSubmit} text="Log In" />
                <ButtonLink text="Sign Up" /></> : <><ButtonSecondary onClick={signUp} text="Sign Up" />
                <ButtonLink text="Log In" /></>
        }
        <Toaster />
    </div>
}