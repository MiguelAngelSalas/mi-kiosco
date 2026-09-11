"use client"
import { Link, TextField, Button, Flex, Card, Heading } from "@radix-ui/themes"
import { useState } from "react"
import { useRouter } from "next/navigation"

const mockUsers = [
    {
        username: "administrador",
        role: "administrador",
        route: "/AdminDashboard",
        password: "password"
    },
    {
        username: "cajero",
        role: "cajero", 
        route: "/CheckoutMenu",
        password: "password"
    }
]

export default function Login() {
    const [inputUsername, setInputUsername] = useState("")
    const [inputPassword, setInputPassword] = useState("")

    const router = useRouter()

    const handleLogin = () => {
        const validUser = mockUsers.find(
            (u) => u.username === inputUsername && u.password === inputPassword
        )
        
        if (validUser) {
            alert(`Login successful. Entering as: ${validUser.role}`)
            localStorage.setItem("rolUsuario", validUser.role)
            router.push(validUser.route)
        } else {
            alert("Invalid credentials")
        }
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4 min-h-screen p-9 transition-colors duration-300 bg-gray-50 dark:bg-gray-900">  
            
            {/* Main Brand Link - Blue Theme (#33589c) */}
            <Link 
                href="/landingPage" 
                size="6" 
                weight="bold"
                className="flex justify-center mb-6 text-pretty rounded py-4 px-8 shadow-lg transition-all duration-300 hover:scale-105 border-[3px] border-[#33589c] text-[#33589c] dark:text-white bg-white dark:bg-gray-800 hover:bg-[#33589c] hover:text-white dark:hover:bg-[#33589c]"
            >
                My Kiosco
            </Link>

            {/* Login Form Container - Dark Mode Support */}
            <Card className="w-75 p-8 transition-all duration-300 hover:shadow-xl border-2 border-[#33589c] bg-white dark:bg-gray-800">
                <Flex direction="column" gap="4">
                    
                    <Heading size="4" align="center" className="text-[#33589c] dark:text-white">
                        Sign In
                    </Heading>
                    
                    <Flex direction="column" gap="3">
                        {/* Inputs with hover matching the blue theme */}
                        <TextField.Root 
                            radius="small" 
                            className="transition-colors border border-gray-300 dark:border-gray-600 hover:border-[#33589c] dark:hover:border-[#33589c] bg-transparent"
                            value={inputUsername} 
                            onChange={(e) => setInputUsername(e.target.value)} 
                            placeholder="Username"
                        />
                        <TextField.Root 
                            radius="small" 
                            className="transition-colors border border-gray-300 dark:border-gray-600 hover:border-[#33589c] dark:hover:border-[#33589c] bg-transparent"
                            value={inputPassword} 
                            onChange={(e) => setInputPassword(e.target.value)} 
                            placeholder="Password" 
                            type="password"
                        />
                    </Flex>
                    
                    {/* Login Action Button - Green Theme (#589c33) */}
                    <Button 
                        size="3"
                        variant="ghost"
                        className="mt-3 cursor-pointer transition-all duration-200 hover:scale-105 border-2 border-[#589c33] text-[#589c33] dark:text-white bg-transparent hover:bg-[#589c33] hover:text-white dark:hover:bg-[#589c33]"
                        onClick={handleLogin}
                    >
                        Enter
                    </Button>
                </Flex>
            </Card>
            
        </div> 
    )
}