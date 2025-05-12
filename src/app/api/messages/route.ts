import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import db from "@/lib/db"

// Get messages for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Query parameters
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get("unreadOnly") === "true"
    
    // Get messages where the user is either sender or recipient
    const sentMessages = await db.getMessagesBySenderId(session.user.id)
    const receivedMessages = await db.getMessagesByRecipientId(session.user.id)
    
    let messages = [...sentMessages, ...receivedMessages]
    
    // Filter to unread messages if requested
    if (unreadOnly) {
      messages = messages.filter(message => 
        message.recipientId === session.user.id && !message.read
      )
    }
    
    // Sort by creation time, newest first
    messages.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching messages" },
      { status: 500 }
    )
  }
}

// Send a new message
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const messageData = await request.json()
    
    if (!messageData.recipientId || !messageData.subject || !messageData.content) {
      return NextResponse.json(
        { message: "Recipient ID, subject, and content are required" },
        { status: 400 }
      )
    }
    
    // Create the message
    const newMessage = await db.createMessage({
      senderId: session.user.id,
      recipientId: messageData.recipientId,
      subject: messageData.subject,
      content: messageData.content
    })
    
    return NextResponse.json({ 
      message: "Message sent successfully", 
      sentMessage: newMessage 
    })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json(
      { message: "An error occurred while sending message" },
      { status: 500 }
    )
  }
}
