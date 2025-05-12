import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    return NextResponse.json({ user: session.user })
  } catch (error) {
    console.error("Error fetching current user:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching user data" },
      { status: 500 }
    )
  }
}
