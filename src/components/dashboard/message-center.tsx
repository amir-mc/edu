"use client"

import { useState } from "react"
import { Search, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { formatDate, getInitials } from "@/lib/utils"

export interface Contact {
  id: string
  name: string
  role: string
  avatar?: string
  lastMessage?: string
  lastMessageTime?: string
  unread?: boolean
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: string
  read: boolean
}

interface MessageCenterProps {
  contacts: Contact[]
  messages: Message[]
  currentUser: {
    id: string
    name: string
    avatar?: string
  }
}

export function MessageCenter({
  contacts,
  messages,
  currentUser,
}: MessageCenterProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedMessages = messages.filter(
    (message) =>
      (message.senderId === currentUser.id &&
        selectedContact?.id === selectedContact?.id) ||
      (message.senderId === selectedContact?.id &&
        selectedContact?.id === selectedContact?.id)
  )

  const handleSendMessage = () => {
    if (messageText.trim() && selectedContact) {
      // In a real app, this would send the message to the backend
      console.log("Sending message to", selectedContact.name, messageText)
      setMessageText("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex">
        <div className="w-1/3 border-r h-full">
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="h-[calc(100%-60px)] overflow-auto">
            {filteredContacts.length > 0 ? (
              <div className="divide-y">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/50 ${
                      selectedContact?.id === contact.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <Avatar>
                      {contact.avatar ? (
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                      ) : (
                        <AvatarFallback>
                          {getInitials(contact.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {contact.role}
                          </p>
                        </div>
                        {contact.lastMessageTime && (
                          <p className="text-xs text-muted-foreground">
                            {formatDate(contact.lastMessageTime)}
                          </p>
                        )}
                      </div>
                      {contact.lastMessage && (
                        <p
                          className={`text-sm truncate mt-1 ${
                            contact.unread ? "font-medium" : "text-muted-foreground"
                          }`}
                        >
                          {contact.lastMessage}
                        </p>
                      )}
                    </div>
                    {contact.unread && (
                      <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center p-4">
                <p className="text-center text-sm text-muted-foreground">
                  No contacts found
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="w-2/3 flex flex-col h-full">
          {selectedContact ? (
            <>
              <div className="border-b p-3 flex items-center gap-3">
                <Avatar>
                  {selectedContact.avatar ? (
                    <AvatarImage
                      src={selectedContact.avatar}
                      alt={selectedContact.name}
                    />
                  ) : (
                    <AvatarFallback>
                      {getInitials(selectedContact.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-medium">{selectedContact.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {selectedContact.role}
                  </p>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-4">
                {selectedMessages.length > 0 ? (
                  selectedMessages.map((message) => {
                    const isCurrentUser = message.senderId === currentUser.id
                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isCurrentUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] rounded-lg p-3 ${
                            isCurrentUser
                              ? "bg-blue-500 text-white"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isCurrentUser
                                ? "text-blue-100"
                                : "text-muted-foreground"
                            }`}
                          >
                            {formatDate(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-center text-sm text-muted-foreground">
                      No messages yet. Start a conversation!
                    </p>
                  </div>
                )}
              </div>
              <div className="border-t p-3 flex gap-2">
                <Textarea
                  placeholder="Type a message..."
                  className="min-h-[60px] max-h-[120px]"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">
                  Select a contact to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Textarea component (minimal implementation)
function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}
