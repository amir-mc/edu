import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full backdrop-blur-sm bg-white/80 px-6 py-4 border-b border-gray-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-2xl">
            <svg 
              className="h-7 w-7 text-blue-600" 
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
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white transition-colors rounded-md px-5">Sign in</Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="w-full py-16 md:py-28 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-gray-900">
                  Empowering <span className="text-blue-600">Education</span> Through Technology
                </h1>
                <p className="text-lg text-gray-600 max-w-[600px]">
                  Connect students, teachers, parents, and school administrators on one seamless platform designed for better learning outcomes.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Link href="/login">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white transition-colors rounded-md text-base h-12 px-6">
                      Sign in
                    </Button>
                  </Link>
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-md text-base h-12 px-6">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full h-auto overflow-hidden rounded-2xl shadow-2xl border border-gray-100">
                  <svg 
                    className="w-full h-full" 
                    viewBox="0 0 1200 800" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="1200" height="800" fill="#ffffff" />
                    <rect x="0" y="0" width="1200" height="800" fill="url(#grid-pattern)" />
                    <defs>
                      <pattern id="grid-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <rect width="40" height="40" fill="white" />
                        <circle cx="20" cy="20" r="1" fill="#E2E8F0" />
                      </pattern>
                    </defs>
                    
                    {/* Dashboard mockup */}
                    <rect x="100" y="100" width="1000" height="600" rx="8" fill="white" stroke="#E2E8F0" strokeWidth="2" />
                    <rect x="100" y="100" width="240" height="600" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                    <rect x="340" y="100" width="760" height="60" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                    
                    {/* Sidebar menu items */}
                    <rect x="120" y="150" width="200" height="10" rx="2" fill="#3B82F6" fillOpacity="0.2" />
                    <rect x="120" y="180" width="180" height="10" rx="2" fill="#E2E8F0" />
                    <rect x="120" y="210" width="180" height="10" rx="2" fill="#E2E8F0" />
                    <rect x="120" y="240" width="180" height="10" rx="2" fill="#E2E8F0" />
                    <rect x="120" y="270" width="180" height="10" rx="2" fill="#E2E8F0" />
                    
                    {/* Content area cards */}
                    <rect x="370" y="190" width="220" height="120" rx="4" fill="white" stroke="#E2E8F0" strokeWidth="2" />
                    <rect x="610" y="190" width="220" height="120" rx="4" fill="white" stroke="#E2E8F0" strokeWidth="2" />
                    <rect x="850" y="190" width="220" height="120" rx="4" fill="white" stroke="#E2E8F0" strokeWidth="2" />
                    
                    {/* Chart area */}
                    <rect x="370" y="340" width="460" height="230" rx="4" fill="white" stroke="#E2E8F0" strokeWidth="2" />
                    <path d="M390 500 L450 440 L510 470 L570 420 L630 450 L690 400 L750 430 L810 380" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="450" cy="440" r="4" fill="#3B82F6" />
                    <circle cx="510" cy="470" r="4" fill="#3B82F6" />
                    <circle cx="570" cy="420" r="4" fill="#3B82F6" />
                    <circle cx="630" cy="450" r="4" fill="#3B82F6" />
                    <circle cx="690" cy="400" r="4" fill="#3B82F6" />
                    <circle cx="750" cy="430" r="4" fill="#3B82F6" />
                    <circle cx="810" cy="380" r="4" fill="#3B82F6" />
                    
                    {/* Right sidebar - activity feed */}
                    <rect x="850" y="340" width="220" height="230" rx="4" fill="white" stroke="#E2E8F0" strokeWidth="2" />
                    <rect x="870" y="360" width="180" height="8" rx="2" fill="#E2E8F0" />
                    <rect x="870" y="380" width="160" height="8" rx="2" fill="#E2E8F0" />
                    <rect x="870" y="420" width="180" height="8" rx="2" fill="#E2E8F0" />
                    <rect x="870" y="440" width="160" height="8" rx="2" fill="#E2E8F0" />
                    <rect x="870" y="480" width="180" height="8" rx="2" fill="#E2E8F0" />
                    <rect x="870" y="500" width="160" height="8" rx="2" fill="#E2E8F0" />
                    <rect x="870" y="540" width="180" height="8" rx="2" fill="#E2E8F0" />
                    <rect x="870" y="560" width="160" height="8" rx="2" fill="#E2E8F0" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-16 md:py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-gray-900">
                Features For Every Role
              </h2>
              <p className="text-lg text-gray-600 max-w-[800px]">
                Our platform provides tailored experiences for students, teachers, parents, and school administrators.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>For Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      View assignments and grades
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Submit work online
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Track academic progress
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Message teachers
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>For Teachers</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Manage class rosters
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Create and grade assignments
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Track student performance
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Communicate with parents
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>For Parents</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Monitor child's progress
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      View grades and attendance
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Message teachers
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Keep up with school events
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>For Principals</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      School-wide analytics
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Staff and student oversight
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Performance monitoring
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Strategic planning tools
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your School Experience?
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join schools across the country that are improving communication, enhancing learning outcomes, 
                  and creating more connected educational communities.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/login">
                  <Button size="lg">Get Started Today</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="w-full border-t py-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <svg 
                className="h-5 w-5 text-blue-600" 
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
            </div>
            <p className="text-sm text-gray-500">
              © 2023 EduTech. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
