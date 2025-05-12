import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { login } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      )
    }

    const result = await login(email, password)

    if (!result) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      )
    }

    const { user, token } = result

    // Set cookie
    cookies().set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 12 * 60 * 60, // 12 hours
    })

    return NextResponse.json({ 
      message: "Login successful", 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  cookies().delete("token")
  return NextResponse.json({ message: "Logged out successfully" })
}
