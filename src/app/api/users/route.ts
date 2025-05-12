import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import db from "@/lib/db"

// Get current user
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

// Get users (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || session.user.role !== "principal") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Query parameters
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    
    let users = await db.getUsers()
    
    // Filter by role if specified
    if (role) {
      users = users.filter(user => user.role === role)
    }
    
    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching users" },
      { status: 500 }
    )
  }
}

// Create user (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || session.user.role !== "principal") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const userData = await request.json()
    
    if (!userData.name || !userData.email || !userData.role) {
      return NextResponse.json(
        { message: "Name, email, and role are required" },
        { status: 400 }
      )
    }
    
    // Check if user with email already exists
    const existingUser = await db.getUserByEmail(userData.email)
    
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      )
    }
    
    // Create new user
    const newUser = await db.createUser({
      name: userData.name,
      email: userData.email,
      role: userData.role,
      avatarUrl: userData.avatarUrl
    })
    
    return NextResponse.json({ 
      message: "User created successfully", 
      user: newUser 
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { message: "An error occurred while creating user" },
      { status: 500 }
    )
  }
}
