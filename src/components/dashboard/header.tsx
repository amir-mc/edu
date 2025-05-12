"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, MessageSquare, User } from "lucide-react"
import { User as UserType } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getInitials } from "@/lib/utils"

interface HeaderProps {
  user: UserType
}

export function Header({ user }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    setShowMessages(false)
    setShowProfile(false)
  }

  const toggleMessages = () => {
    setShowMessages(!showMessages)
    setShowNotifications(false)
    setShowProfile(false)
  }

  const toggleProfile = () => {
    setShowProfile(!showProfile)
    setShowNotifications(false)
    setShowMessages(false)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 border-b bg-background px-6">
      <div className="ml-auto flex items-center gap-4">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            onClick={toggleNotifications}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              3
            </span>
          </Button>
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 rounded-md border bg-background p-4 shadow-md">
              <h3 className="mb-2 font-semibold">Notifications</h3>
              <div className="space-y-2">
                <div className="rounded-md border p-2 text-sm">
                  <p className="font-medium">New assignment posted</p>
                  <p className="text-muted-foreground">
                    A new math assignment has been posted
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    10 minutes ago
                  </p>
                </div>
                <div className="rounded-md border p-2 text-sm">
                  <p className="font-medium">Grade updated</p>
                  <p className="text-muted-foreground">
                    Your science test has been graded
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    1 hour ago
                  </p>
                </div>
                <div className="rounded-md border p-2 text-sm">
                  <p className="font-medium">Upcoming event</p>
                  <p className="text-muted-foreground">
                    School assembly tomorrow at 9 AM
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    6 hours ago
                  </p>
                </div>
              </div>
              <Button variant="link" className="mt-2 text-xs w-full">
                See all notifications
              </Button>
            </div>
          )}
        </div>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Messages"
            onClick={toggleMessages}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              2
            </span>
          </Button>
          {showMessages && (
            <div className="absolute right-0 top-12 w-80 rounded-md border bg-background p-4 shadow-md">
              <h3 className="mb-2 font-semibold">Messages</h3>
              <div className="space-y-2">
                <div className="rounded-md border p-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>T</AvatarFallback>
                    </Avatar>
                    <p className="font-medium">Mrs. Thompson</p>
                  </div>
                  <p className="text-muted-foreground">
                    Please complete your homework...
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    20 minutes ago
                  </p>
                </div>
                <div className="rounded-md border p-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>P</AvatarFallback>
                    </Avatar>
                    <p className="font-medium">Principal Davis</p>
                  </div>
                  <p className="text-muted-foreground">
                    Reminder about the upcoming...
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    3 hours ago
                  </p>
                </div>
              </div>
              <Button variant="link" className="mt-2 text-xs w-full">
                See all messages
              </Button>
            </div>
          )}
        </div>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Profile"
            onClick={toggleProfile}
          >
            <Avatar>
              {user.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={user.name} />
              ) : (
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              )}
            </Avatar>
          </Button>
          {showProfile && (
            <div className="absolute right-0 top-12 w-56 rounded-md border bg-background p-2 shadow-md">
              <div className="flex flex-col">
                <div className="mb-2 border-b pb-2 pt-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <p className="mt-1 text-xs capitalize text-muted-foreground">
                    Role: {user.role}
                  </p>
                </div>
                <Link href={`/dashboard/${user.role}/profile`}>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
