import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const client = new PrismaClient();


export async function POST(req: NextRequest) {
    try{
        const body = await req.json()
        const isExisting = await client.user.findMany({
            where:{
                username: body.username,
            }
        })
        if(isExisting.length){
            return NextResponse.json({
                "User": null
            }, {status: 404})
        }
        const hashedPassword = await hash(body.password, 10);
        const user = await client.user.create({
            data:{
                username: body.username,
                password: hashedPassword
            }
        })
        console.log(user)
        return NextResponse.json({
            "User": user
        }, {status: 200})
    }
    catch(e){
        return NextResponse.json({
            "Error": e
        }, {status: 500})
    }
}