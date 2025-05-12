"use client"

import { useState } from "react"
import Link from "next/link" 
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Key, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)
    setError("")
    
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }
      
      // Redirect based on user role
      router.push(`/dashboard/${data.user.role}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
            <svg 
              className="h-8 w-8 text-blue-600" 
              xmlns="http://www.w3.org/2000/svg" 
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
        
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
            <CardDescription className="text-center text-sm text-gray-500">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <p>{error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    placeholder="m.davis@school.edu"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 h-10 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Link 
                    href="#" 
                    className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 h-10 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors h-10 rounded-md"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>

              <div className="my-4 flex items-center">
                <div className="flex-grow h-px bg-gray-200"></div>
                <span className="mx-2 text-xs text-gray-400 font-medium">DEMO ACCOUNTS</span>
                <div className="flex-grow h-px bg-gray-200"></div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                  <p className="font-medium text-gray-700">Student</p>
                  <p className="text-gray-500 mt-1">student@school.edu</p>
                </div>
                <div className="p-3 rounded bg-gray-50 border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-colors">
                  <p className="font-medium text-gray-700">Teacher</p>
                  <p className="text-gray-500 mt-1">teacher@school.edu</p>
                </div>
                <div className="p-3 rounded bg-gray-50 border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-colors">
                  <p className="font-medium text-gray-700">Parent</p>
                  <p className="text-gray-500 mt-1">parent@school.edu</p>
                </div>
                <div className="p-3 rounded bg-gray-50 border border-gray-100 hover:border-yellow-200 hover:bg-yellow-50 transition-colors">
                  <p className="font-medium text-gray-700">Principal</p>
                  <p className="text-gray-500 mt-1">admin@school.edu</p>
                </div>
              </div>
              <p className="text-center text-xs text-gray-500 mt-2">Password for all: "password"</p>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 pt-0 border-t border-gray-100 mt-4 text-center px-8 py-4">
            <div className="text-sm text-gray-500">
              <span>New to EduTech? </span>
              <Link 
                href="#" 
                className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                Contact your school administrator
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
