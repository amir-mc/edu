"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { 
  BookOpen, 
  Layout, 
  Users, 
  Calendar, 
  FileText, 
  Award, 
  MessageSquare, 
  User, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Role } from "@/types"

interface SidebarProps {
  role: Role
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Define navigation items based on user role
  const getNavItems = (role: Role) => {
    const items = [
      {
        title: "Dashboard",
        href: `/dashboard/${role}`,
        icon: <Layout className="h-5 w-5" />,
        roles: ["student", "teacher", "parent", "principal"] as Role[],
      },
      {
        title: "Classes",
        href: `/dashboard/${role}/classes`,
        icon: <BookOpen className="h-5 w-5" />,
        roles: ["student", "teacher", "principal"] as Role[],
      },
      {
        title: "Students",
        href: `/dashboard/${role}/students`,
        icon: <Users className="h-5 w-5" />,
        roles: ["teacher", "principal"] as Role[],
      },
      {
        title: "Calendar",
        href: `/dashboard/${role}/calendar`,
        icon: <Calendar className="h-5 w-5" />,
        roles: ["student", "teacher", "parent", "principal"] as Role[],
      },
      {
        title: "Assignments",
        href: `/dashboard/${role}/assignments`,
        icon: <FileText className="h-5 w-5" />,
        roles: ["student", "teacher"] as Role[],
      },
      {
        title: "Grades",
        href: `/dashboard/${role}/grades`,
        icon: <Award className="h-5 w-5" />,
        roles: ["student", "teacher", "parent"] as Role[],
      },
      {
        title: "Messages",
        href: `/dashboard/${role}/messages`,
        icon: <MessageSquare className="h-5 w-5" />,
        roles: ["student", "teacher", "parent", "principal"] as Role[],
      },
      {
        title: "Attendance",
        href: `/dashboard/${role}/attendance`,
        icon: <Users className="h-5 w-5" />,
        roles: ["student", "teacher", "parent", "principal"] as Role[],
      },
      {
        title: "Profile",
        href: `/dashboard/${role}/profile`,
        icon: <User className="h-5 w-5" />,
        roles: ["student", "teacher", "parent", "principal"] as Role[],
      },
    ]

    return items.filter(item => item.roles.includes(role))
  }

  const navItems = getNavItems(role)

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-white border-r shadow-sm transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <svg 
              className="h-6 w-6 text-blue-600" 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c0 2 1 3 3 3h6c2 0 3-1 3-3v-5"/>
            </svg>
            <span>EduTech</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4 px-6">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link href={item.href} key={item.href}>
                <span
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                    pathname === item.href
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {item.icon}
                  {item.title}
                </span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t p-4">
          <Link href="/login">
            <Button variant="outline" className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
