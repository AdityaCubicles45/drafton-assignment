import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { NextApiRequest } from "next";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId")
    const proposalsExist = await prisma.proposal.findMany({
      where: {
        userId: userId as string,
      },
    });
    return NextResponse.json(
      {
        proposals: proposalsExist,
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        error: e,
      },
      { status: 500 }
    );
  }
}
