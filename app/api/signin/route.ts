import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";


export async function POST(req: NextRequest) {
    try{
        const body = await req.json()
        const isExisting = await prisma.user.findUnique({
            where:{
                username: body.username,
            }
        })

        if(!isExisting){
            return NextResponse.json({
                "User": null
            }, {status: 404})
        }
        return NextResponse.json({
            "User": isExisting
        }, {status: 200})
    }
    catch(e){
        return NextResponse.json({
            "Error": e
        }, {status: 500})
    }
}